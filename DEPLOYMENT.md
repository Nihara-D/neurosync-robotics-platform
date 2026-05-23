# NeuroSync Deployment Guide

This guide provides instructions for deploying the NeuroSync robotics platform to production.

## Prerequisites

- Node.js 18+ and pnpm
- A Vercel account
- GitHub repository connected
- (Optional) ROS2 system for robot integration

## Quick Start

### 1. Local Testing

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Open http://localhost:3000
```

### 2. Deploy to Vercel

#### Option A: GitHub Integration (Recommended)

```bash
# Push code to GitHub
git push origin main

# Visit Vercel.com and import the repository
# Vercel will automatically:
# - Install dependencies
# - Build the project
# - Deploy to production

# Production URL: https://your-app.vercel.app
```

#### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from command line
vercel

# Follow the prompts to configure deployment
```

## Environment Variables

Set these in Vercel Settings → Environment Variables:

```env
# Optional: ROS2 Bridge Configuration
NEXT_PUBLIC_ROS2_BRIDGE_URL=ws://your-ros2-server:9090
ROS2_NAMESPACE=/robot
ROS_DOMAIN_ID=0

# Optional: Analytics and Monitoring
NEXT_PUBLIC_ANALYTICS_ID=your-analytics-id
SENTRY_DSN=your-sentry-dsn
```

## Production Configuration

### 1. Build Optimization

The project uses Next.js with optimizations:
- Image optimization with next/image
- Automatic code splitting
- CSS minification
- JavaScript compression

No additional configuration needed — Vercel handles this automatically.

### 2. Performance

Key metrics to monitor:
- **Largest Contentful Paint (LCP)**: < 2.5s
- **Cumulative Layout Shift (CLS)**: < 0.1
- **First Input Delay (FID)**: < 100ms

View metrics in Vercel Analytics dashboard.

### 3. API Routes

All API endpoints are serverless functions:
- `/api/robots/[robotId]/command` - Execute commands
- `/api/robots/[robotId]/motions` - Predefined motions
- `/api/ros/websocket` - WebSocket bridge (requires custom server)

### 4. Database & Storage

Currently the app uses in-memory simulated data. For production:

#### Option A: Supabase
```bash
# Install Supabase
npm install @supabase/supabase-js

# Add environment variables
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_SERVICE_ROLE_KEY=your-key
```

#### Option B: Vercel Blob
```bash
# Install Blob SDK
npm install @vercel/blob

# Blob tokens are automatically available in Vercel
```

#### Option C: AWS DynamoDB
```bash
# For robot telemetry and command history
npm install @aws-sdk/client-dynamodb

# Add credentials
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
```

## Custom Server for WebSocket

To enable real-time WebSocket support for the ROS2 bridge, deploy with a custom server:

### Using Node.js with WebSocket

```bash
# Install WebSocket library
pnpm add ws

# Create custom server
# See example in server.js

# Deploy with custom server on Vercel
vercel --build-env NODE_ENV=production
```

## Monitoring & Logging

### 1. Error Tracking

```bash
# Optional: Sentry for error monitoring
npm install @sentry/nextjs

# Configure in next.config.mjs
```

### 2. Logs

- **Build logs**: Visible in Vercel deployment console
- **Runtime logs**: Use Vercel Functions logs dashboard
- **Client errors**: Browser console, Sentry dashboard

### 3. Metrics

Monitor via:
- Vercel Analytics (performance metrics)
- Google Analytics (user behavior)
- Custom dashboard (ROS2 telemetry)

## Security

### 1. Authentication

Currently no auth is implemented. For production, add:

```bash
pnpm add next-auth @auth/core

# Or use Supabase Auth
```

### 2. API Protection

Add rate limiting and validation:

```bash
npm install @vercel/ratelimit

# Protect sensitive endpoints
```

### 3. CORS

API endpoints restrict cross-origin requests. Configure in middleware:

```typescript
// app/api/middleware.ts
export const config = {
  matcher: '/api/:path*',
};
```

## Scaling

### Horizontal Scaling

Vercel automatically scales based on traffic:
- Cold start: ~100ms
- Concurrent connections: Unlimited
- Request timeout: 60 seconds (Pro), 30s (Free)

### Vertical Scaling

For higher performance:
- Upgrade Vercel Pro plan
- Add Edge middleware for routing optimization
- Use ISR (Incremental Static Regeneration) for cacheable pages

## Rollback

If deployment fails:

```bash
# View deployment history
vercel list

# Rollback to previous version
vercel rollback

# Or redeploy specific commit
git push origin main
```

## CI/CD Pipeline

Vercel automatically:
1. Runs Next.js build
2. Tests TypeScript compilation
3. Generates edge functions if needed
4. Deploys to CDN globally
5. Performs health checks

Custom checks can be added via:
- GitHub Actions
- Vercel Deploy Hooks
- Pre-deployment scripts

## Domain Setup

1. Go to Vercel → Project Settings → Domains
2. Add custom domain
3. Update DNS records (CNAME or A record)
4. Enable automatic SSL/TLS

## Maintenance

### Regular Tasks

- **Weekly**: Monitor error rates and performance
- **Monthly**: Review analytics and user feedback
- **Quarterly**: Update dependencies

```bash
# Check for updates
pnpm outdated

# Update dependencies safely
pnpm update
```

### Backups

- GitHub repository serves as source control backup
- Production logs retained for 30 days on Vercel
- Database backups (if using Supabase): Automatic daily

## Troubleshooting

### Build Fails

```bash
# Clear build cache
vercel build --no-cache

# Check logs
vercel logs
```

### Slow Performance

1. Check Vercel Analytics
2. Profile with Chrome DevTools
3. Review API response times
4. Consider caching strategies

### WebSocket Not Working

1. Verify ROS2 bridge is running
2. Check firewall/network settings
3. Review browser console for errors
4. Use HTTP API as fallback

## Support & Resources

- **Documentation**: https://vercel.com/docs
- **Deployment Issues**: https://vercel.com/help
- **ROS2 Bridge**: See ROS2_INTEGRATION.md
- **GitHub Issues**: Report bugs and feature requests

## Example Production Stack

```
┌─────────────────────────────────────────┐
│         NeuroSync (Next.js)             │
│     Running on Vercel Edge Network      │
└─────────────────────────────────────────┘
        ↓                    ↓
    API Routes         WebSocket Bridge
    (Serverless)       (Custom Server)
        ↓                    ↓
   Database          ROS2 System
   (Supabase)        (On-premise)
```

## Next Steps

1. Deploy to Vercel
2. Set up custom domain
3. Configure authentication
4. Integrate with ROS2 bridge
5. Set up monitoring
6. Launch publicly

---

For questions or issues, check the documentation or open an issue on GitHub.
