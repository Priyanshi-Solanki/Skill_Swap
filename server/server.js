const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://Priyanshi:SkillSwap123@cluster0.1li4886.mongodb.net/Skill_Swap';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// User Schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password_hash: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: ''
  },
  profile_photo: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  availability: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  banned: {
    type: Boolean,
    default: false
  },
  skills: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      enum: ['offered', 'wanted'],
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Skills Schema
const skillSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['offered', 'wanted'],
    required: true
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Swap Requests Schema
const swapRequestSchema = new mongoose.Schema({
  from_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  offered_skill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  requested_skill_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Skill',
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Feedback Schema
const feedbackSchema = new mongoose.Schema({
  swap_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SwapRequest',
    required: true
  },
  from_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  to_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Notifications Schema
const notificationSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  read: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Admin Actions Schema
const adminActionSchema = new mongoose.Schema({
  performed_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    enum: ['ban_user', 'warn', 'message_all'],
    required: true
  },
  target_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create models
const User = mongoose.model('User', userSchema);
const Skill = mongoose.model('Skill', skillSchema);
const SwapRequest = mongoose.model('SwapRequest', swapRequestSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);
const Notification = mongoose.model('Notification', notificationSchema);
const AdminAction = mongoose.model('AdminAction', adminActionSchema);

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }
    req.user = user;
    next();
  });
};

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password, role, location, availability } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters long' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // Create new user
    const user = new User({
      name,
      email,
      password_hash,
      role: role || 'user',
      location: location || '',
      availability: availability || ''
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      availability: user.availability,
      profile_photo: user.profile_photo,
      isPublic: user.isPublic,
      createdAt: user.createdAt
    };

    res.status(201).json({
      message: 'User registered successfully',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is banned
    if (user.banned) {
      return res.status(403).json({ message: 'Account has been banned' });
    }

    // Check role if specified
    if (role && user.role !== role) {
      return res.status(401).json({ message: 'Invalid role for this user' });
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user._id, 
        email: user.email, 
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      location: user.location,
      availability: user.availability,
      profile_photo: user.profile_photo,
      isPublic: user.isPublic,
      createdAt: user.createdAt
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Social login (Google/Microsoft)
app.post('/api/auth/social-login', async (req, res) => {
  try {
    const { email, name, role, avatar, provider, location } = req.body;

    // Validate input
    if (!email || !name) {
      return res.status(400).json({ message: 'Email and name are required' });
    }

    // Find existing user
    let user = await User.findOne({ email });

    if (user) {
      // Check if user is banned
      if (user.banned) {
        return res.status(403).json({ message: 'Account has been banned' });
      }

      // User exists, log them in
      const token = jwt.sign(
        { 
          userId: user._id, 
          email: user.email, 
          role: user.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const userResponse = {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location,
        availability: user.availability,
        profile_photo: user.profile_photo,
        isPublic: user.isPublic,
        createdAt: user.createdAt
      };

      return res.json({
        message: 'Social login successful',
        user: userResponse,
        token
      });
    } else {
      // Create new user from social login
      const newUser = new User({
        name,
        email,
        password_hash: `social-auth-${provider}-${Date.now()}`, // Placeholder for social users
        role: role || 'user',
        profile_photo: avatar || '',
        location: location || ''
      });

      await newUser.save();

      const token = jwt.sign(
        { 
          userId: newUser._id, 
          email: newUser.email, 
          role: newUser.role 
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      const userResponse = {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        location: newUser.location,
        availability: newUser.availability,
        profile_photo: newUser.profile_photo,
        isPublic: newUser.isPublic,
        createdAt: newUser.createdAt
      };

      res.status(201).json({
        message: 'Social login successful',
        user: userResponse,
        token
      });
    }

  } catch (error) {
    console.error('Social login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile
app.get('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password_hash');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ user });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update user profile
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { name, location, availability, isPublic, skills } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (location !== undefined) updateData.location = location;
    if (availability) updateData.availability = availability;
    if (isPublic !== undefined) updateData.isPublic = isPublic;
    if (skills) updateData.skills = skills;

    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateData,
      { new: true }
    ).select('-password_hash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ 
      message: 'Profile updated successfully',
      user 
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users (admin only)
app.get('/api/admin/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.find().select('-password_hash');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Skills routes
app.post('/api/skills', authenticateToken, async (req, res) => {
  try {
    const { name, type, category, description } = req.body;
    
    if (!name || !type || !category || !description) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const skill = new Skill({
      user_id: req.user.userId,
      name,
      type,
      category,
      description
    });

    await skill.save();
    res.status(201).json({ message: 'Skill added successfully', skill });
  } catch (error) {
    console.error('Add skill error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await Skill.find().populate('user_id', 'name email location');
    res.json({ skills });
  } catch (error) {
    console.error('Get skills error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user's own skills
app.get('/api/user/skills', authenticateToken, async (req, res) => {
  try {
    const skills = await Skill.find({ user_id: req.user.userId });
    res.json({ skills });
  } catch (error) {
    console.error('Get user skills error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete user skill
app.delete('/api/user/skills/:skillId', authenticateToken, async (req, res) => {
  try {
    const skill = await Skill.findOneAndDelete({ 
      _id: req.params.skillId, 
      user_id: req.user.userId 
    });
    
    if (!skill) {
      return res.status(404).json({ message: 'Skill not found' });
    }
    
    res.json({ message: 'Skill deleted successfully' });
  } catch (error) {
    console.error('Delete skill error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get users for browsing (with skills, swap counts, and ratings)
app.get('/api/users/browse', async (req, res) => {
  try {
    const { skill } = req.query;
    
    console.log('Browse request received:', { skill });
    
    // Build match conditions
    let matchConditions = { isPublic: true };
    
    // Add skill filter if provided
    if (skill) {
      matchConditions['skills.name'] = { $regex: skill, $options: 'i' };
      matchConditions['skills.type'] = 'offered';
    }
    
    console.log('Match conditions:', matchConditions);
    
    // Aggregate pipeline to get users with swap counts and ratings
    const users = await User.aggregate([
      // Match public users and optional skill filter
      { $match: matchConditions },
      
      // Lookup swap requests count
      {
        $lookup: {
          from: 'swaprequests',
          localField: '_id',
          foreignField: 'from_user_id',
          as: 'swapRequests'
        }
      },
      
      // Lookup feedback for ratings
      {
        $lookup: {
          from: 'feedbacks',
          localField: '_id',
          foreignField: 'to_user_id',
          as: 'feedback'
        }
      },
      
      // Calculate swap count and average rating
      {
        $addFields: {
          swapCount: { $size: '$swapRequests' },
          averageRating: {
            $cond: {
              if: { $gt: [{ $size: '$feedback' }, 0] },
              then: { $avg: '$feedback.rating' },
              else: 0
            }
          }
        }
      },
      
      // Project only the fields we need
      {
        $project: {
          _id: 1,
          name: 1,
          skills: 1,
          profile_photo: 1,
          location: 1,
          isPublic: 1,
          swapCount: 1,
          averageRating: 1
        }
      }
    ]);
    
    console.log(`Found ${users.length} users`);
    res.json({ users });
  } catch (error) {
    console.error('Get users for browse error:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
});

// Simple test route for debugging
app.get('/api/users/test', async (req, res) => {
  try {
    const users = await User.find({ isPublic: true }).select('name location skills');
    res.json({ users, count: users.length });
  } catch (error) {
    console.error('Test route error:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 