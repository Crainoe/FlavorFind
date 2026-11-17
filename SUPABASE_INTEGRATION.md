# Supabase integration

FlavorFind uses Supabase for authentication, profiles, favorites, community recipes, and recipe images. The integration lives in the Vue frontend; the ASP.NET Core API does not handle Supabase credentials.

## Included components

- Client configuration: `frontend/src/config/supabase.js`
- Service layer: `frontend/src/services/supabaseService.js`
- Authentication store: `frontend/src/store/modules/auth.js`
- Favorites store: `frontend/src/store/modules/favorites.js`
- User recipe store: `frontend/src/store/modules/userRecipes.js`
- Database and storage policies: `supabase-schema.sql`

Guest favorites remain in `localStorage`. After sign-in, FlavorFind migrates them into the signed-in user's Supabase account.

## Initial setup

1. Create a Supabase project.
2. Open its SQL editor and run `supabase-schema.sql`.
3. Create `frontend/.env.local`:

   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. In Supabase Authentication URL Configuration, add:

   - Local site URL: `http://localhost:3000`
   - Local redirect URL: `http://localhost:3000/**`
   - Production redirect URL: `https://crainoe.github.io/FlavorFind/**`

5. Enable any desired providers, such as Google, and configure their provider credentials in Supabase.
6. Start the application with `npm run dev`.

Environment files are ignored by Git. Never put the Supabase service-role key in the frontend. The anonymous key is public by design and relies on Row Level Security for authorization.

## GitHub Pages

Add these GitHub repository secrets for the deployment workflow:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

The workflow injects them only while Vite builds the static site. Also ensure the GitHub Pages URL is present in Supabase's allowed redirect URLs.

## Verification checklist

1. Create an account and confirm the expected email flow.
2. Sign in and sign out.
3. Add a favorite as a guest, sign in, and verify migration.
4. Reload and confirm signed-in favorites persist.
5. Create, edit, and delete a community recipe.
6. Upload a recipe image and confirm its storage policy permits access.
7. Confirm one user cannot read or modify another user's private rows.

## Troubleshooting

### Missing environment variables

If startup reports missing Supabase configuration, confirm that `frontend/.env.local` exists, uses the exact variable names above, and restart Vite after changing it.

### Authentication redirects incorrectly

Check the Site URL and redirect allow list in Supabase. Local and GitHub Pages paths must both be configured when testing both environments.

### Database operations are denied

Reapply `supabase-schema.sql`, inspect the relevant Row Level Security policy, and confirm the request has an authenticated user session.

### Data does not refresh

Inspect the browser Network panel and console, then check the Vuex module state with Vue DevTools. Supabase project logs can confirm whether a request reached the service.

## References

- [Supabase documentation](https://supabase.com/docs)
- [Vue documentation](https://vuejs.org/guide/)
- [Vuex documentation](https://vuex.vuejs.org/)
