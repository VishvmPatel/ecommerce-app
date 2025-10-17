# Deployment Guide - Fashion Forward E-commerce

This guide provides step-by-step instructions for deploying the Fashion Forward e-commerce application to production.

## 🚀 Deployment Options

### Option 1: Full Stack Deployment (Recommended)

#### Backend Deployment (Railway/Heroku)
1. **Prepare Backend**
   ```bash
   cd Backend
   npm install
   ```

2. **Environment Variables**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
   JWT_SECRET=your-production-jwt-secret
   FRONTEND_URL=https://your-frontend-domain.com
   PORT=5000
   NODE_ENV=production
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-production-email@gmail.com
   EMAIL_PASS=your-app-password
   
   # PayU Configuration
   PAYU_MERCHANT_KEY=your-production-payu-key
   PAYU_MERCHANT_SALT=your-production-payu-salt
   
   # AI Chatbot
   GEMINI_API_KEY=your-gemini-api-key
   ```

3. **Deploy to Railway**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   railway init
   railway up
   ```

4. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   npm install -g heroku
   
   # Create Heroku app
   heroku create your-app-name
   
   # Set environment variables
   heroku config:set MONGODB_URI=your-mongodb-uri
   heroku config:set JWT_SECRET=your-jwt-secret
   # ... set all other variables
   
   # Deploy
   git push heroku main
   ```

#### Frontend Deployment (Vercel/Netlify)
1. **Prepare Frontend**
   ```bash
   cd Frontend
   npm install
   npm run build
   ```

2. **Environment Variables**
   ```env
   VITE_API_URL=https://your-backend-domain.com/api
   VITE_PAYU_MERCHANT_KEY=your-production-payu-key
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel --prod
   ```

4. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod --dir=dist
   ```

### Option 2: VPS Deployment (DigitalOcean/AWS)

#### Server Setup
1. **Create VPS Instance**
   - Ubuntu 20.04 LTS
   - 2GB RAM minimum
   - 25GB SSD storage

2. **Install Dependencies**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   
   # Install Nginx
   sudo apt install nginx -y
   ```

3. **Deploy Application**
   ```bash
   # Clone repository
   git clone <your-repo-url>
   cd fashion-store
   
   # Install dependencies
   npm run install-all
   
   # Build frontend
   npm run build
   
   # Start backend with PM2
   cd Backend
   pm2 start server.js --name "fashion-store-api"
   
   # Configure Nginx
   sudo nano /etc/nginx/sites-available/fashion-store
   ```

4. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       # Frontend
       location / {
           root /path/to/fashion-store/Frontend/dist;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api {
           proxy_pass http://localhost:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. **Enable SSL with Let's Encrypt**
   ```bash
   # Install Certbot
   sudo apt install certbot python3-certbot-nginx -y
   
   # Get SSL certificate
   sudo certbot --nginx -d your-domain.com
   ```

## 🔧 Production Configuration

### MongoDB Atlas Setup
1. **Create Production Cluster**
   - Choose appropriate tier
   - Configure IP whitelist
   - Create database user

2. **Connection String**
   ```
   mongodb+srv://username:password@cluster.mongodb.net/ecommerce?retryWrites=true&w=majority
   ```

### Email Service Setup
1. **Gmail App Password**
   - Enable 2-factor authentication
   - Generate app password
   - Use app password in EMAIL_PASS

### Payment Gateway Setup
1. **PayU Production**
   - Switch to production environment
   - Update merchant key and salt
   - Test payment flow

### AI Chatbot Setup
1. **Google Gemini API**
   - Get production API key
   - Set appropriate rate limits
   - Monitor usage

## 📊 Monitoring & Maintenance

### Application Monitoring
1. **PM2 Monitoring**
   ```bash
   pm2 monit
   pm2 logs
   pm2 restart all
   ```

2. **Nginx Monitoring**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

### Database Monitoring
1. **MongoDB Atlas**
   - Monitor connection metrics
   - Set up alerts
   - Regular backups

### Performance Optimization
1. **Frontend Optimization**
   - Enable gzip compression
   - Optimize images
   - Use CDN for static assets

2. **Backend Optimization**
   - Enable compression middleware
   - Optimize database queries
   - Use Redis for caching (optional)

## 🔒 Security Checklist

### Server Security
- [ ] Update system packages
- [ ] Configure firewall (UFW)
- [ ] Disable root login
- [ ] Use SSH keys
- [ ] Enable fail2ban

### Application Security
- [ ] Use HTTPS everywhere
- [ ] Set secure JWT secrets
- [ ] Validate all inputs
- [ ] Rate limiting
- [ ] CORS configuration

### Database Security
- [ ] IP whitelist in MongoDB Atlas
- [ ] Strong database passwords
- [ ] Regular security updates
- [ ] Backup encryption

## 🚨 Troubleshooting

### Common Issues

1. **Build Failures**
   ```bash
   # Clear cache and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Database Connection Issues**
   - Check MongoDB Atlas IP whitelist
   - Verify connection string
   - Check network connectivity

3. **Payment Gateway Issues**
   - Verify merchant credentials
   - Check webhook URLs
   - Test with sandbox first

4. **Email Service Issues**
   - Verify Gmail app password
   - Check SMTP settings
   - Test email delivery

### Log Analysis
```bash
# Backend logs
pm2 logs fashion-store-api

# Nginx logs
sudo tail -f /var/log/nginx/error.log
sudo tail -f /var/log/nginx/access.log

# System logs
sudo journalctl -u nginx -f
```

## 📈 Scaling Considerations

### Horizontal Scaling
1. **Load Balancer**
   - Use Nginx or cloud load balancer
   - Distribute traffic across multiple instances

2. **Database Scaling**
   - MongoDB Atlas auto-scaling
   - Read replicas for read-heavy operations

3. **CDN Integration**
   - CloudFlare or AWS CloudFront
   - Cache static assets globally

### Vertical Scaling
1. **Server Resources**
   - Increase RAM and CPU
   - Optimize application performance

2. **Database Optimization**
   - Index optimization
   - Query optimization
   - Connection pooling

## 🔄 Backup Strategy

### Database Backups
1. **MongoDB Atlas**
   - Automated daily backups
   - Point-in-time recovery
   - Cross-region backups

### Application Backups
1. **Code Repository**
   - Git repository backup
   - Tagged releases
   - Branch protection

2. **File Uploads**
   - Regular backup of uploads directory
   - Cloud storage integration

## 📞 Support & Maintenance

### Regular Maintenance
- [ ] Weekly security updates
- [ ] Monthly performance reviews
- [ ] Quarterly backup testing
- [ ] Annual security audits

### Monitoring Tools
- [ ] Application performance monitoring
- [ ] Error tracking (Sentry)
- [ ] Uptime monitoring
- [ ] Database performance monitoring

---

**Deployment completed successfully! 🎉**

For additional support, refer to the main README.md or contact the development team.
