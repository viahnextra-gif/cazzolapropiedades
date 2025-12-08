// Middleware para verificar se o usuário autenticado possui uma das roles permitidas.
module.exports = function checkRole(...rolesPermitidas) {
  return function roleMiddleware(req, res, next) {
    if (!req.user) {
      return res.status(401).json({ message: 'Usuário não autenticado' });
    }

    if (!rolesPermitidas.includes(req.user.role)) {
      return res.status(403).json({ message: 'Acesso negado' });
    }

    return next();
  };
};
