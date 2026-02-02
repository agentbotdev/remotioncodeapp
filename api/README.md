# Motion Graphics API - Railway Deployment

## Production API Server with Video Rendering

This is the backend API for motion graphics video generation. Deploy to Railway for full programmatic rendering capabilities.

## Quick Deploy to Railway

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/your-template-id)

### Manual Deploy Steps:

1. **Create Railway Project**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login
   railway login
   
   # Init project
   railway init
   ```

2. **Set Environment Variables**
   
   In Railway dashboard, add these variables:
   ```
   PORT=3000
   NODE_ENV=production
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```

3. **Deploy**
   ```bash
   railway up
   ```

4. **Get Your API URL**
   
   Railway will provide a URL like: `https://your-app.railway.app`
   
   Copy this URL and add it to your Vercel environment as `NEXT_PUBLIC_API_URL`

## Environment Variables

### Required:
- `PORT` - Server port (default: 3000)
- `NODE_ENV` - Environment (production/development)
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

### Optional:
- `OPENAI_API_KEY` - For AI-powered features
- `WEBHOOK_URL` - For completion notifications

## API Endpoints

### `GET /health`
Health check

### `GET /presets`
List all 21 presets

### `POST /generate`
Generate video
```json
{
  "preset": "focus",
  "outputName": "my-video"
}
```

### `GET /status/:jobId`
Check render status

### `GET /outputs`
List all generated videos

### `GET /download/:filename`
Download video

## Local Development

```bash
cd api
npm install
node server.js
```

Server will run on http://localhost:3000

## Performance

- First render: ~60s (includes bundling)
- Subsequent renders: ~15-30s
- Queue system: 1 video at a time
- Output: MP4 H.264, 1080x1920, 30fps
