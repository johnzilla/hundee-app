# Coding Conventions

**Analysis Date:** 2026-01-21

## Naming Patterns

**Files:**
- Components: PascalCase with `.tsx` extension. Example: `AuthForm.tsx`, `GoalCard.tsx`
- Utilities/Libraries: camelCase with `.ts` extension. Example: `auth.ts`, `goals.ts`, `utils.ts`
- Hooks: kebab-case with `.ts` extension, exported as camelCase. Example: `use-auth.ts` exports `useAuth()`
- UI Components: kebab-case. Example: `button.tsx`, `form.tsx`, `input.tsx`
- API Routes: kebab-case in directory structure. Example: `app/api/signup/route.ts`, `app/api/password-reset/route.ts`

**Functions:**
- camelCase for all functions. Example: `signIn()`, `createGoal()`, `updateGoalProgress()`
- Async functions use standard naming without `async` prefix. Example: `async function fetchGoals()`
- Event handlers start with `handle`. Example: `handleSignIn()`, `handleEditGoal()`, `handleCreateGoal()`
- React hooks start with `use`. Example: `useAuth()`, `useFormField()`

**Variables:**
- camelCase for all variables. Example: `signInData`, `editingGoal`, `showGoalForm`
- Boolean variables may use prefix patterns but typically just camelCase. Example: `loading`, `authLoading`, `showShareCard`
- State variables use plain camelCase. Example: `user`, `profile`, `goals`

**Types:**
- PascalCase for all type names. Example: `Goal`, `Profile`, `GoalUpdate`, `ButtonProps`, `GoalFormProps`
- Interface names follow PascalCase. Example: `ButtonProps`, `GoalFormProps`
- Type suffix patterns: `Props` for component props, `Value` for context values. Example: `FormFieldContextValue`, `FormItemContextValue`

## Code Style

**Formatting:**
- Tool: Built-in Next.js ESLint configuration
- Line length: Follows ESLint defaults (typically around 80-100 characters, but not strictly enforced based on code samples)
- Indentation: 2 spaces
- Quotes: Single quotes for imports and strings (see import statements throughout codebase)

**Linting:**
- Tool: ESLint
- Configuration: `.eslintrc.json` extends `next/core-web-vitals`
- Key rules: Follows Next.js core web vitals recommendations
- Notable: `// eslint-disable-next-line import/no-unresolved` used sparingly for external libraries (see `react-hcaptcha` in `auth-form.tsx`)

## Import Organization

**Order:**
1. React and framework imports: `import { useEffect, useState } from 'react'`
2. Third-party packages: `import { Button } from '@/components/ui/button'`
3. Internal modules from lib/utils: `import { signIn, signUp } from '@/lib/auth'`
4. Components: `import { AuthForm } from '@/components/auth/auth-form'`
5. Types: `import type { Goal } from '@/lib/supabase'`
6. Icons (lucide-react): `import { Plus, Target } from 'lucide-react'`

**Path Aliases:**
- `@/*` maps to root directory: `./` (defined in `tsconfig.json`)
- All imports use absolute path aliases via `@/` prefix
- Examples: `@/components/ui/button`, `@/lib/auth`, `@/hooks/use-auth`, `@/lib/supabase`

**Client/Server Directive:**
- `'use client'` directive placed at top of client components
- Used in components that require browser APIs or React hooks
- Examples: `auth-form.tsx`, `page.tsx`, `use-auth.ts`
- Server-only code in `app/api/` route handlers

## Error Handling

**Patterns:**
- **Try-catch with Error Objects:** Errors are caught and accessed via `.message` property
  ```typescript
  catch (error: any) {
    toast.error(error.message || 'Sign in failed');
  }
  ```
- **Supabase Error Pattern:** Errors checked as `{ data, error }` destructuring
  ```typescript
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
  ```
- **API Route Error Responses:** Return `NextResponse.json()` with `error` field and status code
  ```typescript
  return NextResponse.json({ error: 'Too many signup attempts' }, { status: 429 });
  ```
- **Throw Early:** Validation checks throw errors immediately. Example in `app/api/signup/route.ts`:
  ```typescript
  if (!supabaseUrl) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
  }
  ```
- **Toast Notifications:** User-facing errors displayed via `react-hot-toast`
  ```typescript
  try { /* operation */ }
  catch (error: any) {
    toast.error(error.message || 'Fallback message');
  }
  ```

## Logging

**Framework:** `console` (standard JavaScript console)

**Patterns:**
- `console.error()` for error logging. Example: `console.error('Error fetching profile:', error)`
- Minimal logging observed in production code (clean approach)
- Error logging typically used in catch blocks

## Comments

**When to Comment:**
- Comments are sparse in the codebase, indicating self-documenting code is preferred
- When present, comments explain "why" not "what"
- Example from `goals.ts`: `// Get current goal to track previous progress`
- No JSDoc comments found in core business logic files

**JSDoc/TSDoc:**
- Not extensively used in analyzed files
- Type definitions in TypeScript provide most documentation
- UI components have minimal JSDoc due to clear prop interfaces

## Function Design

**Size:** Functions are kept concise and focused
- Range: Typically 20-40 lines for business logic functions
- Longer functions are ~50 lines (e.g., `updateGoalProgress` at 42 lines of logic)
- React components are organized with clear sections

**Parameters:**
- Async functions accept multiple parameters directly: `async function signUp(email, password, username, fullName?, captchaToken?)`
- Optional parameters use `?` syntax
- Objects used for related parameters in component functions: `goal: { title, description?, emoji?, color?, is_public? }`
- React events receive `React.FormEvent` or similar typed events

**Return Values:**
- Direct return of data: `return data`
- Async functions return awaited results: `return data` after database operation
- Void functions used for state updates and side effects
- Nullable returns indicated in types: `Profile | null`

## Module Design

**Exports:**
- Named exports preferred for functions: `export async function signIn()`
- Default export for components: `export default function Home()`
- Mix of named and default: Component files often export component as default, UI utility types as named
- Example: `export { Button, buttonVariants }` for UI components

**Barrel Files:**
- Component lib exports: `export { Button, buttonVariants }` aggregates variants with component
- No barrel index files observed in directories (each file is imported directly)
- Imports are specific: `import { Button } from '@/components/ui/button'` (not from directory)

## Type Definitions

**Location:**
- Supabase types defined inline in `lib/supabase.ts`: `type Goal = Database['public']['Tables']['goals']['Row']`
- Component prop types defined as interfaces above component: `interface GoalFormProps { isOpen: boolean; ... }`
- Reusable types exported from type definition files

**Patterns:**
- Database types derived from Supabase schema
- Component props use `Props` suffix convention
- Generic type parameters used for form handling: `<TFieldValues extends FieldValues = FieldValues>`

## State Management

**Pattern:** React hooks with local state
- `useState()` for local component state
- `useCallback()` for memoized callbacks: `const fetchGoals = useCallback(async () => { ... }, [user])`
- `useEffect()` for side effects with dependency arrays
- Context API for auth state: `useAuth()` hook manages user and profile globally

**Form State:**
- Inline state objects for form data: `const [signUpData, setSignUpData] = useState({ email: '', password: '', ... })`
- Update pattern: `setFormData(prev => ({ ...prev, fieldName: value }))`

---

*Convention analysis: 2026-01-21*
