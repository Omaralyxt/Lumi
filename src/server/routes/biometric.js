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
  console.log(credential);

  // Em um aplicativo real, você verificaria a certificação e salvaria a chave pública.
  // Por enquanto, apenas retornamos sucesso.
  res.json({ success: true, message: 'Credencial biométrica registrada com sucesso.' });
});

export default router;