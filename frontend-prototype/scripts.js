// Dummy dataset to drive the prototype. Replace with API calls when backend is ready.
const properties = [
  {
    id: 'p-101',
    title: 'Cobertura contemporânea com vista para o mar',
    type: 'Venda',
    price: 'R$ 2.150.000',
    location: 'Ipanema, Rio de Janeiro',
    bedrooms: 3,
    bathrooms: 4,
    area: 210,
    description: 'Living integrado à varanda gourmet, cozinha planejada e suítes amplas. Ideal para quem quer luz natural e conforto.',
    hero: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'p-102',
    title: 'Casa térrea com jardim ensolarado',
    type: 'Venda',
    price: 'R$ 1.480.000',
    location: 'Brooklin, São Paulo',
    bedrooms: 4,
    bathrooms: 3,
    area: 260,
    description: 'Ambientes integrados ao jardim, home office pronto e espaço gourmet com churrasqueira. Rua tranquila e arborizada.',
    hero: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'p-103',
    title: 'Apartamento mobiliado e pronto para morar',
    type: 'Aluguel',
    price: 'R$ 6.900/mês',
    location: 'Centro, Florianópolis',
    bedrooms: 2,
    bathrooms: 2,
    area: 92,
    description: 'Vista parcial para o mar, cozinha completa, vaga de garagem e portaria 24h. Perto de cafés, restaurantes e coworkings.',
    hero: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
    ],
  },
  {
    id: 'p-104',
    title: 'Loft industrial com mezanino criativo',
    type: 'Aluguel',
    price: 'R$ 4.200/mês',
    location: 'Savassi, Belo Horizonte',
    bedrooms: 1,
    bathrooms: 1,
    area: 74,
    description: 'Pé-direito duplo, esquadrias amplas, ar condicionado e vaga coberta. Espaço perfeito para quem ama ambientes urbanos.',
    hero: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=400&q=80',
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=400&q=80',
    ],
  },
];

function setHeroImage(imgEl, url) {
  if (imgEl) {
    imgEl.src = url;
    imgEl.alt = 'Imagem do imóvel (placeholder)';
  }
}

function renderHighlighted() {
  const grid = document.querySelector('[data-highlight-grid]');
  if (!grid) return;
  grid.innerHTML = properties.slice(0, 3).map((prop) => cardTemplate(prop)).join('');
}

function renderListings(filtered = properties) {
  const list = document.querySelector('[data-listings]');
  if (!list) return;
  list.innerHTML = filtered.map((prop) => cardTemplate(prop, true)).join('');
}

function renderDetail() {
  const detailWrapper = document.querySelector('[data-property-detail]');
  if (!detailWrapper) return;

  const params = new URLSearchParams(window.location.search);
  const currentId = params.get('id') || properties[0].id; // fallback if accessed directly without id
  const property = properties.find((p) => p.id === currentId) || properties[0];

  detailWrapper.innerHTML = detailTemplate(property);

  // Future backend hook: replace dummy gallery swapping with gallery from API / CMS.
  const mainImage = detailWrapper.querySelector('[data-main-image]');
  const thumbs = detailWrapper.querySelectorAll('[data-thumb]');
  thumbs.forEach((thumb) => {
    thumb.addEventListener('click', () => {
      setHeroImage(mainImage, thumb.dataset.src);
    });
  });
}

function handleFilters() {
  const form = document.querySelector('[data-filter-form]');
  if (!form) return;
  form.addEventListener('input', () => {
    const type = form.querySelector('[name="type"]').value;
    const location = form.querySelector('[name="location"]').value.toLowerCase();
    const min = Number(form.querySelector('[name="min"]')?.value || 0);
    const max = Number(form.querySelector('[name="max"]')?.value || Number.MAX_SAFE_INTEGER);

    const filtered = properties.filter((prop) => {
      const matchesType = !type || prop.type.toLowerCase() === type.toLowerCase();
      const matchesLocation = !location || prop.location.toLowerCase().includes(location);
      // Note: price parsing is simplified for the dummy data. Replace with numeric price from API later.
      const numericPrice = Number(prop.price.replace(/\D/g, '')) || 0;
      return matchesType && matchesLocation && numericPrice >= min && numericPrice <= max;
    });

    renderListings(filtered);
  });
}

function handleContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    // Future backend hook: send payload to /api/leads via fetch; integrate analytics + CRM.
    console.log('Lead enviada (dummy):', payload);
    const feedback = form.querySelector('[data-feedback]');
    if (feedback) {
      feedback.textContent = 'Obrigado! Seus dados foram recebidos e entraremos em contato.';
    }
    form.reset();
  });
}

function cardTemplate(prop, includeActions = false) {
  return `
    <article class="card">
      <div class="tag">${prop.type}</div>
      <img src="${prop.hero}" alt="Foto do imóvel" loading="lazy" />
      <h3>${prop.title}</h3>
      <div class="meta">${prop.location}</div>
      <div class="list-inline" style="grid-template-columns: repeat(3, minmax(0, 1fr));">
        <span>🛏️ ${prop.bedrooms}</span>
        <span>🛁 ${prop.bathrooms}</span>
        <span>📐 ${prop.area} m²</span>
      </div>
      <div class="price">${prop.price}</div>
      ${includeActions ? `<div class="actions"><a class="button secondary" href="property-detail.html?id=${prop.id}">Ver detalhes</a></div>` : ''}
    </article>
  `;
}

function detailTemplate(prop) {
  return `
    <section class="detail-hero">
      <div>
        <div class="gallery-main">
          <img data-main-image src="${prop.hero}" alt="Imagem principal do imóvel" />
        </div>
        <div class="gallery-thumbs">
          ${prop.gallery.map((src) => `<img data-thumb data-src="${src}" src="${src}" alt="Miniatura do imóvel" />`).join('')}
        </div>
      </div>
      <div class="detail-card">
        <div class="tag">${prop.type}</div>
        <h1 style="margin: 0;">${prop.title}</h1>
        <div class="price">${prop.price}</div>
        <p>${prop.description}</p>
        <ul class="list-inline">
          <li>🛏️ ${prop.bedrooms} quartos</li>
          <li>🛁 ${prop.bathrooms} banheiros</li>
          <li>📐 ${prop.area} m²</li>
          <li>📍 ${prop.location}</li>
        </ul>
        <div class="highlight">Aqui conectaremos a ficha real do imóvel via API ou CMS, incluindo mapa, documentos, tour virtual e agendamento de visita.</div>
        <a class="button primary" href="contact.html">Quero mais informações</a>
      </div>
    </section>
  `;
}

function renderPage() {
  const page = document.body.dataset.page;
  switch (page) {
    case 'home':
      renderHighlighted();
      break;
    case 'listings':
      renderListings();
      handleFilters();
      break;
    case 'detail':
      renderDetail();
      break;
    case 'contact':
      handleContactForm();
      break;
  }
}

document.addEventListener('DOMContentLoaded', renderPage);
