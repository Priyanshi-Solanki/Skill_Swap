# Google OAuth Setup Guide

To enable real Google authentication in your SkillSwap app, follow these steps:

## 1. Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API and Google Identity Services API

## 2. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: "SkillSwap"
   - User support email: Your email
   - Developer contact information: Your email
4. Add scopes: `email`, `profile`, `openid`
5. Add test users (your email) if needed

## 3. Create OAuth 2.0 Credentials

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client IDs"
3. Choose "Web application"
4. Add authorized JavaScript origins:
   - `http://localhost:8080` (for development)
   - `http://localhost:3000` (if using different port)
   - Your production domain (when deployed)
5. Add authorized redirect URIs:
   - `http://localhost:8080`
   - `http://localhost:3000`
   - Your production domain

## 4. Get Your Client ID

1. After creating the OAuth client, copy the Client ID
2. It will look like: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

## 5. Update Your App

1. Open `src/App.tsx`
2. Replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID:

```typescript
const GOOGLE_CLIENT_ID = "123456789-abcdefghijklmnop.apps.googleusercontent.com";
```

## 6. Install Dependencies

Run this command to install the Google OAuth library:

```bash
npm install @react-oauth/google
```

## 7. Test the Integration

1. Start your development server: `npm run dev`
2. Go to the login page
3. Click "Continue with Google"
4. You should see the real Google account selection popup
5. Choose your Google account to authenticate

## Features Now Available

✅ **Real Google OAuth** - Users can select from their Google accounts
✅ **Account Creation** - New users get accounts created automatically
✅ **Existing User Login** - Existing users are logged in seamlessly
✅ **Role-based Routing** - Users are redirected to appropriate dashboards
✅ **Profile Data** - Real name, email, and profile picture from Google

## Troubleshooting

- **"Invalid Client ID"**: Make sure you've copied the correct Client ID
- **"Unauthorized JavaScript origin"**: Add your domain to authorized origins
- **"OAuth consent screen not configured"**: Complete the OAuth consent screen setup
- **"API not enabled"**: Enable Google Identity Services API

## Security Notes

- Never commit your Client ID to public repositories
- Use environment variables in production
- Add your production domain to authorized origins when deploying 