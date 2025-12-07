const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const { buildFilters } = require('./propertyController');

function formatLocation(property) {
  return property.fullLocation || property.address || property.neighborhood || '';
}

// Home destaca os últimos imóveis cadastrados.
exports.renderHome = async (req, res, next) => {
  try {
    const featured = await Property.find({ status: 'ativo' }).sort({ createdAt: -1 }).limit(3);
    res.render('home', { featured, formatLocation });
  } catch (error) {
    next(error);
  }
};

// Listagem de imóveis com filtros básicos (mesmos filtros da API REST).
exports.renderListings = async (req, res, next) => {
  try {
    const filters = buildFilters(req.query);
    const properties = await Property.find(filters).sort({ createdAt: -1 });

    res.render('listings', {
      properties,
      filters: req.query,
      formatLocation,
    });
  } catch (error) {
    next(error);
  }
};

// Página de detalhe de um imóvel específico.
exports.renderDetail = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).send('Imóvel não encontrado');
    }

    return res.render('detail', { property, formatLocation });
  } catch (error) {
    return next(error);
  }
};

// Formulário de contato para capturar leads.
exports.renderContactForm = (req, res) => {
  res.render('contact', { submitted: false, errors: [] });
};

exports.submitContactForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('contact', {
        submitted: false,
        errors: errors.array(),
      });
    }

    await Lead.create({ ...req.body, status: 'novo' });

    return res.render('contact', { submitted: true, errors: [] });
  } catch (error) {
    return next(error);
  }
};

// Admin: listagem de imóveis simples para gestão.
exports.renderAdminProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.render('admin/properties', { properties, formatLocation });
  } catch (error) {
    next(error);
  }
};

exports.renderNewPropertyForm = (req, res) => {
  res.render('admin/new-property', { errors: [], submitted: false });
};

exports.handleNewPropertyForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).render('admin/new-property', {
        errors: errors.array(),
        submitted: false,
      });
    }

    const payload = { ...req.body };
    if (payload.images && typeof payload.images === 'string') {
      payload.images = payload.images.split(',').map((item) => item.trim()).filter(Boolean);
    }

    await Property.create(payload);

    return res.render('admin/new-property', { errors: [], submitted: true });
  } catch (error) {
    return next(error);
  }
};

exports.renderAdminLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.render('admin/leads', { leads });
  } catch (error) {
    next(error);
  }
};
