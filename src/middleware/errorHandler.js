// Middleware global de tratamento de erros
module.exports = (err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isHtml = req.headers.accept && req.headers.accept.includes('text/html');

  console.error(process.env.NODE_ENV === 'production' ? err.message : err);

  if (isHtml) {
    return res.status(status).send('Erro interno do servidor. Tente novamente.');
  }

  return res.status(status).json({
    message: err.message || 'Erro interno do servidor',
  });
};
