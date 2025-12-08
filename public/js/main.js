// JS utilitário para interações básicas do protótipo integrado às views EJS.

function bindGallery() {
  const mainImage = document.querySelector('[data-main-image]');
  const thumbs = document.querySelectorAll('[data-thumb]');
  if (!mainImage || !thumbs.length) return;

  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      const src = thumb.getAttribute('data-src');
      if (src) {
        mainImage.setAttribute('src', src);
      }
    });
  });
}

function bindLeadForm() {
  const form = document.querySelector('[data-lead-form]');
  if (!form) return;

  const alertBox = document.querySelector('[data-lead-alert]');

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (alertBox) {
      alertBox.classList.add('hidden');
      alertBox.textContent = '';
    }

    const data = Object.fromEntries(new FormData(form).entries());
    const endpoint = form.dataset.api || '/api/leads';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          property: data.property || data.propertyId || undefined,
          status: data.status || 'novo',
        }),
      });

      if (!response.ok) {
        const payload = await response.json();
        const message = payload.errors?.map((err) => err.msg).join(', ') || payload.message || 'Erro ao enviar lead.';
        throw new Error(message);
      }

      form.reset();
      if (alertBox) {
        alertBox.classList.remove('hidden');
        alertBox.classList.remove('error');
        alertBox.textContent = 'Obrigado pelo contato! Responderemos em breve.';
      }
    } catch (error) {
      if (alertBox) {
        alertBox.classList.remove('hidden');
        alertBox.classList.add('error');
        alertBox.textContent = error.message;
      }
    }
  });
}

function bindFilterToggle() {
  const filterForm = document.querySelector('[data-filter-form]');
  if (!filterForm) return;

  filterForm.addEventListener('change', () => {
    filterForm.submit();
  });
}

function markActiveNav() {
  const activePage = document.body.dataset.page;
  if (!activePage) return;

  document.querySelectorAll('[data-nav-link]').forEach((link) => {
    if (link.dataset.navLink === activePage) {
      link.classList.add('active');
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  bindGallery();
  bindLeadForm();
  bindFilterToggle();
  markActiveNav();
});
