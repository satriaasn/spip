import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mngsigaowhlimqhrbwva.supabase.co';
const supabaseAnonKey = 'sb_publishable_ehItH8QD0UVw5uSFQURWpQ_3qN5dBYu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const email = 'admin@spip.com';
  const password = 'AdminPassword123!';

  console.log(`Testing login for ${email}...`);

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('Login failed:', error.message);
    } else {
      console.log('Login successful!');
      console.log('Session user ID:', data.user?.id);
      console.log('Session email_confirmed_at:', data.user?.email_confirmed_at);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
