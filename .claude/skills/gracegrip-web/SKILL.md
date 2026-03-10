# gracegrip-web Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches development patterns for gracegrip-web, a Next.js application following conventional commit standards and modern React patterns. The codebase emphasizes security, proper documentation, and clean architecture with systematic workflows for dependency management, security hardening, and platform deployment.

## Coding Conventions

### File Naming
- Use **camelCase** for all files
- React components: `componentName.jsx`
- Utilities: `utilityName.js`
- Tests: `fileName.test.js`

### Import/Export Style
```javascript
// Use relative imports
import { Component } from './components/componentName'
import utils from '../utils/utilityName'

// Use named exports
export const ComponentName = () => {
  // component logic
}

export { ComponentName as default }
```

### Commit Messages
- Follow conventional commit format
- Average length: ~62 characters
- Use prefixes: `chore`, `docs`, `fix`, `feat`, `security`, `release`, `revert`, `ci`

Examples:
```
feat: add user authentication component
fix: resolve navigation menu overflow issue
chore: update dependencies to latest versions
security: add CSP headers and sanitize inputs
```

## Workflows

### Dependency Updates
**Trigger:** When dependencies need security updates or new features  
**Command:** `/update-deps`

1. Review outdated packages with `npm outdated`
2. Update `package.json` with new version numbers
3. Run `npm install` to regenerate `package-lock.json`
4. Test application for breaking changes
5. Commit with `chore: update dependencies` message
6. Create pull request or merge directly

**Files involved:** `package.json`, `package-lock.json`

### Documentation Mass Updates
**Trigger:** Preparing for releases or platform migrations  
**Command:** `/update-docs`

1. Identify all documentation files needing updates
2. Update version numbers and dates consistently
3. Update platform references (URLs, deployment info)
4. Review for accuracy and completeness
5. Commit all changes together with `docs: update documentation for [reason]`

**Files involved:** `README.md`, `ROADMAP.md`, `TASKS.md`, `PROJECT_MANIFEST.md`, `HANDOVER_DEVOPS.md`

### Security Configuration
**Trigger:** Hardening security posture or preparing for public release  
**Command:** `/harden-security`

1. Add security configuration files
2. Update `.gitignore` to exclude sensitive files:
   ```
   .env.local
   .env.production.local
   *.key
   *.pem
   ```
3. Add security headers via `vercel.json`:
   ```json
   {
     "headers": [
       {
         "source": "/(.*)",
         "headers": [
           {
             "key": "Content-Security-Policy",
             "value": "default-src 'self'"
           }
         ]
       }
     ]
   }
   ```
4. Update `app/layout.jsx` with security meta tags
5. Commit with `security: [description]` message

### Copyright Header Injection
**Trigger:** Preparing for public release or ensuring license compliance  
**Command:** `/add-copyright`

1. Identify source files needing headers
2. Add MIT copyright headers to all source files:
   ```javascript
   /*
   * MIT License
   * Copyright (c) [YEAR] [PROJECT_NAME]
   * 
   * Permission is hereby granted, free of charge, to any person obtaining a copy...
   */
   ```
3. Convert existing `//` style headers to `/* */` format
4. Apply to all `.jsx`, `.js` files in components, utils, app directories
5. Commit with `chore: add MIT copyright headers`

**Files involved:** `src/components/**/*.jsx`, `src/utils/*.js`, `app/**/*.jsx`, `src/context/*.jsx`

### Deployment Platform Migration
**Trigger:** Switching hosting platforms (GitHub Pages ↔ Vercel)  
**Command:** `/migrate-platform`

1. Update CI/CD workflow files:
   ```yaml
   # .github/workflows/deploy.yml
   name: Deploy
   on:
     push:
       branches: [main]
   jobs:
     deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - name: Setup Node
           uses: actions/setup-node@v3
         - run: npm ci && npm run build
   ```
2. Modify `next.config.mjs` for platform-specific settings
3. Add/remove platform files (`.nojekyll` for GitHub Pages, `vercel.json` for Vercel)
4. Update all documentation references to new deployment URLs
5. Test deployment on new platform
6. Commit with `ci: migrate deployment to [platform]`

## Testing Patterns

### Test Structure
- Test files follow pattern: `*.test.*`
- Framework: Not specified (likely Jest/React Testing Library)
- Recommended structure:
```javascript
// componentName.test.jsx
import { render, screen } from '@testing-library/react'
import ComponentName from './componentName'

describe('ComponentName', () => {
  it('should render correctly', () => {
    render(<ComponentName />)
    expect(screen.getByRole('button')).toBeInTheDocument()
  })
})
```

## Commands

| Command | Purpose |
|---------|---------|
| `/update-deps` | Update npm dependencies and regenerate lock file |
| `/update-docs` | Mass update documentation files for releases |
| `/harden-security` | Add security configurations and headers |
| `/add-copyright` | Inject MIT copyright headers into source files |
| `/migrate-platform` | Switch deployment platforms and update configs |