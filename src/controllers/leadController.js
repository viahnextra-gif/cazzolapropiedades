const { validationResult } = require('express-validator');
const Lead = require('../models/Lead');

exports.listLeads = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const filters = {};

    if (status) {
      filters.status = status;
    }

    const safeLimit = Math.min(Number(limit) || 20, 100);
    const safePage = Number(page) || 1;

    const [leads, total] = await Promise.all([
      Lead.find(filters)
        .sort({ createdAt: -1 })
        .skip((safePage - 1) * safeLimit)
        .limit(safeLimit),
      Lead.countDocuments(filters),
    ]);

    res.json({
      data: leads,
      pagination: {
        page: safePage,
        limit: safeLimit,
        total,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.createLead = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const lead = await Lead.create(req.body);
    return res.status(201).json(lead);
  } catch (error) {
    return next(error);
  }
};
