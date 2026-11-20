# FlavorFind

FlavorFind is a recipe discovery application with a Vue 3 frontend, Supabase-backed authentication and user data, TheMealDB recipe data, and an ASP.NET Core API foundation.

## Features

- Browse and search recipes from TheMealDB
- Filter by category and cuisine
- Save favorites as a guest or signed-in user
- Create and manage community recipes
- Sign in with email or Google through Supabase
- Responsive light and dark themes

## Repository layout

```text
FlavorFind/
|-- frontend/                 Vue 3 and Vite web application
|   |-- src/components/
|   |-- src/services/
|   |-- src/store/
|   |-- src/views/
|   `-- tests/
|-- backend/
|   `-- src/FlavorFind.Api/   ASP.NET Core API
|-- .github/workflows/        CI validation
`-- supabase-schema.sql       Supabase database schema and policies
```

The frontend currently talks directly to Supabase and TheMealDB. The backend exposes `/api/health` and is the starting point for future server-owned operations. Deploy the API separately if frontend features begin to depend on it.

## Prerequisites

- Node.js 22 or newer
- npm
- .NET SDK 10
- A Supabase project

## Setup

1. Install all dependencies:

   ```bash
   npm run install:all
   ```

2. Create `frontend/.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. Apply [supabase-schema.sql](supabase-schema.sql) in the Supabase SQL editor.

4. Start the frontend and backend together:

   ```bash
   npm run dev
   ```

The frontend runs at `http://localhost:3000`. The API launch profile uses `http://localhost:5004`, and its health endpoint is `http://localhost:5004/api/health`.

## Commands

| Command | Purpose |
| --- | --- |
| `npm run dev` | Run the frontend and API together |
| `npm run dev:frontend` | Run only the Vite frontend |
| `npm run dev:backend` | Run only the ASP.NET Core API |
| `npm run lint` | Check frontend code without modifying it |
| `npm test` | Run frontend unit tests once |
| `npm run build` | Build both frontend and backend |
| `npm run check` | Lint, test, and build the whole repository |

Use `npm --prefix frontend run lint:fix` when you intentionally want ESLint to rewrite formatting.

## Deployment

The workflow in `.github/workflows/deploy.yml` validates the frontend and backend without publishing the site. The frontend build uses `/` as its base path for a root domain such as `beta.flavfind.com`.

Add these repository secrets before running the validation workflow:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The Supabase anonymous key is designed for browser use; data security must be enforced by the Row Level Security policies in `supabase-schema.sql`.

## Architecture notes

- Vuex modules own authentication, favorites, recipes, search, and theme state.
- `frontend/src/services` contains external-service access.
- `frontend/src/utils/mealTransform.js` normalizes TheMealDB responses.
- Supabase stores profiles, favorites, user recipes, and uploaded recipe images.
- ASP.NET Core configuration restricts CORS to configured origins.

See [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md) for Supabase setup and troubleshooting details.
