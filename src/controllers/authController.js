const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

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
    { expiresIn: type === 'access' ? ACCESS_TOKEN_TTL : REFRESH_TOKEN_TTL }
  );
}

function buildTokens(user) {
  const accessToken = signToken(user, 'access');
  const refreshToken = signToken(user, 'refresh');
  return { accessToken, refreshToken };
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge,
    path: '/',
  };
}

function sanitizeUser(user) {
  const payload = user.toObject ? user.toObject() : { ...user };
  delete payload.password;
  delete payload.tokens;
  return payload;
}

async function persistRefresh(user, refreshToken) {
  const existing = user.tokens || [];
  const trimmed = existing.slice(-4);
  user.tokens = [...trimmed, refreshToken];
  await user.save();
}

function setAuthCookies(res, { accessToken, refreshToken }) {
  res.cookie('accessToken', accessToken, cookieOptions(15 * 60 * 1000));
  res.cookie('refreshToken', refreshToken, cookieOptions(7 * 24 * 60 * 60 * 1000));
}

exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'Email já cadastrado' });
    }

    const user = new User({
      name,
      email: email.toLowerCase(),
      password,
      role: role || 'cliente',
      status: status || 'ativo',
    });

    const tokens = buildTokens(user);
    user.tokens = [tokens.refreshToken];
    await user.save();

    setAuthCookies(res, tokens);

    return res.status(201).json({ user: sanitizeUser(user), ...tokens });
  } catch (error) {
    return next(error);
  }
};

exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    if (user.status === 'inativo') {
      return res.status(403).json({ message: 'Usuário inativo' });
    }

    const passwordOk = await user.comparePassword(password);
    if (!passwordOk) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    const tokens = buildTokens(user);
    await persistRefresh(user, tokens.refreshToken);

    setAuthCookies(res, tokens);

    return res.json({ user: sanitizeUser(user), ...tokens });
  } catch (error) {
    return next(error);
  }
};

exports.logoutUser = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token é obrigatório' });
    }

    let user;
    try {
      const payload = jwt.verify(refreshToken, env.JWT_SECRET);
      if (payload.type !== 'refresh') {
        return res.status(401).json({ message: 'Refresh token inválido' });
      }
      user = await User.findById(payload.sub);
    } catch (error) {
      return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
    }

    if (user) {
      user.tokens = (user.tokens || []).filter((token) => token !== refreshToken);
      await user.save();
    }

    res.clearCookie('accessToken', cookieOptions(0));
    res.clearCookie('refreshToken', cookieOptions(0));

    return res.json({ message: 'Logout realizado' });
  } catch (error) {
    return next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken || req.body.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token é obrigatório' });
    }

    const payload = jwt.verify(refreshToken, env.JWT_SECRET);
    if (payload.type !== 'refresh') {
      return res.status(401).json({ message: 'Refresh token inválido' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    const stored = user.tokens || [];
    if (!stored.includes(refreshToken)) {
      return res.status(401).json({ message: 'Refresh token não autorizado' });
    }

    const tokens = buildTokens(user);
    user.tokens = stored.filter((token) => token !== refreshToken);
    user.tokens.push(tokens.refreshToken);
    await user.save();

    setAuthCookies(res, tokens);

    return res.json({ user: sanitizeUser(user), ...tokens });
  } catch (error) {
    return res.status(401).json({ message: 'Refresh token inválido ou expirado' });
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    return res.json({ user: sanitizeUser(req.user) });
  } catch (error) {
    return next(error);
  }
};
