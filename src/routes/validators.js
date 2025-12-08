const { body } = require('express-validator');

// Shared validation rules for Property
const propertyValidationRules = [
  body('title').notEmpty().withMessage('Título é obrigatório'),
  body('type').isIn(['venda', 'aluguel']).withMessage('Tipo deve ser venda ou aluguel'),
  body('category')
    .isIn(['casa', 'apartamento', 'terreno', 'comercial'])
    .withMessage('Categoria inválida'),
  body('price').isFloat({ min: 0 }).withMessage('Preço deve ser numérico'),
  body('address').notEmpty().withMessage('Endereço é obrigatório'),
  body('neighborhood').notEmpty().withMessage('Bairro é obrigatório'),
  body('city').notEmpty().withMessage('Cidade é obrigatória'),
  body('status').optional().isIn(['ativo', 'inativo']).withMessage('Status inválido'),
  body('bedrooms').optional().isInt({ min: 0 }).withMessage('Quartos deve ser inteiro'),
  body('bathrooms').optional().isInt({ min: 0 }).withMessage('Banheiros deve ser inteiro'),
  body('area').optional().isFloat({ min: 0 }).withMessage('Metragem deve ser numérica'),
  body('images').optional().isString().withMessage('Imagens deve ser uma lista de URLs separadas por vírgula'),
  body('description').optional().isString(),
  body('mapUrl').optional().isString(),
];

// Validation rules for Lead
const leadValidationRules = [
  body('name').notEmpty().withMessage('Nome é obrigatório'),
  body('email').isEmail().withMessage('E-mail inválido'),
  body('phone').optional().isString(),
  body('interest')
    .isIn(['aluguel', 'compra', 'gestao', 'outro'])
    .withMessage('Interesse inválido'),
  body('message').optional().isString(),
  body('status').optional().isIn(['novo', 'contatado', 'convertido']),
  body('property').optional({ checkFalsy: true }).isMongoId(),
];

module.exports = {
  propertyValidationRules,
  leadValidationRules,
};
