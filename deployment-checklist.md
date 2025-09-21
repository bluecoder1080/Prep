# Render Deployment Checklist

## Pre-Deployment ✅

- [ ] Code is committed to GitHub repository
- [ ] All environment variables are documented
- [ ] Build scripts are created and tested
- [ ] Clerk authentication is set up
- [ ] Database connection strings are ready

## Render Setup ✅

- [ ] Render account created
- [ ] Repository connected to Render
- [ ] Blueprint deployed from render.yaml
- [ ] All services are created:
  - [ ] Backend API service
  - [ ] Frontend static site
  - [ ] Worker service
  - [ ] MongoDB database
  - [ ] Redis cache

## Environment Configuration ✅

### Backend Variables
- [ ] `NODE_ENV=production`
- [ ] `MONGO_URI` (from database)
- [ ] `REDIS_URL` (from Redis service)
- [ ] `JWT_SECRET` (generated)
- [ ] `JWT_REFRESH_SECRET` (generated)
- [ ] `CLERK_PUBLISHABLE_KEY`
- [ ] `CLERK_SECRET_KEY`

### Frontend Variables
- [ ] `VITE_API_URL` (backend service URL)
- [ ] `VITE_CLERK_PUBLISHABLE_KEY`

## Clerk Configuration ✅

- [ ] Frontend URL added to allowed origins
- [ ] Backend URL added to allowed origins
- [ ] Webhook endpoints configured (if any)
- [ ] Authentication settings verified

## Testing ✅

- [ ] All services show "Live" status
- [ ] Frontend loads without errors
- [ ] User registration works
- [ ] User login works
- [ ] API endpoints respond correctly
- [ ] Database connections are working
- [ ] Redis caching is functional

## Post-Deployment ✅

- [ ] Custom domain configured (optional)
- [ ] SSL certificate is active
- [ ] Monitoring and alerts set up
- [ ] Performance metrics reviewed
- [ ] Backup strategy implemented

## Troubleshooting Resources

- Service logs in Render dashboard
- Browser developer tools for frontend issues
- Database connection testing
- API endpoint testing with Postman/curl

## Quick Commands

```bash
# Test API endpoint
curl https://your-backend-app.onrender.com/api/health

# Check frontend
curl https://your-frontend-app.onrender.com

# View service logs
# (Available in Render dashboard)
```

## Emergency Contacts

- Render Support: support@render.com
- Clerk Support: support@clerk.com
- MongoDB Atlas Support: (if using Atlas)

---

**Deployment Date**: ___________
**Deployed By**: ___________
**Frontend URL**: ___________
**Backend URL**: ___________
