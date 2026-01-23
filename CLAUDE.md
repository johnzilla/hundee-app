# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build and Development Commands

```bash
npm run dev        # Start development server at http://localhost:3000
npm run build      # Production build (uses Netlify Next.js plugin)
npm run start      # Start production server
npm run lint       # Run ESLint
```

## Architecture Overview

Hundee is a goal tracking app where users complete "100 of anything" challenges. It's built with Next.js 14 App Router and Supabase.

### Tech Stack
- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: TailwindCSS + shadcn/ui (Radix UI primitives)
- **Backend**: Supabase (PostgreSQL with Row-Level Security)
- **Auth**: Supabase Auth with email/password
- **Deployment**: Netlify with @netlify/plugin-nextjs (supports API routes)

### Key Directories
- `app/` - Next.js App Router pages and API routes
- `app/api/signup/route.ts` - Transactional sign-up with rate limiting and hCaptcha
- `components/` - React components organized by feature (auth/, goals/, layout/, ui/)
- `components/ui/` - shadcn/ui components (do not edit directly, regenerate with CLI)
- `lib/` - Business logic and utilities (supabase.ts, goals.ts, auth.ts)
- `hooks/` - Custom React hooks (use-auth.ts for auth state)
- `supabase/migrations/` - Database schema migrations

### Database Schema
Three main tables with RLS policies:
- `profiles` - User profiles (username, is_public flag)
- `goals` - Goal tracking (title, progress 0-100, emoji, color, is_completed, is_public)
- `goal_updates` - Progress history

### Authentication Flow
The `useAuth` hook in `hooks/use-auth.ts` manages auth state by subscribing to Supabase auth changes. Sign-up uses a transactional API route (`app/api/signup/route.ts`) that creates both auth user and profile atomically with rollback on failure. The hook also exposes `refreshProfile()` for updating profile state after changes.

### Profile Visibility
Users control their visibility on the Hundee Wall via a toggle in the header dropdown menu. This updates `profiles.is_public` using `updateProfile()` in `lib/auth.ts`.

### Public Feed (Hundee Wall)
The community feed at `components/goals/hundee-wall.tsx` shows all public goals (both in-progress and completed) where both the goal and profile have `is_public=true`. Goals display with custom colors and show "In Progress" or "Completed" badges.

## Environment Variables

Required:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # Server-only, for sign-up API
```

Optional (enables hCaptcha on sign-up):
```env
HCAPTCHA_SECRET=your_secret
NEXT_PUBLIC_HCAPTCHA_SITEKEY=your_site_key
```

## Code Patterns

- Client components use `'use client'` directive
- Database types are defined in `lib/supabase.ts`
- Form validation uses Zod schemas with react-hook-form
- API routes implement rate limiting (5 req/min per IP) and input validation
- Use `@/` path alias for imports (configured in tsconfig.json)
