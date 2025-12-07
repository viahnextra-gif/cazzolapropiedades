// Server entrypoint para Cazzola Propiedades.
// Configura Express 5, conecta ao MongoDB, serve assets públicos e expõe rotas web + API REST.
require('dotenv').config();
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const connectDB = require('./src/config/db');
const webRoutes = require('./src/routes/web');
const apiRoutes = require('./src/routes/api');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

// Conecta ao banco usando Mongoose (timestamps nos modelos ajudam a ordenar dados no admin).
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

// Middlewares globais.
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Assets públicos (CSS/JS) ficam em /public.
app.use(express.static(path.join(__dirname, 'public')));

// Configura EJS e pasta de views.
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Health check simples.
app.get('/health', (req, res) => res.send('OK'));

// API REST (imóveis e leads).
app.use('/api', apiRoutes);

// Rotas web renderizadas.
app.use('/', webRoutes);

// Tratamento de erros padrão.
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  if (req.headers.accept && req.headers.accept.includes('text/html')) {
    return res.status(500).send('Erro interno. Tente novamente em instantes.');
  }
  return res.status(500).json({ message: 'Erro interno', detail: err.message });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor Cazzola Propiedades ouvindo em http://localhost:${PORT}`);
});
