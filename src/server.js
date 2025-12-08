// Server entrypoint para Cazzola Propiedades.
// Configura Express 5, conecta ao MongoDB, serve assets públicos e expõe rotas web + API REST.
const path = require('path');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const env = require('./config/env');
const connectDB = require('./config/db');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// Conecta ao banco usando Mongoose (timestamps nos modelos ajudam a ordenar dados no admin).
if (!env.MONGODB_URI) {
  // eslint-disable-next-line no-console
  console.error('MONGODB_URI não definido. Configure sua conexão no arquivo .env.');
  process.exit(1);
} else {
  connectDB(env.MONGODB_URI)
    .then(() => {
      // eslint-disable-next-line no-console
      console.log('MongoDB conectado com sucesso');
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error('Falha ao conectar ao MongoDB:', error.message);
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    });
}

// Middlewares globais.
app.use(cors({ origin: process.env.CORS_ORIGIN || true, credentials: true }));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Assets públicos (CSS/JS) ficam em /public.
app.use(express.static(path.join(__dirname, '..', 'public')));

// Configura EJS e pasta de views.
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Health check simples.
app.get('/health', (req, res) => res.send('OK'));

// API REST (imóveis e leads).
app.use('/api', apiRoutes);

// Rotas de autenticação.
app.use('/auth', authRoutes);

// Rotas web renderizadas.
app.use('/', webRoutes);

// Tratamento de erros padrão.
// Mantemos respostas HTML simples e JSON para a API com status adequados.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const isHtml = req.headers.accept && req.headers.accept.includes('text/html');

  // eslint-disable-next-line no-console
  console.error(process.env.NODE_ENV === 'production' ? err.message : err);

  if (isHtml) {
    return res.status(status).send('Erro interno. Tente novamente em instantes.');
  }

  return res.status(status).json({
    message: err.message || 'Erro interno',
  });
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Servidor Cazzola Propiedades ouvindo em http://localhost:${PORT}`);
});

module.exports = app;
