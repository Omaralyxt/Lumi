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

export default router;