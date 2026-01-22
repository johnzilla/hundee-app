# Technology Stack

**Analysis Date:** 2026-01-21

## Languages

**Primary:**
- TypeScript 5.2.2 - Full codebase including components, API routes, and utilities
- JavaScript - Configuration files

**Secondary:**
- SQL - Supabase database migrations and queries

## Runtime

**Environment:**
- Node.js 18+ (specified in README prerequisites)

**Package Manager:**
- npm (with package-lock.json)

## Frameworks

**Core:**
- Next.js 13.5.1 - Full-stack framework with App Router, API routes, static export

**UI & Components:**
- React 18.2.0 - Component library
- @radix-ui/* (extensive collection) - Unstyled accessible component primitives including:
  - @radix-ui/react-dialog, @radix-ui/react-tabs, @radix-ui/react-alert-dialog
  - @radix-ui/react-dropdown-menu, @radix-ui/react-popover, @radix-ui/react-select
  - Complete collection across 25+ Radix UI packages
- shadcn/ui - Pre-built component library built on Radix UI (referenced in README and config)

**Styling:**
- TailwindCSS 3.3.3 - Utility-first CSS framework
- autoprefixer 10.4.15 - PostCSS vendor prefixing
- tailwindcss-animate 1.0.7 - Animation utilities
- tailwind-merge 2.5.2 - Utility class merging

**Themes & Appearance:**
- next-themes 0.3.0 - Dark mode support

**Forms:**
- react-hook-form 7.53.0 - Form state management
- @hookform/resolvers 3.9.0 - Form validation resolvers
- zod 3.23.8 - Schema validation library
- input-otp 1.2.4 - OTP input component

**Data Visualization:**
- recharts 2.12.7 - Charting library for progress visualization
- embla-carousel-react 8.3.0 - Carousel component

**Testing & Dev:**
- @next/swc-wasm-nodejs 13.5.1 - SWC compiler for Next.js
- ESLint 8.49.0 - Code linting
- eslint-config-next 13.5.1 - Next.js ESLint config

## Key Dependencies

**Critical:**
- @supabase/supabase-js 2.50.3 - Supabase client for database and auth
- @supabase/auth-ui-react 0.4.7 - Pre-built auth UI components
- @supabase/auth-ui-shared 0.1.8 - Shared auth UI utilities

**Authentication:**
- react-hcaptcha 1.8.2 - hCaptcha bot prevention widget

**Notifications & Feedback:**
- react-hot-toast 2.5.2 - Toast notifications
- sonner 1.5.0 - Alternative toast library
- react-day-picker 8.10.1 - Date picker

**Utilities:**
- date-fns 3.6.0 - Date manipulation
- lucide-react 0.446.0 - Icon library
- clsx 2.1.1 - Conditional className utility
- class-variance-authority 0.7.0 - CSS variant builder
- vaul 0.9.9 - Drawer component
- react-resizable-panels 2.1.3 - Resizable panel layouts
- cmdk 1.0.0 - Command menu/palette component
- html2canvas 1.4.1 - Screenshot/canvas conversion for share cards

**Type Definitions:**
- @types/react 18.2.22 - React type definitions
- @types/react-dom 18.2.7 - React DOM type definitions
- @types/node 20.6.2 - Node.js type definitions

## Configuration

**Environment:**
- Environment variables configured via `.env.local` (not committed, in .gitignore)
- Required variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
- Optional variables: HCAPTCHA_SECRET, NEXT_PUBLIC_HCAPTCHA_SITEKEY, NEXT_PUBLIC_SITE_URL

**Build:**
- `next.config.js` - Next.js configuration with static export (output: 'export')
- `tsconfig.json` - TypeScript compiler options with path alias `@/*`
- `tailwind.config.ts` - TailwindCSS theme and plugin configuration
- `postcss.config.js` - PostCSS pipeline configuration
- `.eslintrc.json` - ESLint configuration extending Next.js rules
- `components.json` - shadcn/ui component library configuration

**Styling:**
- Global CSS at `app/globals.css` with CSS variables for theming (darkMode: 'class')
- Tailwind extends with custom keyframes for accordion animations

## Platform Requirements

**Development:**
- Node.js 18+
- npm or yarn
- TypeScript knowledge
- Supabase account
- Environment variables for local development

**Production:**
- Deployment target: Netlify (per README, configured with static export)
- Build command: `npm run build`
- Publish directory: `out/` (static export output)
- Server-side environment variables: SUPABASE_SERVICE_ROLE_KEY, HCAPTCHA_SECRET
- Client environment variables: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, NEXT_PUBLIC_HCAPTCHA_SITEKEY

---

*Stack analysis: 2026-01-21*
