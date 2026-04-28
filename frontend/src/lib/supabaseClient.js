// frontend\src\lib\supabaseClient.js
import { createClient } from '@supabase/supabase-js'

// Vite carga las variables del archivo .env automáticamente
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)