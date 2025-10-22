import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './routes/auth.js';
import sellerRoutes from './routes/seller.js';
import biometricRoutes from './routes/biometric.js';

dotenv.config();
const app = express();
app.use(express.json());

// Adicionar CORS para permitir requisições do frontend (Vite)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Permitir qualquer origem em desenvolvimento
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  next();
});

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);
app.set('supabase', supabase);

app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/biometric', biometricRoutes);

// Usar a porta 3001 para o servidor de API
const port = 3001; 
app.listen(port, () => console.log('Auth service running on', port));