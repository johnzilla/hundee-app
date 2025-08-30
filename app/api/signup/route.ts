import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: Request) {
  const { email, password, username, fullName } = await req.json();

  try {
    const { data: userData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
      user_metadata: {
        username,
        full_name: fullName,
      },
    });

    if (signUpError || !userData.user) {
      throw signUpError || new Error('Failed to create user');
    }

    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .insert([
        {
          id: userData.user.id,
          username,
          full_name: fullName || null,
        },
      ]);

    if (profileError) {
      await supabaseAdmin.auth.admin.deleteUser(userData.user.id);
      throw profileError;
    }

    return NextResponse.json({ user: userData.user });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Transaction failed' }, { status: 400 });
  }
}
