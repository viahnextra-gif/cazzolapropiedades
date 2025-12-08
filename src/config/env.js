// Centraliza a leitura e defaults das variáveis de ambiente do projeto.
// Carregamos .env aqui para evitar repetições em todos os módulos.
require('dotenv').config();

const env = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET || 'change-me', // Placeholder até integrar autenticação.
  DEFAULT_LAW: process.env.DEFAULT_LAW || 'lgpd_br',
  DPO_EMAIL: process.env.DPO_EMAIL || 'dpo@example.com',
};

module.exports = env;
