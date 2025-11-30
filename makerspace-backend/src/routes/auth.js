// src/routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../config/db'); // ajusta se o caminho for diferente
const router = express.Router();

// ===============================
// POST /api/auth/register
// Cadastro com upload de imagem
// ===============================
router.post('/register', async (req, res) => {
  try {
    console.log('--- Log de Cadastro ---');
    console.log('Content-Type recebido:', req.headers['content-type']);
    console.log('Dados de Texto (req.body):', req.body);
    console.log('Informações de Arquivo (req.files):', req.files);

    const { username, email, password, login } = req.body;

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ message: 'username, email e password são obrigatórios.' });
    }

    // Verifica se já existe usuário com esse email
    const userExists = await db.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'E-mail já está em uso.' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // --------------------------
    // Arquivo vindo do mobile
    // --------------------------
    let profileImageBuffer = null;
    let profileImageMimeType = null;

    // express-fileupload coloca arquivos em req.files
    // O nome do campo precisa ser o MESMO nome usado no FormData: "profileImage"
    if (req.files && req.files.profileImage) {
      const file = req.files.profileImage;

      profileImageBuffer = file.data;      // Buffer da imagem
      profileImageMimeType = file.mimetype; // ex: image/jpeg
    }

    console.log(
      'Buffer da Imagem:',
      profileImageBuffer ? 'Preenchido' : 'Nulo'
    );
    console.log(
      'Tipo MIME da Imagem:',
      profileImageMimeType || 'null'
    );
    console.log('------------------------');

    const query = `
      INSERT INTO users (username, login, email, password, profile_image, image_mimetype)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING id, username, email, profile_image, image_mimetype
    `;

    const values = [
      username,
      login || username,
      email,
      hashedPassword,
      profileImageBuffer,
      profileImageMimeType,
    ];

    const { rows } = await db.query(query, values);

    return res.status(201).json({
      message: 'Usuário cadastrado com sucesso!',
      user: rows[0],
    });
  } catch (err) {
    console.error('Erro no /auth/register:', err);
    return res.status(500).json({ message: 'Erro ao registrar usuário.' });
  }
});

// ===============================
// POST /api/auth/login
// (exemplo simples com JWT)
// ===============================
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const result = await db.query(
      'SELECT id, username, email, password FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const payload = { id: user.id, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: '8h',
    });

    return res.json({
      message: 'Login realizado com sucesso!',
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error('Erro no /auth/login:', err);
    return res.status(500).json({ message: 'Erro ao autenticar usuário.' });
  }
});

module.exports = router;
