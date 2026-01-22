# Architecture

**Analysis Date:** 2026-01-21

## Pattern Overview

**Overall:** Client-side Next.js application with Supabase backend (BaaS)

**Key Characteristics:**
- Server-side rendered with client components for interactivity
- Supabase handles authentication, database, and RLS policies
- React hooks for state management and data fetching
- Tab-based navigation for different app sections
- Modal-based forms for creating/editing goals

## Layers

**UI Layer:**
- Purpose: Render interactive components and handle user interactions
- Location: `components/`
- Contains: React components organized by feature (auth, goals, layout, contact, setup)
- Depends on: Hooks, lib utilities, Shadcn UI components
- Used by: Next.js pages

**Business Logic Layer:**
- Purpose: Handle goal operations, authentication, and profile management
- Location: `lib/`
- Contains: Goal CRUD, auth functions, Supabase client initialization
- Depends on: Supabase SDK, environment variables
- Used by: Components and API routes

**API Layer:**
- Purpose: Server-side operations requiring service role credentials
- Location: `app/api/`
- Contains: Signup endpoint with CAPTCHA verification and rate limiting
- Depends on: Supabase admin client, hCaptcha service
- Used by: Frontend auth functions

**Data Layer:**
- Purpose: Database schema, types, and RLS policies
- Location: `supabase/migrations/` and `lib/supabase.ts`
- Contains: Three tables (profiles, goals, goal_updates) with Row-Level Security policies
- Depends on: PostgreSQL
- Used by: All business logic functions

**Presentation Layer:**
- Purpose: Page layouts and routing structure
- Location: `app/`
- Contains: Root layout, home page, setup page
- Depends on: All UI components
- Used by: Next.js router

## Data Flow

**Goal Creation:**
1. User fills GoalForm component
2. Form calls `createGoal()` from `lib/goals.ts`
3. Function authenticates with Supabase and inserts into `goals` table
4. Component shows success toast and refreshes goal list
5. Goals automatically fetch from database via `getUserGoals()`

**Goal Progress Update:**
1. User clicks +/- button on GoalCard
2. Card calls `updateGoalProgress()` from `lib/goals.ts`
3. Function updates goal progress and auto-sets is_completed flag when >= 100
4. Function records update in `goal_updates` table for history tracking
5. Component refreshes goal list and shows completion toast

**Public Goals Display:**
1. HundeeWall component mounts and calls `getPublicGoals()`
2. Query selects goals where is_public=true, is_completed=true, and user profile is_public=true
3. Results include joined profile data (username, full_name)
4. HundeeWall displays goals with user attribution and completion date

**Authentication:**
1. User submits credentials in AuthForm
2. Frontend calls `/api/signup` endpoint (new users) or `signIn()` (existing)
3. Signup endpoint verifies CAPTCHA, creates auth user, creates profile record
4. Auth change triggers useAuth hook update
5. useAuth hook fetches profile and updates app state
6. Protected content renders based on user state

**State Management:**
- Session state: Supabase auth listener via `useAuth()` hook
- Goal state: Local component state in home page, refreshed on each user action
- UI state: Tab selection, form visibility, edit mode tracking
- No global state manager; parent component (page.tsx) manages orchestration

## Key Abstractions

**useAuth Hook:**
- Purpose: Centralized authentication state management
- Location: `hooks/use-auth.ts`
- Pattern: Custom hook listening to Supabase auth state changes
- Usage: Called in components needing user/profile data
- Initializes on first load, subscribes to auth changes

**Goal Operations:**
- Purpose: Abstract database operations for goals
- Location: `lib/goals.ts`
- Pattern: Pure async functions with error handling
- Functions: createGoal, updateGoal, deleteGoal, getUserGoals, getPublicGoals, updateGoalProgress, getGoalUpdates
- All functions throw on error, caller handles via try/catch

**Supabase Client:**
- Purpose: Single centralized Supabase instance
- Location: `lib/supabase.ts`
- Pattern: Singleton export with environment validation
- Contains: Type definitions for all tables (Database type, Goal, Profile, GoalUpdate)
- Validates required env vars at module load time

**Auth Functions:**
- Purpose: Authentication and profile queries
- Location: `lib/auth.ts`
- Pattern: Async functions wrapping Supabase calls
- Functions: signUp (calls API), signIn, signOut, getCurrentUser, getProfile

## Entry Points

**Home Page:**
- Location: `app/page.tsx`
- Triggers: App load, user navigation
- Responsibilities: Auth gate, orchestrate goal display, manage modals for forms
- Renders three tabs: goals, wall, contact

**Setup Checker:**
- Location: `app/setup/page.tsx`
- Triggers: Admin-initiated setup verification
- Responsibilities: Verify database connection, tables exist, RLS policies work
- Useful for development/deployment validation

**API Signup:**
- Location: `app/api/signup/route.ts`
- Triggers: New user registration POST request
- Responsibilities: Rate limiting (5 requests/minute per IP), CAPTCHA verification, create auth user and profile atomically
- Returns user object or error

## Error Handling

**Strategy:** Try-catch with user-facing toast notifications

**Patterns:**
- All lib functions throw errors; components catch and display via `toast.error()`
- API endpoint returns 400/429 status with error message
- Supabase errors passed up and caught at component level
- CAPTCHA failure returns 400 with descriptive message
- Rate limit returns 429 status code
- Failed profile creation triggers user deletion (rollback)

## Cross-Cutting Concerns

**Logging:**
- Console.error for caught exceptions in hooks and lib
- No dedicated logging infrastructure

**Validation:**
- Client-side HTML5 form validation (required fields)
- Server-side CAPTCHA verification for signup
- Supabase RLS policies enforce authorization at database level
- Progress field constrained to 0-100 with CHECK constraint

**Authentication:**
- Supabase JWT-based auth with automatic refresh
- Service role key used only on backend for admin operations
- Anon key used by frontend for user operations
- RLS policies prevent unauthorized data access

---

*Architecture analysis: 2026-01-21*
