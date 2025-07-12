# Environment Variables Setup

This guide will help you set up environment variables for your SkillSwap application.

## 1. Create .env File

Create a `.env` file in the root directory of your project with the following content:

```env
# MongoDB Connection
MONGODB_URI=mongodb://localhost:27017/skillswap

# App Configuration
VITE_APP_NAME=SkillSwap
VITE_APP_URL=http://localhost:8080

# Development/Production
NODE_ENV=development
```

## 2. Environment Variables Explained

### MongoDB Connection
- `MONGODB_URI`: Your MongoDB connection string
  - Local: `mongodb://localhost:27017/skillswap`
  - Atlas: `mongodb+srv://username:password@cluster.mongodb.net/skillswap`

### Google OAuth
- `VITE_GOOGLE_CLIENT_ID`: Your Google OAuth Client ID
  - Get this from Google Cloud Console
  - Format: `123456789-abcdefghijklmnop.apps.googleusercontent.com`

### App Configuration
- `VITE_APP_NAME`: Application name (used in titles, etc.)
- `VITE_APP_URL`: Your application URL
- `NODE_ENV`: Environment (development/production)

## 3. Vite Environment Variables

In Vite, environment variables must be prefixed with `VITE_` to be accessible in the frontend:

```typescript
// ✅ Accessible in frontend
import.meta.env.VITE_GOOGLE_CLIENT_ID
import.meta.env.VITE_APP_NAME

// ❌ Not accessible in frontend (server-side only)
process.env.MONGODB_URI
```

## 4. Security Best Practices

### ✅ Do This:
- Use `.env` for local development
- Use `.env.local` for local overrides
- Use `.env.production` for production settings
- Add `.env*` to `.gitignore`

### ❌ Don't Do This:
- Commit `.env` files to version control
- Use hardcoded secrets in code
- Share `.env` files publicly

## 5. Production Setup

For production, set environment variables in your hosting platform:

### Vercel:
```bash
vercel env add VITE_GOOGLE_CLIENT_ID
vercel env add MONGODB_URI
```

### Netlify:
```bash
netlify env:set VITE_GOOGLE_CLIENT_ID "your-client-id"
netlify env:set MONGODB_URI "your-mongodb-uri"
```

### Railway:
```bash
railway variables set VITE_GOOGLE_CLIENT_ID=your-client-id
railway variables set MONGODB_URI=your-mongodb-uri
```

## 6. Testing Environment Variables

You can test if your environment variables are loaded correctly:

```typescript
console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('App Name:', import.meta.env.VITE_APP_NAME);
```

## 7. Troubleshooting

### Environment Variables Not Loading?
1. Make sure the `.env` file is in the root directory
2. Restart your development server
3. Check that variables are prefixed with `VITE_`
4. Verify the `.env` file syntax (no spaces around `=`)

### MongoDB Connection Issues?
1. Check your MongoDB URI format
2. Ensure MongoDB is running locally
3. Verify network access for Atlas connections
4. Check authentication credentials

### Google OAuth Issues?
1. Verify your Client ID is correct
2. Check authorized origins in Google Cloud Console
3. Ensure OAuth consent screen is configured
4. Verify API is enabled

## 8. Example .env File

```env
# Development
MONGODB_URI=mongodb://localhost:27017/skillswap
VITE_GOOGLE_CLIENT_ID=267321705557-ke7ohep7e95svsu9dcqhb0or2ebggnrn.apps.googleusercontent.com
VITE_APP_NAME=SkillSwap
VITE_APP_URL=http://localhost:8080
NODE_ENV=development

# Production (example)
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/skillswap
# VITE_GOOGLE_CLIENT_ID=your-production-client-id
# VITE_APP_NAME=SkillSwap
# VITE_APP_URL=https://your-domain.com
# NODE_ENV=production
``` 
