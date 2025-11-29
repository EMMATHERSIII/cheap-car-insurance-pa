<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
    <meta charset="<?php bloginfo('charset'); ?>">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    
    <?php if (is_front_page()): ?>
    <!-- SEO Meta Tags -->
    <meta name="description" content="Get cheap car insurance quotes in Pennsylvania. Compare rates from top providers and save up to $847/year. Fast, free, and easy quote process.">
    <meta name="keywords" content="cheap car insurance Pennsylvania, PA auto insurance, car insurance quotes, Pennsylvania insurance rates">
    
    <!-- Open Graph -->
    <meta property="og:title" content="Cheap Car Insurance Pennsylvania - Save Up to $847/Year">
    <meta property="og:description" content="Compare car insurance quotes from top providers in Pennsylvania. Get your free quote in 2 minutes.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="<?php echo esc_url(home_url('/')); ?>">
    
    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="Cheap Car Insurance Pennsylvania">
    <meta name="twitter:description" content="Save up to $847/year on car insurance in Pennsylvania">
    <?php endif; ?>
    
    <?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>

<header class="site-header">
    <div class="container">
        <div class="header-inner">
            <div class="site-branding">
                <?php if (has_custom_logo()): ?>
                    <?php the_custom_logo(); ?>
                <?php else: ?>
                    <a href="<?php echo esc_url(home_url('/')); ?>" class="site-logo">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                        </svg>
                        <div>
                            <div><?php bloginfo('name'); ?></div>
                            <div class="site-tagline"><?php bloginfo('description'); ?></div>
                        </div>
                    </a>
                <?php endif; ?>
            </div>
            
            <a href="#quote-form" class="btn btn-primary">Get Free Quote</a>
        </div>
    </div>
</header>
