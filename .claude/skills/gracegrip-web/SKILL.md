```markdown
# gracegrip-web Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill covers the core development patterns and conventions used in the `gracegrip-web` repository, a Next.js project written in JavaScript. It documents file naming, import/export styles, commit message conventions, and testing patterns. Use this guide to ensure code consistency and streamline collaboration.

## Coding Conventions

### File Naming
- Use **PascalCase** for all file names, including components and pages.
  - Example: `UserProfile.js`, `DashboardPage.js`

### Import Style
- Use **absolute imports** for all modules.
  - Example:
    ```js
    import Header from 'components/Header';
    import { fetchData } from 'utils/api';
    ```

### Export Style
- Use **default exports** for modules.
  - Example:
    ```js
    // components/Header.js
    function Header() { ... }
    export default Header;
    ```

### Commit Message Conventions
- Follow **conventional commit** patterns.
- Use prefixes like `fix` or `chore`.
- Keep commit messages concise (average 39 characters).
  - Example:
    ```
    fix: resolve login redirect issue
    chore: update dependencies
    ```

## Workflows

### Code Commit Workflow
**Trigger:** When making any code changes  
**Command:** `/commit`

1. Stage your changes:
    ```
    git add .
    ```
2. Write a commit message using the conventional commit format:
    ```
    git commit -m "fix: correct typo in Navbar"
    ```
3. Push your changes:
    ```
    git push
    ```

### File Creation Workflow
**Trigger:** When creating new components, pages, or utilities  
**Command:** `/create-file`

1. Name the file using PascalCase (e.g., `NewComponent.js`).
2. Place the file in the appropriate directory (`components/`, `pages/`, etc.).
3. Use absolute imports within the file.
4. Export the main entity as default.

### Testing Workflow
**Trigger:** When adding or updating features  
**Command:** `/test`

1. Create a test file alongside the module, using the pattern: `*.test.*`
    - Example: `UserProfile.test.js`
2. Write tests using the project's preferred testing framework (framework unknown; check project dependencies).
3. Run tests to ensure correctness.

## Testing Patterns

- Test files follow the `*.test.*` naming convention.
  - Example: `LoginForm.test.js`
- Place test files near the modules they test.
- The specific testing framework is not detected; check `package.json` for details.
- Example test file structure:
    ```js
    // components/Header.test.js
    describe('Header', () => {
      it('renders correctly', () => {
        // test implementation
      });
    });
    ```

## Commands
| Command      | Purpose                                      |
|--------------|----------------------------------------------|
| /commit      | Commit code changes using conventional commits|
| /create-file | Create a new file with proper conventions     |
| /test        | Run or add tests following the test pattern   |
```
