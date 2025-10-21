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

// Upload de imagem
router.post('/upload-image', authMiddleware, requireSeller, async (req, res) => {
  try {
    // Aqui você implementaria o upload para Supabase Storage
    // Por enquanto, retornamos uma URL de placeholder
    const { file } = req.body;
    const imageUrl = `https://supabase.storage.lumi/products/${req.user.id}/${Date.now()}.jpg`;
    
    res.json({ 
      message: 'Imagem enviada com sucesso',
      url: imageUrl 
    });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao enviar imagem' });
  }
});

// Cadastro de produto
router.post('/products', authMiddleware, requireSeller, async (req, res) => {
  try {
    const { title, description, price, category, stock, type, image_url, features, specifications } = req.body;
    
    // Validação básica
    if (!title || !description || !price || !category || !type) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    // Aqui você implementaria a inserção no banco de dados
    // Por enquanto, retornamos uma resposta de sucesso
    const product = {
      id: Date.now(),
      seller_id: req.user.id,
      title,
      description,
      price: parseFloat(price),
      category,
      stock: parseInt(stock) || 0,
      type,
      image_url,
      features: features || [],
      specifications: specifications || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    res.json({ 
      message: 'Produto cadastrado com sucesso', 
      product 
    });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao cadastrar produto' });
  }
});

// Listar produtos do vendedor
router.get('/products', authMiddleware, requireSeller, async (req, res) => {
  try {
    // Aqui você implementaria a busca no banco de dados
    const products = [
      {
        id: 1,
        title: "Smartphone Samsung Galaxy A54",
        price: 12500,
        category: "Eletrónicos",
        type: "product",
        stock: 15,
        created_at: new Date().toISOString()
      }
    ];
    
    res.json({ products });
  } catch (error) {
    res.status(500).json({ error: 'Falha ao buscar produtos' });
  }
});

export default router;