import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://ulalwhqfculdxavhdkey.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SERVICE_ROLE_KEY) {
  console.error('Error: SUPABASE_SERVICE_ROLE_KEY environment variable is required');
  console.error('Get it from Supabase Dashboard > Settings > API > service_role key');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function createAdminUser() {
  const email = 'admin@madrasah.id';
  const password = 'admin123';
  const fullName = 'Admin Madrasah';

  console.log('Creating admin user...');

  // 1. Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      full_name: fullName,
      role: 'ADMIN',
      is_active: true,
    },
  });

  if (authError) {
    console.error('Error creating auth user:', authError.message);
    process.exit(1);
  }

  const userId = authData.user?.id;
  console.log(`Auth user created with ID: ${userId}`);

  // 2. Wait for the trigger to create the profile in public.users
  // The trigger handle_new_auth_user should auto-create the profile
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // 3. Verify profile exists
  const { data: profile, error: profileError } = await supabase
    .from('users')
    .select('id, full_name, email, is_active')
    .eq('id', userId)
    .maybeSingle();

  if (profileError) {
    console.error('Error fetching profile:', profileError.message);
  } else if (!profile) {
    console.log('Profile not found, creating manually...');
    const { error: insertError } = await supabase.from('users').insert({
      id: userId,
      full_name: fullName,
      email,
      is_active: true,
    });
    if (insertError) {
      console.error('Error creating profile:', insertError.message);
      process.exit(1);
    }
    console.log('Profile created manually');
  } else {
    console.log('Profile found:', profile);
  }

  // 4. Get ADMIN role ID
  const { data: adminRole, error: roleError } = await supabase
    .from('roles')
    .select('id')
    .eq('code', 'ADMIN')
    .maybeSingle();

  if (roleError || !adminRole) {
    console.error('Error finding ADMIN role:', roleError?.message);
    process.exit(1);
  }

  console.log(`ADMIN role ID: ${adminRole.id}`);

  // 5. Assign ADMIN role to user
  const { error: userRoleError } = await supabase
    .from('user_roles')
    .insert({
      user_id: userId,
      role_id: adminRole.id,
    });

  if (userRoleError) {
    console.error('Error assigning ADMIN role:', userRoleError.message);
    process.exit(1);
  }

  console.log('ADMIN role assigned successfully!');
  console.log('\n--- Admin User Created ---');
  console.log(`Email: ${email}`);
  console.log(`Password: ${password}`);
  console.log(`User ID: ${userId}`);
  console.log('--------------------------');
}

createAdminUser().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});