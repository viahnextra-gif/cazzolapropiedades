// Middleware simples para evitar cadastro/edição com campos obrigatórios vazios.
module.exports = function validateProperty(req, res, next) {
  const requiredFields = ['title', 'type', 'category', 'price', 'address', 'neighborhood', 'city'];
  const missing = requiredFields.filter((field) => !req.body[field]);

  if (missing.length) {
    const message = `Preencha os campos obrigatórios: ${missing.join(', ')}`;
    if (req.headers.accept && req.headers.accept.includes('application/json')) {
      return res.status(400).json({ message });
    }

    req.validationErrors = [{ msg: message }];
  }

  return next();
};
