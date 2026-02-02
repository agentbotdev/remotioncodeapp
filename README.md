# 🎬 Motion Graphics Studio

Professional motion graphics video generation with 21 presets, powered by Remotion and AI.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/agentbotdev/remotioncodeapp)

---

## 🚀 Quick Start (3 Steps)

### Step 1: Deploy to Vercel (Frontend)

```bash
# Clone and push to your repo
git clone https://github.com/agentbotdev/remotioncodeapp.git
cd remotioncodeapp
git remote set-url origin YOUR_GITHUB_REPO_URL
git push

# Or use Vercel CLI
npm install -g vercel
vercel
```

**In Vercel Dashboard:**
- Add environment variable: `NEXT_PUBLIC_API_URL` (will update after Railway)

### Step 2: Deploy to Railway (API)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and init
railway login
railway init

# Deploy API folder
cd api
railway up
```

**In Railway Dashboard**, add environment variables:
```
PORT=3000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

**Get YOUR_RAILWAY_URL** from Railway dashboard (e.g., `https://your-app.railway.app`)

### Step 3: Connect Frontend to API

In **Vercel Dashboard**, update environment variable:
```
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

Redeploy Vercel app.

✅ **Done!** Your Motion Graphics Studio is live.

---

## 📦 What You Get

### 🎨 21 Professional Presets

**Motivational (4)**
- `focus` - "FOCUS ON WHAT MATTERS"
- `grind` - "THE GRIND NEVER STOPS"
- `execute` - "EXECUTION > IDEAS"
- `discipline` - "DISCIPLINE EQUALS FREEDOM"

**Visual Effects (7)**
- `gradient_power` - Purple gradient text
- `gradient_limitless` - Rainbow gradient
- `gradient_rise` - Pink-red gradient
- `neon_crypto` - Green cyberpunk neon
- `neon_electric` - Cyan neon
- `neon_future` - Magenta neon
- `glass_revenue` - Glassmorphism dashboard

**Data Visualization (2)**
- `chart_growth` - Animated growth chart
- `chart_moonshot` - Exponential growth

**Advanced Effects (8)**
- `particle_tech` - Particle network
- `particle_matrix` - Matrix-style particles
- `iso_premium` - 3D isometric card
- `iso_tech` - 3D tech showcase
- `bento_features` - Apple-style Bento Grid
- `parallax_depth` - Cinematic parallax
- And more...

### 🔧 Features

- ✅ **Live Preview** - Remotion Player for all presets
- ✅ **REST API** - Programmatic video generation
- ✅ **n8n Ready** - HTTP endpoints for automation
- ✅ **Queue System** - Handles concurrent requests
- ✅ **Cloud Storage** - Cloudinary integration
- ✅ **Fast Rendering** - 15-30 second average
- ✅ **High Quality** - 1080x1920, 30fps, H.264

---

## 🧪 Testing the API

### Generate a Video

```bash
curl -X POST https://your-railway-app.railway.app/generate \
  -H "Content-Type: application/json" \
  -d '{"preset":"focus","outputName":"test-video"}'
```

**Response:**
```json
{
  "jobId": "job-1234-abc",
  "status": "queued",
  "checkStatus": "/status/job-1234-abc"
}
```

### Check Status

```bash
curl https://your-railway-app.railway.app/status/job-1234-abc
```

**Response (completed):**
```json
{
  "status": "completed",
  "outputFile": "test-video.mp4",
  "downloadUrl": "/outputs/test-video.mp4",
  "fileSize": "0.28"
}
```

### Download Video

```bash
curl https://your-railway-app.railway.app/download/test-video.mp4 -O
```

---

## 🔌 n8n Integration

### Workflow Example

```
┌──────────────────────┐
│  HTTP Request        │
│  POST /generate      │
│  {"preset":"focus"}  │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│  Set Variable        │
│  jobId = response    │
└─────────┬────────────┘
          │
┌─────────▼────────────┐
│  Wait 35 seconds     │
└─────────┬────────────┘
          │
┌─────────▼────────────────┐
│  HTTP Request            │
│  GET /status/:jobId      │
└─────────┬────────────────┘
          │
