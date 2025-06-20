<div align="center">

# 🌍 PolyChat9 - Global Multilingual Communication Platform

[![React](https://img.shields.io/badge/React-19.0.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-brightgreen.svg)](https://mongodb.com/)
[![Stream](https://img.shields.io/badge/Stream-Video%20%26%20Chat-orange.svg)](https://getstream.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Authentication-orange.svg)](https://firebase.google.com/)

**🚀 Real-time multilingual video calling and messaging platform with advanced authentication**

![Demo App](/frontend/public/screenshot-for-readme.png)

</div>

---

## ✨ **Key Features**

### 💬 **Communication**
- 🌐 **Real-time Chat** - Instant messaging with typing indicators
- 📹 **HD Video Calls** - Crystal clear video conversations
- 👥 **Friend System** - Connect with language learning partners
- 🔔 **Notifications** - Friend requests and message alerts

### 🔐 **Authentication**
- 📧 **Email/Password** - Traditional signup and login
- 🔥 **Firebase Auth** - Google, Twitter/X social login
- 🔗 **LinkedIn OAuth** - Professional network integration
- 🛡️ **Secure Tokens** - JWT-based authentication

### 🎨 **User Experience**
- 📱 **Responsive Design** - Works on all devices
- 🎭 **Avatar System** - Custom photos or generated avatars
- 🌍 **Language Support** - Multilingual interface
- ⚡ **Fast Performance** - Optimized with modern tech stack

---

## 🚀 **Quick Start**

### 📋 **Prerequisites**
- Node.js 18+ and npm
- MongoDB (local or Atlas)
- Stream account ([Get API keys](https://getstream.io/dashboard/))
- Firebase project ([Firebase Console](https://console.firebase.google.com/))

### ⚡ **Installation**
```bash
# Clone and install
git clone https://github.com/Troy2727/PolyChat9.git
cd PolyChat9
npm install

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd ../frontend && npm install
```

### 🔧 **Environment Setup**

#### Backend (.env)
```bash
cd backend
cp .env.example .env
# Edit with your configuration:

PORT=5002
MONGO_URI=mongodb://localhost:27017/polychat9
JWT_SECRET_KEY=your_jwt_secret
STREAM_API_KEY=your_stream_key
STREAM_API_SECRET=your_stream_secret
GOOGLE_APPLICATION_CREDENTIALS=./firebase-adminsdk.json
LINKEDIN_CLIENT_ID=your_linkedin_id
LINKEDIN_CLIENT_SECRET=your_linkedin_secret
```

#### Frontend (.env)
```bash
cd frontend
# Create .env file:

VITE_STREAM_API_KEY=your_stream_key
VITE_FIREBASE_API_KEY=your_firebase_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_LINKEDIN_CLIENT_ID=your_linkedin_id
```

### 🚀 **Run the Application**
```bash
# Start backend (from backend directory)
npm run dev

# Start frontend (from frontend directory)
npm run dev
```

**Access the app**: http://localhost:5173

---

## 🔥 **Firebase Authentication Setup**

### 1. Firebase Console Configuration
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select your project
3. Navigate to **Authentication > Sign-in method**
4. Enable: **Email/Password**, **Google**, **Twitter**

### 2. Download Service Account
1. Go to **Project Settings > Service Accounts**
2. Click **Generate new private key**
3. Save as `backend/firebase-adminsdk.json`

### 3. LinkedIn App Setup (Optional)
1. Go to [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Create app and get Client ID/Secret
3. Add redirect URL: `http://localhost:5173/auth/linkedin/callback`

### 🧪 **Test Authentication**
Visit: `http://localhost:5173/auth-test` to test all auth methods

---

## 🏗️ **Tech Stack**

### Frontend
- **React 19** + **Vite** - Modern development
- **TailwindCSS** + **DaisyUI** - Styling
- **TanStack Query** - Data fetching
- **React Router** - Navigation
- **Stream SDK** - Video/Chat
- **Firebase SDK** - Authentication

### Backend
- **Node.js** + **Express** - Server
- **MongoDB** + **Mongoose** - Database
- **Firebase Admin** - Auth verification
- **Stream API** - Real-time features
- **JWT** - Token management

### 📁 **Project Structure**
```
PolyChat9/
├── backend/
│   ├── src/
│   │   ├── controllers/    # API handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API routes
│   │   ├── lib/            # Firebase, Stream config
│   │   └── server.js       # Entry point
│   └── .env                # Environment config
├── frontend/
│   ├── src/
│   │   ├── components/     # UI components
│   │   ├── pages/          # Route pages
│   │   ├── hooks/          # Custom hooks
│   │   └── lib/            # API, Firebase config
│   └── .env                # Environment config
└── README.md
```

---

## 📱 **Core Pages & Features**

### 💬 **Chat Page** (`/chat/:id`)
The real-time messaging interface powered by Stream Chat SDK:

**Features:**
- **Real-time Messaging** - Instant message delivery with typing indicators
- **Channel Management** - Automatic channel creation between users
- **Message Threading** - Organized conversation threads
- **Video Call Integration** - Start video calls directly from chat
- **User Presence** - See when users are online/offline
- **Message History** - Persistent chat history across sessions

**Technical Implementation:**
- Uses Stream Chat React SDK components (`Chat`, `Channel`, `MessageList`, `MessageInput`)
- Automatic channel ID generation using sorted user IDs
- JWT token-based authentication with Stream
- Real-time connection management and error handling

**Route:** `/chat/:id` (where `:id` is the target user's ID)

### 📹 **Video Calls Page** (`/call/:id`)
HD video calling interface powered by Stream Video SDK:

**Features:**
- **HD Video Calls** - Crystal clear video conversations
- **Speaker Layout** - Optimized video layout for conversations
- **Call Controls** - Mute, camera toggle, screen share, hang up
- **Auto-join** - Seamless call joining with create-if-not-exists
- **Call States** - Proper handling of connecting, active, and ended states
- **Responsive Design** - Works across all device sizes

**Technical Implementation:**
- Uses Stream Video React SDK (`StreamVideo`, `StreamCall`, `CallControls`)
- Automatic call creation and joining
- Real-time video/audio streaming
- Call state management with proper navigation
- Error handling and loading states

**Route:** `/call/:id` (where `:id` is the channel/call ID)

**Integration:** Video calls are initiated from the Chat Page via the video call button, which sends a call link message and redirects participants.

### 🔄 **Chat ↔ Video Call Workflow**

1. **Start in Chat** - Users begin conversations in the Chat Page (`/chat/:userId`)
2. **Initiate Video Call** - Click the video call button in the chat interface
3. **Call Link Generation** - System generates a unique call URL (`/call/:channelId`)
4. **Message Notification** - Call link is automatically sent as a chat message
5. **Join Call** - Participants click the link to join the video call
6. **Return to Chat** - After ending the call, users return to the chat interface

This seamless integration ensures users can easily switch between text and video communication without losing context.

### 🧵 **Thread Card Structure**
Modern card-based interface for displaying conversation threads and posts:

**Features:**
- **Thread Cards** - Clean, card-based layout for conversations and posts
- **Interactive Elements** - Like, comment, share buttons with real-time updates
- **Media Support** - Image, video, and file attachments in thread cards
- **Thread Hierarchy** - Visual representation of reply chains and nested comments
- **User Attribution** - Clear display of author information, timestamps, and avatars
- **Engagement Metrics** - Real-time like counts, comment counts, and view statistics

**Technical Implementation:**
- Reusable card components with consistent styling
- Lazy loading for optimal performance with large thread lists
- Real-time updates for engagement metrics
- Responsive design adapting to different screen sizes
- Accessibility features for screen readers and keyboard navigation

### 💬 **Reply/Comment System**
Comprehensive commenting and reply functionality for enhanced user interaction:

**Features:**
- **Nested Comments** - Multi-level reply chains with visual threading
- **Rich Text Editor** - Markdown support, emoji picker, and text formatting
- **Real-time Updates** - Instant comment notifications and live updates
- **Comment Moderation** - Report, edit, and delete functionality
- **Mention System** - @username mentions with notifications
- **Comment Reactions** - Like, dislike, and emoji reactions

**Technical Implementation:**
- Recursive comment rendering for nested replies
- Real-time WebSocket updates for new comments
- Rich text editor with markdown parsing
- Comment pagination and infinite scroll
- Notification system for mentions and replies

### 👤 **Profile Page** (`/profile/:userId`)
Comprehensive user profile interface with customization options:

**Features:**
- **Profile Information** - Bio, location, languages, interests, and contact details
- **Avatar Management** - Photo upload, generated avatars, and avatar customization
- **Activity Timeline** - Recent posts, comments, and interactions
- **Language Preferences** - Native languages, learning languages, and proficiency levels
- **Friend Management** - Friends list, mutual connections, and friend suggestions
- **Privacy Settings** - Profile visibility, contact preferences, and blocking options
- **Statistics Dashboard** - Chat activity, call duration, and engagement metrics

**Technical Implementation:**
- Dynamic profile data loading with caching
- Image upload and processing for avatars
- Privacy controls with granular permissions
- Activity feed with pagination
- Real-time status updates and presence indicators

### 🔍 **Search Page** (`/search`)
Advanced search functionality for users, content, and conversations:

**Features:**
- **Global Search** - Search across users, messages, threads, and communities
- **Advanced Filters** - Filter by content type, date range, language, and location
- **User Discovery** - Find users by language, interests, and location
- **Content Search** - Search through messages, posts, and shared media
- **Search History** - Recent searches and saved search queries
- **Smart Suggestions** - Auto-complete and search recommendations

**Technical Implementation:**
- Elasticsearch integration for fast, relevant search results
- Real-time search suggestions and auto-complete
- Advanced filtering with multiple criteria
- Search result ranking and relevance scoring
- Search analytics and performance optimization

### 📊 **Activity Page** (`/activity`)
Centralized activity feed and notification center:

**Features:**
- **Activity Feed** - Chronological feed of user interactions and updates
- **Notification Center** - Friend requests, messages, mentions, and system notifications
- **Activity Types** - Posts, comments, likes, friend requests, and call invitations
- **Real-time Updates** - Live activity stream with WebSocket connections
- **Activity Filtering** - Filter by activity type, date, and user
- **Mark as Read** - Notification management and read status tracking

**Technical Implementation:**
- Real-time activity streaming with WebSocket connections
- Notification queuing and delivery system
- Activity aggregation and deduplication
- Push notification integration for mobile devices
- Activity analytics and engagement tracking

### 🌐 **Community Page** (`/communities`)
Community discovery and management interface:

**Features:**
- **Community Discovery** - Browse and search language learning communities
- **Community Creation** - Create new communities with custom settings
- **Member Management** - Join/leave communities, member roles, and permissions
- **Community Feed** - Dedicated feed for community posts and discussions
- **Event Management** - Community events, language exchanges, and meetups
- **Community Moderation** - Admin tools, content moderation, and community guidelines

**Technical Implementation:**
- Community-based content filtering and organization
- Role-based access control for community features
- Event scheduling and notification system
- Community analytics and engagement metrics
- Moderation tools and automated content filtering

---

## 🚀 **Features Overview**

### Authentication System
- **Email/Password** signup and login
- **Google** and **Twitter** social login via Firebase
- **LinkedIn** OAuth integration
- **JWT** token-based sessions
- **Password reset** functionality

### Communication Features
- **Real-time messaging** with Stream Chat SDK
  - Instant message delivery and typing indicators
  - Message threading and conversation history
  - Channel-based communication between users
- **HD Video calling** with Stream Video SDK
  - Crystal clear video conversations with call controls
  - Speaker layout optimized for 1-on-1 calls
  - Seamless call initiation from chat interface
- **Friend system** with requests/notifications
  - Send/accept friend requests with real-time notifications
  - Friend recommendations based on language preferences
- **User profiles** with hybrid avatar system
  - Custom photo uploads or generated avatars (DiceBear/RoboHash)
  - Language preferences and learning goals
- **Smart routing** between chat and video calls
  - Direct navigation from chat to video calls
  - Persistent call links shared via chat messages

### Technical Features
- **Responsive design** for all devices
- **Real-time updates** across clients
- **Error handling** and loading states
- **Secure authentication** flow
- **MongoDB** data persistence

---

## 🐛 **Troubleshooting**

### Common Issues
1. **Port conflicts**: Backend runs on 5002, frontend on 5173
2. **Firebase errors**: Check service account file and environment variables
3. **MongoDB connection**: Ensure MongoDB is running locally or Atlas URI is correct
4. **Stream errors**: Verify API keys in both frontend and backend
5. **CORS issues**: Check frontend URL in backend CORS configuration

### Debug Tips
- Check browser console for frontend errors
- Check terminal logs for backend errors
- Verify all environment variables are set
- Test authentication at `/auth-test` page

---

## 📝 **License**

This project is licensed under the MIT License.

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Built with ❤️ for global communication and language learning**
