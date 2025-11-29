// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = {
    // Função utilitária para executar queries
    query: (text, params) => pool.query(text, params),
    // Função para testar a conexão no início
    connect: () => pool.connect(), 
};