import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

function authMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  
  const token = auth.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET);
    req.user = data;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

function requireSeller(req, res, next) {
  if (req.user.user_type !== 'seller') {
    return res.status(403).json({ error: 'Acesso restrito a vendedores' });
  }
  next();
}

router.get('/me', authMiddleware, requireSeller, async (req, res) => {
  // Simulação de busca de perfil
  const profile = {
    id: req.user.id,
    full_name: "Vendedor Teste",
    store_name: "Loja do Vendedor",
    email: req.user.email,
    phone: "+258840000000",
    user_type: "seller",
    created_at: new Date().toISOString()
  };
  
  res.json({ profile });
});

// Simulação de upload de imagem
router.post('/upload-image', authMiddleware, requireSeller, (req, res) => {
  res.json({ 
    message: 'Upload simulado com sucesso',
    url: '/placeholder.svg'
  });
});

// Cadastro de produto
router.post('/products', authMiddleware, requireSeller, (req, res) => {
  const { title, description, price, category, type } = req.body;
  
  if (!title || !description || !price || !category || !type) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  const newProduct = {
    id: Date.now(),
    seller_id: req.user.id,
    ...req.body,
    created_at: new Date().toISOString(),
  };

  res.status(201).json({ 
    message: 'Produto cadastrado com sucesso', 
    product: newProduct 
  });
});

export default router;