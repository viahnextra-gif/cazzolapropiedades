const complianceConfig = require('../config/compliance');

// Registra consentimento LGPD/Ley Paraguay vinculando versão e IP.
// Pode ser reutilizado em fluxos de registro ou aceite explícito em formulários futuros.
function registrarConsentimento(user, { aceito, versao, ip, leiAplicada }) {
  if (!user) return;

  user.consentimentoLGPD = {
    aceito: Boolean(aceito),
    data: new Date(),
    versao: versao || '1.0',
    ip: ip || undefined,
    leiAplicada: leiAplicada || complianceConfig.defaultLaw,
  };
}

module.exports = { registrarConsentimento };
