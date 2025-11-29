# Hostinger Deployment Guide
## CheapCarInsurancePennsylvania.com Migration & Backup

**Author:** Manus AI  
**Last Updated:** November 29, 2025  
**Version:** 1.0

---

## Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Quick Start (Automated Deployment)](#quick-start-automated-deployment)
4. [Manual Deployment (Step-by-Step)](#manual-deployment-step-by-step)
5. [Database Migration](#database-migration)
6. [Configuration](#configuration)
7. [Troubleshooting](#troubleshooting)
8. [Maintenance & Updates](#maintenance--updates)

---

## Overview

This guide provides comprehensive instructions for deploying your auto-insurance lead generation website to Hostinger as a backup or primary hosting solution. The deployment package includes automated scripts to simplify the migration process while maintaining full functionality of your multi-step form, blog system, A/B testing, and CPA network integration.

### What's Included

The migration package contains the following components designed to streamline your deployment:

**Automated Scripts:**
- `deploy-hostinger.sh` - Complete deployment automation script
- `export-database.sh` - Database backup and export utility
- `import-to-hostinger.sh` - Server-side database import script (generated automatically)

**Configuration Templates:**
- `.env.production.example` - Production environment variables template
- `.env.hostinger.example` - SSH connection configuration template

**Application Files:**
- Complete source code (frontend and backend)
- Database schema and migrations
- All dependencies and build configurations

### Deployment Architecture

Your application will run on Hostinger using the following stack:

| Component | Technology | Hostinger Service |
|-----------|------------|-------------------|
| Runtime | Node.js 22.x | Node.js Hosting |
| Database | MySQL 8.0 | MySQL Database |
| Web Server | Express.js | Managed by Node.js |
| Process Manager | PM2 or systemd | Hostinger Process Management |
| SSL Certificate | Let's Encrypt | Automatic (via Hostinger) |

---

## Prerequisites

Before beginning the deployment process, ensure you have the following requirements in place:

### Hostinger Account Requirements

You need a Hostinger hosting plan that supports Node.js applications. The recommended plans are:

- **Business Hosting** (minimum recommended)
- **Premium Hosting** or higher
- **VPS Hosting** (for high-traffic scenarios)

**Note:** Shared hosting plans without Node.js support will not work for this application.

### Required Access & Credentials

Gather the following information from your Hostinger control panel (hPanel):

1. **SSH Access Credentials**
   - SSH hostname (e.g., `srv123.hostinger.com`)
   - SSH username (e.g., `u123456789`)
   - SSH password or private key

2. **MySQL Database Credentials**
   - Database name
   - Database username
   - Database password
   - Database host (usually `localhost`)

3. **Domain Configuration**
   - Domain name pointed to Hostinger nameservers
   - DNS records configured

### Local Development Tools

Install these tools on your local machine before running the deployment scripts:

- **SSH Client** - For secure server connection
- **SCP/SFTP Client** - For file transfer (included with SSH on Linux/Mac)
- **Node.js 18+** - For building the application locally
- **pnpm or npm** - Package manager for dependencies

---

## Quick Start (Automated Deployment)

The automated deployment script handles the entire process from build to deployment. This is the recommended approach for most users.

### Step 1: Download Your Website Code

From the Manus interface, navigate to the Code panel and click the "Download All Files" button. Extract the downloaded ZIP file to a local directory on your computer.

### Step 2: Configure SSH Connection

Create a file named `.env.hostinger` in your project root directory by copying the example template:

```bash
cp .env.hostinger.example .env.hostinger
```

Edit `.env.hostinger` and add your Hostinger SSH credentials:

```bash
HOSTINGER_SSH_HOST=srv123.hostinger.com
HOSTINGER_SSH_USER=u123456789
HOSTINGER_APP_PATH=/home/u123456789/domains/cheapcarinsurancepennsylvania.com/public_html
HOSTINGER_SSH_PORT=22
```

Replace the values with your actual Hostinger server details from hPanel.

### Step 3: Configure Production Environment

Create your production environment file:

```bash
cp .env.production.example .env.production
```

Edit `.env.production` with your production settings. At minimum, configure these critical variables:

```bash
# Database (get from Hostinger MySQL settings)
DATABASE_URL=mysql://u123456789_insurance:YourPassword@localhost:3306/u123456789_insurance

# Security (generate random 32+ character string)
JWT_SECRET=your-random-secret-key-minimum-32-characters

# Contact
CONTACT_EMAIL=david.domainmasterio@gmail.com

# CPA Network
CPA_REDIRECT_URL=https://tracking.maxbounty.com/aff_c?offer_id=YOUR_ID&aff_id=YOUR_ID

# Application
NODE_ENV=production
PORT=3000
```

**Important:** Generate a secure JWT_SECRET using this command:

```bash
openssl rand -base64 32
```

### Step 4: Run Automated Deployment

Execute the deployment script from your local machine:

```bash
./deploy-hostinger.sh
```

The script will automatically perform the following operations:

1. Build your application locally
2. Create a deployment package with all necessary files
3. Upload the package to your Hostinger server via SCP
4. Extract files on the server
5. Install production dependencies
6. Run database migrations
7. Restart the Node.js application

### Step 5: Verify Deployment

After the script completes successfully, verify your deployment by visiting your domain:

```
https://cheapcarinsurancepennsylvania.com
```

Check that all features are working:
- Multi-step quote form
- Blog listing and individual posts
- Contact form submission
- A/B testing variants
- CPA redirect after form completion

---

## Manual Deployment (Step-by-Step)

If you prefer manual control or the automated script encounters issues, follow these detailed steps for manual deployment.

### Phase 1: Prepare Application Locally

Begin by building your application on your local machine to ensure all assets are compiled correctly.

**Install Dependencies:**

```bash
cd /path/to/your/project
pnpm install
```

If you don't have pnpm installed, you can use npm instead:

```bash
npm install
```

**Build the Application:**

```bash
pnpm build
```

This command compiles your TypeScript code, bundles the frontend assets, and prepares the application for production deployment. The build output will be in the `dist/` directory for the backend and `client/dist/` for the frontend.

**Verify Build Success:**

Check that the following directories exist after building:

- `dist/` - Contains compiled server code
- `client/dist/` - Contains bundled frontend assets

### Phase 2: Create Deployment Package

Create a clean deployment package containing only the necessary files for production.

**Create Deployment Directory:**

```bash
mkdir deploy-package
```

**Copy Required Files:**

```bash
# Copy built application
cp -r dist deploy-package/
cp -r client/dist deploy-package/client-dist

# Copy source files needed at runtime
cp -r server deploy-package/
cp -r drizzle deploy-package/
cp -r shared deploy-package/

# Copy configuration files
cp package.json deploy-package/
cp pnpm-lock.yaml deploy-package/  # or package-lock.json
cp drizzle.config.ts deploy-package/

# Copy production environment
cp .env.production deploy-package/.env
```

**Create Archive:**

```bash
tar -czf deploy-package.tar.gz deploy-package/
```

### Phase 3: Upload to Hostinger

Transfer your deployment package to the Hostinger server using SCP (Secure Copy Protocol).

**Upload via SCP:**

```bash
scp deploy-package.tar.gz u123456789@srv123.hostinger.com:~/
```

Replace `u123456789` with your actual Hostinger username and `srv123.hostinger.com` with your server hostname.

**Alternative: Upload via FTP**

If you prefer using FTP, you can use FileZilla or any FTP client:

1. Connect to your Hostinger server using FTP credentials from hPanel
2. Navigate to your home directory
3. Upload `deploy-package.tar.gz`

### Phase 4: Extract and Configure on Server

Connect to your Hostinger server via SSH and set up the application.

**Connect via SSH:**

```bash
ssh u123456789@srv123.hostinger.com
```

**Navigate to Application Directory:**

```bash
cd /home/u123456789/domains/cheapcarinsurancepennsylvania.com/public_html
```

**Extract Deployment Package:**

```bash
tar -xzf ~/deploy-package.tar.gz
mv deploy-package/* .
mv deploy-package/.env .
rmdir deploy-package
```

**Install Production Dependencies:**

```bash
# If pnpm is available
pnpm install --prod

# Otherwise use npm
npm install --production
```

### Phase 5: Configure Database

Set up your MySQL database and import your data from the Manus-hosted version.

**Create Database via hPanel:**

1. Log in to Hostinger hPanel
2. Navigate to "Databases" → "MySQL Databases"
3. Click "Create New Database"
4. Database name: `u123456789_insurance` (Hostinger adds your username prefix automatically)
5. Create a database user with a strong password
6. Grant all privileges to the user on this database
7. Note down the credentials for your `.env` file

**Run Database Migrations:**

From your SSH session on the server:

```bash
pnpm db:push
```

This command uses Drizzle ORM to create all necessary tables based on your schema definition in `drizzle/schema.ts`.

**Import Existing Data (if applicable):**

If you exported data from your Manus database, upload the export files and import them:

```bash
# Upload your database export
scp database-export.tar.gz u123456789@srv123.hostinger.com:~/

# On the server
cd ~
tar -xzf database-export.tar.gz
cd database-export-*
./import-to-hostinger.sh
```

### Phase 6: Start the Application

Configure and start your Node.js application on Hostinger.

**Using PM2 (Recommended):**

PM2 is a production process manager for Node.js applications that provides automatic restarts, monitoring, and logging.

```bash
# Install PM2 globally (if not already installed)
npm install -g pm2

# Start your application
pm2 start dist/index.js --name "insurance-app"

# Save PM2 configuration
pm2 save

# Set PM2 to start on system boot
pm2 startup
```

**Using Hostinger's Node.js Manager:**

Alternatively, you can configure the application through Hostinger's control panel:

1. Go to hPanel → "Advanced" → "Node.js"
2. Click "Create Application"
3. Set Application Root: `/home/u123456789/domains/cheapcarinsurancepennsylvania.com/public_html`
4. Set Application Startup File: `dist/index.js`
5. Set Application Mode: Production
6. Click "Create"

### Phase 7: Configure Domain and SSL

Point your domain to the application and enable HTTPS.

**Domain Configuration:**

In hPanel, navigate to "Domains" and ensure your domain `cheapcarinsurancepennsylvania.com` is properly configured:

1. Verify DNS records point to Hostinger nameservers
2. Set document root to your application directory
3. Enable "Force HTTPS" option

**SSL Certificate:**

Hostinger provides free SSL certificates through Let's Encrypt:

1. Go to hPanel → "Security" → "SSL"
2. Select your domain
3. Click "Install SSL"
4. Wait for automatic installation (usually 5-15 minutes)

---

## Database Migration

Migrating your database from Manus to Hostinger requires exporting data from the source and importing it to the destination.

### Export from Manus

Use the provided export script to extract all data from your current Manus-hosted database.

**Run Export Script:**

From your local machine with the project code:

```bash
./export-database.sh
```

This script performs the following operations:

1. Connects to your Manus database using credentials from `.env`
2. Exports the database schema to `schema.sql`
3. Exports all table data to `data.sql`
4. Creates individual CSV files for each table
5. Generates an import script for Hostinger
6. Packages everything into a compressed archive

**Export Output:**

The script creates a timestamped directory (e.g., `database-export-20251129-143022/`) containing:

- `schema.sql` - Database structure
- `data.sql` - All table data
- `users.csv`, `leads.csv`, `blog_posts.csv`, etc. - Individual table exports
- `import-to-hostinger.sh` - Automated import script

### Import to Hostinger

Transfer the export package to your Hostinger server and run the import process.

**Upload Export Package:**

```bash
scp database-export-*.tar.gz u123456789@srv123.hostinger.com:~/
```

**Import Data:**

Connect to your Hostinger server via SSH and execute the import:

```bash
ssh u123456789@srv123.hostinger.com
cd ~
tar -xzf database-export-*.tar.gz
cd database-export-*
./import-to-hostinger.sh
```

The import script will prompt you for your Hostinger MySQL credentials and automatically import both the schema and data.

### Verify Data Integrity

After importing, verify that all data transferred correctly by checking record counts.

**Check via phpMyAdmin:**

1. Log in to hPanel
2. Navigate to "Databases" → "phpMyAdmin"
3. Select your database
4. Browse each table and verify data exists

**Check via Command Line:**

```bash
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "SELECT COUNT(*) FROM leads;"
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "SELECT COUNT(*) FROM blog_posts;"
mysql -u YOUR_DB_USER -p YOUR_DB_NAME -e "SELECT COUNT(*) FROM contact_messages;"
```

Compare these counts with your original Manus database to ensure all records were transferred.

---

## Configuration

Proper configuration is essential for your application to function correctly on Hostinger.

### Environment Variables

Your `.env` file contains all configuration settings. Here is a comprehensive breakdown of each variable:

#### Database Configuration

```bash
DATABASE_URL=mysql://username:password@host:port/database
```

**Format Breakdown:**
- `username` - Your Hostinger MySQL username (e.g., `u123456789_insurance`)
- `password` - Your MySQL password
- `host` - Database host, typically `localhost` for Hostinger
- `port` - MySQL port, usually `3306`
- `database` - Your database name

**Example:**
```bash
DATABASE_URL=mysql://u123456789_ins:MySecurePass123@localhost:3306/u123456789_insurance
```

#### Security Settings

```bash
JWT_SECRET=your-random-32-plus-character-secret-key
```

The JWT secret is used to sign authentication tokens. Generate a cryptographically secure random string:

```bash
openssl rand -base64 32
```

**Never reuse the same JWT_SECRET across different environments or applications.**

#### Application Settings

```bash
NODE_ENV=production
PORT=3000
VITE_APP_TITLE=Cheap Car Insurance Pennsylvania
VITE_APP_LOGO=/logo.png
```

These variables control basic application behavior:

- `NODE_ENV` - Set to `production` for optimized performance and security
- `PORT` - The port your application listens on (Hostinger typically uses 3000)
- `VITE_APP_TITLE` - Your website title for SEO and branding
- `VITE_APP_LOGO` - Path to your logo file

#### Contact & Notifications

```bash
CONTACT_EMAIL=david.domainmasterio@gmail.com
```

This email address receives notifications when visitors submit the contact form.

#### CPA Network Integration

```bash
CPA_REDIRECT_URL=https://tracking.maxbounty.com/aff_c?offer_id=12345&aff_id=67890
```

After visitors complete the quote form, they are automatically redirected to this URL. Replace with your actual CPA network tracking link from MaxBounty, FlexOffers, or your chosen network.

**Optional CPA Webhook Configuration:**

```bash
MAXBOUNTY_WEBHOOK_URL=https://api.maxbounty.com/webhook
MAXBOUNTY_API_KEY=your_api_key_here
FLEXOFFERS_WEBHOOK_URL=https://api.flexoffers.com/webhook
FLEXOFFERS_API_KEY=your_api_key_here
```

These allow server-to-server lead posting for higher-quality lead delivery.

### Hostinger-Specific Configuration

Some settings may need adjustment for Hostinger's environment.

#### Process Management

If using PM2, create an `ecosystem.config.js` file in your project root:

```javascript
module.exports = {
  apps: [{
    name: 'insurance-app',
    script: './dist/index.js',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/output.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    merge_logs: true
  }]
};
```

Start with this configuration:

```bash
pm2 start ecosystem.config.js
```

#### Reverse Proxy Configuration

Hostinger typically handles reverse proxy configuration automatically, but if you need custom settings, create an `.htaccess` file:

```apache
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://localhost:3000/$1 [P,L]
```

---

## Troubleshooting

Common issues and their solutions when deploying to Hostinger.

### Application Won't Start

**Symptom:** The Node.js application fails to start or crashes immediately.

**Diagnosis Steps:**

1. Check application logs:
   ```bash
   pm2 logs insurance-app
   ```

2. Verify Node.js version:
   ```bash
   node --version
   ```
   Ensure it's 18.x or higher.

3. Check for missing dependencies:
   ```bash
   npm list
   ```

**Common Solutions:**

- **Missing environment variables:** Verify `.env` file exists and contains all required variables
- **Database connection failed:** Check `DATABASE_URL` format and credentials
- **Port already in use:** Change `PORT` in `.env` to a different value (e.g., 3001)
- **Permission errors:** Ensure files have correct ownership:
  ```bash
  chown -R u123456789:u123456789 /home/u123456789/domains/cheapcarinsurancepennsylvania.com/public_html
  ```

### Database Connection Errors

**Symptom:** Application starts but shows database connection errors.

**Diagnosis:**

Test database connection manually:

```bash
mysql -u YOUR_DB_USER -p -h localhost YOUR_DB_NAME
```

**Common Solutions:**

- **Incorrect credentials:** Verify username, password, and database name in hPanel
- **Database doesn't exist:** Create the database in hPanel → MySQL Databases
- **User lacks privileges:** Grant all privileges to the user on the database
- **Wrong host:** Change `DATABASE_URL` host from `localhost` to `127.0.0.1` or vice versa

### Form Submissions Not Working

**Symptom:** Quote form or contact form submissions fail or don't save to database.

**Diagnosis:**

1. Check browser console for JavaScript errors
2. Check server logs for API errors:
   ```bash
   pm2 logs insurance-app --lines 100
   ```

**Common Solutions:**

- **CORS errors:** Ensure your domain is properly configured in Hostinger
- **Database write permissions:** Verify database user has INSERT privileges
- **Missing tables:** Run database migrations:
  ```bash
  pnpm db:push
  ```

### CPA Redirect Not Working

**Symptom:** After form submission, users are not redirected to CPA network.

**Diagnosis:**

Check if `CPA_REDIRECT_URL` is set in `.env`:

```bash
grep CPA_REDIRECT_URL .env
```

**Common Solutions:**

- **Missing environment variable:** Add `CPA_REDIRECT_URL` to `.env`
- **Invalid URL format:** Ensure the URL includes `https://` and is properly formatted
- **Restart required:** Restart the application after changing `.env`:
  ```bash
  pm2 restart insurance-app
  ```

### SSL Certificate Issues

**Symptom:** Website shows "Not Secure" or SSL errors.

**Common Solutions:**

- **Wait for propagation:** SSL installation can take up to 24 hours
- **Force HTTPS:** Enable "Force HTTPS" in hPanel → Domains
- **Clear browser cache:** Hard refresh (Ctrl+Shift+R) or clear browser cache
- **Reinstall SSL:** In hPanel → SSL, delete and reinstall the certificate

### High Memory Usage

**Symptom:** Application crashes with out-of-memory errors.

**Diagnosis:**

Check memory usage:

```bash
pm2 monit
```

**Common Solutions:**

- **Limit memory:** Configure PM2 with memory limits:
  ```bash
  pm2 start dist/index.js --name insurance-app --max-memory-restart 500M
  ```
- **Upgrade hosting plan:** Consider VPS hosting for more resources
- **Optimize queries:** Review database queries for efficiency

---

## Maintenance & Updates

Best practices for maintaining your Hostinger deployment over time.

### Regular Backups

Implement a backup strategy to protect your data and code.

**Automated Database Backups:**

Create a cron job to backup your database daily:

```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * mysqldump -u YOUR_DB_USER -pYOUR_PASSWORD YOUR_DB_NAME > ~/backups/db-$(date +\%Y\%m\%d).sql
```

**Code Backups:**

Periodically download your code from Hostinger:

```bash
# From your local machine
scp -r u123456789@srv123.hostinger.com:/home/u123456789/domains/cheapcarinsurancepennsylvania.com/public_html ./backup-$(date +%Y%m%d)
```

### Updating the Application

When you make changes to your code on Manus, deploy updates to Hostinger.

**Update Process:**

1. Download updated code from Manus
2. Build locally: `pnpm build`
3. Run deployment script: `./deploy-hostinger.sh`

The deployment script automatically creates a backup of the current deployment before updating.

**Manual Update:**

```bash
# On Hostinger server
cd /home/u123456789/domains/cheapcarinsurancepennsylvania.com/public_html

# Backup current version
cp -r . ../backup-$(date +%Y%m%d)

# Upload new files via SCP
# Extract and replace files
# Restart application
pm2 restart insurance-app
```

### Monitoring

Set up monitoring to detect issues before they impact users.

**PM2 Monitoring:**

```bash
# View real-time logs
pm2 logs insurance-app

# Monitor CPU and memory
pm2 monit

# View application status
pm2 status
```

**Log Rotation:**

Configure PM2 to rotate logs automatically:

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Performance Optimization

Optimize your Hostinger deployment for better performance.

**Enable Gzip Compression:**

Add to your `.htaccess`:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>
```

**Enable Browser Caching:**

```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

**Database Optimization:**

Regularly optimize your MySQL tables:

```bash
mysqlcheck -u YOUR_DB_USER -p --optimize YOUR_DB_NAME
```

---

## Support & Resources

If you encounter issues not covered in this guide, consult these resources:

**Hostinger Documentation:**
- [Node.js Hosting Guide](https://support.hostinger.com/en/articles/1583245-how-to-set-up-node-js)
- [MySQL Database Management](https://support.hostinger.com/en/articles/1583293-how-to-manage-mysql-databases)
- [SSH Access](https://support.hostinger.com/en/articles/1583227-how-to-use-ssh)

**Hostinger Support:**
- Live chat available 24/7 in hPanel
- Submit tickets for technical issues
- Community forum for peer support

**Application Support:**
- Review the main `DOCUMENTATION.md` file in your project
- Check Manus documentation at https://help.manus.im
- Contact david.domainmasterio@gmail.com for application-specific questions

---

## Conclusion

This guide has provided comprehensive instructions for deploying your auto-insurance lead generation website to Hostinger. Whether you choose the automated deployment script or manual process, you now have a complete backup solution independent of the Manus platform.

Remember to regularly backup your database, monitor application performance, and keep your dependencies updated for optimal security and performance. Your Hostinger deployment serves as a reliable fallback while maintaining all the features of your original Manus-hosted site.

For ongoing support and updates, refer to the resources section above and maintain regular communication with both Hostinger support and your development team.

---

**Document Version:** 1.0  
**Last Updated:** November 29, 2025  
**Prepared by:** Manus AI
