const { validationResult } = require('express-validator');
const Property = require('../models/Property');
const { buildFilters } = require('../services/propertyService');

function normalizeImages(req, payload) {
  const uploaded = (req.files || []).map((file) => `/uploads/${file.filename}`);

  let urls = [];
  if (payload.imageUrls) {
    urls = payload.imageUrls
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  } else if (payload.images && typeof payload.images === 'string') {
    urls = payload.images
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  const merged = [...uploaded, ...urls];
  if (merged.length) {
    payload.images = merged;
  }
}

function normalizeNumbers(payload) {
  ['price', 'bedrooms', 'bathrooms', 'area'].forEach((field) => {
    if (payload[field] !== undefined && payload[field] !== null && payload[field] !== '') {
      // eslint-disable-next-line no-param-reassign
      payload[field] = Number(payload[field]);
    }
  });
}

exports.listProperties = async (req, res, next) => {
  try {
    const filters = buildFilters(req.query);
    const properties = await Property.find(filters).sort({ createdAt: -1 });
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

exports.getPropertyById = async (req, res, next) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }
    return res.json(property);
  } catch (error) {
    return next(error);
  }
};

exports.createProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload = {
      ...req.body,
      status: req.body.status || 'ativo',
    };
    normalizeImages(req, payload);
    normalizeNumbers(payload);

    const property = await Property.create(payload);
    return res.status(201).json(property);
  } catch (error) {
    return next(error);
  }
};

exports.updateProperty = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const payload = {
      ...req.body,
      status: req.body.status || 'ativo',
    };
    normalizeImages(req, payload);
    normalizeNumbers(payload);

    const property = await Property.findByIdAndUpdate(req.params.id, payload, {
      new: true,
      runValidators: true,
    });

    if (!property) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }

    return res.json(property);
  } catch (error) {
    return next(error);
  }
};

exports.deleteProperty = async (req, res, next) => {
  try {
    const deleted = await Property.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Imóvel não encontrado' });
    }

    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

exports.buildFilters = buildFilters;
