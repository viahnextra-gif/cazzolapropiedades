const { validationResult } = require('express-validator');
const Property = require('../models/Property');

// Helper to build Mongo filters from query params.
function buildFilters(query) {
  const { type, location, city, neighborhood, minPrice, maxPrice, bedrooms, status } = query;
  const filters = {};

  if (type) {
    filters.type = type;
  }
  if (status) {
    filters.status = status;
  }
  if (city) {
    filters.city = new RegExp(city, 'i');
  }
  if (neighborhood) {
    filters.neighborhood = new RegExp(neighborhood, 'i');
  }
  if (location && !city && !neighborhood) {
    // Busca ampla quando apenas "location" for usado (bairros/cidades).
    const locationRegex = new RegExp(location, 'i');
    filters.$or = [
      { neighborhood: locationRegex },
      { city: locationRegex },
      { address: locationRegex },
    ];
  }
  if (minPrice || maxPrice) {
    filters.price = {};
    if (minPrice) filters.price.$gte = Number(minPrice);
    if (maxPrice) filters.price.$lte = Number(maxPrice);
  }
  if (bedrooms) {
    filters.bedrooms = { $gte: Number(bedrooms) };
  }

  return filters;
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
    if (payload.images && typeof payload.images === 'string') {
      payload.images = payload.images.split(',').map((item) => item.trim()).filter(Boolean);
    }

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
    if (payload.images && typeof payload.images === 'string') {
      payload.images = payload.images.split(',').map((item) => item.trim()).filter(Boolean);
    }

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
