require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = '/api';

// ⚠️ NÃO USE express.json() AQUI!
// ⚠️ NÃO USE express.urlencoded() AQUI!

app.use(cors());

// fileUpload TEM QUE VIR PRIMEIRO
app.use(
  fileUpload({
    useTempFiles: false,
    limits: { fileSize: 10 * 1024 * 1024 },
  })
);

// ⚠️ JSON somente em rotas que NÃO fazem upload
// e nunca antes das rotas de upload

// Rotas
const authRoutes = require('./src/routes/auth');
app.use(`${API_BASE}/auth`, authRoutes);

// iniciar o servidor
async function start() {
  try {
    const client = await db.connect();
    client.release();
    console.log("🔥 Banco conectado com sucesso!");

    app.listen(PORT, () =>
      console.log(`Servidor Express rodando em http://localhost:${PORT}`)
    );
  } catch (err) {
    console.error("Erro ao conectar no banco:", err.message);
    process.exit(1);
  }
}

start();
