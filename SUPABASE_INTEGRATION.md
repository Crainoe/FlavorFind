# Supabase Integration for FlavorFind

This document explains how to complete the Supabase integration for your FlavorFind app.

## 🎯 What's Been Implemented

✅ **Supabase Client Setup**

- Installed `@supabase/supabase-js`
- Created Supabase configuration in `src/config/supabase.js`
- Set up client with your provided API key

✅ **Service Layer**

- Created `SupabaseService` class in `src/services/supabaseService.js`
- Handles authentication, favorites, and user profile operations
- Includes error handling and proper async/await patterns

✅ **State Management Updates**

- Updated favorites store (`src/store/modules/favorites.js`) to use Supabase
- Created new auth store (`src/store/modules/auth.js`) for user management
- Added backward compatibility with localStorage for guest users
- Automatic migration of localStorage favorites when users sign in

✅ **UI Components**

- Created `AuthWidget` component for sign in/sign up
- Updated `AppHeader` to include authentication controls
- Updated `RecipeCard` to work with TheMealDB data structure
- Updated `Favorites` view with loading states and error handling

✅ **Database Schema**

- Created `supabase-schema.sql` with complete database setup
- Includes tables for profiles and favorites
- Row Level Security (RLS) policies for data protection
- Automatic triggers and functions

## 🚀 Next Steps to Complete Integration

### 1. Set Up Your Supabase Database

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL script to create all necessary tables and policies

### 2. Configure Authentication

1. In your Supabase dashboard, go to **Authentication > Settings**
2. Configure your Site URL (e.g., `http://localhost:3000` for development)
3. Set up email templates if desired
4. Enable email confirmation if you want users to verify their email

### 3. Test the Integration

1. Start your development server: `npm run dev`
2. Try signing up for a new account
3. Add some recipes to favorites
4. Sign out and sign back in to verify data persistence
5. Test the localStorage migration by:
   - Adding favorites as a guest user
   - Then signing in to see them migrate to Supabase

### 4. Environment Variables (Optional but Recommended)

For production, move your Supabase credentials to environment variables:

1. Create a `.env.local` file:

```env
VITE_SUPABASE_URL=https://lkenacxddywafqoojwpd.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

2. Update `src/config/supabase.js`:

```javascript
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
```

## 🔧 Features Included

### Authentication

- **Sign Up/Sign In**: Modal-based authentication UI
- **User Sessions**: Automatic session management
- **Profile Management**: User profile creation and updates
- **Security**: Row Level Security ensuring users only access their data

### Favorites Management

- **Cloud Storage**: Favorites saved to Supabase database
- **Guest Support**: Fallback to localStorage for non-authenticated users
- **Data Migration**: Automatic migration from localStorage to Supabase on sign-in
- **Offline Tolerance**: Graceful fallbacks when Supabase is unavailable

### User Experience

- **Loading States**: Proper loading indicators during async operations
- **Error Handling**: User-friendly error messages and retry mechanisms
- **Backward Compatibility**: Existing localStorage favorites are preserved
- **Responsive Design**: Works on desktop and mobile devices

## 📊 Database Tables

### `profiles` table

- Extends the default auth.users table
- Stores user profile information (name, avatar, etc.)

### `favorites` table

- Links users to their favorite recipes
- Stores complete recipe data from TheMealDB API
- Includes creation timestamps for sorting

## 🔒 Security Features

- **Row Level Security**: Users can only access their own data
- **Authentication Required**: Sensitive operations require valid session
- **API Key Protection**: Anon key only allows user-scoped operations
- **Input Validation**: Proper data validation in all forms

## 🐛 Troubleshooting

### Common Issues

1. **"User not authenticated" errors**

   - Check that RLS policies are set up correctly
   - Ensure user is properly signed in

2. **Favorites not loading**

   - Check browser console for errors
   - Verify database tables exist and have correct permissions

3. **Sign up not working**
   - Check Supabase auth settings
   - Verify email configuration

### Debug Tools

- Check the browser's Network tab for failed API calls
- Use Supabase dashboard to view real-time logs
- Check Vue DevTools for store state

## 🎨 Customization Ideas

- Add recipe collections/folders
- Implement recipe sharing between users
- Add recipe ratings and reviews
- Create meal planning features
- Add grocery list generation from favorites

## 📚 Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Vue.js Documentation](https://vuejs.org/guide/)
- [Vuex Store Management](https://vuex.vuejs.org/)

Your FlavorFind app now has a complete Supabase integration! Users can create accounts, save favorites to the cloud, and have their data synchronized across devices.
