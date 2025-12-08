const express = require('express');
const pageController = require('../controllers/pageController');
const { propertyValidationRules, leadValidationRules } = require('./validators');

const router = express.Router();

// Páginas públicas
router.get('/', pageController.renderHome);
router.get('/imoveis', pageController.renderListings);
router.get('/imoveis/:id', pageController.renderDetail);

// Contato
router.get('/contato', pageController.renderContactForm);
router.post('/contato', leadValidationRules, pageController.submitContactForm);

// Admin (sem auth ainda — será implementado no Patch 3)
router.get('/admin/properties', pageController.renderAdminProperties);
router.get('/admin/properties/new', pageController.renderNewPropertyForm);
router.post('/admin/properties/new', propertyValidationRules, pageController.handleNewPropertyForm);
router.get('/admin/leads', pageController.renderAdminLeads);

module.exports = router;
