<footer class="site-footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3><?php bloginfo('name'); ?></h3>
                <p>Your trusted partner for finding affordable car insurance in Pennsylvania. Compare quotes from top providers and save hundreds on your premium.</p>
            </div>
            
            <div class="footer-section">
                <h3>Quick Links</h3>
                <ul>
                    <li><a href="<?php echo esc_url(home_url('/')); ?>">Home</a></li>
                    <li><a href="<?php echo esc_url(home_url('/about')); ?>">About Us</a></li>
                    <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Blog</a></li>
                    <li><a href="<?php echo esc_url(home_url('/contact')); ?>">Contact</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Legal</h3>
                <ul>
                    <li><a href="<?php echo esc_url(home_url('/privacy')); ?>">Privacy Policy</a></li>
                    <li><a href="<?php echo esc_url(home_url('/terms')); ?>">Terms of Service</a></li>
                </ul>
            </div>
            
            <div class="footer-section">
                <h3>Resources</h3>
                <ul>
                    <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Insurance Tips</a></li>
                    <li><a href="<?php echo esc_url(home_url('/blog')); ?>">PA Insurance Guide</a></li>
                    <li><a href="<?php echo esc_url(home_url('/blog')); ?>">FAQ</a></li>
                </ul>
            </div>
        </div>
        
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. All rights reserved.</p>
            <p>We help Pennsylvania drivers find affordable car insurance by comparing quotes from multiple providers.</p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html>
