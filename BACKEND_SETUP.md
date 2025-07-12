# Backend Server Setup Guide

This guide will help you set up the backend server to connect your SkillSwap application to MongoDB.

## 1. Backend Structure

```
server/
├── package.json          # Backend dependencies
├── server.js            # Main server file
├── install.bat          # Install dependencies script
├── start.bat            # Start server script
└── .env                 # Environment variables (create this)
```

## 2. Install Backend Dependencies

Navigate to the server directory and install dependencies:

```bash
cd server
npm install
```

Or use the provided script:
```bash
server/install.bat
```

## 3. Create Server Environment File

Create a `.env` file in the `server/` directory with:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://Priyanshi:SkillSwap123@cluster0.1li4886.mongodb.net/skillswap

# JWT Secret (change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Server Configuration
PORT=5000
NODE_ENV=development
```

## 4. Update Frontend Environment

Update your frontend `.env` file to include the API URL:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://Priyanshi:SkillSwap123@cluster0.1li4886.mongodb.net/skillswap

# Google OAuth
GOOGLE_CLIENT_ID=267321705557-ke7ohep7e95svsu9dcqhb0or2ebggnrn.apps.googleusercontent.com

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# App Configuration
VITE_APP_NAME=SkillSwap
VITE_APP_URL=http://localhost:8080
VITE_API_URL=http://localhost:5000

# Development/Production
NODE_ENV=development
```

## 5. Start the Backend Server

Run the backend server:

```bash
cd server
npm run dev
```

Or use the provided script:
```bash
server/start.bat
```

The server will start on `http://localhost:5000`

## 6. Test the Connection

### Health Check
```bash
curl http://localhost:5000/api/health
```

### Register a User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "role": "user"
  }'
```

## 7. API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/social-login` - Social login (Google/Microsoft)

### User Management
- `GET /api/user/profile` - Get user profile (authenticated)
- `GET /api/admin/users` - Get all users (admin only)

### Health Check
- `GET /api/health` - Server health check

## 8. Database Schema

The backend creates users with this schema:

```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password_hash: String,
  role: String (enum: ['user', 'admin']),
  avatar: String,
  createdAt: Date
}
```

## 9. Security Features

✅ **Password Hashing** - Uses bcryptjs for secure password storage
✅ **JWT Authentication** - Secure token-based authentication
✅ **Input Validation** - Validates all user inputs
✅ **Error Handling** - Comprehensive error handling
✅ **CORS Enabled** - Allows frontend to communicate with backend

## 10. Troubleshooting

### MongoDB Connection Issues
1. Check your MongoDB URI format
2. Verify network access to MongoDB Atlas
3. Check username/password in connection string
4. Ensure database name is correct

### Server Not Starting
1. Check if port 5000 is available
2. Verify all dependencies are installed
3. Check .env file exists and is properly formatted
4. Look for error messages in console

### Frontend Can't Connect
1. Ensure backend is running on port 5000
2. Check CORS configuration
3. Verify VITE_API_URL in frontend .env
4. Check browser console for CORS errors

### Authentication Issues
1. Verify JWT_SECRET is set
2. Check token expiration
3. Ensure proper Authorization header format
4. Verify user exists in database

## 11. Development Workflow

1. **Start Backend**: `cd server && npm run dev`
2. **Start Frontend**: `npm run dev` (in root directory)
3. **Test Registration**: Use the signup form
4. **Test Login**: Use the login form
5. **Check Database**: Verify users are created in MongoDB

## 12. Production Deployment

For production, update environment variables:

```env
MONGODB_URI=your-production-mongodb-uri
JWT_SECRET=your-production-jwt-secret
NODE_ENV=production
PORT=5000
```

## 13. Database Connection

Your MongoDB connection string:
```
mongodb+srv://Priyanshi:SkillSwap123@cluster0.1li4886.mongodb.net/skillswap
```

This will connect to the `skillswap` database in your MongoDB Atlas cluster.

## 14. Next Steps

1. Start the backend server
2. Test user registration
3. Test user login
4. Test social login
5. Verify data is stored in MongoDB
6. Test role-based access

The backend is now ready to handle user authentication and store data in your MongoDB database! 