---
name: Nuxt Module Development
description: Guidelines and best practices for creating, adjusting, and improving Nuxt 4 modules.
---

# Nuxt Module Development Skill

When working on Nuxt 4 modules, adhere to these conventions, anatomy, and best practices derived from the official Nuxt documentation.

## Module Anatomy
- **Entry Point**: The module definition is usually located at `src/module.ts`.
- **Definition**: Always use the object-syntax with the `defineNuxtModule` helper from `@nuxt/kit`.
  - Include the `meta` property (e.g., `name`, `configKey`, `compatibility` with Nuxt `^3.0.0` or `^4.0.0`).
- **Runtime Assets**: Code inside `src/runtime/` is injected into the application. This includes Vue components, composables, Nuxt plugins, Nitro API routes, middlewares, etc.

## Best Practices & Conventions

### 1. Prefix Your Exports
To avoid conflicts, **always prefix** any exposed configuration, plugin, API, composable, component, or server route.
- Ideally, prefix them with your module's name (e.g., if module is `nuxt-foo`, use `useFooData()`, `<FooButton />`, `/api/_foo/data`).

### 2. Modify Nuxt Configuration Safely
- Use `defu` to extend configurations without accidentally overwriting user-provided configuration.
- To expose your module options to the runtime, extend `nuxt.options.runtimeConfig.public.myModule`.

### 3. Add Plugins, Components, & Composables
Use the `@nuxt/kit` utilities in the `setup` function:
- `addPlugin(resolver.resolve('./runtime/plugin'))` for Nuxt plugins.
- `addComponent({ name: 'MyComponent', filePath: resolver.resolve('runtime/components/MyComponent.vue') })` for Vue components.
- `addImports({ name: 'useMyComposable', from: resolver.resolve('runtime/composables/useMyComposable') })` for composables.
- `addServerHandler({ route: '/api/endpoint', handler: resolver.resolve('runtime/server/api/endpoint') })` for Nitro routes.

### 4. Use Lifecycle Hooks
- When your module needs to perform one-time setup tasks (like generating configurations or database setups), use lifecycle hooks (`onInstall`, `onUpgrade`) instead of running heavy async logic directly in the main `setup` function.
- Be careful with asynchronous behaviors in `setup`, as Nuxt waits for your module to finish setting up.

### 5. Be TypeScript & ESM Friendly
- Nuxt relies on native ESM. Always use ES Modules (`import`/`export`).
- Expose TypeScript types correctly. Add type declarations for runtime hooks or augment Nuxt configurations if your module introduces new properties.

## Testing Your Module
- **E2E Testing**: Use `@nuxt/test-utils/e2e` to test your module end-to-end.
- The standard workflow involves creating a Nuxt application as a "fixture" inside `test/fixtures/*`, setting it up in your test files, and interacting with it via tests (e.g., using `Vitest`).
- Adhere to the starter conventions (ESLint, Vitest) if the module is open source to maintain consistency in the ecosystem.

## General Reminders
- Avoid "magic". Keep the module explicit and the documentation clear.
- Stay Version Agnostic: avoid mentioning "Nuxt 3" and prefer "Nuxt", using `meta.compatibility` to set actual constraints (e.g., `nuxt: '>=3.0.0'`).
