# WordPress Installation Guide
## Cheap Car Insurance Pennsylvania - Custom Theme

**Version:** 1.0  
**Author:** Manus AI  
**Last Updated:** November 29, 2025

---

## Table of Contents

1. [Introduction](#introduction)
2. [Prerequisites](#prerequisites)
3. [Step 1: Install WordPress on Hostinger](#step-1-install-wordpress-on-hostinger)
4. [Step 2: Upload Theme Files](#step-2-upload-theme-files)
5. [Step 3: Configure Database](#step-3-configure-database)
6. [Step 4: Configure Theme Settings](#step-4-configure-theme-settings)
7. [Step 5: Create Pages](#step-5-create-pages)
8. [Step 6: Configure CPA Redirect](#step-6-configure-cpa-redirect)
9. [Step 7: Test Everything](#step-7-test-everything)
10. [Troubleshooting](#troubleshooting)
11. [Maintenance & Updates](#maintenance--updates)

---

## Introduction

This guide provides complete instructions for installing the **Cheap Car Insurance Pennsylvania** custom WordPress theme on your Hostinger Premium hosting account. The theme includes a multi-step quote form, blog system, contact functionality, and CPA network integration.

**What You'll Get:**
- Professional landing page with multi-step quote form
- Blog system for SEO content
- Contact page with email notifications
- Privacy Policy and Terms of Service pages
- CPA redirect integration
- Mobile-responsive design
- phpMyAdmin database access

**Estimated Installation Time:** 30-45 minutes

---

## Prerequisites

Before you begin, ensure you have:

### Hosting Requirements
- **Hostinger Premium Plan** (or higher)
- **PHP Version:** 7.4 or higher
- **MySQL Version:** 5.7 or higher
- **Disk Space:** At least 500 MB available
- **Memory Limit:** 128 MB or higher

### Access Credentials
- Hostinger hPanel login credentials
- FTP credentials (available in hPanel)
- phpMyAdmin access (available in hPanel)

### Files Needed
- WordPress theme folder (`cheap-car-insurance-pa`)
- Database SQL file (`database-schema.sql`)
- This installation guide

---

## Step 1: Install WordPress on Hostinger

### 1.1 Access Hostinger hPanel

Log in to your Hostinger account and access the hPanel dashboard.

### 1.2 Install WordPress

Navigate to **Website → Auto Installer → WordPress** and follow these steps:

**Installation Settings:**
- **Website URL:** Choose your domain (e.g., cheapcarinsurancepennsylvania.com)
- **Admin Username:** Choose a secure username (avoid "admin")
- **Admin Password:** Create a strong password (save this securely)
- **Admin Email:** Enter your email address (david.domainmasterio@gmail.com)
- **Website Title:** Cheap Car Insurance Pennsylvania
- **Website Tagline:** Save Money on Auto Insurance

Click **Install** and wait for the process to complete (usually 2-3 minutes).

### 1.3 Verify Installation

Once installation is complete, you should receive:
- WordPress admin URL (e.g., `https://cheapcarinsurancepennsylvania.com/wp-admin`)
- Login credentials confirmation

Visit your WordPress admin panel and log in to verify the installation was successful.

---

## Step 2: Upload Theme Files

### 2.1 Access File Manager

In Hostinger hPanel, navigate to **Files → File Manager**.

### 2.2 Navigate to Themes Directory

Browse to: `public_html/wp-content/themes/`

### 2.3 Upload Theme Folder

**Option A: Using File Manager (Recommended)**

1. Click **Upload Files** button
2. Select the `cheap-car-insurance-pa` folder (or ZIP file)
3. If you uploaded a ZIP file, right-click and select **Extract**
4. Verify the folder structure:
   ```
   wp-content/themes/cheap-car-insurance-pa/
   ├── style.css
   ├── functions.php
   ├── header.php
   ├── footer.php
   ├── front-page.php
   ├── page.php
   ├── single.php
   ├── archive.php
   ├── css/
   ├── js/
   └── templates/
   ```

**Option B: Using FTP**

1. Download and install FileZilla (or any FTP client)
2. Connect using your Hostinger FTP credentials:
   - **Host:** Your domain or FTP hostname
   - **Username:** Your FTP username
   - **Password:** Your FTP password
   - **Port:** 21
3. Navigate to `/public_html/wp-content/themes/`
4. Upload the `cheap-car-insurance-pa` folder

### 2.4 Activate Theme

1. Go to WordPress Admin → **Appearance → Themes**
2. Find "Cheap Car Insurance PA" theme
3. Click **Activate**

---

## Step 3: Configure Database

### 3.1 Access phpMyAdmin

In Hostinger hPanel, navigate to **Databases → phpMyAdmin**.

### 3.2 Select Your Database

Click on your WordPress database name (usually starts with your username).

### 3.3 Create Custom Tables

Click the **SQL** tab and execute the following SQL to create custom tables for leads and contact messages:

```sql
CREATE TABLE IF NOT EXISTS `wp_insurance_leads` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `age` int(11) NOT NULL,
  `state` varchar(2) NOT NULL,
  `zip_code` varchar(10) NOT NULL,
  `vehicle_type` varchar(50) NOT NULL,
  `vehicle_year` int(11) NOT NULL,
  `recent_accidents` varchar(10) NOT NULL,
  `current_insurer` varchar(100) DEFAULT NULL,
  `coverage_type` varchar(50) DEFAULT NULL,
  `ownership` varchar(50) DEFAULT NULL,
  `first_name` varchar(100) NOT NULL,
  `last_name` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone` varchar(20) NOT NULL,
  `status` varchar(20) DEFAULT 'new',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `created_at` (`created_at`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS `wp_contact_messages` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `subject` varchar(255) DEFAULT NULL,
  `message` text NOT NULL,
  `status` varchar(20) DEFAULT 'unread',
  `created_at` datetime DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `email` (`email`),
  KEY `created_at` (`created_at`),
  KEY `status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

Click **Go** to execute the SQL.

### 3.4 Verify Tables

Click on **Structure** tab and verify both tables (`wp_insurance_leads` and `wp_contact_messages`) appear in the table list.

---

## Step 4: Configure Theme Settings

### 4.1 Set Site Identity

Go to **Appearance → Customize → Site Identity**:

- **Site Title:** Cheap Car Insurance Pennsylvania
- **Tagline:** Save Money on Auto Insurance
- **Site Icon:** Upload a favicon (32x32px recommended)

### 4.2 Configure Permalinks

Go to **Settings → Permalinks** and select **Post name** structure. This creates SEO-friendly URLs.

Click **Save Changes**.

### 4.3 Configure Reading Settings

Go to **Settings → Reading**:

- **Your homepage displays:** A static page
- **Homepage:** Select "Home" (you'll create this in Step 5)
- **Posts page:** Select "Blog" (you'll create this in Step 5)

Click **Save Changes**.

---

## Step 5: Create Pages

### 5.1 Create Homepage

1. Go to **Pages → Add New**
2. **Title:** Home
3. **Template:** Select "Homepage" from the Template dropdown (right sidebar)
4. Click **Publish**

### 5.2 Create About Page

1. Go to **Pages → Add New**
2. **Title:** About Us
3. **Content:** Add your about content:

```
We are Pennsylvania's trusted partner for finding affordable car insurance. Our mission is simple: help drivers compare quotes from top providers and save hundreds of dollars per year.

Founded by insurance industry veterans, we understand the challenges Pennsylvania drivers face when shopping for coverage. That's why we've created a simple, transparent platform that puts you in control.

## Our Promise

- **No Hidden Fees:** Our service is 100% free
- **Your Privacy Matters:** We never sell your information
- **Unbiased Comparison:** We show you all available options
- **Expert Support:** Our team is here to help

## How It Works

1. **Answer a few questions** about yourself and your vehicle
2. **Compare quotes** from multiple top-rated providers
3. **Choose the best option** and start saving money

Join thousands of Pennsylvania drivers who have already saved money on their car insurance.
```

3. Click **Publish**

### 5.3 Create Blog Page

1. Go to **Pages → Add New**
2. **Title:** Blog
3. Leave content empty (posts will display automatically)
4. Click **Publish**

### 5.4 Create Contact Page

1. Go to **Pages → Add New**
2. **Title:** Contact
3. **Content:**

```
Have questions? We're here to help! Fill out the form below and we'll get back to you within 24 hours.

[contact-form-7]
```

**Note:** You'll need to install Contact Form 7 plugin (see Step 4.4)

4. Click **Publish**

### 5.5 Create Privacy Policy Page

1. Go to **Pages → Add New**
2. **Title:** Privacy Policy
3. **Content:** Add your privacy policy (template provided in `privacy-policy-template.txt`)
4. Click **Publish**

### 5.6 Create Terms of Service Page

1. Go to **Pages → Add New**
2. **Title:** Terms of Service
3. **Content:** Add your terms (template provided in `terms-template.txt`)
4. Click **Publish**

### 5.7 Install Contact Form 7 Plugin

1. Go to **Plugins → Add New**
2. Search for "Contact Form 7"
3. Click **Install Now**, then **Activate**
4. Go to **Contact → Contact Forms**
5. Edit the default form and add this code:

```
<label> Your Name
    [text* your-name] </label>

<label> Your Email
    [email* your-email] </label>

<label> Subject
    [text your-subject] </label>

<label> Your Message
    [textarea your-message] </label>

[submit "Send Message"]
```

6. In the **Mail** tab, set:
   - **To:** david.domainmasterio@gmail.com
   - **From:** [your-name] <wordpress@yourdomain.com>
   - **Subject:** Contact Form: [your-subject]

7. Copy the shortcode (e.g., `[contact-form-7 id="123"]`)
8. Edit your Contact page and replace `[contact-form-7]` with the actual shortcode

---

## Step 6: Configure CPA Redirect

### 6.1 Edit functions.php

Go to **Appearance → Theme File Editor** (or use FTP/File Manager).

**Warning:** Be careful when editing theme files. Always backup first.

### 6.2 Add CPA Redirect URL

Find this line in `functions.php`:

```php
define('CPA_REDIRECT_URL', '');
```

Replace with your actual CPA network tracking URL:

```php
define('CPA_REDIRECT_URL', 'https://tracking.maxbounty.com/aff_c?offer_id=12345&aff_id=YOUR_ID');
```

**Where to get this URL:**
- Log in to your CPA network (MaxBounty, FlexOffers, etc.)
- Find your auto insurance offer
- Copy the tracking link
- Paste it between the quotes

### 6.3 Save Changes

Click **Update File** to save.

### 6.4 Test Redirect

Submit a test quote through your form and verify it redirects to your CPA network after the success screen.

---

## Step 7: Test Everything

### 7.1 Test Homepage

Visit your homepage and verify:
- ✅ Hero section displays correctly
- ✅ Trust indicators show proper numbers
- ✅ Multi-step form loads
- ✅ Benefits section displays
- ✅ FAQ section works (accordions expand/collapse)
- ✅ Footer links are correct

### 7.2 Test Quote Form

Fill out the entire multi-step form:
- ✅ Progress bar updates correctly
- ✅ Validation works on each step
- ✅ Back button navigates to previous steps
- ✅ Form data is saved between steps
- ✅ Matching animation displays
- ✅ Success screen shows
- ✅ Redirects to CPA network (if configured)

### 7.3 Check Database

Go to phpMyAdmin and check `wp_insurance_leads` table:
- ✅ New row appears with your test data
- ✅ All fields are populated correctly
- ✅ Timestamp is correct

### 7.4 Test Contact Form

Submit a test contact message:
- ✅ Form submits successfully
- ✅ Confirmation message displays
- ✅ Email arrives at david.domainmasterio@gmail.com
- ✅ Message appears in `wp_contact_messages` table

### 7.5 Test Blog

1. Create a test blog post
2. Visit the Blog page
3. Verify:
   - ✅ Post appears in blog listing
   - ✅ Clicking post opens single post page
   - ✅ Blog preview shows on homepage (if you have 3+ posts)

### 7.6 Mobile Testing

Visit your site on a mobile device or use Chrome DevTools:
- ✅ Responsive design works
- ✅ Form is usable on mobile
- ✅ Navigation works
- ✅ All buttons are clickable

---

## Troubleshooting

### Issue: Theme doesn't appear in Themes list

**Solution:**
- Verify folder structure is correct
- Check that `style.css` has proper theme header
- Re-upload theme files
- Clear browser cache

### Issue: Multi-step form doesn't work

**Solution:**
- Check browser console for JavaScript errors
- Verify jQuery is loaded (should be included by WordPress)
- Ensure `multistep-form.js` is enqueued in `functions.php`
- Clear browser cache and hard refresh (Ctrl+F5)

### Issue: Form submissions don't save to database

**Solution:**
- Verify database tables exist in phpMyAdmin
- Check table names match (`wp_insurance_leads`)
- Verify AJAX handler is registered in `functions.php`
- Check WordPress debug log for errors

### Issue: CPA redirect doesn't work

**Solution:**
- Verify `CPA_REDIRECT_URL` is set in `functions.php`
- Check URL is properly formatted (starts with `https://`)
- Test URL directly in browser
- Check browser console for errors

### Issue: Contact form emails not sending

**Solution:**
- Install WP Mail SMTP plugin for reliable email delivery
- Configure SMTP settings (use Gmail or Hostinger SMTP)
- Test email functionality with WP Mail SMTP test feature
- Check spam folder

### Issue: 500 Internal Server Error

**Solution:**
- Check `.htaccess` file for syntax errors
- Increase PHP memory limit in `php.ini` or `wp-config.php`
- Check error logs in hPanel → Error Logs
- Disable plugins one by one to find conflict

### Issue: White screen (WSOD)

**Solution:**
- Enable WordPress debug mode in `wp-config.php`:
  ```php
  define('WP_DEBUG', true);
  define('WP_DEBUG_LOG', true);
  ```
- Check `wp-content/debug.log` for errors
- Rename theme folder to force WordPress to use default theme
- Fix errors and re-activate theme

---

## Maintenance & Updates

### Regular Maintenance Tasks

**Weekly:**
- Review new leads in phpMyAdmin
- Check contact messages
- Publish new blog posts (2-3 per week recommended)

**Monthly:**
- Update WordPress core, plugins, and theme
- Backup database and files
- Review site performance and speed
- Check for broken links

**Quarterly:**
- Review and update legal pages (Privacy Policy, Terms)
- Analyze traffic and conversion rates
- Test all forms and functionality
- Update CPA tracking URLs if needed

### Backup Procedures

**Database Backup:**
1. Go to phpMyAdmin
2. Select your database
3. Click **Export**
4. Choose **Quick** export method
5. Click **Go** to download SQL file

**Files Backup:**
1. Use Hostinger File Manager
2. Select `/public_html` folder
3. Click **Compress**
4. Download the ZIP file

**Recommended:** Set up automatic backups in Hostinger hPanel → Backups

### Performance Optimization

**Install These Plugins:**
- **WP Super Cache** - Page caching for faster load times
- **Smush** - Image optimization
- **Autoptimize** - CSS/JS minification

**Optimize Images:**
- Compress all images before uploading
- Use WebP format when possible
- Lazy load images below the fold

**Enable Gzip Compression:**
Add to `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>
```

---

## Support & Resources

**WordPress Documentation:** https://wordpress.org/documentation/  
**Hostinger Knowledge Base:** https://support.hostinger.com  
**Contact Form 7 Docs:** https://contactform7.com/docs/

For theme-specific questions or customization requests, refer to the theme documentation or contact your developer.

---

**Installation Complete!** Your Cheap Car Insurance Pennsylvania website is now live and ready to generate leads.
