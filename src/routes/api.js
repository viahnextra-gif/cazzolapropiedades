const express = require('express');
const propertyController = require('../controllers/propertyController');
const leadController = require('../controllers/leadController');
const { propertyValidationRules, leadValidationRules } = require('./validators');
const upload = require('../config/upload');
const validateProperty = require('../middleware/validateProperty');

// Router para endpoints REST (prefixo /api definido em server.js).
const router = express.Router();

// Imóveis
router.get('/properties', propertyController.listProperties);
router.get('/properties/:id', propertyController.getPropertyById);
router.post(
  '/properties',
  upload.array('images', 10),
  propertyValidationRules,
  validateProperty,
  propertyController.createProperty,
);
router.put(
  '/properties/:id',
  upload.array('images', 10),
  propertyValidationRules,
  validateProperty,
  propertyController.updateProperty,
);
router.delete('/properties/:id', propertyController.deleteProperty);

// Leads
router.get('/leads', leadController.listLeads);
router.post('/leads', leadValidationRules, leadController.createLead);

module.exports = router;
