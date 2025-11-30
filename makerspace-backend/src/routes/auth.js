// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const multer = require('multer');
// const path = require('path'); // <<-- REMOVIDO/COMENTADO (não é mais necessário para memoryStorage)
// const fs = require('fs');     // <<-- REMOVIDO/COMENTADO (o arquivo não é salvo em disco)

// ----------------------------------------------------
// Configuração do Multer para Upload de Imagens
// USANDO memoryStorage para capturar o arquivo como BUFFER (BLOB)
// ----------------------------------------------------
const storage = multer.memoryStorage(); // <<-- MUDANÇA: Usa a memória em vez do disco

// Filtro de arquivos para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ 
    storage: storage, // Usa memoryStorage
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: fileFilter
});
// ----------------------------------------------------

// POST /api/auth/register (Cadastro)
router.post('/register', upload.single('profileImage'), async (req, res) => {
    
    const { username, email, password, login } = req.body; 
    
    // 💡 Extração do Buffer (BLOB) e MimeType
    // req.file.buffer contém os dados binários da imagem
    const profileImageBuffer = req.file ? req.file.buffer : null; // <<-- MUDANÇA
    const profileImageMimeType = req.file ? req.file.mimetype : null; // <<-- NOVO: Armazenar o tipo MIME

    // 🌟 ADICIONE ESTES LOGS PARA DIAGNÓSTICO 🌟
    console.log("--- Log de Cadastro ---");
    console.log("Dados de Texto (req.body):", req.body);
    console.log("Informações do Arquivo (req.file):", req.file);
    console.log("Buffer da Imagem:", profileImageBuffer ? "Disponível (" + profileImageBuffer.length + " bytes)" : "Nulo"); // <<-- MUDANÇA
    console.log("Tipo MIME da Imagem:", profileImageMimeType); // <<-- NOVO
    console.log("------------------------");
    
    if (!email || !password || !username) {
        // A lógica de exclusão de arquivo não é mais necessária, pois está na memória.
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 🔑 REQUISITO DE DB:
        // A coluna profile_image DEVE ser do tipo BYTEA (PostgreSQL) ou BLOB (outros)
        // A coluna image_mimetype (NOVA) deve ser VARCHAR/TEXT.
        const result = await db.query(
            // Adicionado image_mimetype ao INSERT e RETURNING
            'INSERT INTO users (username, email, password, login, profile_image, image_mimetype) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, username, email, profile_image, image_mimetype',
            [username, email, hashedPassword, login || username, profileImageBuffer, profileImageMimeType] // <<-- profileImageBuffer agora é o dado BLOB
        );
        
        // 🌟 Logue o resultado da inserção para verificar se o campo profile_image foi preenchido
        console.log("Resultado da Inserção (rows[0]):", result.rows[0]);

        res.status(201).json({ 
            message: "Conta criada! Você pode fazer login agora.", 
            user: { 
                id: result.rows[0].id, 
                username: result.rows[0].username, 
                email: result.rows[0].email,
                // Não retorna o BLOB completo no registro
            } 
        });
    } catch (error) {
        // A lógica de exclusão de arquivo não é mais necessária.
        
        if (error.code === '23505') {
            return res.status(400).json({ message: "Email ou nome de usuário já em uso." });
        }
        console.error("Erro CRÍTICO ao salvar no banco de dados:", error);
        res.status(500).json({ message: "Erro ao criar conta." });
    }
});

// POST /api/auth/login (Login)
router.post('/login', express.json(), async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) { return res.status(400).json({ message: "Preencha todos os campos." }); }

    try {
        // Query de busca por email (ADICIONE 'image_mimetype' no SELECT)
        const result = await db.query('SELECT id, username, email, password, profile_image, image_mimetype FROM users WHERE email = $1', [email]); // <<-- MUDANÇA
        const user = result.rows[0];

        if (!user) { return res.status(401).json({ message: "Email ou senha incorretos." }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).json({ message: "Email ou senha incorretos." }); }

        // Geração do JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        // 🔑 CONVERTE O BUFFER (BLOB) PARA DATA URL (Base64) PARA O FRONTEND
        // O frontend (React Native Image) consegue renderizar imagens em Base64
        const profileImageBase64 = user.profile_image && user.image_mimetype
            ? `data:${user.image_mimetype};base64,${user.profile_image.toString('base64')}` // <<-- MUDANÇA
            : null;

        res.json({ 
            token, 
            user: { 
                id: user.id, 
                username: user.username, 
                email: user.email, 
                // Retorna a imagem em Base64
                profileImageBase64: profileImageBase64 
            } 
        });
    } catch (error) {
        console.error("Erro de login:", error);
        res.status(500).json({ message: "Erro de servidor durante o login." });
    }
});

module.exports = router;