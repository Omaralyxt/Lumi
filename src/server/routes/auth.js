import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Registro de comprador
router.post('/register', async (req, res) => {
  const { name, email, password, phone, user_type } = req.body;
  
  if (!name || !email || !password || !phone || !user_type) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Criptografar senha
    const password_hash = await bcrypt.hash(password, 10);
    
    // Aqui você implementaria a inserção no banco de dados
    // Por enquanto, simulamos sucesso
    const user = {
      id: Date.now(),
      name,
      email,
      phone,
      user_type,
      created_at: new Date().toISOString()
    };

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Conta criada com sucesso', 
      user,
      token 
    });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao criar conta' });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Aqui você implementaria a busca no banco de dados
    // Por enquanto, simulamos um usuário válido
    const user = {
      id: 1,
      name: "Maria João",
      email: "maria@exemplo.com",
      phone: "+258849999999",
      user_type: "buyer",
      created_at: new Date().toISOString()
    };

    // Verificar senha (simulado)
    const valid = await bcrypt.compare(password, await bcrypt.hash("123456", 10));
    
    if (!valid) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // Gerar token
    const token = jwt.sign(
      { id: user.id, email: user.email, user_type: user.user_type }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    res.json({ 
      message: 'Login efetuado', 
      token,
      user 
    });
  } catch (error) {
    res.status(500).json({ error: 'Falha no login' });
  }
});

export default router;