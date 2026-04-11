```markdown
# gracegrip-web Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development conventions and patterns used in the `gracegrip-web` repository, a JavaScript web application built with Next.js. You'll learn how to structure files, write and organize code, follow commit message conventions, and understand the project's testing approach.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.js`, `loginForm.jsx`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```js
    import Button from './button';
    import { fetchUser } from '../utils/api';
    ```

### Export Style
- **Mixed exports** are used (both default and named).
  - Example:
    ```js
    // Default export
    export default function LoginForm() { ... }

    // Named export
    export function validateEmail(email) { ... }
    ```

### Commit Message Convention
- Use **Conventional Commits** with the `feat` prefix for features.
- Average commit message length: ~68 characters.
  - Example:
    ```
    feat: add user authentication flow with JWT support
    ```

## Workflows

### Feature Development
**Trigger:** When adding a new feature to the application  
**Command:** `/feature-development`

1. Create a new branch for your feature.
2. Implement the feature using camelCase file naming and relative imports.
3. Write or update tests in files matching `*.test.*`.
4. Commit changes using the `feat` prefix and a descriptive message.
5. Open a pull request for review.

### Code Testing
**Trigger:** When verifying code correctness  
**Command:** `/run-tests`

1. Identify or create test files using the `*.test.*` pattern.
2. Run the project's test suite (framework unknown; refer to project scripts).
3. Review test results and fix any failing tests.

### Code Exporting
**Trigger:** When creating new modules or components  
**Command:** `/export-module`

1. Decide if the export should be default or named.
2. Use the appropriate export syntax:
    - Default: `export default MyComponent;`
    - Named: `export { myFunction };`
3. Import modules using relative paths in other files.

## Testing Patterns

- Test files follow the `*.test.*` naming convention (e.g., `loginForm.test.js`).
- The specific testing framework is not detected; check project dependencies or scripts for details.
- Place test files alongside the code they test or in a dedicated test directory.

## Commands
| Command              | Purpose                                      |
|----------------------|----------------------------------------------|
| /feature-development | Start a new feature workflow                 |
| /run-tests           | Run the project's test suite                 |
| /export-module       | Guide for exporting modules/components       |
```
