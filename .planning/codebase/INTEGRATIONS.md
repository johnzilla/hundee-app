# External Integrations

**Analysis Date:** 2026-01-21

## APIs & External Services

**hCaptcha Bot Prevention:**
- hCaptcha - Bot protection for sign-up form
  - SDK/Client: react-hcaptcha 1.8.2
  - Verification endpoint: https://hcaptcha.com/siteverify
  - Client-side sitekey env var: NEXT_PUBLIC_HCAPTCHA_SITEKEY
  - Server-side secret env var: HCAPTCHA_SECRET
  - Implementation: `components/auth/auth-form.tsx` (lines 150-156), `app/api/signup/route.ts` (lines 49-78)
  - Optional - only used if HCAPTCHA_SECRET environment variable is set
  - Rate-limited API endpoint: 5 requests per IP per minute

## Data Storage

**Database:**
- Supabase (PostgreSQL)
  - Connection: NEXT_PUBLIC_SUPABASE_URL
  - Client: @supabase/supabase-js 2.50.3
  - ORM/Query: Supabase JavaScript client with direct SQL and ORM-like methods
  - Migrations: `supabase/migrations/` directory
    - `20250705210620_dusty_torch.sql` - Initial schema (profiles, goals, goal_updates tables)
    - `20250708120000_add_is_public_to_profiles.sql` - Profile visibility flag

**File Storage:**
- Not yet implemented - placeholder support in schema (avatar_url field in profiles table)
- Potential for future Supabase Storage integration

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Supabase Auth (PostgreSQL-backed)
  - Implementation: `lib/supabase.ts`, `lib/auth.ts`
  - Approach:
    - Email/password authentication via Supabase Auth
    - Service role key for admin operations (user creation, deletion, password reset)
    - Anonymous key for client-side auth operations
    - Email confirmation required (email_confirm: false initially, user must verify)
    - Password reset via email with custom redirect URL

**Auth Components:**
- `components/auth/auth-form.tsx` - Sign in/Sign up tabs with form validation
- `components/auth/password-reset.tsx` - Password reset handling via email confirmation code
- `components/auth/resend-verification.tsx` - Email verification resend

**Auth Flow:**
- Sign up: POST to `/api/signup` -> Creates Supabase user + profile row atomically
- Sign in: Direct Supabase auth.signInWithPassword()
- Password reset: POST to `/api/password-reset` -> Sends reset email via Supabase

## Monitoring & Observability

**Error Tracking:**
- None detected - basic error handling with console.error()

**Logs:**
- Console-based logging in API routes and components
- Example: `app/api/password-reset/route.ts` line 39

## CI/CD & Deployment

**Hosting:**
- Netlify (per README)
- Static export configuration (output: 'export' in next.config.js)
- Environment variables configured in Netlify dashboard

**CI Pipeline:**
- None detected - Netlify auto-deploys on GitHub push

## Environment Configuration

**Required env vars:**

**Client-side (NEXT_PUBLIC_):**
- NEXT_PUBLIC_SUPABASE_URL - Supabase project URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY - Supabase anonymous key for client-side operations
- NEXT_PUBLIC_HCAPTCHA_SITEKEY - hCaptcha site key (optional, enables CAPTCHA)

**Server-side (private):**
- SUPABASE_SERVICE_ROLE_KEY - Supabase service role key for admin operations (sign-up, password reset)
- HCAPTCHA_SECRET - hCaptcha secret for server-side verification (optional)
- NEXT_PUBLIC_SITE_URL - Optional custom site URL for password reset redirects (defaults to Supabase URL)

**Secrets location:**
- `.env.local` file (development, not committed)
- Netlify Environment Variables dashboard (production)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- Email verification/confirmation links via Supabase SMTP
- Password reset links via Supabase SMTP
- Redirect URLs configured in Supabase dashboard authentication settings:
  - `/auth/reset` - Password reset confirmation page
  - Site URL for email verification

## Data Flow & Integration Points

**Sign-Up Flow:**
1. Client: `auth-form.tsx` collects email, password, username, full name, CAPTCHA token
2. Client: Calls `/api/signup` with form data
3. Server: `app/api/signup/route.ts` validates CAPTCHA (if HCAPTCHA_SECRET set)
4. Server: Creates Supabase user via admin API
5. Server: Inserts profile row to profiles table atomically
6. Server: Returns user object or rolls back both operations on error
7. Supabase: Sends email confirmation email to user

**Sign-In Flow:**
1. Client: `auth-form.tsx` collects email, password
2. Client: Calls Supabase auth.signInWithPassword()
3. Supabase: Returns session token on success
4. Client: Session stored in Supabase client (if localStorage is available)

**Password Reset Flow:**
1. Client: `password-reset.tsx` collects email
2. Client: Calls `/api/password-reset` with email
3. Server: Calls supabaseAdmin.auth.resetPasswordForEmail()
4. Supabase: Sends email with reset code/link
5. User: Clicks link, redirected to `/auth/reset` with code
6. Client: Exchanges code for session via supabase.auth.exchangeCodeForSession()
7. Client: User can update password via supabase.auth.updateUser({ password })

**Database Access:**
- Client uses NEXT_PUBLIC_SUPABASE_ANON_KEY with Row Level Security (RLS) policies
- Server uses SUPABASE_SERVICE_ROLE_KEY for admin operations
- All queries filtered by authenticated user ID via RLS policies

---

*Integration audit: 2026-01-21*
