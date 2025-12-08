const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User');

// Middleware que valida o access token (Bearer ou cookie httpOnly) e injeta o usuário na requisição.
module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization || '';
    const bearerToken = authHeader.startsWith('Bearer ')
      ? authHeader.replace('Bearer ', '').trim()
      : null;

    const token = bearerToken || req.cookies?.accessToken;

    if (!token) {
      return res.status(401).json({ message: 'Token não informado' });
    }

    if (!env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT_SECRET não configurado' });
    }

    const payload = jwt.verify(token, env.JWT_SECRET);

    if (payload.type && payload.type !== 'access') {
      return res.status(401).json({ message: 'Tipo de token inválido' });
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      return res.status(401).json({ message: 'Usuário não encontrado' });
    }

    req.user = user;
    return next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido ou expirado' });
  }
};
