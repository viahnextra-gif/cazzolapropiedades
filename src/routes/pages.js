const express = require('express');
const pageController = require('../controllers/pageController');
const { propertyValidationRules, leadValidationRules } = require('./validators');

const router = express.Router();

const blogPosts = [
  {
    id: 'b1',
    title: 'Tendências do mercado imobiliário 2025',
    summary: 'Panorama de crescimento em Asunción, Luque e Mariano Roque Alonso.',
    date: '2025-02-01',
  },
  {
    id: 'b2',
    title: 'Checklist de documentação para compra',
    summary: 'O que preparar antes de assinar contrato de compra e venda.',
    date: '2025-03-12',
  },
];

router.get('/', pageController.renderHome);
router.get('/properties', pageController.renderProperties);
router.get('/properties/:id', pageController.renderPropertyDetail);

router.get('/contato', pageController.renderContactForm);
router.post('/contato', leadValidationRules, pageController.submitContactForm);

router.get('/admin/imoveis/novo', pageController.renderNewPropertyForm);
router.post('/admin/imoveis/novo', propertyValidationRules, pageController.handleNewPropertyForm);

router.get('/blog', (req, res) => {
  res.render('blog', { posts: blogPosts });
});

router.get('/about', (req, res) => {
  res.render('about');
});

router.get('/services', (req, res) => {
  res.render('services');
});

module.exports = router;
