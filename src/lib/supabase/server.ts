import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder';

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn("Missing SUPABASE_SERVICE_ROLE_KEY or URL");
}

// Client สำหรับฝั่ง Server-side (Route Handlers, Server Actions) 
// ใช้สิทธิ์ Service Role เพื่อ Bypass RLS
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});
