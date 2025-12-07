const mongoose = require('mongoose');

// Modelo principal de imóvel.
// Inclui campos necessários para venda/aluguel e permite expansão futura (status, proprietário, etc.).
const PropertySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      required: true,
      enum: ['venda', 'aluguel'],
    },
    status: {
      type: String,
      enum: ['ativo', 'inativo'],
      default: 'ativo',
    },
    price: { type: Number, required: true, min: 0 },
    address: { type: String, required: true, trim: true },
    neighborhood: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, default: '', trim: true },
    bedrooms: { type: Number, default: 0, min: 0 },
    bathrooms: { type: Number, default: 0, min: 0 },
    area: { type: Number, default: 0, min: 0 }, // metragem em m²
    description: { type: String, default: '' },
    images: { type: [String], default: [] },
  },
  {
    timestamps: true, // createdAt / updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

// Virtual para exibir a localização formatada em páginas e API.
PropertySchema.virtual('fullLocation').get(function fullLocation() {
  const parts = [this.neighborhood, this.city, this.state].filter(Boolean);
  return parts.join(', ');
});

module.exports = mongoose.model('Property', PropertySchema);
