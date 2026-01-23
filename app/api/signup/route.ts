import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Simple in-memory rate limiter
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 5;
const ipRateLimit = new Map<string, { count: number; firstRequest: number }>();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY');
}

// Use anon key for regular signUp (triggers email confirmation)
const supabase = createClient(supabaseUrl, supabaseAnonKey, {
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
    // Use regular signUp - triggers email confirmation
    // Profile is created automatically by database trigger
    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username,
          full_name: fullName,
        },
      },
    });

    if (signUpError) {
      throw signUpError;
    }

    return NextResponse.json({
      user: data.user,
      message: 'Check your email to confirm your account'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Sign up failed' }, { status: 400 });
  }
}
