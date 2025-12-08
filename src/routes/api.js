const express = require('express');
const propertyController = require('../controllers/propertyController');
const leadController = require('../controllers/leadController');
const { propertyValidationRules, leadValidationRules } = require('./validators');

const router = express.Router();

// API REST — Imóveis
router.get('/imoveis', propertyController.listProperties);
router.get('/imoveis/:id', propertyController.getPropertyById);
router.post('/imoveis', propertyValidationRules, propertyController.createProperty);
router.put('/imoveis/:id', propertyValidationRules, propertyController.updateProperty);
router.delete('/imoveis/:id', propertyController.deleteProperty);

// API REST — Leads
router.get('/leads', leadController.listLeads);
router.post('/leads', leadValidationRules, leadController.createLead);

module.exports = router;
