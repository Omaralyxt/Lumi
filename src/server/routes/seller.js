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
  const supabase = req.app.get('supabase');
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', req.user.id)
    .single();
  
  res.json({ profile });
});

// Simulação de upload de imagem
router.post('/upload-image', authMiddleware, requireSeller, (req, res) => {
  // Em um app real, você usaria uma lib como multer para processar o upload
  // e salvar no Supabase Storage ou similar.
  res.json({ 
    message: 'Upload simulado com sucesso',
    url: '/placeholder.svg' // Retorna uma URL de placeholder
  });
});

// Cadastro de produto
router.post('/products', authMiddleware, requireSeller, (req, res) => {
  const { title, description, price, category, type } = req.body;
  
  if (!title || !description || !price || !category || !type) {
    return res.status(400).json({ error: 'Campos obrigatórios faltando' });
  }

  // Simula a criação do produto no banco de dados
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