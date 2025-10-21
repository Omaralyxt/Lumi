import express from 'express';
import jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

const router = express.Router();

// Initialize Supabase admin client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY // Use service role key for admin operations
);

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

// Verify biometric credential and return a JWT
router.post('/verify', async (req, res) => {
  try {
    const { credential, deviceName } = req.body;

    if (!credential || !credential.id || !credential.response) {
      return res.status(400).json({ error: 'Invalid credential data' });
    }

    // Find the stored credential by public key (which is the credential ID in WebAuthn)
    const { data: biometricData, error } = await supabase
      .from('user_biometrics')
      .select('*')
      .eq('public_key', credential.id)
      .single();

    if (error || !biometricData) {
      return res.status(404).json({ error: 'Biometric credential not found' });
    }

    // In a real implementation, you would verify the credential signature here
    // For now, we'll assume it's valid and generate a token

    // Generate a JWT for the user
    const token = jwt.sign(
      { 
        id: biometricData.user_id, 
        user_type: 'buyer', // This should come from the user profile
        device_id: deviceName 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '7d' }
    );

    // Also get a Supabase token for the user
    const { data: supabaseToken, error: tokenError } = await supabase.auth.admin.createToken({
      user_id: biometricData.user_id
    });

    if (tokenError) {
      throw tokenError;
    }

    res.json({
      success: true,
      token,
      supabaseToken: supabaseToken.data.access_token
    });
  } catch (error) {
    console.error('Biometric verification failed:', error);
    res.status(500).json({ error: 'Biometric verification failed' });
  }
});

// Get user's biometric credentials
router.get('/credentials', authMiddleware, async (req, res) => {
  try {
    const { data: credentials, error } = await supabase
      .from('user_biometrics')
      .select('id, device_id, platform, created_at')
      .eq('user_id', req.user.id);

    if (error) {
      throw error;
    }

    res.json({ credentials });
  } catch (error) {
    console.error('Failed to get biometric credentials:', error);
    res.status(500).json({ error: 'Failed to get credentials' });
  }
});

// Delete a biometric credential
router.delete('/credentials/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Verify the credential belongs to the user
    const { data: credential, error: fetchError } = await supabase
      .from('user_biometrics')
      .select('user_id')
      .eq('id', id)
      .eq('user_id', req.user.id)
      .single();

    if (fetchError || !credential) {
      return res.status(404).json({ error: 'Credential not found or access denied' });
    }

    // Delete the credential
    const { error } = await supabase
      .from('user_biometrics')
      .delete()
      .eq('id', id);

    if (error) {
      throw error;
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Failed to delete biometric credential:', error);
    res.status(500).json({ error: 'Failed to delete credential' });
  }
});

export default router;