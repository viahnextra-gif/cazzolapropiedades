// Server entrypoint for Cazzola Propiedades com API e páginas renderizadas.
// Configura Express, conecta ao MongoDB, expõe rotas públicas e endpoints RESTful.

require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

const pageRoutes = require('./routes/pages');
const propertyApiRoutes = require('./routes/api/properties');
const leadApiRoutes = require('./routes/api/leads');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conecta ao MongoDB antes de subir o servidor HTTP.
connectDB(MONGODB_URI)
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('MongoDB conectado com sucesso');
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Falha ao conectar ao MongoDB:', error.message);
    process.exit(1);
  });

// Middlewares globais
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Static assets
app.use(express.static(path.join(__dirname, '..', 'public')));

// View engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Health check
app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

// API routes
app.use('/api/imoveis', propertyApiRoutes);
app.use('/api/leads', leadApiRoutes);

// Page routes
app.use('/', pageRoutes);

// Error handler centralizado para JSON e páginas
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const acceptsHTML = req.headers.accept && req.headers.accept.includes('text/html');

  if (acceptsHTML) {
    return res.status(500).send('Ocorreu um erro no servidor. Tente novamente mais tarde.');
  }

  return res.status(500).json({ message: 'Erro interno', detail: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Cazzola Propiedades server running at http://localhost:${PORT}`);
});
