// src/routes/posts.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth'); // Middleware para proteger as rotas
const db = require('../../config/db');

// POST /api/posts (Cria novo projeto) - REQUER AUTENTICAÇÃO
router.post('/', auth, async (req, res) => {
    const { postImage, description } = req.body;
    const authorId = req.userId; // ID obtido do middleware 'auth'

    if (!postImage || !description) { 
        return res.status(400).json({ message: "Imagem e descrição são obrigatórias." }); 
    } //

    try {
        // Query de inserção
        const result = await db.query(
            'INSERT INTO posts (post_image, description, author_id) VALUES ($1, $2, $3) RETURNING *',
            [postImage, description, authorId]
        );

        res.status(201).json({ message: "Projeto publicado com sucesso!", post: result.rows[0] }); //
    } catch (e) {
        console.error("Erro ao publicar projeto:", e);
        res.status(500).json({ message: "Falha ao publicar. Erro interno do servidor." });
    }
});

// GET /api/posts (Obter feed) - REQUER AUTENTICAÇÃO
router.get('/', auth, async (req, res) => {
    try {
        // Query complexa com JOIN para buscar posts e dados do autor
        const result = await db.query(`
            SELECT 
                p.id, 
                p.post_image, 
                p.description, 
                p.timestamp,
                -- Agrupa os dados do autor em um objeto JSON (simulando a estrutura de um ORM)
                json_build_object(
                    'id', u.id,
                    'username', u.username,
                    'profileImage', u.profile_image
                ) as author
            FROM posts p
            JOIN users u ON p.author_id = u.id
            ORDER BY p.timestamp DESC
        `);

        // Mapeia o resultado para o formato camelCase esperado pelo frontend (opcional, mas recomendado)
        const posts = result.rows.map(row => ({
            id: row.id,
            postImage: row.post_image,
            description: row.description,
            timestamp: row.timestamp,
            author: {
                id: row.author.id,
                username: row.author.username,
                profileImage: row.author.profile_image,
            }
        }));

        res.json(posts); //
    } catch (e) {
        console.error("Erro ao buscar posts:", e);
        res.status(500).json({ message: "Falha ao carregar o Feed. Verifique o servidor Node.js." });
    }
});

module.exports = router;