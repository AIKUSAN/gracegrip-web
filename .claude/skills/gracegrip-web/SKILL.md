```markdown
# gracegrip-web Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill documents the core development patterns and conventions used in the `gracegrip-web` TypeScript codebase. It covers file organization, code style, commit conventions, and testing patterns, providing clear examples and suggested commands for common workflows. This guide is intended to help contributors maintain consistency and quality across the project.

## Coding Conventions

### File Naming
- **Style:** kebab-case
- **Example:**  
  ```
  user-profile.ts
  login-form.ts
  ```

### Import Style
- **Style:** Relative imports
- **Example:**
  ```typescript
  import { UserProfile } from './user-profile';
  import { validateInput } from '../utils/validation';
  ```

### Export Style
- **Style:** Named exports
- **Example:**
  ```typescript
  // user-profile.ts
  export function UserProfile() { ... }
  export const USER_ROLE = 'admin';
  ```

### Commit Messages
- **Style:** Conventional commits
- **Prefix:** `feat`
- **Average Length:** ~48 characters
- **Example:**
  ```
  feat: add user authentication to login form
  ```

## Workflows

### Feature Development
**Trigger:** When implementing a new feature  
**Command:** `/feature-development`

1. Create a new branch for your feature.
2. Use kebab-case for new file names.
3. Write code using relative imports and named exports.
4. Commit changes using the `feat:` prefix and a concise description.
5. Open a pull request for review.

### Testing
**Trigger:** When writing or updating tests  
**Command:** `/run-tests`

1. Create or update test files using the `*.test.*` pattern (e.g., `login-form.test.ts`).
2. Ensure tests cover new or changed functionality.
3. Run the test suite (framework unknown; refer to project scripts).
4. Address any failing tests before merging.

## Testing Patterns

- **Test File Naming:**  
  Test files follow the pattern `*.test.*`, such as `user-profile.test.ts`.
- **Framework:**  
  Not explicitly detected; check project documentation or scripts for details.
- **Example:**
  ```typescript
  // login-form.test.ts
  import { validateInput } from './login-form';

  describe('validateInput', () => {
    it('should return true for valid input', () => {
      expect(validateInput('test@example.com')).toBe(true);
    });
  });
  ```

## Commands
| Command               | Purpose                                      |
|-----------------------|----------------------------------------------|
| /feature-development  | Start a new feature using project conventions|
| /run-tests            | Run the test suite for the project           |
```