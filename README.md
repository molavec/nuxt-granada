# @granada/core 🌟

Granada CMS Core is a headless CMS and modern website builder built natively as a **Nuxt Module**. It is designed as an agile, zero-friction alternative to WordPress. The module automatically injects a sleek Admin UI, fully functional Nitro API routes, and a dynamic frontend Catch-All renderer into any Nuxt application that installs it.

## Features ✨
- **Zero-Config Admin UI**: Accessible out of the box at `/admin`.
- **Modern Tech Stack**: Nuxt 4, Tailwind CSS, Nuxt UI minimalist design language.
- **Serverless Database**: Powered by Drizzle ORM and Turso (libSQL).
- **Injected Catch-All Renderer**: Renders dynamic Markdown content on the frontend automatically.

---

## 🚀 Getting Started (Playground)

To run the playground and test the module locally, follow these steps:

### 1. Environment Setup
Create a `.env` file in the root of the project (or inside `/playground`):

```env
# Your Turso Database Credentials
GRANADA_DATABASE_URL="libsql://your-db-name.turso.io"
GRANADA_AUTH_TOKEN="your-turso-auth-token"
```

*Note: Since the DB connects over HTTP with libSQL, local file databases like `file:local.db` will also work if you omit the auth token!*

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Run the Development Server
```bash
npm run dev
```

### 4. Explore
- **Admin Panel**: Visit [http://localhost:3000/admin](http://localhost:3000/admin) to manage your pages, blog posts, and active themes.
- **Frontend App**: Visit [http://localhost:3000/](http://localhost:3000/) to see your dynamic content rendered through the Catch-All route injector.
