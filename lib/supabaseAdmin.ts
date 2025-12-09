// // lib/supabaseAdmin.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// if (!serviceRoleKey) {
//   throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set in environment (server-only).');
// }

// export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);

// lib/supabaseAdmin.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false }
});
