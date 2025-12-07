// Intercepta o formulário de contato para enviar via API REST e manter UX responsiva.
// Futuramente: integrar recaptcha, tracking de campanha e CRM.
function bindLeadForm() {
  const form = document.querySelector('#contact-form');
  const alertBox = document.querySelector('#lead-alert');

  if (!form) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    if (alertBox) {
      alertBox.classList.add('d-none');
      alertBox.textContent = '';
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const endpoint = form.dataset.api || '/api/leads';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, status: data.status || 'novo' }),
      });

      if (!response.ok) {
        const payload = await response.json();
        const message = payload.errors?.map((err) => err.msg).join(', ') || payload.message || 'Erro ao enviar lead.';
        throw new Error(message);
      }

      form.reset();
      if (alertBox) {
        alertBox.className = 'alert alert-success';
        alertBox.textContent = 'Obrigado pelo contato! Responderemos em breve.';
      }
    } catch (error) {
      if (alertBox) {
        alertBox.className = 'alert alert-danger';
        alertBox.textContent = error.message;
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindLeadForm();
  // Placeholder para futuras integrações: mapa no detalhe do imóvel, analytics, chat online.
});
