const express = require('express');
const pageController = require('../controllers/pageController');
const { propertyValidationRules, leadValidationRules } = require('./validators');

// Rotas server-rendered com EJS.
const router = express.Router();

router.get('/', pageController.renderHome);
router.get('/imoveis', pageController.renderListings);
router.get('/imoveis/:id', pageController.renderDetail);

router.get('/contato', pageController.renderContactForm);
router.post('/contato', leadValidationRules, pageController.submitContactForm);

// Admin simples (sem autenticação nesta fase)
router.get('/admin/properties', pageController.renderAdminProperties);
router.get('/admin/properties/new', pageController.renderNewPropertyForm);
router.post('/admin/properties/new', propertyValidationRules, pageController.handleNewPropertyForm);
router.get('/admin/leads', pageController.renderAdminLeads);

module.exports = router;
