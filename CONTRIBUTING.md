# Contributing to VisionForge AI

Thank you for your interest in contributing to VisionForge AI! This document provides guidelines and instructions for contributing.

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on the code, not the person
- Help others learn and grow

## Getting Started

### 1. Fork and Clone

```bash
git clone https://github.com/YOUR_USERNAME/visionforge-ai.git
cd visionforge-ai
git remote add upstream https://github.com/Yaka1971/visionforge-ai.git
```

### 2. Create a Feature Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Install Dependencies

```bash
pnpm install
```

### 4. Set Up Environment

```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

### 5. Start Development Server

```bash
pnpm dev
```

## Development Workflow

### Before Writing Code

1. Check existing issues and PRs
2. Create an issue to discuss your feature
3. Wait for feedback from maintainers
4. Get approval before starting work

### Writing Code

- Follow the existing code style
- Use TypeScript for all new code
- Add proper type annotations
- Write descriptive variable/function names
- Keep functions small and focused

### Testing

```bash
# Run all tests
pnpm test

# Run specific test
pnpm test generation.test.ts

# Watch mode
pnpm test --watch
```

**Important**: All new features must include tests. PRs without tests will not be merged.

### Code Style

- Use 2-space indentation
- Use semicolons
- Use single quotes for strings
- Use arrow functions
- Use `const` by default, `let` when needed

### Commit Messages

Use clear, descriptive commit messages:

```
feat: Add image-to-video generation
fix: Resolve API key encryption bug
docs: Update README with setup instructions
test: Add tests for settings router
refactor: Simplify video generation logic
```

## Pull Request Process

### 1. Update Your Branch

```bash
git fetch upstream
git rebase upstream/main
```

### 2. Push Your Changes

```bash
git push origin feature/your-feature-name
```

### 3. Create Pull Request

- Go to GitHub and create a PR
- Use a clear title and description
- Reference related issues: "Closes #123"
- Include screenshots for UI changes

### 4. PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How to test these changes:
1. ...
2. ...

## Checklist
- [ ] Tests added/updated
- [ ] Documentation updated
- [ ] No breaking changes
- [ ] Code follows style guide
```

### 5. Review Process

- Maintainers will review your code
- Address feedback and push updates
- Once approved, your PR will be merged

## Areas for Contribution

### High Priority
- [ ] Real Kling AI integration
- [ ] Real Runway ML integration
- [ ] Performance optimization
- [ ] Bug fixes

### Medium Priority
- [ ] UI/UX improvements
- [ ] Documentation
- [ ] Tests
- [ ] Accessibility

### Low Priority
- [ ] Code refactoring
- [ ] Minor optimizations

## Setting Up for Different Contributions

### Frontend Changes

```bash
# Make changes in client/src/
# Test in browser at http://localhost:3000
# Run tests: pnpm test
```

### Backend Changes

```bash
# Make changes in server/
# tRPC procedures in server/routers/
# Services in server/services/
# Database queries in server/db.ts
# Run tests: pnpm test
```

### Database Schema Changes

```bash
# 1. Update drizzle/schema.ts
# 2. Generate migration: pnpm drizzle-kit generate
# 3. Review generated SQL
# 4. Apply migration: pnpm drizzle-kit migrate
# 5. Update db.ts with new queries
```

## Common Issues

### Tests Failing

```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
pnpm test
```

### Database Connection Issues

- Check DATABASE_URL in .env.local
- Verify MySQL is running
- Check credentials

### Build Errors

```bash
# Clear build cache
rm -rf dist .next
pnpm build
```

## Documentation

- Update README.md for user-facing changes
- Add JSDoc comments for complex functions
- Update TECHNICAL_SPECS.md for architecture changes
- Include examples for new features

## Performance Guidelines

- Avoid unnecessary re-renders (use useMemo, useCallback)
- Optimize database queries (use indexes)
- Lazy load components when possible
- Monitor bundle size

## Security Guidelines

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Validate all user inputs
- Use parameterized queries
- Keep dependencies updated

## Release Process

Maintainers only:

```bash
# Update version in package.json
# Create release notes
# Tag release: git tag v1.0.0
# Push tags: git push --tags
```

## Getting Help

- Check existing documentation
- Search closed issues
- Ask in GitHub Discussions
- Open an issue with detailed information

## Recognition

Contributors will be recognized in:
- CONTRIBUTORS.md file
- Release notes
- GitHub contributors page

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to VisionForge AI! 🚀**
