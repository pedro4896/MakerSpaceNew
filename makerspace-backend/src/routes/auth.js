// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');

// POST /api/auth/register (Cadastro)
router.post('/register', async (req, res) => {
    const { username, email, password, login, profileImage } = req.body;

    if (!email || !password || !username) {
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios." }); //
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Query de inserção
        const result = await db.query(
            'INSERT INTO users (username, email, password, login, profile_image) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email',
            [username, email, hashedPassword, login || username, profileImage]
        );

        res.status(201).json({ message: "Conta criada! Você pode fazer login agora.", user: result.rows[0] });
    } catch (error) {
        if (error.code === '23505') { // PostgreSQL unique constraint violation
            return res.status(400).json({ message: "Email ou nome de usuário já em uso." });
        }
        console.error("Erro de cadastro:", error);
        res.status(500).json({ message: "Erro ao criar conta." });
    }
});

// POST /api/auth/login (Login)
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) { return res.status(400).json({ message: "Preencha todos os campos." }); } //

    try {
        // Query de busca por email
        const result = await db.query('SELECT id, username, email, password, profile_image FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) { return res.status(401).json({ message: "Email ou senha incorretos." }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).json({ message: "Email ou senha incorretos." }); }

        // Geração do JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                profileImage: user.profile_image 
            } 
        });
    } catch (error) {
        console.error("Erro de login:", error);
        res.status(500).json({ message: "Erro de servidor durante o login." });
    }
});

module.exports = router;