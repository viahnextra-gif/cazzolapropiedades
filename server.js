// Servidor Cazzola Propiedades — Padronização Inicial Patch 1
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

// Verificação básica do .env
if (!process.env.MONGODB_URI) {
  console.error('[ERRO] MONGODB_URI não encontrado no .env');
  process.exit(1);
}

// Conectar ao MongoDB
connectDB(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch((error) => {
    console.error('Falha ao conectar ao MongoDB:', error.message);
    process.exit(1);
  });

// Middlewares globais
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Assets públicos
app.use(express.static(path.join(__dirname, 'public')));

// Views EJS
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'ejs');

// Health
app.get('/health', (req, res) => res.send('OK'));

// API REST
app.use('/api', apiRoutes);

// Rotas Web
app.use('/', webRoutes);

// Middleware de erro padronizado
app.use((err, req, res, next) => {
  console.error('Erro interno:', err);

  const isHTML = req.headers.accept && req.headers.accept.includes('text/html');

  if (isHTML) {
    return res.status(500).send('Erro interno do servidor. Tente novamente.');
  }

  return res.status(500).json({
    message: 'Erro interno do servidor',
    detail: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
});

app.listen(PORT, () => {
  console.log(`Cazzola rodando em http://localhost:${PORT}`);
});
