<?php get_header(); ?>

<div class="container container-narrow" style="padding: 4rem 0;">
    <?php while (have_posts()): the_post(); ?>
        <article>
            <h1 style="font-size: 2.5rem; margin-bottom: 1.5rem;"><?php the_title(); ?></h1>
            <div style="color: var(--color-muted-foreground); line-height: 1.8;">
                <?php the_content(); ?>
            </div>
        </article>
    <?php endwhile; ?>
</div>

<?php get_footer(); ?>
