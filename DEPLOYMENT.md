# 🚀 DEPLOYMENT GUIDE - Step by Step

This guide will walk you through deploying the Motion Graphics Studio to production in about **15 minutes**.

---

## 📋 Prerequisites

- GitHub account
- Vercel account (free): https://vercel.com
- Railway account (free trial): https://railway.app
- Cloudinary account (free): https://cloudinary.com

---

## 🎯 PART 1: Cloudinary Setup (2 minutes)

### 1. Create Cloudinary Account

1. Go to https://cloudinary.com
2. Click "Sign Up" → Choose FREE plan
3. Verify your email

### 2. Get Your Credentials

1. Go to https://cloudinary.com/console
2. Copy these 3 values:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcd1234...`)

**Save these!** You'll need them for Railway.

---

## 🎯 PART 2: Push to GitHub (3 minutes)

```bash
cd remotioncodeapp

# Initialize git
git init
git add .
git commit -m "Initial commit - Motion Graphics Studio"

# Push to YOUR GitHub repo
git remote add origin https://github.com/agentbotdev/remotioncodeapp.git
git branch -M main
git push -u origin main
```

---

## 🎯 PART 3: Deploy API to Railway (5 minutes)

### 1. Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose `remotioncodeapp`
5. Railway will detect and deploy

### 2. Configure Root Directory

1. In Railway dashboard → Settings
2. **Root Directory:** `api`
3. **Start Command:** `node server.js`

### 3. Add Environment Variables

In Railway dashboard → Variables, add:

```env
PORT=3000
NODE_ENV=production
CLOUDINARY_CLOUD_NAME=dxyz123abc
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=abcd1234...
```

(Use YOUR values from Cloudinary step)

### 4. Get Your Railway URL

1. In Railway dashboard → Settings
2. Click "Generate Domain"
3. Copy the URL: `https://your-app.railway.app`

**Save this URL!** You need it for Vercel.

---

## 🎯 PART 4: Deploy Frontend to Vercel (3 minutes)

### 1. Deploy to Vercel

1. Go to https://vercel.com
2. Click "Import Project"
3. Select your GitHub repo: `remotioncodeapp`
4. Click "Deploy"

### 2. Add Environment Variable

In Vercel dashboard → Settings → Environment Variables:

```env
NEXT_PUBLIC_API_URL=https://your-app.railway.app
```

(Use YOUR Railway URL from previous step)

### 3. Redeploy

1. Go to Deployments tab
2. Click "..." → "Redeploy"
3. Wait ~2 minutes

---

## ✅ PART 5: Verify Everything Works (2 minutes)

### 1. Test Frontend

Visit your Vercel URL: `https://your-app.vercel.app`

You should see:
- ✅ Homepage with 21 presets
- ✅ Beautiful UI
- ✅ Preset cards

### 2. Test API

```bash
# Test health endpoint
curl https://your-app.railway.app/health

# Generate a test video
curl -X POST https://your-app.railway.app/generate \
  -H "Content-Type: application/json" \
  -d '{"preset":"focus","outputName":"test"}'
```

You should get a `jobId` in response.

### 3. Check Status

Wait 30 seconds, then:

```bash
curl https://your-app.railway.app/status/YOUR_JOB_ID
```

Should show `"status": "completed"`

---

## 🎉 YOU'RE DONE!

Your Motion Graphics Studio is now live:

- **Frontend**: `https://your-app.vercel.app`
- **API**: `https://your-app.railway.app`

---

## 🔧 Configure n8n Integration

### n8n Workflow Setup

1. Create new workflow in n8n
2. Add HTTP Request node:

```json
{
  "method": "POST",
  "url": "https://your-app.railway.app/generate",
  "bodyParameters": {
    "preset": "focus",
    "outputName": "{{$json.videoName}}"
  }
}
```

3. Add Wait node: 35 seconds

4. Add HTTP Request node (Check Status):

```json
{
  "method": "GET",
  "url": "=https://your-app.railway.app/status/{{$('HTTP Request').item.json.jobId}}"
}
```

5. Add HTTP Request node (Download):

```json
{
  "method": "GET",
  "url": "=https://your-app.railway.app/download/{{$('HTTP Request1').item.json.outputFile}}",
  "responseFormat": "file"
}
```

---

## 📊 Monitoring & Logs

### Railway Logs

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login
railway login

# View logs
railway logs
```

### Vercel Logs

1. Go to Vercel dashboard
2. Click on your project
3. Go to "Logs" tab

---

## 🐛 Troubleshooting

### API Not Responding

**Check Railway logs:**
```bash
railway logs
```

**Common issues:**
- Missing environment variables
- Cloudinary credentials incorrect
- Port binding issue

**Fix:** Double-check all environment variables in Railway dashboard

### Frontend Can't Connect to API

**Check:**
1. `NEXT_PUBLIC_API_URL` in Vercel is correct
2. Railway app is running (check Railway dashboard)
3. CORS is enabled (already configured in server.js)

**Fix:** Update `NEXT_PUBLIC_API_URL` and redeploy Vercel

### Videos Not Saving

**Check:**
- Cloud inary credentials are correct
- Cloudinary free tier hasn't exceeded limit (25 credits/month)

**Fix:** Verify credentials or upgrade Cloudinary plan

---

## 📈 Scaling & Optimization

### For Higher Traffic

1. **Railway**: Upgrade to Pro ($5/month)
   - More memory (8GB)
   - Faster CPUs
   - Better uptime

2. **Cloudinary**: Upgrade plan
   - More storage credits
   - Higher bandwidth

3. **Add Redis Queue** (Advanced)
   - Better job management
   - Distributed processing

### Performance Tips

- **Bundle caching**: Already optimized
- **Concurrent renders**: Currently 1 at a time (safe)
- **Video quality**: Adjust `VIDEO_CRF` in env (18 = high quality)

---

## 💵 Monthly Costs

| Service | Free Tier | Pro Cost |
|---------|-----------|----------|
| **Vercel** | ✅ Unlimited | $20/month (not needed for this) |
| **Railway** | 500 hours/month | $5-10/month |
| **Cloudinary** | 25 credits/month | $89/month (for heavy use) |

**Estimated Total:** $5-10/month for moderate use

---

## 🎓 Next Steps

### Add Custom Domain

**Vercel:**
1. Settings → Domains
2. Add your domain
3. Update DNS records

**Railway:**
1. Settings → Domains
2. Add custom domain
3. Update CNAME record

### Add Analytics

- Vercel Analytics (built-in)
- Google Analytics
- PostHog

### Add Authentication

- NextAuth.js
- Clerk
- Supabase Auth

---

## 📞 Need Help?

- **Documentation**: See README.md
- **Issues**: https://github.com/agentbotdev/remotioncodeapp/issues
- **Discord**: Join our community

---

**Congratulations! You've successfully deployed a production-ready Motion Graphics Studio! 🎉**
