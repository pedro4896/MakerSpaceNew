// src/routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../../config/db');
const multer = require('multer');  // <<-- NOVO
const path = require('path');      // <<-- NOVO
const fs = require('fs');          // <<-- NOVO (Para deletar o arquivo em caso de erro)

// ----------------------------------------------------
// Configuração do Multer para Upload de Imagens
// ----------------------------------------------------
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // O caminho 'uploads/' é o diretório que você criou no Passo 2
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        // Cria um nome de arquivo único: fieldname-timestamp.extensao
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Filtro de arquivos para aceitar apenas imagens
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Apenas imagens são permitidas!'), false);
    }
};

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limite de 5MB
    fileFilter: fileFilter
});
// ----------------------------------------------------

// POST /api/auth/register (Cadastro)
// Aplica o middleware do multer, esperando um campo chamado 'profileImage'
router.post('/register', upload.single('profileImage'), async (req, res) => {
    
    const { username, email, password, login } = req.body; 
    
    // 💡 Extração do caminho do arquivo
    // req.file.path deve retornar algo como 'uploads/profileImage-123456789.jpg'
    const profileImagePath = req.file ? req.file.path : null; 

    // 🌟 ADICIONE ESTES LOGS PARA DIAGNÓSTICO 🌟
    console.log("--- Log de Cadastro ---");
    console.log("Dados de Texto (req.body):", req.body);
    console.log("Informações do Arquivo (req.file):", req.file);
    console.log("Caminho da Imagem a Salvar (profileImagePath):", profileImagePath);
    console.log("------------------------");
    
    if (!email || !password || !username) {
        // ... (lógica de exclusão e retorno de erro)
        if (req.file && fs.existsSync(req.file.path)) {
             fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ message: "Preencha todos os campos obrigatórios." });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // 🔑 A coluna profile_image DEVE existir e ser TEXT/VARCHAR no BD.
        const result = await db.query(
            'INSERT INTO users (username, email, password, login, profile_image) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, profile_image',
            [username, email, hashedPassword, login || username, profileImagePath]
        );
        
        // 🌟 Logue o resultado da inserção para verificar se o campo profile_image foi preenchido
        console.log("Resultado da Inserção (rows[0]):", result.rows[0]);

        res.status(201).json({ 
            message: "Conta criada! Você pode fazer login agora.", 
            user: result.rows[0] 
        });
    } catch (error) {
        // ... (lógica de exclusão e retorno de erro)
        if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
        }
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
        // Query de busca por email
        const result = await db.query('SELECT id, username, email, password, profile_image FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) { return res.status(401).json({ message: "Email ou senha incorretos." }); }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) { return res.status(401).json({ message: "Email ou senha incorretos." }); }

        // Geração do JWT
        const token = jwt.sign({ id: user.id, username: user.username }, process.env.JWT_SECRET, { expiresIn: '1d' });
        
        // 🔑 NOTA: Para exibir a imagem no frontend, você precisará da URL completa.
        // A profileImage salva é apenas o caminho no servidor (ex: 'uploads/imagem.jpg').
        // O frontend precisará do URL completo: http://IP_DO_SEU_SERVIDOR:3000/uploads/imagem.jpg
        const fullProfileImageURL = user.profile_image 
            ? `${process.env.API_BASE_URL.replace('/api', '')}/${user.profile_image}` // Exemplo de como construir a URL
            : null;

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