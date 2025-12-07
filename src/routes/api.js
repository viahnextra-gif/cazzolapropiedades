const express = require('express');
const propertyController = require('../controllers/propertyController');
const leadController = require('../controllers/leadController');
const { propertyValidationRules, leadValidationRules } = require('./validators');

// Router para endpoints REST (prefixo /api definido em server.js).
const router = express.Router();

// Imóveis
router.get('/imoveis', propertyController.listProperties);
router.get('/imoveis/:id', propertyController.getPropertyById);
router.post('/imoveis', propertyValidationRules, propertyController.createProperty);
router.put('/imoveis/:id', propertyValidationRules, propertyController.updateProperty);
router.delete('/imoveis/:id', propertyController.deleteProperty);

// Leads
router.get('/leads', leadController.listLeads);
router.post('/leads', leadValidationRules, leadController.createLead);

module.exports = router;
