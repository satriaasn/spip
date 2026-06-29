import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mngsigaowhlimqhrbwva.supabase.co';
const supabaseAnonKey = 'sb_publishable_ehItH8QD0UVw5uSFQURWpQ_3qN5dBYu';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function run() {
  const email = 'admin@spip.go.id';
  const password = 'AdminPassword123!';
  const fullName = 'Administrator SPIP';
  const role = 'ADMIN';

  console.log(`Registering user ${email} with role ${role}...`);

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role: role,
        }
      }
    });

    if (error) {
      console.error('Error during signUp:', error.message);
    } else {
      console.log('User signed up successfully!');
      console.log('User ID:', data.user?.id);
      console.log('Profile created in database:', data.user?.user_metadata);
      console.log('Please check email for confirmation (if email confirmation is required).');
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

run();
