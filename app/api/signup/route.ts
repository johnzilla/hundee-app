import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipRateLimit = new Map<string, { count: number; firstRequest: number }>();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!serviceRoleKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export async function POST(req: Request) {
  const ip =
    req.headers.get('x-forwarded-for')?.split(',')[0] ||
    req.headers.get('x-real-ip') ||
    'unknown';
  const now = Date.now();
  const rateInfo = ipRateLimit.get(ip);
  if (!rateInfo || now - rateInfo.firstRequest > RATE_LIMIT_WINDOW_MS) {
    ipRateLimit.set(ip, { count: 1, firstRequest: now });
  } else {
    rateInfo.count += 1;
    if (rateInfo.count > RATE_LIMIT_MAX_REQUESTS) {
      return NextResponse.json(
        { error: 'Too many signup attempts. Please try again later.' },
        { status: 429 }
      );
    }
    ipRateLimit.set(ip, rateInfo);
  }

  const { email, password, username, fullName, captchaToken } = await req.json();

  if (process.env.HCAPTCHA_SECRET) {
    if (!captchaToken) {
      return NextResponse.json(
        { error: 'CAPTCHA token missing' },
        { status: 400 }
      );
    }
    try {
      const params = new URLSearchParams();
      params.append('secret', process.env.HCAPTCHA_SECRET);
      params.append('response', captchaToken);
      const captchaRes = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      const captchaData = await captchaRes.json();
      if (!captchaData.success) {
        return NextResponse.json(
          { error: 'CAPTCHA verification failed' },
          { status: 400 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: 'CAPTCHA verification failed' },
        { status: 400 }
      );
    }
  }

  try {
    const { data: userData, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
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
          is_public: false,
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
