const express = require('express');
const { listLeads, createLead } = require('../../controllers/leadController');
const { leadValidationRules } = require('../validators');

const router = express.Router();

// GET /api/leads - list leads (admin)
router.get('/', listLeads);

// POST /api/leads - create lead
router.post('/', leadValidationRules, createLead);

module.exports = router;
