const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/user');
const { registrarConsentimento } = require('../utils/consent');

const ACCESS_EXPIRES_IN = '15m';
const REFRESH_EXPIRES_IN = '7d';

function signToken(user, type = 'access') {
  if (!env.JWT_SECRET) {
    throw new Error('JWT_SECRET não configurado');
  }

  return jwt.sign(
    {
      sub: user._id.toString(),
      role: user.role,
      type,
    },
    env.JWT_SECRET,
    { expiresIn: type === 'access' ? ACCESS_EXPIRES_IN : REFRESH_EXPIRES_IN }
  );
}

function buildTokens(user) {
  const accessToken = signToken(user, 'access');
  const refreshToken = signToken(user, 'refresh');
  return { accessToken, refreshToken };
}

function sanitizeUser(user) {
  const safe = user.toObject ? user.toObject() : { ...user };
  delete safe.senha;
  delete safe.refreshTokens;
  return safe;
}

async function persistRefreshToken(user, refreshToken) {
  const tokens = user.refreshTokens || [];
  // Limita quantidade para evitar crescimento infinito.
  const trimmed = tokens.slice(-4);
  user.refreshTokens = [...trimmed, refreshToken];
  await user.save();
}

exports.register = async (req, res, next) => {
  try {
    const { nome, email, telefone, senha, role } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const senhaHash = await bcrypt.hash(senha, 10);

    const user = new User({
      nome,
      email: email.toLowerCase(),
      telefone,
      senha: senhaHash,
      role: role || 'cliente',
    });

    registrarConsentimento(user, {
      aceito: req.body.consentimentoAceito ?? true,
      versao: req.body.versaoConsentimento,
      ip: req.ip,
      leiAplicada: req.body.leiAplicada,
    });

    const tokens = buildTokens(user);
    user.refreshTokens = [tokens.refreshToken];
    await user.save();

    return res.status(201).json({ user: sanitizeUser(user), ...tokens });
  } catch (error) {
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const passwordOk = await bcrypt.compare(senha, user.senha);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (user.status === 'inativo') {
      return res.status(403).json({ message: 'Usuário inativo' });
    }

    const tokens = buildTokens(user);
    await persistRefreshToken(user, tokens.refreshToken);

    return res.json({ user: sanitizeUser(user), ...tokens });
  } catch (error) {
    return next(error);
  }
};

exports.refresh = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refreshToken é obrigatório' });
    }

    if (!env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const payload = jwt.verify(refreshToken, env.JWT_SECRET);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: 'Tipo de token inválido' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const hasToken = (user.refreshTokens || []).includes(refreshToken);
    if (!hasToken) {
      return res.status(401).json({ message: 'Refresh token não autorizado' });
    }

    const tokens = buildTokens(user);
    user.refreshTokens = user.refreshTokens.filter((token) => token !== refreshToken);
    user.refreshTokens.push(tokens.refreshToken);
    await user.save();

    return res.json({ user: sanitizeUser(user), ...tokens });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ message: 'refreshToken é obrigatório' });
    }

    const payload = env.JWT_SECRET ? jwt.verify(refreshToken, env.JWT_SECRET) : null;
    if (!payload || payload.type !== 'refresh') {
      return res.status(401).json({ message: 'Refresh token inválido' });
    }

    const user = await User.findById(payload.sub);
    if (user) {
      user.refreshTokens = (user.refreshTokens || []).filter((token) => token !== refreshToken);
      await user.save();
    }

    return res.json({ message: 'Logout realizado' });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
  }
};

exports.me = async (req, res, next) => {
  try {
    return res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    return next(error);
  }
};
