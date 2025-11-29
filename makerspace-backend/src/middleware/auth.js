// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

module.exports = async (req, res, next) => {
    // Extrai o token do cabeçalho 'Authorization'
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Acesso negado. Token não fornecido.' }); //
    }

    try {
        // Verifica e decodifica o JWT
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Procura o usuário no DB para confirmar existência (segurança)
        const userResult = await db.query('SELECT id, username FROM users WHERE id = $1', [decoded.id]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ message: 'Token inválido ou usuário não existe.' });
        }

        // Anexa o ID do usuário (obtido do token) ao objeto request
        req.userId = decoded.id;
        
        next();
    } catch (ex) {
        res.status(400).json({ message: 'Token inválido.' });
    }
};