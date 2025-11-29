<?php get_header(); ?>

<div class="container" style="padding: 4rem 0;">
    <h1 style="font-size: 2.5rem; margin-bottom: 2rem; text-align: center;">
        <?php the_archive_title(); ?>
    </h1>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 2rem;">
        <?php while (have_posts()): the_post(); ?>
            <div class="card">
                <?php if (has_post_thumbnail()): ?>
                    <div style="margin: -2rem -2rem 1.5rem -2rem; border-radius: 1rem 1rem 0 0; overflow: hidden;">
                        <?php the_post_thumbnail('medium', array('style' => 'width: 100%; height: 200px; object-fit: cover;')); ?>
                    </div>
                <?php endif; ?>
                
                <div style="font-size: 0.875rem; color: var(--color-muted-foreground); margin-bottom: 0.5rem;">
                    <?php echo get_the_date(); ?>
                </div>
                
                <h2 style="margin-bottom: 1rem;">
                    <a href="<?php the_permalink(); ?>" style="color: var(--color-foreground);">
                        <?php the_title(); ?>
                    </a>
                </h2>
                
                <p style="color: var(--color-muted-foreground); margin-bottom: 1rem;">
                    <?php echo wp_trim_words(get_the_excerpt(), 20); ?>
                </p>
                
                <a href="<?php the_permalink(); ?>" class="btn btn-secondary">Read More →</a>
            </div>
        <?php endwhile; ?>
    </div>
    
    <div style="margin-top: 3rem; text-align: center;">
        <?php the_posts_pagination(); ?>
    </div>
</div>

<?php get_footer(); ?>
