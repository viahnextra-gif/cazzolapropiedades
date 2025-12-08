const express = require('express');
const pageController = require('../controllers/pageController');
const { propertyValidationRules, leadValidationRules } = require('./validators');
const upload = require('../config/upload');
const validateProperty = require('../middleware/validateProperty');

// Rotas server-rendered com EJS.
const router = express.Router();

router.get('/', pageController.renderHome);
router.get('/properties', pageController.renderListings);
router.get('/properties/:id', pageController.renderDetail);

router.get('/contact', pageController.renderContactForm);
router.post('/contact', leadValidationRules, pageController.submitContactForm);

// Admin simples (sem autenticação nesta fase)
router.get('/admin', (_req, res) => res.redirect('/admin/properties'));
router.get('/admin/properties', pageController.renderAdminProperties);
router.get('/admin/properties/new', pageController.renderNewPropertyForm);
router.post(
  '/admin/properties',
  upload.array('images', 10),
  propertyValidationRules,
  validateProperty,
  pageController.handleNewPropertyForm,
);
router.get('/admin/properties/edit/:id', pageController.renderEditPropertyForm);
router.post(
  '/admin/properties/edit/:id',
  upload.array('images', 10),
  propertyValidationRules,
  validateProperty,
  pageController.handleEditPropertyForm,
);
router.post('/admin/properties/delete/:id', pageController.handleDeleteProperty);
router.get('/admin/leads', pageController.renderAdminLeads);

module.exports = router;
