<?php
/**
 * Template Name: Homepage
 * Description: Main landing page with hero section and multi-step quote form
 */

get_header();
?>

<!-- Hero Section -->
<section class="hero-section" style="background: linear-gradient(135deg, oklch(0.95 0.05 250) 0%, oklch(0.98 0.01 250) 100%); padding: 4rem 0;">
    <div class="container">
        <div style="max-width: 800px; margin: 0 auto; text-align: center;">
            <h1 style="font-size: 3rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--color-foreground);">
                Save Up to $847/Year on Car Insurance in Pennsylvania
            </h1>
            <p style="font-size: 1.25rem; color: var(--color-muted-foreground); margin-bottom: 2rem;">
                Compare quotes from top providers in minutes. Fast, free, and easy.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
                <a href="#quote-form" class="btn btn-primary btn-lg">Get Free Quote</a>
                <a href="<?php echo esc_url(home_url('/about')); ?>" class="btn btn-secondary btn-lg">Learn More</a>
            </div>
        </div>
    </div>
</section>

<!-- Trust Indicators -->
<section style="padding: 3rem 0; background: var(--color-card);">
    <div class="container">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 2rem; text-align: center;">
            <div>
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">2 Min</div>
                <div style="color: var(--color-muted-foreground);">Quick Quote Process</div>
            </div>
            <div>
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">50K+</div>
                <div style="color: var(--color-muted-foreground);">Happy Customers</div>
            </div>
            <div>
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">$847</div>
                <div style="color: var(--color-muted-foreground);">Average Savings/Year</div>
            </div>
            <div>
                <div style="font-size: 2.5rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.5rem;">100%</div>
                <div style="color: var(--color-muted-foreground);">Free Service</div>
            </div>
        </div>
    </div>
</section>

<!-- Quote Form Section -->
<section id="quote-form" style="padding: 4rem 0; background: var(--color-background);">
    <div class="container">
        <?php get_template_part('templates/multistep-form'); ?>
    </div>
</section>

<!-- Benefits Section -->
<section style="padding: 4rem 0; background: var(--color-card);">
    <div class="container">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">Why Choose Us?</h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <div class="card">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">💰 Save Money</h3>
                <p>Compare quotes from multiple providers to find the best rate. Pennsylvania drivers save an average of $847 per year.</p>
            </div>
            <div class="card">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">⚡ Fast & Easy</h3>
                <p>Get your quote in just 2 minutes. No phone calls, no hassle. Simple online process.</p>
            </div>
            <div class="card">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">🔒 Secure & Private</h3>
                <p>Your information is protected with bank-level encryption. We never sell your data.</p>
            </div>
            <div class="card">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">🏆 Top Providers</h3>
                <p>Access quotes from leading insurance companies including State Farm, GEICO, Progressive, and more.</p>
            </div>
            <div class="card">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">📱 Mobile Friendly</h3>
                <p>Get quotes on any device. Our platform works perfectly on phones, tablets, and computers.</p>
            </div>
            <div class="card">
                <h3 style="color: var(--color-primary); margin-bottom: 1rem;">✅ No Obligation</h3>
                <p>Comparing quotes is 100% free with no obligation to buy. See your options risk-free.</p>
            </div>
        </div>
    </div>
</section>

<!-- Blog Preview Section -->
<?php
$recent_posts = wp_get_recent_posts(array(
    'numberposts' => 3,
    'post_status' => 'publish'
));

