// index.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db'); 

const app = express();
const PORT = process.env.PORT || 3000;
const API_BASE = '/api';

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Importação e uso das Rotas
const authRoutes = require('./src/routes/auth');
const postRoutes = require('./src/routes/posts');

app.use(API_BASE + '/auth', authRoutes);
app.use(API_BASE + '/posts', postRoutes);

// Teste de Conexão e Início do Servidor
async function startServer() {
    let client;
    try {
        // Tenta se conectar para garantir que o DB está online
        client = await db.connect();
        console.log('PostgreSQL conectado com sucesso (SQL Puro)!');
        client.release();

        app.listen(PORT, () => {
            console.log(`Servidor Express rodando em http://localhost:${PORT}`);
        });

    } catch (err) {
        console.error('Erro ao conectar com o banco de dados. Certifique-se de que o PostgreSQL está rodando e a DATABASE_URL está correta:', err.message);
        if (client) {
            client.release();
        }
        process.exit(1);
    }
}

startServer();