# VisionForge AI - Complete Setup Guide

This guide covers everything you need to set up VisionForge AI locally or in production.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Database Setup](#database-setup)
4. [Manus Configuration](#manus-configuration)
5. [API Key Management](#api-key-management)
6. [Running the Application](#running-the-application)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Software

- **Node.js**: v22.13.0 or higher
  - Download: https://nodejs.org/
  - Verify: `node --version`

- **pnpm**: v10.4.1 or higher
  - Install: `npm install -g pnpm`
  - Verify: `pnpm --version`

- **MySQL/TiDB**: v5.7 or higher
  - Download: https://www.mysql.com/downloads/
  - Or use TiDB Cloud: https://tidbcloud.com/

- **Git**: v2.0 or higher
  - Download: https://git-scm.com/

### Recommended Tools

- **VS Code**: https://code.visualstudio.com/
- **Postman**: For API testing
- **MySQL Workbench**: For database management
- **Docker**: For containerized setup

---

## Local Development Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/Yaka1971/visionforge-ai.git
cd visionforge-ai
git checkout sandbox  # Use sandbox branch for latest development
```

### Step 2: Install Dependencies

```bash
pnpm install
```

This installs all required packages for both frontend and backend.

### Step 3: Create Environment File

Create a `.env.local` file in the project root:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration (see [Manus Configuration](#manus-configuration) below).

### Step 4: Verify Installation

```bash
# Check Node version
node --version  # Should be v22.13.0+

# Check pnpm version
pnpm --version  # Should be v10.4.1+

# Check dependencies
pnpm list
```

---

## Database Setup

### Option A: Local MySQL

#### Install MySQL

**macOS (Homebrew):**
```bash
brew install mysql
brew services start mysql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install mysql-server
sudo systemctl start mysql
```

**Windows:**
- Download from https://dev.mysql.com/downloads/mysql/
- Run installer and follow setup wizard

#### Create Database

```bash
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE visionforge;
CREATE USER 'visionforge'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON visionforge.* TO 'visionforge'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

#### Update .env.local

```env
DATABASE_URL=mysql://visionforge:your_password@localhost:3306/visionforge
```

### Option B: TiDB Cloud

1. Go to https://tidbcloud.com/
2. Create a new cluster
3. Get connection string
4. Update .env.local:

```env
DATABASE_URL=mysql://user:password@host:port/visionforge
```

### Option C: Docker

```bash
docker run --name visionforge-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=visionforge \
  -e MYSQL_USER=visionforge \
  -e MYSQL_PASSWORD=your_password \
  -p 3306:3306 \
  -d mysql:8.0
```

Update .env.local:
```env
DATABASE_URL=mysql://visionforge:your_password@localhost:3306/visionforge
```

### Run Migrations

```bash
# Generate migration files
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate
```

---

## Manus Configuration

### Step 1: Create Manus Account

1. Go to https://manus.im
2. Sign up for a free account
3. Verify your email

### Step 2: Create OAuth Application

1. Log in to Manus Dashboard
2. Go to Developer Settings
3. Create new OAuth application
4. Set redirect URI: `http://localhost:3000/api/oauth/callback`
5. Copy `APP_ID` and `APP_SECRET`

### Step 3: Get API Keys

1. In Manus Dashboard, go to API Keys
2. Generate new API key
3. Copy the key

### Step 4: Update .env.local

```env
# OAuth
VITE_APP_ID=your_app_id_from_manus
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im

# API Keys
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# JWT Secret (generate random string)
JWT_SECRET=your_random_jwt_secret_key_here

# Encryption Salt (generate random string)
ENCRYPTION_SALT=your_random_encryption_salt_here

# Owner Info
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_manus_open_id
```

---

## API Key Management

### For Image Generation (Built-in)

No additional setup needed! Manus provides built-in image generation.

### For Video Generation (Optional)

#### Option A: Kling AI

1. Go to https://app.klingai.com
2. Sign up for account
3. Add payment method
4. Go to API section
5. Create API key
6. In app Settings → API Keys, paste your Kling AI key

#### Option B: Runway ML

1. Go to https://dev.runwayml.com
2. Sign up for account
3. Add payment method
4. Go to API Keys section
5. Create new API key
6. In app Settings → API Keys, paste your Runway ML key

**Note:** Keys are encrypted and stored securely. Never share your keys!

---

## Running the Application

### Development Mode

```bash
# Start dev server (includes hot reload)
pnpm dev

# Open browser
# Navigate to http://localhost:3000
```

### Production Mode

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run specific test file
pnpm test generation.test.ts

# Watch mode (re-run on file changes)
pnpm test --watch
```

### Type Checking

```bash
# Check for TypeScript errors
pnpm check
```

---

## Production Deployment

### Option A: Manus Platform (Recommended)

1. Ensure all tests pass: `pnpm test`
2. In Manus Management UI, click "Publish"
3. Your app is live at `your-domain.manus.space`
4. Custom domain support available

### Option B: Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

### Option C: Render

1. Push code to GitHub
2. Go to https://render.com
3. Create new Web Service
4. Connect GitHub repo
5. Set environment variables
6. Deploy

### Option D: Docker

```bash
# Build image
docker build -t visionforge-ai .

# Run container
docker run -p 3000:3000 \
  -e DATABASE_URL=your_db_url \
  -e VITE_APP_ID=your_app_id \
  visionforge-ai
```

### Environment Variables for Production

Set these in your hosting platform:

```
DATABASE_URL=your_production_db_url
VITE_APP_ID=your_manus_app_id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://oauth.manus.im
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your_api_key
VITE_FRONTEND_FORGE_API_KEY=your_frontend_key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
JWT_SECRET=your_production_jwt_secret
ENCRYPTION_SALT=your_production_encryption_salt
OWNER_NAME=Your Name
OWNER_OPEN_ID=your_open_id
NODE_ENV=production
```

---

## Troubleshooting

### Database Connection Failed

**Error:** `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solution:**
```bash
# Check if MySQL is running
mysql -u root -p

# If not running, start it:
# macOS: brew services start mysql
# Ubuntu: sudo systemctl start mysql
# Windows: net start MySQL80
```

### Port 3000 Already in Use

**Error:** `Error: listen EADDRINUSE :::3000`

**Solution:**
```bash
# Find process using port 3000
lsof -i :3000

# Kill the process
kill -9 <PID>

# Or use different port
PORT=3001 pnpm dev
```

### Module Not Found

**Error:** `Cannot find module '@/components/ui/button'`

**Solution:**
```bash
# Reinstall dependencies
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript Errors

**Error:** `Type 'X' is not assignable to type 'Y'`

**Solution:**
```bash
# Check types
pnpm check

# Fix types in your code or update tsconfig.json
```

### OAuth Redirect URI Mismatch

**Error:** `Redirect URI mismatch`

**Solution:**
1. In Manus Dashboard, update redirect URI
2. For local dev: `http://localhost:3000/api/oauth/callback`
3. For production: `https://your-domain.com/api/oauth/callback`

### API Key Not Working

**Error:** `401 Unauthorized` when generating images

**Solution:**
1. Verify API key in Settings page
2. Check if API key has sufficient credits
3. For Kling AI: Ensure account has video generation credits
4. For Runway ML: Check API key is active

### Build Fails

**Error:** `Build failed with errors`

**Solution:**
```bash
# Clear build cache
rm -rf dist .next

# Check for TypeScript errors
pnpm check

# Rebuild
pnpm build
```

---

## Next Steps

1. ✅ Complete setup
2. 📖 Read [README.md](./README.md) for feature overview
3. 🔧 Check [CONTRIBUTING.md](./CONTRIBUTING.md) for development guidelines
4. 🚀 Start creating!

---

## Getting Help

- **Documentation**: See [TECHNICAL_SPECS.md](./VISIONFORGE_AI_TECHNICAL_SPECS.md)
- **Issues**: https://github.com/Yaka1971/visionforge-ai/issues
- **Discussions**: https://github.com/Yaka1971/visionforge-ai/discussions

---

**Happy creating with VisionForge AI! 🎬**
