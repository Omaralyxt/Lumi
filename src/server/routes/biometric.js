import express from 'express';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Middleware para proteger rotas
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

// Simular o registro de uma nova credencial biométrica
router.post('/register', authMiddleware, (req, res) => {
  const { credential } = req.body;
  
  if (!credential) {
    return res.status(400).json({ error: 'Dados da credencial são necessários' });
  }

  console.log('Simulando o salvamento da credencial biométrica para o usuário:', req.user.id);
  
  res.json({ success: true, message: 'Credencial biométrica registrada com sucesso.' });
});

// Simular o login com credencial biométrica
router.post('/login', (req, res) => {
  const { assertion } = req.body;

  if (!assertion) {
    return res.status(400).json({ error: 'Dados de autenticação são necessários' });
  }

  console.log('Simulando a verificação da credencial biométrica...');

  // Em um app real, você buscaria o usuário pela credencial e verificaria a assinatura.
  // Por enquanto, retornamos um usuário e token de sucesso.
  const user = {
    id: 'buyer-1',
    full_name: "Comprador Biométrico",
    email: "biometric@email.com",
    user_type: "buyer",
    created_at: new Date().toISOString()
  };

  const token = jwt.sign(
    { id: user.id, email: user.email, user_type: user.user_type }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );

  res.json({ 
    message: 'Login biométrico efetuado', 
    token,
    profile: user 
  });
});

export default router;