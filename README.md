# Video Platform Backend API

**🌐 Live API:** [Back_Api](cb-back-prueba-production.up.railway.app)

A robust Node.js backend API for a video sharing and streaming platform with authentication, video management, categories, speakers, comments, and AI-powered search capabilities.

## 🚀 Features

- **Video Management**: Upload, stream, update, and delete videos with Cloudinary integration
- **User Authentication**: Secure login system with JWT tokens
- **Categories & Speakers**: Organize content by categories and speakers
- **Comments System**: User interaction through comments on videos
- **AI-Powered Search**: Intelligent video search using Google's Generative AI
- **Chat System**: Real-time chat functionality
- **CORS Support**: Cross-origin resource sharing for frontend integration
- **File Upload**: Secure video file uploads with validation (up to 100MB)

## 🛠️ Tech Stack

- **Runtime**: Node.js with ES6 modules
- **Framework**: Express.js
- **Database**: MySQL with mysql2
- **File Storage**: Cloudinary for video hosting
- **AI Integration**: Google Generative AI for search
- **File Upload**: Multer for handling multipart/form-data
- **Environment**: dotenv for configuration management
- **CORS**: Cross-origin resource sharing support

## 📁 Project Structure

```
├── index.js                 # Main server entry point
├── db.js                    # Database connection configuration
├── cloudinary.js            # Cloudinary configuration
├── package.json             # Dependencies and scripts
├── modules/                 # Feature modules
│   ├── auth/               # Authentication system
│   │   ├── auth.controller.js
│   │   ├── auth.model.js
│   │   └── auth.routes.js
│   ├── videos/             # Video management
│   │   ├── videos.controller.js
│   │   ├── videos.model.js
│   │   └── videos.routes.js
│   ├── categories/         # Category management
│   │   ├── categories.controller.js
│   │   └── categories.routes.js
│   ├── speakers/           # Speaker management
│   │   ├── speakers.controller.js
│   │   └── speakers.routes.js
│   ├── comments/           # Comment system
│   │   ├── comments.controller.js
│   │   ├── comments.model.js
│   │   └── comment.routes.js
│   ├── search/             # AI-powered search
│   │   ├── search.controller.js
│   │   ├── search.model.js
│   │   └── search.routes.js
│   └── chat/               # Chat system
│       ├── chat.controller.js
│       └── chat.routes.js
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL database
- Cloudinary account
- Google AI API key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SebitasDown/cb-back-prueba.git
   cd cb-back-prueba
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the root directory:
   ```env
   # Database Configuration
   DB_HOST=your_mysql_host
   DB_NAME=your_database_name
   DB_USER=your_database_user
   DB_PASSWORD=your_database_password
   DB_PORT=3306

   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret

   # Google AI Configuration
   GOOGLE_AI_API_KEY=your_google_ai_api_key

   # Server Configuration
   PORT=3000
   ```

4. **Database Setup**
   - Create a MySQL database
   - Import the database schema (contact contributors for schema details)

5. **Run the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

## 📡 API Endpoints

### Authentication
- `POST /auth` - User login

### Videos
- `GET /videos` - Get all videos
- `POST /videos/create` - Upload new video
- `PUT /videos/:id` - Update video
- `DELETE /videos/:id` - Delete video

### Categories
- `GET /categories` - Get all categories

### Speakers
- `GET /speakers` - Get all speakers

### Comments
- `GET /comment` - Get comments
- `POST /comment` - Create comment
- `PUT /comment/:id` - Update comment
- `DELETE /comment/:id` - Delete comment

### Search
- `GET /search` - AI-powered video search

### Chat
- `GET /chat` - Get chat messages
- `POST /chat` - Send chat message

## 🔧 Configuration

### CORS Settings
The API is configured to accept requests from multiple frontend domains:
- `https://cb-front.vercel.app`
- `https://cb-front-nuegaam1f-sebitasdowns-projects.vercel.app`
- `https://cb-front-lol.vercel.app`
- Local development servers

### File Upload Limits
- Maximum file size: 100MB
- Supported formats: MP4, AVI, MOV, WMV, FLV, QuickTime

## 🚀 Deployment

### Vercel Deployment
This project is configured for deployment on Vercel:

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables for Production
Ensure all environment variables are set in your deployment platform:
- Database credentials
- Cloudinary configuration
- Google AI API key
- CORS origins

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 👥 Contributors

### Core Team
- **SebitasDown** - Project Lead & Backend Developer
  - GitHub: [@SebitasDown](https://github.com/SebitasDown)
  - Role: Full-stack development, API architecture, database design

### Additional Contributors
- **David** - Backend Development
  - Role: Authentication system, video management, API endpoints

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/SebitasDown/cb-back-prueba/issues) page
2. Create a new issue with detailed description
3. Contact the maintainers for urgent issues

## 🔗 Related Projects

- **Frontend**: [cb-front](https://github.com/SebitasDown/cb-front) - React-based frontend application
- **Database Schema**: Contact contributors for database setup instructions

---

**Built with ❤️ by the Video Platform Team**
