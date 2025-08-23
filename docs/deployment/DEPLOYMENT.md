# Deployment Guide

This guide explains how to deploy Link Hub to various environments.

## Prerequisites

- Docker and Docker Compose
- Node.js 16+ and npm 8+
- A PostgreSQL database (local or managed service)
- A domain name (for production)
- SSL certificate (for HTTPS in production)

## Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# App
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL="postgresql://user:password@host:5432/dbname"

# Authentication
NEXTAUTH_SECRET=your-secret-here
NEXTAUTH_URL=https://your-domain.com

# Optional: Email service
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
EMAIL_FROM=noreply@yourdomain.com
```

## Local Development

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Production Deployment with Docker

1. Build the Docker image:
   ```bash
   docker build -t link-hub .
   ```

2. Run the container:
   ```bash
   docker run -d \
     --name link-hub \
     -p 3000:3000 \
     --env-file .env \
     link-hub
   ```

## Deployment to Vercel

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   vercel --prod
   ```

## Environment Variables in Production

### Vercel
Add environment variables in the Vercel dashboard under Project Settings > Environment Variables.

### Other Platforms
Set environment variables according to your hosting provider's documentation.

## Database Backups

Set up automated backups for your production database. For PostgreSQL, you can use:

```bash
# Example backup command
pg_dump -U username -d dbname -f backup-$(date +%Y%m%d).sql

# Schedule with cron (daily at 2 AM)
0 2 * * * pg_dump -U username -d dbname -f /path/to/backups/backup-$(date +\%Y\%m\%d).sql
```

## Monitoring

Set up monitoring for your application:

1. **Error Tracking**: Consider using Sentry or similar service
2. **Logging**: Use a log management service like LogDNA or Papertrail
3. **Performance Monitoring**: Use tools like New Relic or Datadog

## Scaling

For high-traffic deployments:

1. **Database**: Consider using a managed database service
2. **Caching**: Implement Redis for session storage and caching
3. **CDN**: Use a CDN for static assets
4. **Load Balancing**: Set up load balancing for high availability

## Maintenance

### Database Migrations
Run migrations before deploying new versions:

```bash
npx prisma migrate deploy
```

### Updates
Regularly update dependencies:

```bash
# Check for outdated packages
npm outdated

# Update packages
npm update
```

## Troubleshooting

### Common Issues

1. **Database Connection Issues**
   - Verify DATABASE_URL is correct
   - Check if the database is running and accessible

2. **Authentication Problems**
   - Ensure NEXTAUTH_SECRET is set and consistent across deployments
   - Verify NEXTAUTH_URL matches your deployment URL

3. **Build Failures**
   - Check Node.js version compatibility
   - Verify all environment variables are set

For additional help, please refer to our [Troubleshooting Guide](./TROUBLESHOOTING.md).
