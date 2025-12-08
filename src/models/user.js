const mongoose = require('mongoose');

// Esquema de usuário com consentimento e campos auxiliares para favoritos, agenda e notificações.
const userSchema = new mongoose.Schema(
  {
    nome: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    telefone: {
      type: String,
      trim: true,
    },
    senha: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'corretor', 'cliente'],
      default: 'cliente',
    },
    status: {
      type: String,
      enum: ['ativo', 'inativo'],
      default: 'ativo',
    },
    consentimentoLGPD: {
      aceito: { type: Boolean, default: false },
      data: { type: Date },
      versao: { type: String, default: '1.0' },
      ip: { type: String },
      leiAplicada: { type: String, default: 'lgpd_br' },
    },
    favoritos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    documentosEnviados: [
      {
        nome: String,
        url: String,
        enviadoEm: { type: Date, default: Date.now },
      },
    ],
    agenda: [
      {
        dataHora: Date,
        descricao: String,
        status: { type: String, enum: ['pendente', 'confirmado', 'cancelado'], default: 'pendente' },
      },
    ],
    notificacoes: [
      {
        mensagem: String,
        lida: { type: Boolean, default: false },
        criadaEm: { type: Date, default: Date.now },
      },
    ],
    refreshTokens: [String],
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);
