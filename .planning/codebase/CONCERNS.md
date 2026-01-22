# Codebase Concerns

**Analysis Date:** 2026-01-21

## Security Considerations

**Missing Authorization Checks on Goal Operations:**
- Issue: Functions in `lib/goals.ts` like `updateGoal()` and `deleteGoal()` do not verify the user owns the goal before modification. The client-side calls these directly without checking ownership.
- Files: `lib/goals.ts` (lines 33-52), `components/goals/goal-card.tsx` (lines 24-51)
- Current mitigation: Supabase RLS policies on backend enforce authorization. However, this relies entirely on database-level security.
- Risk: If RLS is misconfigured or bypassed, any authenticated user could modify another user's goals. No application-level validation redundancy.
- Recommendations:
  - Add explicit user ownership check before UPDATE/DELETE operations in `lib/goals.ts`
  - Fetch current goal and verify `goal.user_id === currentUser.id` before allowing updates
  - Implement proper error handling for authorization failures

**In-Memory Rate Limiter Not Persistent:**
- Issue: Rate limiting in `app/api/signup/route.ts` (lines 5-7) uses an in-memory Map that is lost on server restart or scaling across multiple instances
- Files: `app/api/signup/route.ts` (lines 4-45)
- Current mitigation: Basic rate limit of 5 requests per minute per IP
- Risk: In production with load balancing, rate limiting is ineffective. Each server instance has its own tracking, allowing an attacker to bypass limits by distributing requests across servers
- Recommendations:
  - Replace in-memory tracking with Redis-backed or database-backed rate limiter
  - Use a service like Upstash Redis for serverless compatibility
  - Consider using Supabase for persistent rate limit tracking

**CAPTCHA Token Validation Missing Error Handling:**
- Issue: In `app/api/signup/route.ts` (lines 72-77), if CAPTCHA verification throws an error, the generic error message doesn't distinguish between network failures and actual verification failures
- Files: `app/api/signup/route.ts` (lines 56-78)
- Risk: User experience degrades during CAPTCHA service outages without proper diagnostics
- Recommendations: Log specific CAPTCHA error details server-side while returning generic messages to client

**Generic Error Type Usage:**
- Issue: Multiple files use `error: any` type casting instead of proper error typing:
  - `app/api/signup/route.ts` (line 112)
  - `components/goals/goal-form.tsx` (line 72)
  - `components/goals/goal-card.tsx` (line 34)
  - `components/auth/auth-form.tsx` (lines 33, 54)
  - `lib/verify-setup.ts` (line 61)
- Files: `lib/goals.ts`, `app/api/signup/route.ts`, `components/goals/goal-form.tsx`, `components/auth/auth-form.tsx`, `lib/verify-setup.ts`
- Risk: Untyped errors can mask unexpected error types and make debugging harder. Error handling logic becomes brittle.
- Recommendations: Create typed error classes, use proper error narrowing, avoid `any` type annotations

## Data Access & Authorization

**Missing Row-Level Ownership Validation in Application Layer:**
- Issue: `lib/goals.ts` functions update/delete goals without checking ownership. The query itself doesn't filter by user_id.
- Files: `lib/goals.ts` (lines 33-42 for updateGoal, lines 45-51 for deleteGoal)
- Current implementation: Relies solely on Supabase RLS to prevent unauthorized access
- Risk: Double-layer security is missing. If RLS policies fail or are temporarily disabled for maintenance, data could be modified cross-tenant
- Recommendations: Add explicit user verification check before database operations

**Profile Visibility Policy Scope Issue:**
- Issue: In `supabase/migrations/20250708120000_add_is_public_to_profiles.sql` (line 9), the policy allows viewing ALL public profiles but the field `is_public` was just added, creating a period where it defaults to false
- Files: `supabase/migrations/20250708120000_add_is_public_to_profiles.sql`, `lib/goals.ts` (line 77)
- Risk: New users cannot be discovered on the Hundee Wall unless they explicitly set `is_public` to true. Migration doesn't set default visibility for existing users.
- Recommendations:
  - Update migration to set `is_public = true` for existing profiles OR
  - Add UI guidance to prompt new users to enable profile visibility
  - Add analytics to track profile visibility adoption rate

## Performance & Scalability

**Unoptimized Public Goals Query:**
- Issue: `getPublicGoals()` in `lib/goals.ts` (lines 65-83) fetches 50 public goals with full profiles and goal_updates data on every page load
- Files: `lib/goals.ts` (lines 65-83), `components/goals/hundee-wall.tsx` (lines 15-28)
- Current approach: Fetches all requested columns without pagination or filtering by date range
- Risk: As user base grows, the Hundee Wall page will slow down. The query has no pagination, so will always fetch 50 records.
- Recommendations:
  - Implement cursor-based pagination in `getPublicGoals()`
  - Add optional date range filtering to show recently completed goals
  - Consider caching with `stale-while-revalidate` strategy
  - Monitor query performance as data grows

