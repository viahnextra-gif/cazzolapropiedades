const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const Lead = require('../models/Lead');
const { buildFilters } = require('../services/propertyService');

function formatLocation(property) {
  return property.fullLocation || property.address || property.neighborhood || '';
}

function normalizePayloadNumbers(payload) {
  ['price', 'bedrooms', 'bathrooms', 'area'].forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== null && payload[field] !== '') {
      // eslint-disable-next-line no-param-reassign
      payload[field] = Number(payload[field]);
    }
  });
}

function collectImages(req, baseImages = []) {
  const uploaded = (req.files || []).map((file) => `/uploads/${file.filename}`);
  let urls = [];
  if (req.body.imageUrls) {
    urls = req.body.imageUrls
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }
  const images = [...baseImages, ...uploaded, ...urls];
  return images;
}

// Home destaca os últimos imóveis cadastrados.
exports.renderHome = async (req, res, next) => {
  try {
    const featured = await Property.find({ status: 'ativo' })
      .sort({ createdAt: -1 })
      .limit(6);
    res.render('home', { featured, formatLocation, page: 'home' });
  } catch (error) {
    next(error);
  }
};

// Listagem de imóveis com filtros básicos (mesmos filtros da API REST).
exports.renderListings = async (req, res, next) => {
  try {
    const filters = buildFilters({ ...req.query, status: req.query.status || 'ativo' });
    const properties = await Property.find(filters).sort({ createdAt: -1 });

    const filterOptions = {
      categories: ['casa', 'apartamento', 'terreno', 'comercial'],
      types: ['venda', 'aluguel'],
      cities: [...new Set(properties.map((item) => item.city))],
    };

    res.render('listings', {
      properties,
      filters: req.query,
      formatLocation,
      filterOptions,
      page: 'listings',
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

    return res.render('detail', { property, formatLocation, page: 'detail' });
  } catch (error) {
    return next(error);
  }
};

// Formulário de contato para capturar leads.
exports.renderContactForm = (req, res) => {
  res.render('contact', {
    submitted: false,
    errors: [],
    propertyId: req.query.propertyId || '',
    propertyTitle: req.query.title || '',
    page: 'contact',
  });
};

exports.submitContactForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const aggregatedErrors = req.validationErrors || errors.array();
    if (aggregatedErrors.length) {
      return res.status(400).render('contact', {
        submitted: false,
        errors: aggregatedErrors,
        propertyId: req.body.property || req.body.propertyId || '',
        propertyTitle: req.body.propertyTitle || '',
        page: 'contact',
      });
    }

    await Lead.create({ ...req.body, property: req.body.property || req.body.propertyId || null, status: 'novo' });

    return res.render('contact', {
      submitted: true,
      errors: [],
      propertyId: '',
      propertyTitle: '',
      page: 'contact',
    });
  } catch (error) {
    return next(error);
  }
};

// Admin: listagem de imóveis simples para gestão.
exports.renderAdminProperties = async (req, res, next) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.render('admin/properties', { properties, formatLocation, page: 'admin' });
  } catch (error) {
    next(error);
  }
};

exports.renderNewPropertyForm = (req, res) => {
  res.render('admin/new-property', {
    errors: req.validationErrors || [],
    submitted: false,
    property: req.body || { status: 'ativo', type: 'venda', category: 'casa' },
    page: 'admin',
  });
};

exports.handleNewPropertyForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const aggregatedErrors = [...(req.validationErrors || []), ...errors.array()];
    if (aggregatedErrors.length) {
      return res.status(400).render('admin/new-property', {
        errors: aggregatedErrors,
        submitted: false,
        property: req.body,
        page: 'admin',
      });
    }

    const payload = {
      ...req.body,
      status: req.body.status || 'ativo',
      images: collectImages(req),
    };
    normalizePayloadNumbers(payload);
    await Property.create(payload);

    return res.render('admin/new-property', {
      errors: [],
      submitted: true,
      property: { status: 'ativo', type: 'venda', category: 'casa' },
      page: 'admin',
    });
  } catch (error) {
    return next(error);
  }
};

exports.renderEditPropertyForm = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).send('Imóvel não encontrado');
    }

    return res.render('admin/edit-property', {
      errors: req.validationErrors || [],
      property,
      submitted: false,
      page: 'admin',
    });
  } catch (error) {
    return next(error);
  }
};

exports.handleEditPropertyForm = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    const aggregatedErrors = [...(req.validationErrors || []), ...errors.array()];
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).send('Imóvel não encontrado');
    }

    if (aggregatedErrors.length) {
      return res.status(400).render('admin/edit-property', {
        errors: aggregatedErrors,
        property: { ...property.toObject(), ...req.body },
        submitted: false,
        page: 'admin',
      });
    }

    const payload = {
      ...req.body,
      images: collectImages(req, property.images || []),
      status: req.body.status || 'ativo',
    };
    normalizePayloadNumbers(payload);
    property.set(payload);
    await property.save();

    return res.render('admin/edit-property', {
      errors: [],
      property,
      submitted: true,
      page: 'admin',
    });
  } catch (error) {
    return next(error);
  }
};

exports.handleDeleteProperty = async (req, res, next) => {
  try {
    await Property.findByIdAndDelete(req.params.id);
    return res.redirect('/admin/properties');
  } catch (error) {
    return next(error);
  }
};

exports.renderAdminLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().populate('property', 'title').sort({ createdAt: -1 });
    res.render('admin/leads', { leads, page: 'admin' });
  } catch (error) {
    next(error);
  }
};
