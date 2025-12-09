// Servidor Cazzola Propiedades — Padronização Inicial Patch 1.1
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const path = require('path');

const connectDB = require('./src/config/db');
const apiRoutes = require('./src/routes/api');
const webRoutes = require('./src/routes/web');
const errorHandler = require('./src/middleware/errorHandler');

const app = express();

// 🔐 Middlewares globais
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(morgan('dev'));

// Arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// 🔗 EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src', 'views'));

// 🧠 Banco de dados
const mongoUri = process.env.MONGO_URI || process.env.MONGODB_URI;
if (!mongoUri) {
  console.error('[ERRO] MONGO_URI não encontrado no .env');
  process.exit(1);
}

connectDB(mongoUri)
  .then(() => console.log('MongoDB conectado com sucesso'))
  .catch((error) => {
    console.error('Falha ao conectar ao MongoDB:', error.message);
    process.exit(1);
  });

// 🌍 Rotas
app.use('/', webRoutes);
app.use('/api', apiRoutes);

// 🧱 Erro global
app.use(errorHandler);

// 🚀 Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🌎 Servidor Cazzola Propiedades rodando na porta ${PORT}`);
});
