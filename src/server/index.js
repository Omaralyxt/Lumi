import express from 'express';
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import authRoutes from './routes/auth.js';
import sellerRoutes from './routes/seller.js';
import biometricRoutes from './routes/biometric.js';

dotenv.config();
const app = express();
app.use(express.json());

const supabase = createClient(
  process.env.SUPABASE_URL, 
  process.env.SUPABASE_KEY
);
app.set('supabase', supabase);

app.use('/api/auth', authRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/biometric', biometricRoutes);

const port = process.env.PORT || 8080;
app.listen(port, () => console.log('Auth service running on', port));