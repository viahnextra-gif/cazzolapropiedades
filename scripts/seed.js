require('dotenv').config();
const connectDB = require('../src/config/db');
const env = require('../src/config/env');
const Property = require('../src/models/Property');
const Lead = require('../src/models/Lead');

// Script de seed para popular o banco com imóveis e leads fictícios.
// Use SEED_RESET=true para limpar coleções antes de inserir novamente.
async function run() {
  const shouldReset = process.env.SEED_RESET === 'true';

  await connectDB(env.MONGODB_URI);

  if (shouldReset) {
    await Promise.all([Property.deleteMany({}), Lead.deleteMany({})]);
    // eslint-disable-next-line no-console
    console.log('Coleções limpas.');
  }

  const sampleProperties = [
    {
      title: 'Casa ampla com piscina em Carmelitas',
      type: 'venda',
      category: 'casa',
      status: 'ativo',
      price: 380000,
      address: 'Av. Santa Teresa 1234',
      neighborhood: 'Carmelitas',
      city: 'Asunción',
      state: 'Central',
      bedrooms: 4,
      bathrooms: 4,
      area: 320,
      description: 'Casa iluminada, piscina, churrasqueira e escritório.',
      images: [
        'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
      ],
      mapUrl: '',
    },
    {
      title: 'Apartamento moderno próximo ao Shopping del Sol',
      type: 'aluguel',
      category: 'apartamento',
      status: 'ativo',
      price: 950,
      address: 'Calle Alberto de Souza 45',
      neighborhood: 'Villa Morra',
      city: 'Asunción',
      state: 'Central',
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      description: 'Condomínio com academia, coworking e segurança 24h.',
      images: [
        'https://images.unsplash.com/photo-1529429617124-aee1f1650a5c?auto=format&fit=crop&w=800&q=80',
      ],
      mapUrl: '',
    },
    {
      title: 'Cobertura com vista panorâmica do rio',
      type: 'venda',
      category: 'apartamento',
      status: 'ativo',
      price: 520000,
      address: 'Costanera 880',
      neighborhood: 'Centro',
      city: 'Asunción',
      state: 'Central',
      bedrooms: 3,
      bathrooms: 3,
      area: 210,
      description: 'Varanda gourmet, 3 vagas e espaço para home-office.',
      images: [
        'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      ],
      mapUrl: '',
    },
    {
      title: 'Casa térrea em condomínio fechado',
      type: 'aluguel',
      category: 'casa',
      status: 'inativo',
      price: 750,
      address: 'Ruta Luque San Bernardino km 18',
      neighborhood: 'Ykua Sati',
      city: 'Luque',
      state: 'Central',
      bedrooms: 3,
      bathrooms: 2,
      area: 140,
      description: 'Ideal para família, com jardim e playground.',
      images: [
        'https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=800&q=80',
      ],
      mapUrl: '',
    },
  ];

  const existing = await Property.countDocuments();
  if (!existing || shouldReset) {
    await Property.insertMany(sampleProperties);
    // eslint-disable-next-line no-console
    console.log(`Inseridos ${sampleProperties.length} imóveis de exemplo.`);
  } else {
    // eslint-disable-next-line no-console
    console.log('Já existem imóveis cadastrados. Use SEED_RESET=true para recriar.');
  }

  // eslint-disable-next-line no-console
  console.log('Seed concluído.');
  process.exit(0);
}

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Erro ao executar seed:', error);
  process.exit(1);
});