if (!empty($recent_posts)):
?>
<section style="padding: 4rem 0; background: var(--color-background);">
    <div class="container">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 1rem;">Latest Insurance Tips & News</h2>
        <p style="text-align: center; color: var(--color-muted-foreground); margin-bottom: 3rem;">Stay informed with our expert advice and industry updates</p>
        
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem;">
            <?php foreach ($recent_posts as $post): ?>
            <div class="card">
                <?php if (has_post_thumbnail($post['ID'])): ?>
                    <div style="margin: -2rem -2rem 1.5rem -2rem; border-radius: 1rem 1rem 0 0; overflow: hidden;">
                        <?php echo get_the_post_thumbnail($post['ID'], 'medium', array('style' => 'width: 100%; height: 200px; object-fit: cover;')); ?>
                    </div>
                <?php endif; ?>
                
                <h3 style="margin-bottom: 1rem;">
                    <a href="<?php echo get_permalink($post['ID']); ?>" style="color: var(--color-foreground);">
                        <?php echo esc_html($post['post_title']); ?>
                    </a>
                </h3>
                
                <p style="color: var(--color-muted-foreground); margin-bottom: 1rem;">
                    <?php echo wp_trim_words($post['post_content'], 20); ?>
                </p>
                
                <a href="<?php echo get_permalink($post['ID']); ?>" class="btn btn-secondary">Read More →</a>
            </div>
            <?php endforeach; ?>
        </div>
        
        <div style="text-align: center; margin-top: 2rem;">
            <a href="<?php echo esc_url(home_url('/blog')); ?>" class="btn btn-primary">View All Articles</a>
        </div>
    </div>
</section>
<?php endif; ?>

<!-- FAQ Section -->
<section style="padding: 4rem 0; background: var(--color-card);">
    <div class="container container-narrow">
        <h2 style="text-align: center; font-size: 2.5rem; margin-bottom: 3rem;">Frequently Asked Questions</h2>
        
        <div style="display: flex; flex-direction: column; gap: 1.5rem;">
            <details style="padding: 1.5rem; background: var(--color-background); border-radius: var(--radius-lg);">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 1rem;">How much can I save on car insurance in Pennsylvania?</summary>
                <p style="color: var(--color-muted-foreground);">Pennsylvania drivers save an average of $847 per year by comparing quotes. Your actual savings depend on your driving history, vehicle, and coverage needs.</p>
            </details>
            
            <details style="padding: 1.5rem; background: var(--color-background); border-radius: var(--radius-lg);">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 1rem;">Is it really free to get a quote?</summary>
                <p style="color: var(--color-muted-foreground);">Yes! Our service is 100% free with no hidden fees. You can compare quotes from multiple providers without any obligation to purchase.</p>
            </details>
            
            <details style="padding: 1.5rem; background: var(--color-background); border-radius: var(--radius-lg);">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 1rem;">How long does it take to get a quote?</summary>
                <p style="color: var(--color-muted-foreground);">Most people complete our form in under 2 minutes. You'll receive personalized quotes from top providers instantly.</p>
            </details>
            
            <details style="padding: 1.5rem; background: var(--color-background); border-radius: var(--radius-lg);">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 1rem;">What information do I need to provide?</summary>
                <p style="color: var(--color-muted-foreground);">You'll need basic information about yourself, your vehicle, and your current insurance. The process is quick and straightforward.</p>
            </details>
            
            <details style="padding: 1.5rem; background: var(--color-background); border-radius: var(--radius-lg);">
                <summary style="font-weight: 600; cursor: pointer; margin-bottom: 1rem;">Which insurance companies do you work with?</summary>
                <p style="color: var(--color-muted-foreground);">We partner with all major insurance providers including State Farm, GEICO, Progressive, Allstate, Nationwide, and many more.</p>
            </details>
        </div>
    </div>
</section>

<!-- CTA Section -->
<section style="padding: 4rem 0; background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-hover) 100%); color: white; text-align: center;">
    <div class="container container-narrow">
        <h2 style="font-size: 2.5rem; margin-bottom: 1rem; color: white;">Ready to Save on Car Insurance?</h2>
        <p style="font-size: 1.25rem; margin-bottom: 2rem; opacity: 0.9;">Join thousands of Pennsylvania drivers who have already saved money</p>
        <a href="#quote-form" class="btn btn-lg" style="background: white; color: var(--color-primary);">Get Your Free Quote Now</a>
    </div>
</section>

<?php get_footer(); ?>