**Hundred Grid Rendering Performance:**
- Issue: `components/goals/goal-card.tsx` (lines 116-127) and `components/goals/hundee-wall.tsx` (lines 108-116) render 100 div elements for progress visualization on every goal
- Files: `components/goals/goal-card.tsx` (lines 116-127), `components/goals/hundee-wall.tsx` (lines 108-116)
- Risk: Rendering many goal cards with 100 divs each creates significant DOM nodes. With 50 goals on wall and 10+ on main page, this could impact rendering performance.
- Recommendations:
  - Consider CSS Grid with gradients instead of individual divs for visual progress
  - Use virtualization for large goal lists (not currently an issue but scales poorly)
  - Profile actual rendering performance with DevTools

## Data Consistency & Race Conditions

**Progress Update Not Atomic with Completion:**
- Issue: In `lib/goals.ts` (lines 85-127), `updateGoalProgress()` performs multiple database operations:
  1. Fetch current goal to track progress (line 90-94)
  2. Update goal with new progress (line 100-108)
  3. Insert into goal_updates table (line 113-122)
- Files: `lib/goals.ts` (lines 85-127)
- Risk: Between operations 1 and 2, another user request could modify the goal. The `completed_at` timestamp is set by trigger, not in the same transaction. Race condition possible between progress update and completion marking.
- Recommendations:
  - Consolidate into single SQL transaction if possible
  - Use Supabase functions/procedures instead of multi-step client operations
  - Consider optimistic locking with version fields

**Profile Creation Race Condition in Signup:**
- Issue: In `app/api/signup/route.ts` (lines 81-109), user creation and profile insertion are separate operations. If profile insertion fails, user is created but orphaned.
- Files: `app/api/signup/route.ts` (lines 81-109)
- Current mitigation: User is deleted on profile insertion failure (line 107)
- Risk: There's a window where user exists without a profile, and if the deletion fails, user is orphaned. No idempotency key, so retries could create duplicate users.
- Recommendations:
  - Use database transaction or Supabase transaction if available
  - Add idempotency token to signup request to prevent duplicate user creation on retries
  - Test failure scenarios (network interruption during user creation)

## Testing & Coverage

