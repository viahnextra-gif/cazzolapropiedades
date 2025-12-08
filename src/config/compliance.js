const env = require('./env');

// Configuração de conformidade e retenção de dados para evoluções futuras.
const complianceConfig = {
  defaultLaw: 'lgpd_br',
  supportedLaws: ['lgpd_br', 'py_7593', 'ar_25326', 'uy_18331'],
  dataRetention: {
    leads: { default: '2y' },
    chatLogs: { default: '2y' },
    contracts: { default: '10y' },
  },
  dpoContact: {
    email: env.DPO_EMAIL,
    country: 'PY',
  },
};

module.exports = complianceConfig;
