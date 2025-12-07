const express = require('express');
const {
  listProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../../controllers/propertyController');
const { propertyValidationRules } = require('../validators');

const router = express.Router();

// GET /api/imoveis - list all properties
router.get('/', listProperties);

// GET /api/imoveis/:id - property detail
router.get('/:id', getPropertyById);

// POST /api/imoveis - create property
router.post('/', propertyValidationRules, createProperty);

// PUT /api/imoveis/:id - update property
router.put('/:id', propertyValidationRules, updateProperty);

// DELETE /api/imoveis/:id - delete property
router.delete('/:id', deleteProperty);

module.exports = router;
