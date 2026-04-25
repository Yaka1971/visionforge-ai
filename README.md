# VisionForge AI

A futuristic, cinematic AI creative studio web application that generates ultra-high-definition images and videos from text prompts with powerful AI-assisted prompt tools, personal galleries, and seamless export options.

**Live Demo:** https://visionforge-h7v3twbp.manus.space

**GitHub Repository:** https://github.com/Yaka1971/visionforge-ai

---

## 🎬 What is VisionForge AI?

VisionForge AI is a production-ready web application that empowers creators to generate stunning visual content using artificial intelligence. Whether you're a content creator, filmmaker, designer, or artist, VisionForge AI streamlines your creative workflow with:

- **Text-to-Image Generation**: Create ultra-HD images (up to 4K) from text prompts with 7 style presets
- **AI Prompt Enhancement**: Automatically refine prompts for optimal output quality
- **Cinematic Mode**: Generate Hollywood-level prompts with professional cinematography terminology
- **Smart Prompt Builder**: Category-based suggestions (Characters, Environment, Lighting, Camera Angles, Mood)
- **Image-to-Video**: Convert static images into 15-second cinematic videos with motion effects
- **Personal Gallery**: Organize, manage, and download all generated content
- **User Authentication**: Secure login with persistent sessions and private galleries
- **Social Media Export**: Optimized formats for TikTok, YouTube, Instagram, and more

---

## 🔑 BYOK Model (Bring Your Own Keys)

VisionForge AI uses a **Bring Your Own Keys (BYOK)** model for video generation APIs. This means:

✅ **You maintain full control** of your API credentials
✅ **No vendor lock-in** - switch between Kling AI and Runway ML anytime
✅ **Transparent pricing** - pay only for what you use
✅ **Privacy-first** - your keys are encrypted and never exposed to frontend
✅ **Secure storage** - AES-256-GCM encryption for all credentials

### Supported Video Generation APIs:
- **Kling AI** - Fast, high-quality AI video synthesis with motion effects
- **Runway ML** - Professional video generation with advanced controls

---

## 🎯 Demo Mode vs Real API Mode

### Demo Mode (No API Keys Required)
- Generate sample images using Manus built-in image generation
- Create placeholder videos with motion metadata
- Perfect for testing and exploring features
- No costs incurred

### Real API Mode (With Your API Keys)
- Generate actual AI-synthesized videos using Kling AI or Runway ML
- Full access to motion effects, transitions, and enhancements
- Professional-grade output quality
- Pay-as-you-go pricing

