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
  const { email } = await req.json();

  try {
    const { error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/reset`,
    });

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: 'Password reset email sent' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to send reset email' }, { status: 400 });
  }
}
