```markdown
# gracegrip-web Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `gracegrip-web` repository, a JavaScript web application built with the Next.js framework. You'll learn how to structure files, write and organize code, follow commit conventions, and understand the project's approach to testing.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.js`, `mainHeader.jsx`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```js
    import { getUser } from './userService';
    import Header from '../components/mainHeader';
    ```

### Export Style
- Use **named exports** for all modules.
  - Example:
    ```js
    // userService.js
    export function getUser(id) { ... }
    export function updateUser(data) { ... }
    ```

### Commit Messages
- Follow **conventional commit** patterns.
- Use the `chore` prefix for routine tasks.
  - Example:  
    ```
    chore: update dependencies for security patches
    ```
- Keep commit messages concise (average 61 characters).

## Workflows

_No automated workflows detected in this repository._

## Testing Patterns

- **Test File Naming:**  
  Test files follow the `*.test.*` pattern.
  - Example: `userService.test.js`, `mainHeader.test.jsx`

- **Testing Framework:**  
  The specific testing framework is unknown, but tests are colocated with source files using the above pattern.

- **Example Test File Structure:**
  ```js
  // userService.test.js
  import { getUser } from './userService';

  test('should fetch user by id', () => {
    const user = getUser(1);
    expect(user.id).toBe(1);
  });
  ```

## Commands

| Command    | Purpose                                  |
|------------|------------------------------------------|
| /commit    | Create a conventional commit             |
| /test      | Run all test files matching *.test.*     |
| /lint      | Lint the codebase according to standards |
```