**To Enable Real API Mode:**
1. Sign up for [Kling AI](https://app.klingai.com) or [Runway ML](https://dev.runwayml.com)
2. Get your API key
3. Go to Settings → API Keys in the app
4. Paste your key securely (encrypted, never exposed)
5. Start generating real videos!

---

## 🎥 Image-to-Video Workflow

### Step 1: Generate or Upload Image
- Use Text-to-Image to create a base image, OR
- Upload an existing image from your gallery

### Step 2: Describe the Scene
- Enter a scene description (up to 1000 characters)
- Example: "A camera slowly zooms through a mystical forest with glowing particles and ethereal lighting"

### Step 3: Configure Motion & Effects
- **Camera Motion**: Zoom, Pan, Dolly, Slow Motion
- **Motion Intensity**: 0-100% slider
- **Light Effects**: Beam Bursts, Glow, Fire, Smoke
- **Scene Transitions**: Fade, Flash, Glitch, Cinematic Cut
- **Export Quality**: HD (720p) or 4K (2160p)

### Step 4: Generate & Export
- Click "Generate Video"
- Video processes and stores automatically
- Download as MP4 or share directly

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22.13.0+
- pnpm 10.4.1+
- MySQL/TiDB database
- Manus account (for image generation)
- Optional: Kling AI or Runway ML API key (for real video generation)

### Local Development

```bash
# Clone the repository
git clone https://github.com/Yaka1971/visionforge-ai.git
cd visionforge-ai

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local

# Configure database
# Update DATABASE_URL in .env.local with your MySQL connection string

# Run development server
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/visionforge

# Manus OAuth
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# Manus Built-in Services
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_manus_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Encryption (for API key storage)
ENCRYPTION_SALT=your_secure_salt_key

# JWT
JWT_SECRET=your_jwt_secret_key
```

---

## 📦 Project Structure

```
visionforge-ai-web/
├── client/                    # React frontend
│   ├── src/
│   │   ├── pages/            # Page components (TextToImage, Gallery, etc.)
│   │   ├── components/       # Reusable UI components
│   │   ├── lib/              # tRPC client setup
│   │   ├── contexts/         # React contexts
│   │   └── App.tsx           # Main app router
│   └── public/               # Static assets
├── server/                    # Express backend
│   ├── routers/              # tRPC procedure definitions
│   │   ├── generation.ts     # Image/video generation APIs
│   │   └── settings.ts       # API key management
│   ├── services/             # Business logic
│   │   ├── aiService.ts      # LLM integration
│   │   ├── encryption.ts     # API key encryption
│   │   └── videoGeneration.ts # Video creation
│   ├── db.ts                 # Database queries
│   └── _core/                # Framework plumbing
├── drizzle/                  # Database schema & migrations
├── shared/                   # Shared types & constants
└── package.json
```

---

## 🔧 Building & Deployment

### Build for Production

```bash
# Build frontend and backend
pnpm build

# Start production server
pnpm start
```

### Deploy to Manus (Recommended)

VisionForge AI is optimized for Manus hosting:

1. Click "Publish" in the Manus Management UI
2. Get automatic HTTPS, CDN, and scaling
3. Custom domain support
4. Built-in monitoring and analytics

### Deploy to Other Platforms

The app can be deployed to any Node.js hosting:

- **Vercel**: `vercel deploy`
- **Railway**: `railway up`
- **Render**: Connect GitHub repo
- **Docker**: `docker build -t visionforge-ai .`

---

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test generation.test.ts
```

### Test Coverage
- ✅ Generation router (image/video creation)
- ✅ Settings router (API key management)
- ✅ Authentication (logout)
- ✅ Gallery operations (CRUD)
- ✅ Encryption/decryption

---

## 🎨 Tech Stack

**Frontend:**
- React 19
- Tailwind CSS 4
- Framer Motion (animations)
- tRPC (type-safe API)
- Wouter (routing)
- shadcn/ui (components)

**Backend:**
- Express 4
- tRPC 11
- Drizzle ORM
- MySQL/TiDB
- Node.js crypto (encryption)

**DevOps:**
- Vite (build tool)
- Vitest (testing)
- TypeScript
- pnpm (package manager)

---

## 🔐 Security

- **API Keys**: AES-256-GCM encrypted, never exposed to frontend
- **Authentication**: Manus OAuth with secure session cookies
- **Database**: Parameterized queries prevent SQL injection
- **HTTPS**: All traffic encrypted in transit
- **CORS**: Configured for secure cross-origin requests
- **Input Validation**: Zod schema validation on all inputs

---

## 📊 Features Checklist

- [x] Text-to-Image generation (7 styles, 4 aspect ratios)
- [x] AI prompt enhancement via LLM
- [x] Cinematic Mode prompt generation
- [x] Smart Prompt Builder with suggestions
- [x] Image-to-Video with motion controls
- [x] Video effects and transitions
- [x] Personal gallery with metadata
- [x] User authentication & profiles
- [x] API key management (BYOK)
- [x] File storage integration (S3)
- [x] Export support (PNG, JPG, MP4)
- [x] Responsive dark-themed UI
- [x] Toast notifications
- [x] Batch generation support

---

## 🚧 Roadmap

### Phase 2 (Upcoming)
- [ ] Real-time video generation progress tracking
- [ ] Prompt template library & community sharing
- [ ] Advanced video editing suite
- [ ] Batch processing queue system
- [ ] Watermark/branding system
- [ ] Social media direct upload (TikTok, YouTube, Instagram)

### Phase 3 (Future)
- [ ] Desktop app (Electron)
- [ ] Mobile app (React Native)
- [ ] Collaborative workspaces
- [ ] AI-powered style transfer
- [ ] Real-time collaboration
- [ ] Advanced analytics dashboard

---

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

---

## 💬 Support

- **Documentation**: [Full Technical Specs](./VISIONFORGE_AI_TECHNICAL_SPECS.md)
- **Issues**: [GitHub Issues](https://github.com/Yaka1971/visionforge-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Yaka1971/visionforge-ai/discussions)

---

## 🙏 Acknowledgments

Built with:
- Manus platform for OAuth, image generation, and LLM services
- Kling AI and Runway ML for video generation APIs
- React, Express, and TypeScript communities
- shadcn/ui for beautiful components

---

**Made with ❤️ by VisionForge Team**

*Transform your imagination into stunning 4K images and cinematic videos with AI.*
