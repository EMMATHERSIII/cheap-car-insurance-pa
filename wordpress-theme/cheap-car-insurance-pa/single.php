<?php get_header(); ?>

<article class="container container-narrow" style="padding: 4rem 0;">
    <?php while (have_posts()): the_post(); ?>
        <div style="margin-bottom: 2rem;">
            <div style="font-size: 0.875rem; color: var(--color-muted-foreground); margin-bottom: 0.5rem;">
                <?php echo get_the_date(); ?> • <?php echo get_the_author(); ?>
            </div>
            
            <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;"><?php the_title(); ?></h1>
            
            <?php if (has_post_thumbnail()): ?>
                <div style="margin-bottom: 2rem; border-radius: var(--radius-xl); overflow: hidden;">
                    <?php the_post_thumbnail('large', array('style' => 'width: 100%; height: auto;')); ?>
                </div>
            <?php endif; ?>
        </div>
        
        <div style="color: var(--color-foreground); line-height: 1.8; font-size: 1.125rem;">
            <?php the_content(); ?>
        </div>
        
        <div style="margin-top: 3rem; padding-top: 2rem; border-top: 1px solid var(--color-border);">
            <a href="<?php echo esc_url(home_url('/blog')); ?>" class="btn btn-secondary">← Back to Blog</a>
        </div>
    <?php endwhile; ?>
</article>

<?php get_footer(); ?>
