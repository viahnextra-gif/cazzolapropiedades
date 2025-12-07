const mongoose = require('mongoose');

// Modelo de lead capturado via formulários ou integrações futuras.
const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true },
    phone: { type: String, default: '' },
    interest: {
      type: String,
      enum: ['aluguel', 'compra', 'gestao', 'outro'],
      default: 'outro',
    },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: ['novo', 'contatado', 'convertido'],
      default: 'novo',
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Lead', LeadSchema);
