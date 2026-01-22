# Testing Patterns

**Analysis Date:** 2026-01-21

## Test Framework

**Current State:**
- No test framework configured or test files present in codebase
- `package.json` contains no test dependencies (Jest, Vitest, etc.)
- No test configuration files (`jest.config.js`, `vitest.config.ts`, etc.) found
- No test runner scripts in `package.json` (only `dev`, `build`, `start`, `lint`)

**Recommendation for Implementation:**
If testing is added, consider:
- **Vitest** for unit tests (modern, fast, ESM-native)
- **Testing Library** for component tests (React best practice)
- **Playwright** or **Cypress** for E2E tests

## Test File Organization

**Current Organization:**
- No test directory structure exists
- No `.test.ts`, `.spec.ts`, `.test.tsx`, or `.spec.tsx` files found anywhere in codebase

**Recommended Pattern (if tests are added):**
- **Co-located tests:** Place `.test.tsx` files alongside component files
  - Example structure:
    ```
    components/auth/
    ├── auth-form.tsx
    ├── auth-form.test.tsx
    ├── password-reset.tsx
    └── password-reset.test.tsx
    ```
- **Separate test directory for API routes:**
  ```
  __tests__/api/
  ├── signup.test.ts
  └── password-reset.test.ts
  ```
- **Utilities tests in lib:**
  ```
  lib/
  ├── auth.ts
  ├── auth.test.ts
  ├── goals.ts
  └── goals.test.ts
  ```

## Testing Gaps Analysis

### Critical Components Without Tests

**Authentication Flow:**
- `lib/auth.ts`: `signUp()`, `signIn()`, `signOut()`, `getCurrentUser()`, `getProfile()`
- `app/api/signup/route.ts`: POST endpoint with rate limiting, CAPTCHA verification, transaction logic
- `app/api/password-reset/route.ts`: Password reset logic
- `components/auth/auth-form.tsx`: Form submission, state management, error handling
- **Risk Level:** High - authentication is critical path

**Goal Management:**
- `lib/goals.ts`: CRUD operations (`createGoal()`, `updateGoal()`, `deleteGoal()`, `updateGoalProgress()`)
- `components/goals/goal-form.tsx`: Form validation, submission, edit/create logic
- `components/goals/goal-card.tsx`: Render and interaction logic
- **Risk Level:** High - core feature of application

**API Routes:**
- Rate limiting logic in `signup/route.ts`: Manual in-memory rate limiter
- CAPTCHA verification: hCaptcha integration
- Database transaction handling: Atomic user/profile creation
- **Risk Level:** High - production availability

**Hooks:**
- `hooks/use-auth.ts`: Auth state management, session subscription, error handling
- **Risk Level:** Medium-High - used throughout app

### Components/Areas Without Test Coverage

**Components with Business Logic:**
- `components/layout/header.tsx`: Sign out functionality, error handling
- `components/goals/hundee-wall.tsx`: Public goals display, API integration
- `components/goals/share-card.tsx`: Goal sharing functionality
- `components/contact/contact-form.tsx`: Form submission
- **Risk Level:** Medium - UI but with integration logic

**Utilities:**
- `lib/utils.ts`: `cn()` function (class merging utility)
- `lib/supabase.ts`: Client initialization, type definitions
- `lib/verify-setup.ts`: Setup verification logic
- **Risk Level:** Low-Medium - utilities mostly deterministic

## Recommended Test Structure

If tests are added, follow this pattern observed in similar Next.js projects:

```typescript
// Example structure for lib/auth.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as authModule from './auth';
import { supabase } from './supabase';

vi.mock('./supabase');

describe('auth', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('signIn', () => {
    it('should sign in user with valid credentials', async () => {
      // test implementation
    });

    it('should throw error on invalid credentials', async () => {
      // test implementation
    });
  });

  describe('getCurrentUser', () => {
    it('should return current user', async () => {
      // test implementation
    });
  });
});
```

## Mocking Strategy

**For API Tests:**
- Mock `supabase` client methods using Vitest `vi.mock()`
- Mock `fetch()` for external API calls (CAPTCHA verification)
- Mock environment variables for testing different configurations

**For Component Tests:**
- Mock `supabase` using Testing Library's `useAuth` hook
- Mock `react-hot-toast` for toast notifications
- Mock `next/router` or navigation if implementing client-side routing