┌─────────▼────────────────┐
│  HTTP Request            │
│  GET /download/:filename │
└──────────────────────────┘
```

### Node Configurations

**Node 1: Generate Video**
```json
{
  "method": "POST",
  "url": "https://your-railway-app.railway.app/generate",
  "bodyParameters": {
    "preset": "focus",
    "outputName": "my-video"
  }
}
```

**Node 2: Wait** - 35 seconds

**Node 3: Check Status**
```json
{
  "method": "GET",
  "url": "=https://your-railway-app.railway.app/status/{{ $('Generate Video').item.json.jobId }}"
}
```

**Node 4: Download**
```json
{
  "method": "GET",
  "url": "=https://your-railway-app.railway.app/download/{{ $('Check Status').item.json.outputFile }}",
  "responseFormat": "file"
}
```

---

## 📋 Environment Variables

### Vercel (.env)
```env
NEXT_PUBLIC_API_URL=https://your-railway-app.railway.app
```

### Railway (.env)
```env
# Server
PORT=3000
NODE_ENV=production

# Cloudinary (required)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Optional
OPENAI_API_KEY=sk-your-openai-api-key
WEBHOOK_URL=https://your-n8n-instance.com/webhook
```

### Get Cloudinary Credentials

1. Sign up at https://cloudinary.com (FREE tier available)
2. Go to Dashboard
3. Copy:
   - Cloud Name
   - API Key
   - API Secret

---

## 🏗️ Project Structure

```
remotioncodeapp/
├── app/                    # Next.js app (Vercel)
│   ├── page.tsx           # Homepage with preset gallery
│   ├── layout.tsx         # Root layout
│   └── globals.css        # Global styles
├── api/                    # Express API (Railway)
│   ├── server.js          # Main API server
│   └── README.md          # Railway deployment guide
├── remotion/
│   ├── compositions/      # All 12 compositions
│   │   ├── KineticTitle.jsx
│   │   ├── GradientText.jsx
│   │   ├── NeonGlowText.jsx
│   │   └── ...
│   └── presets.js         # 21 preset configurations
├── .env.example           # Environment template
├── vercel.json            # Vercel config
├── package.json
└── README.md
```

---

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | Server health check |
| `/presets` | GET | List all 21 presets |
| `/generate` | POST | Generate video |
| `/status/:jobId` | GET | Check render status |
| `/outputs` | GET | List generated videos |
| `/download/:filename` | GET | Download video |
| `/outputs/:filename` | GET | Stream video |

---

## 💰 Costs

| Service | Cost | What For |
|---------|------|----------|
| **Vercel** | FREE | Frontend hosting |
| **Railway** | ~$5-10/month | Video rendering API |
| **Cloudinary** | FREE (25 credits) | Video storage |

**Total:** ~$5-10/month for full production setup

---

## 🛠️ Local Development

### Frontend (Next.js)
```bash
npm install
npm run dev
# Open http://localhost:3000
```

### API (Express)
```bash
cd api
npm install
node server.js
# API on http://localhost:3000
```

---

## 📚 Documentation

- **Frontend**: Next.js 14 + Remotion Player
- **API**: Express + Remotion Renderer
- **Styling**: Tailwind CSS
- **Video**: Remotion 4.0 + Chrome Headless Shell
- **Storage**: Cloudinary
- **Deployment**: Vercel + Railway

---

## 🎯 Use Cases

- 🎥 Automated social media content
- 📊 Data visualization videos
- 🎨 Marketing materials
- 🚀 Product demos
- 📈 Analytics reports
- 💼 Business presentations

---

## 🤝 Contributing

PRs welcome! Please read CONTRIBUTING.md first.

---

## 📄 License

MIT License - see LICENSE file

---

## 🙏 Credits

Built with:
- [Remotion](https://remotion.dev) - Video rendering
- [Next.js](https://nextjs.org) - Frontend framework
- [Railway](https://railway.app) - API hosting
- [Vercel](https://vercel.com) - Frontend hosting
- [Cloudinary](https://cloudinary.com) - Video storage

---

## 💡 Support

- 📧 Email: support@yourdomain.com
- 💬 Discord: [Join our community](#)
- 🐛 Issues: [GitHub Issues](https://github.com/agentbotdev/remotioncodeapp/issues)

---

**Made with ❤️ by the Motion Graphics Team**
