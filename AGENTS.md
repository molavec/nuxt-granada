# AGENTS.md

Welcome, AI Agent! This document outlines the general guidelines, architecture, and technology stack for **Granada CMS Core** (`@granada/core`), a headless CMS and modern website builder built natively as a **Nuxt 4 Module**.

When contributing to this project, adhere strictly to the following conventions to ensure the codebase remains maintainable, consistent, and performant.

## Tech Stack
- **Framework**: Nuxt 4 (as a Nuxt module)
- **Database ORM**: Drizzle ORM
- **Database Engine**: libSQL (Turso) / SQLite
- **Styling**: Tailwind CSS & Nuxt UI
- **Language**: TypeScript (`.ts` and `.vue`)
- **Package Manager**: pnpm

## Project Structure & Architecture

Granada CMS Core is designed as an agile Nuxt module. It injects a sleek Admin UI (`/admin`) and dynamic frontend Catch-All renderer into any Nuxt application that installs it.

- `src/`: Contains the actual source code of the Nuxt Module (composables, components, server routes, plugins, the module setup logic, etc.).
- `playground/`: A dummy Nuxt application to locally test and preview the module.
- `drizzle/`: Contains the Drizzle migration files and the Drizzle configuration schema setup.
- `dist/`: The built/compiled module bundle output.

### Working with the Module
When modifying runtime files (like `src/runtime/server/api/...` or `src/runtime/components/...`), remember that the module logic revolves around adding these files via the Nuxt kit utilities (like `addServerHandler`, `addComponent`, etc.) inside the `src/module.ts` setup.

## Database & ORM Conventions
We use **Drizzle ORM** combined with **libSQL** (Turso). 
- Schema changes should be clearly reflected in the Drizzle schema files.
- ALWAYS use `drizzle-kit generate` to generate database migrations, and `drizzle-kit push` or `drizzle-kit migrate` as appropriate to test locally.
- Keep the usage of SQLite-specific functions safe and secure against SQL injection.

## Styling & UI Conventions
The UI is built with **Tailwind CSS** and heavily draws from the **Nuxt UI** minimalist design language.
- Implement sleek, highly aesthetic, modern interfaces.
- Prioritize clean markup and reuse of utility classes over writing custom CSS.
- Ensure the Admin UI remains zero-friction and highly accessible.
- Maintain responsive, mobile-first layouts out of the box.

## Development Scripts (pnpm)
Below are the key commands used during development:
- `npm run dev` / `pnpm run dev`: Starts the test playground with the module auto-injected.
- `pnpm db:generate`: Generates Drizzle schema migrations.
- `pnpm db:migrate` / `pnpm db:push`: Applies database schema changes.
- `pnpm lint`: Runs ESLint to lint the code.
- `pnpm test`: Runs Vitest for the testing suite.

## Commit Guidelines
- Write clear, concise commit messages.
- Prefix commits properly when applicable (e.g. `feat:`, `fix:`, `docs:`, `chore:`).
- Keep changes reasonably scoped per PR or commit.

## Important Note to Agents
Always verify that your code conforms to the existing ESLint and TypeScript checks before completing tasks. Verify that modifying the module's generic files will correctly be injected and available to the consumer Nuxt application via the `playground`.