**No Automated Tests:**
- Issue: Project has zero test files. No `.test.ts`, `.spec.ts`, or vitest/jest configuration found.
- Files: No test files present (entire test suite missing)
- Risk: Regressions go undetected. Critical paths like authentication, goal operations, and authorization changes have no safety net.
- Priority: HIGH - This is the single biggest quality risk
- Recommendations:
  - Add unit tests for `lib/goals.ts`, `lib/auth.ts` (minimum coverage of public functions)
  - Add integration tests for signup flow with CAPTCHA and rate limiting
  - Test authorization boundaries (user cannot modify other users' goals)
  - Add E2E tests for critical user journeys (signup, create goal, complete goal, view wall)

**Missing Error Scenario Testing:**
- Issue: No tests for error conditions like:
  - Supabase connection failures
  - CAPTCHA service failures
  - Rate limiter edge cases
  - Missing database rows
  - RLS policy enforcement
- Files: All API routes and lib functions
- Risk: Error handling code is untested and may fail silently
- Recommendations: Add error boundary tests before production launch

## Fragile Areas

**Supabase Environment Variable Validation:**
- Issue: While `lib/supabase.ts` validates env vars at startup, `app/api/signup/route.ts` and `app/api/password-reset/route.ts` throw errors independently
- Files: `lib/supabase.ts` (lines 3-15), `app/api/signup/route.ts` (lines 9-18), `app/api/password-reset/route.ts` (lines 4-6)
- Risk: Three separate validation points that could get out of sync. Non-uniform error messages. Startup failures might not be caught until API route is hit.
- Recommendations:
  - Centralize environment validation in a single module
  - Run validation on server startup, not on route access
  - Create typed config object to ensure all required vars are present

**Untyped Component Props in HundeeWall:**
- Issue: In `components/goals/hundee-wall.tsx` (line 12), goals state is typed as `any[]` instead of `Goal[]`
- Files: `components/goals/hundee-wall.tsx` (lines 12, 69-121)
- Risk: Type safety is lost. Accessing undefined properties like `goal.profiles.username` (line 82) has no compile-time verification. Current fallback to 'anonymous' hides missing data issues.
- Recommendations: Replace `any[]` with proper `Goal & { profiles: Profile }` type

**Hard-coded EMOJI_OPTIONS and COLOR_OPTIONS:**
- Issue: In `components/goals/goal-form.tsx` (lines 22-26), emoji and color options are hardcoded
- Files: `components/goals/goal-form.tsx` (lines 22-26)
- Risk: Adding new options requires code change and rebuild. Options are duplicated logic (also in form submission defaults).
- Recommendations: Move to constants file or database configuration for runtime customization

**Silent Error in getPublicGoals:**
- Issue: In `lib/goals.ts` (lines 65-83), if the profiles join fails, the entire query fails silently without indicating which goal data is missing
- Files: `lib/goals.ts` (lines 65-83), `components/goals/hundee-wall.tsx` (line 82 fallback)
- Risk: The `goal.profiles?.username` fallback to 'anonymous' masks data integrity issues. If RLS prevents profile access, goals won't display correctly.
- Recommendations: Add explicit error handling and logging for failed profile joins

## Missing Critical Features

**No Password Reset Completion Page:**
- Issue: `app/api/password-reset/route.ts` sends email but there's a `/auth/reset` redirect URL that doesn't appear to exist in codebase
- Files: `app/api/password-reset/route.ts` (line 27)
- Risk: Users cannot actually reset their password. Email links will 404.
- Recommendations: Implement `app/auth/reset/page.tsx` that handles password reset form submission

**No Account Deletion:**
- Issue: No endpoint or UI for users to delete their account
- Files: Not found in codebase
- Risk: Data retention compliance issue. Users cannot remove their data.
- Recommendations: Add `DELETE /api/user` endpoint with confirmation, delete user via Supabase admin API

**No Email Verification Enforcement:**
- Issue: Users can create accounts but `email_confirm: false` is hardcoded in `app/api/signup/route.ts` (line 84)
- Files: `app/api/signup/route.ts` (line 84)
- Risk: Unverified emails can access full functionality. Spam accounts possible.
- Recommendations: Set `email_confirm: true` OR implement middleware to require email verification before accessing certain features

**No Input Validation:**
- Issue: `app/api/signup/route.ts` accepts email, password, username, fullName without validation
- Files: `app/api/signup/route.ts` (line 47)
- Risk:
  - Empty strings accepted for username
  - No email format validation (Supabase may reject invalid format)
  - No password strength requirements
  - No SQL injection risk (parameterized queries) but semantic validation missing
- Recommendations:
  - Use Zod schema validation (zod is already a dependency)
  - Validate email format, password strength, username constraints
  - Add max length limits to prevent abuse

## Dependencies at Risk

**Next.js 13.5.1 is Outdated:**
- Issue: Project uses Next.js 13.5.1, current stable is 14.x and 15.x
- Files: `package.json` (line 58)
- Risk: Missing security patches, performance improvements, and breaking API changes in dependencies
- Recommendations:
  - Plan upgrade to Next.js 14 or 15 after stabilizing current version
  - Test thoroughly as major version upgrades can introduce breaking changes
  - Update TypeScript and React simultaneously

**eslint-config-next Mismatch:**
- Issue: Using eslint 8.49.0 with eslint-config-next 13.5.1
- Files: `package.json` (lines 53, 54)
- Risk: May miss new linting rules in newer ESLint versions
- Recommendations: Keep ESLint and Next.js versions in sync

**React 18.2.0 is Stable but Older:**
- Issue: React 18.2.0 (from early 2023) while 18.3+ available
- Files: `package.json` (line 61)
- Risk: Missing bug fixes and improvements
- Recommendations: Update to latest React 18.x safely (no major changes expected)

## Monitoring & Observability

**No Error Logging Infrastructure:**
- Issue: Only two console.error calls exist in the entire backend. No structured logging.
- Files: `lib/verify-setup.ts` (line 63), `app/api/password-reset/route.ts` (line 39)
- Risk: Production errors are invisible. Cannot diagnose issues for users experiencing problems.
- Recommendations:
  - Implement structured logging (Pino, Winston, or Supabase logs)
  - Log all API errors with context (user ID, request ID, stack trace)
  - Set up error alerting for critical paths (signup, goal operations)

**No Request Tracing:**
- Issue: Multi-step operations like signup have no way to trace the request end-to-end
- Files: `app/api/signup/route.ts`
- Risk: Hard to debug failures. Cannot correlate auth user creation with profile creation.
- Recommendations: Add request ID header, pass through to all database operations

---

*Concerns audit: 2026-01-21*
