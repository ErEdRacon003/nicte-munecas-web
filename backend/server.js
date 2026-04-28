// backend/server.js
const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors()); 
app.use(express.json()); 

// Conexión con la Service Role Key (Poder absoluto)
const supabaseAdmin = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// RUTA PARA CREAR FAMILIARES
app.post('/api/crear-familiar', async (req, res) => {
  const { email, password, nombre, secret_key } = req.body;

  // Comparamos contra la variable del entorno (.env)
  if (secret_key !== process.env.MASTER_DEV_KEY) {
    return res.status(401).json({ error: 'Llave de desarrollador incorrecta' });
  }

  try {
    const { data, error } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { nombre: nombre },
      email_confirm: true 
    });

    if (error) throw error;
    res.json({ message: 'Cuenta creada con éxito', user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Backend corriendo en http://localhost:${PORT}`);
});