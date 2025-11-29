# Cheap Car Insurance Pennsylvania - WordPress Theme Package

**Version:** 1.0  
**Author:** Manus AI  
**Compatible with:** WordPress 5.8+  
**PHP Version:** 7.4+  
**License:** Proprietary

---

## Package Contents

This package contains everything you need to deploy the Cheap Car Insurance Pennsylvania website on WordPress/Hostinger:

```
wordpress-theme/
├── cheap-car-insurance-pa/          # WordPress theme folder
│   ├── style.css                    # Theme stylesheet with header
│   ├── functions.php                # Theme functions and hooks
│   ├── header.php                   # Site header template
│   ├── footer.php                   # Site footer template
│   ├── front-page.php               # Homepage template
│   ├── page.php                     # Default page template
│   ├── single.php                   # Single blog post template
│   ├── archive.php                  # Blog archive template
│   ├── css/
│   │   ├── main.css                 # Main theme styles
│   │   └── multistep-form.css       # Form-specific styles
│   ├── js/
│   │   └── multistep-form.js        # Form functionality
│   └── templates/
│       └── multistep-form.php       # Form HTML template
│
├── WORDPRESS_INSTALLATION_GUIDE.md  # Complete installation guide
└── README.md                        # This file
```

---

## Quick Start

1. **Install WordPress** on your Hostinger Premium hosting
2. **Upload theme** to `/wp-content/themes/`
3. **Activate theme** in WordPress admin
4. **Run SQL** to create custom database tables
5. **Create pages** (Home, About, Contact, Blog, Privacy, Terms)
6. **Configure CPA redirect** URL in functions.php
7. **Test everything** and go live!

**Detailed instructions:** See `WORDPRESS_INSTALLATION_GUIDE.md`

---

## Features

### Multi-Step Quote Form
- 10-step progressive form with validation
- Real-time progress tracking
- Matching animation after submission
- Success screen with stats
- Automatic CPA network redirect
- Mobile-responsive design

### Lead Management
- Custom database tables for leads
- phpMyAdmin access to view/export leads
- Email notifications on form submission
- Lead status tracking

### Blog System
- Native WordPress blog functionality
- Custom archive and single post templates
- Blog preview on homepage (shows 3 latest posts)
- SEO-optimized permalinks

### Contact System
- Contact Form 7 integration
- Email notifications to owner
- Message storage in database
- Spam protection

### Pages Included
- Homepage with hero section and CTA
- About Us page
- Contact page
- Blog listing page
- Privacy Policy page
- Terms of Service page

### CPA Integration
- Configurable redirect URL
- Post-submission redirect with delay
- Lead data saved before redirect
- Compatible with all major CPA networks

---

## Installation Requirements

**Hosting:**
- Hostinger Premium plan (or higher)
- PHP 7.4+
- MySQL 5.7+
- 500 MB disk space
- 128 MB memory limit

**WordPress:**
- WordPress 5.8 or higher
- Recommended plugins:
  - Contact Form 7 (required for contact page)
  - WP Super Cache (performance)
  - Smush (image optimization)
  - WP Mail SMTP (reliable emails)

---

## Configuration

### CPA Redirect URL

Edit `functions.php` and update this line:

```php
define('CPA_REDIRECT_URL', 'https://your-cpa-network-url-here');
```

Replace with your actual tracking URL from MaxBounty, FlexOffers, or your chosen CPA network.

### Email Notifications

Contact form emails are sent to the address configured in Contact Form 7 settings. Default: `david.domainmasterio@gmail.com`

To change:
1. Go to **Contact → Contact Forms**
2. Edit the form
3. Click **Mail** tab
4. Update **To:** field

---

## Database Schema

The theme creates two custom tables:

### wp_insurance_leads
Stores quote form submissions with fields:
- id, age, state, zip_code, vehicle_type, vehicle_year
- recent_accidents, current_insurer, coverage_type, ownership
- first_name, last_name, email, phone
- status, created_at

### wp_contact_messages
Stores contact form submissions with fields:
- id, name, email, subject, message
- status, created_at

Access via phpMyAdmin to view, export, or manage leads.

---

## Customization

### Change Colors

Edit `css/main.css` and update CSS variables:

```css
:root {
  --color-primary: oklch(0.55 0.20 250);
  --color-background: oklch(0.98 0.01 250);
  /* ... more variables */
}
```

### Modify Form Steps

Edit `templates/multistep-form.php` to add/remove/modify form steps.

Update `js/multistep-form.js` to match (update `totalSteps` variable).

### Add Custom Pages

Create new page templates by copying `page.php` and renaming. Add template header:

```php
<?php
/**
 * Template Name: Your Template Name
 */
get_header();
// Your custom content here
get_footer();
?>
```

---

## Support

**Installation Issues:**
- Check `WORDPRESS_INSTALLATION_GUIDE.md` troubleshooting section
- Verify all prerequisites are met
- Check WordPress debug log for errors

**Customization:**
- WordPress Codex: https://codex.wordpress.org/
- Theme development: https://developer.wordpress.org/themes/

**Hosting Support:**
- Hostinger Knowledge Base: https://support.hostinger.com

---

## Version History

**v1.0** (November 29, 2025)
- Initial release
- Multi-step quote form
- Blog system
- Contact functionality
- CPA integration
- Mobile-responsive design

---

## License

This theme is proprietary software created for Cheap Car Insurance Pennsylvania. All rights reserved.

**Do not redistribute or resell this theme without permission.**

---

For installation instructions, see **WORDPRESS_INSTALLATION_GUIDE.md**
