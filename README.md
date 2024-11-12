# RestroHQ API
An all-in-one SaaS solution for restaurants including POS, menu management, order management, reservations, customer management, and reviews.

## 📑 Table of Contents
- [🚀 Tech Stack](#-tech-stack)
  - [Core Technologies](#core-technologies)
  - [Authentication & Validation](#authentication--validation)
- [📚 Resources](#-helpful-articles--resources)
  - [Architecture & Best Practices](#architecture--best-practices)
  - [Database & Prisma](#database--prisma)
  - [Authentication & Security](#authentication--security)
- [🏗️ Project Structure](#️-project-structure)
- [📦 Package Management](#-package-management)
- [🚦 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Setup Steps](#setup-steps)
  - [Troubleshooting Common Issues](#troubleshooting-common-issues)
- [📝 Environment Variables](#-environment-variables)
- [🤝 Contributing](#-contributing)
- [📝 Commit Message Convention](#-commit-message-convention)
- [🐳 Docker Support](#-docker-support)


## 🚀 Tech Stack

### Core Technologies
- **Node.js** - [Official Documentation](https://nodejs.org/en/docs/)
- **Express.js** - [Official Documentation](https://expressjs.com/)
- **PostgreSQL** - [Official Documentation](https://www.postgresql.org/docs/)
- **Prisma ORM** - [Official Documentation](https://www.prisma.io/docs/)

### Authentication & Validation
- **JSON Web Tokens (JWT)** - [Official Documentation](https://jwt.io/introduction)
- **Zod Schema Validation** - [Official Documentation](https://zod.dev/)

## 📚 Helpful Articles & Resources

### Architecture & Best Practices
- [REST API Best Practices](https://www.freecodecamp.org/news/rest-api-best-practices-rest-endpoint-design-examples/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Clean Architecture with Node.js](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
- [API Security Best Practices](https://roadmap.sh/best-practices/api-security)
- [Modern JavaScript Features](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules)

### Database & Prisma
- [Prisma Schema Design Guide](https://www.prisma.io/docs/concepts/components/prisma-schema)
- [Database Connection Management](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management)
- [Prisma Relationship Guide](https://www.prisma.io/docs/concepts/components/prisma-schema/relations)
- [PostgreSQL Performance Tuning](https://wiki.postgresql.org/wiki/Performance_Optimization)

### Authentication & Security
- [JWT Authentication Best Practices](https://auth0.com/blog/a-complete-guide-to-jwt-authentication/)
- [Node.js Security Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Nodejs_Security_Cheat_Sheet.html)
- [OAuth 2.0 Implementation Guide](https://oauth.net/getting-started/)

## 🏗️ Project Structure
```
├── prisma/
│   ├── migrations/
│   ├── schema.prisma
│   └── migration_lock.toml
├── src/
│   ├── api/
│   │   └── v1/
│   │       ├── controllers/
│   │       ├── middlewares/
│   │       ├── routes/
│   │       ├── schemas/
│   │       └── services/
│   ├── utils/
│   │   ├── config.js
│   │   ├── prisma.js
│   │   └── seed.js
│   └── index.js
├── .babelrc
├── .env
├── .eslintrc
├── .prettierrc
└── package.json
```

## 📦 Package Management

## 📝 Package Management Guidelines

### Adding Dependencies
```bash
# Add production dependency
pnpm add [package-name]

# Add development dependency
pnpm add -D [package-name]

# Add global dependency
pnpm add -g [package-name]
```

### Updating Dependencies
```bash
# Check for updates
pnpm update --interactive

# Update all dependencies
pnpm update

# Update specific package
pnpm update [package-name]
```

### Managing pnpm
```bash
# View pnpm version
pnpm -v

# Upgrade pnpm itself
pnpm add -g pnpm

# Clean dependencies
pnpm store prune
```

### Why pnpm over npm/yarn?
1. **Disk Space Efficiency**: pnpm creates a single content-addressable storage for all packages, significantly reducing disk space usage.
2. **Security**: Prevents phantom dependencies by using strict package resolution.
3. **Performance**: Faster installation times compared to npm and yarn.
4. **Monorepo Support**: Built-in support for monorepos without additional tools.

## 🤝 Contributing
1. Create a feature branch from `main`
2. Commit your changes following [Commit Message Convention](#-commit-message-convention)
3. Push your branch and create a Pull Request
4. Ensure CI passes and get code review

## 📝 Commit Message Convention

This website follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)

Commit message will be checked using [husky and commit lint](https://theodorusclarence.com/library/husky-commitlint-prettier), you can't commit if not using the proper convention below.

### Format
`<type>(optional scope): <description>`
Example: `feat(pre-event): add speakers section`

### 1. Type
Available types are:
- feat → Changes about addition or removal of a feature. Ex: `feat: add table on landing page`, `feat: remove table from landing page`
- fix → Bug fixing, followed by the bug. Ex: `fix: illustration overflows in mobile view`
- docs → Update documentation (README.md)
- style → Updating style, and not changing any logic in the code (reorder imports, fix whitespace, remove comments)
- chore → Installing new dependencies, or bumping deps
- refactor → Changes in code, same output, but different approach
- ci → Update github workflows, husky
- test → Update testing suite, cypress files
- revert → when reverting commits
- perf → Fixing something regarding performance (deriving state, using memo, callback)
- vercel → Blank commit to trigger vercel deployment. Ex: `vercel: trigger deployment`

### 2. Optional Scope
Labels per page Ex: `feat(pre-event): add date label`

*If there is no scope needed, you don't need to write it

### 3. Description
Description must fully explain what is being done.

Add BREAKING CHANGE in the description if there is a significant change.

**If there are multiple changes, then commit one by one**

- After colon, there are a single space Ex: `feat: add something`
- When using `fix` type, state the issue Ex: `fix: file size limiter not working`
- Use imperative, and present tense: "change" not "changed" or "changes"
- Don't use capitals in front of the sentence
- Don't add full stop (.) at the end of the sentence


## 🐳 Docker Support

### Windows
```powershell
# Install Docker Desktop for Windows first
# Build container
docker build -t restaurant-saas .

# Run container
docker run -p 3000:3000 restaurant-saas
```

### Linux/macOS
```bash
# Build container
docker build -t restaurant-saas .

# Run container
docker run -p 3000:3000 restaurant-saas
```
