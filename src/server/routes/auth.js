import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  const { full_name, store_name, email, password, phone, user_type } = req.body;
  
  if (!full_name || !email || !password || !phone || !user_type) {
    return res.status(400).json({ error: 'Todos os campos obrigatórios são necessários' });
  }
  if (user_type === 'seller' && !store_name) {
    return res.status(400).json({ error: 'O nome da loja é obrigatório para vendedores' });
  }

  try {
    // Criptografar senha
    const password_hash = await bcrypt.hash(password, 10);
    
    // Simular criação de usuário
    const user = {
      id: Date.now().toString(),
      full_name,
      store_name: user_type === 'seller' ? store_name : null,
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

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // Simular busca de usuário
    const isSellerLogin = email.includes("seller"); // Simulação para diferenciar
    const user = {
      id: isSellerLogin ? 'seller-1' : 'buyer-1',
      full_name: isSellerLogin ? "Vendedor Teste" : "Comprador Teste",
      store_name: isSellerLogin ? "Loja do Vendedor" : null,
      email: email,
      phone: "+258840000000",
      user_type: isSellerLogin ? "seller" : "buyer",
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
      profile: user 
    });
  } catch (error) {
    res.status(500).json({ error: 'Falha no login' });
  }
});

export default router;