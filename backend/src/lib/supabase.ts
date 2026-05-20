import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.SUPABASE_URL!
const key = process.env.SUPABASE_SERVICE_KEY!

if (!url || !key) {
  console.error('❌  SUPABASE_URL or SUPABASE_SERVICE_KEY missing from .env')
}

export const supabase = createClient(url, key, {
  auth: { autoRefreshToken: false, persistSession: false },
})
