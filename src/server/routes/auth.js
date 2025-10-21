import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Registration endpoint
router.post('/register', async (req, res) => {
  const { name, email, password, phone, user_type } = req.body;
  
  if (!name || !email || !password || !phone || !user_type) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  try {
    // Criptografar senha
    const password_hash = await bcrypt.hash(password, 10);
    
    // In a real implementation, you would create the user in Supabase Auth here
    // For now, we'll simulate a user creation
    const user = {
      id: Date.now().toString(),
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

// Login endpoint
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email e senha são obrigatórios' });
  }

  try {
    // In a real implementation, you would verify the user against Supabase Auth here
    // For now, we'll simulate a user
    const user = {
      id: '1',
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

// Biometric registration endpoint
router.post('/biometric-register', async (req, res) => {
  const { userId, email, deviceName } = req.body;
  
  if (!userId || !email) {
    return res.status(400).json({ error: 'User ID and email are required' });
  }

  try {
    // In a real implementation, you would call the WebAuthn registration here
    // For now, we'll simulate the process
    const credential = {
      id: 'mock-credential-id',
      rawId: new Uint8Array(32),
      response: {
        clientDataJSON: 'mock-client-data',
        attestationObject: 'mock-attestation'
      },
      type: 'public-key'
    };

    // Store the credential in the database (simulated)
    res.json({ 
      success: true,
      credential
    });
  } catch (error) {
    res.status(500).json({ error: 'Biometric registration failed' });
  }
});

export default router;