**Example Mocking Pattern:**
```typescript
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
      getUser: vi.fn(),
    },
    from: vi.fn(),
  },
}));
```

## Test Types

### Unit Tests (Recommended Priority: High)

**Scope:**
- Individual functions in isolation
- Business logic without dependencies
- Type correctness

**Examples to test:**
- `lib/auth.ts` functions: mock Supabase responses
- `lib/goals.ts` CRUD operations: mock database layer
- `lib/utils.ts`: `cn()` function - simple deterministic tests

**Approach:**
```typescript
// Test cn() utility
describe('cn', () => {
  it('should merge Tailwind classes', () => {
    const result = cn('px-2', 'px-4'); // px-4 should win
    expect(result).toContain('px-4');
  });
});
```

### Integration Tests (Recommended Priority: Medium)

**Scope:**
- Multiple components working together
- API route with database interaction
- Full flow from component to backend

**Examples to test:**
- Sign up flow: component → API route → database
- Goal creation: form → API → database query
- Auth state management: `useAuth` hook → Supabase session

**Approach:**
```typescript
// Integration test for signup
describe('signup flow', () => {
  it('should create user and profile atomically', async () => {
    const response = await POST(mockRequest);
    expect(response.status).toBe(200);
    // Verify both user and profile created
  });
});
```

### E2E Tests (Recommended Priority: Low-Medium)

**Scope:**
- Full user workflows in browser
- UI interactions with real backend
- Cross-feature scenarios

**Examples to test:**
- User registration → sign in → create goal → view on wall
- Goal completion and progress tracking
- Profile editing and visibility

**Tool:** Playwright or Cypress (not currently configured)

## Coverage Targets

**Recommended Minimums:**
- Critical paths (auth, goals CRUD): 80%+ coverage
- API routes: 70%+ coverage
- Components: 50%+ coverage for business logic components
- Utilities: 90%+ coverage

**Current Coverage:** 0% (no tests exist)

**Priority for Implementation:**
1. Auth flow (`lib/auth.ts`, `app/api/signup/route.ts`)
2. Goal management (`lib/goals.ts`)
3. API route error handling and rate limiting
4. Hook logic (`use-auth.ts`)
5. Critical components (`goal-form.tsx`, `auth-form.tsx`)

## Missing Test Infrastructure

**Not Present:**
- No test configuration
- No test utilities or helpers
- No fixtures or mock factories
- No test data generators
- No shared test setup

**Needed for Testing:**
```typescript
// Example: Mock factory for goals
function createMockGoal(overrides = {}): Goal {
  return {
    id: 'test-id',
    user_id: 'user-123',
    title: 'Test Goal',
    description: '',
    progress: 0,
    emoji: '🎯',
    color: '#8B5CF6',
    is_completed: false,
    completed_at: null,
    is_public: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    ...overrides,
  };
}
```

## Async Testing

**Pattern for Async Code:**
- Use `async/await` in tests
- Wrap promises with proper error handling
- Example: `const result = await signUp(email, password, username);`

## Error Testing

**Pattern Observed in Code (should be tested):**
- Supabase errors: `if (error) throw error;`
- Network errors: try-catch blocks
- Validation errors: argument validation before operations

**Test Pattern:**
```typescript
it('should throw error on failed database operation', async () => {
  vi.mocked(supabase.from).mockReturnValue({
    insert: vi.fn().mockResolvedValue({ error: new Error('DB Error') }),
  });

  await expect(createGoal(data)).rejects.toThrow('DB Error');
});
```

## Test Run Commands

**To be implemented when testing is added:**
```bash
npm run test              # Run all tests
npm run test:watch       # Watch mode for development
npm run test:coverage    # Generate coverage report
npm run test:unit        # Run unit tests only
npm run test:integration # Run integration tests only
npm run test:e2e         # Run E2E tests (Playwright)
```

**Scripts to add to `package.json`:**
```json
{
  "test": "vitest",
  "test:watch": "vitest --watch",
  "test:coverage": "vitest --coverage",
  "test:e2e": "playwright test"
}
```

---

*Testing analysis: 2026-01-21*

**Note:** This codebase currently has zero test coverage. Testing infrastructure should be implemented as part of quality assurance improvements. Priority should be given to authentication and goal management features as they are critical paths in the application.
