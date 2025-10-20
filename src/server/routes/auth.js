import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Registo via Supabase Auth
router.post('/register', async (req, res) => {
  const supabase = req.app.get('supabase');
  const { email, password, full_name, phone, store_name } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  // Cria user no Supabase Auth
  const { data, error } = await supabase.auth.signUp({ 
    email, 
    password 
  });
  
  if (error) {
    return res.status(400).json({ error: error.message });
  }

  // Cria profile
  const userId = data.user.id;
  const { error: err2 } = await supabase
    .from('profiles')
    .insert([{ 
      id: userId, 
      full_name, 
      phone, 
      user_type: 'seller', 
      store_name 
    }]);
  
  if (err2) {
    return res.status(500).json({ error: err2.message });
  }

  res.json({ 
    message: 'Vendedor registrado, verifique email para confirmar (se aplicável)' 
  });
});

// Login via Supabase
router.post('/login', async (req, res) => {
  const supabase = req.app.get('supabase');
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  const { data, error } = await supabase.auth.signInWithPassword({ 
    email, 
    password 
  });
  
  if (error || !data.session) {
    return res.status(401).json({ error: 'Credenciais inválidas' });
  }

  // Pega perfil
  const userId = data.user.id;
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  if (!profile || profile.user_type !== 'seller') {
    return res.status(403).json({ error: 'Acesso restrito a vendedores' });
  }

  // Opcional: emitir JWT próprio (ou retornar o access_token do supabase)
  const token = jwt.sign(
    { id: userId, email, user_type: profile.user_type }, 
    process.env.JWT_SECRET, 
    { expiresIn: '7d' }
  );

  res.json({ 
    message: 'ok', 
    token, 
    profile, 
    supabase_session: data.session 
  });
});

export default router;