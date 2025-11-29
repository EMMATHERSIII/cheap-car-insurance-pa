<?php
/**
 * Theme Name: Cheap Car Insurance Pennsylvania
 * Description: Custom WordPress theme for auto insurance lead generation
 * Version: 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function cheap_car_insurance_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('custom-logo');
    
    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'cheap-car-insurance-pa'),
        'footer' => __('Footer Menu', 'cheap-car-insurance-pa'),
    ));
}
add_action('after_setup_theme', 'cheap_car_insurance_setup');

/**
 * Enqueue Scripts and Styles
 */
function cheap_car_insurance_scripts() {
    // Google Fonts
    wp_enqueue_style(
        'google-fonts',
        'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
        array(),
        null
    );
    
    // Theme stylesheet
    wp_enqueue_style(
        'cheap-car-insurance-style',
        get_stylesheet_uri(),
        array(),
        wp_get_theme()->get('Version')
    );
    
    // Multi-step form styles
    wp_enqueue_style(
        'multistep-form',
        get_template_directory_uri() . '/css/multistep-form.css',
        array(),
        '1.0.0'
    );
    
    // jQuery (WordPress includes it)
    wp_enqueue_script('jquery');
    
    // Multi-step form script
    wp_enqueue_script(
        'multistep-form',
        get_template_directory_uri() . '/js/multistep-form.js',
        array('jquery'),
        '1.0.0',
        true
    );
    
    // Localize script for AJAX
    wp_localize_script('multistep-form', 'ajaxData', array(
        'ajaxurl' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('insurance_form_nonce')
    ));
}
add_action('wp_enqueue_scripts', 'cheap_car_insurance_scripts');

/**
 * Create Custom Database Tables on Theme Activation
 */
function cheap_car_insurance_create_tables() {
    global $wpdb;
    $charset_collate = $wpdb->get_charset_collate();
    
    // Leads table
    $table_leads = $wpdb->prefix . 'insurance_leads';
    $sql_leads = "CREATE TABLE IF NOT EXISTS $table_leads (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        age int(11) NOT NULL,
        state varchar(2) NOT NULL,
        zip_code varchar(10) NOT NULL,
        vehicle_type varchar(50) NOT NULL,
        vehicle_year int(11) NOT NULL,
        recent_accidents tinyint(1) NOT NULL DEFAULT 0,
        current_insurer varchar(100) DEFAULT NULL,
        coverage_type varchar(100) DEFAULT NULL,
        ownership varchar(20) DEFAULT NULL,
        first_name varchar(100) NOT NULL,
        last_name varchar(100) NOT NULL,
        email varchar(255) NOT NULL,
        phone varchar(20) NOT NULL,
        status varchar(20) DEFAULT 'new',
        ip_address varchar(45) DEFAULT NULL,
        user_agent text DEFAULT NULL,
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY email (email),
        KEY status (status),
        KEY created_at (created_at)
    ) $charset_collate;";
    
    // Contact messages table
    $table_contacts = $wpdb->prefix . 'insurance_contacts';
    $sql_contacts = "CREATE TABLE IF NOT EXISTS $table_contacts (
        id bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT,
        name varchar(255) NOT NULL,
        email varchar(255) NOT NULL,
        phone varchar(20) DEFAULT NULL,
        subject varchar(255) DEFAULT NULL,
        message text NOT NULL,
        status varchar(20) DEFAULT 'unread',
        created_at datetime DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        KEY status (status),
        KEY created_at (created_at)
    ) $charset_collate;";
    
    require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
    dbDelta($sql_leads);
    dbDelta($sql_contacts);
}
add_action('after_switch_theme', 'cheap_car_insurance_create_tables');

/**
 * AJAX Handler for Lead Form Submission
 */
function handle_insurance_lead_submission() {
    // Verify nonce
    check_ajax_referer('insurance_form_nonce', 'nonce');
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'insurance_leads';
    
    // Sanitize input data
    $data = array(
        'age' => absint($_POST['age']),
        'state' => sanitize_text_field($_POST['state']),
        'zip_code' => sanitize_text_field($_POST['zipCode']),
        'vehicle_type' => sanitize_text_field($_POST['vehicleType']),
        'vehicle_year' => absint($_POST['vehicleYear']),
        'recent_accidents' => isset($_POST['recentAccidents']) && $_POST['recentAccidents'] === 'yes' ? 1 : 0,
        'current_insurer' => sanitize_text_field($_POST['currentInsurer']),
        'coverage_type' => sanitize_text_field($_POST['coverageType']),
        'ownership' => sanitize_text_field($_POST['ownership']),
        'first_name' => sanitize_text_field($_POST['firstName']),
        'last_name' => sanitize_text_field($_POST['lastName']),
        'email' => sanitize_email($_POST['email']),
        'phone' => sanitize_text_field($_POST['phone']),
        'status' => 'new',
        'ip_address' => $_SERVER['REMOTE_ADDR'],
        'user_agent' => $_SERVER['HTTP_USER_AGENT']
    );
    
    // Insert into database
    $result = $wpdb->insert($table_name, $data);
    
    if ($result) {
        // Send email notification
        $to = get_option('insurance_contact_email', get_option('admin_email'));
        $subject = 'New Insurance Lead: ' . $data['first_name'] . ' ' . $data['last_name'];
        $message = "New insurance quote request received:\n\n";
        $message .= "Name: {$data['first_name']} {$data['last_name']}\n";
        $message .= "Email: {$data['email']}\n";
        $message .= "Phone: {$data['phone']}\n";
        $message .= "State: {$data['state']}\n";
        $message .= "ZIP: {$data['zip_code']}\n";
        $message .= "Vehicle: {$data['vehicle_year']} {$data['vehicle_type']}\n";
        $message .= "\nView all leads in WordPress admin.";
        
        wp_mail($to, $subject, $message);
        
        // Get CPA redirect URL
        $cpa_url = get_option('insurance_cpa_redirect_url', '');
        
        wp_send_json_success(array(
            'message' => 'Lead submitted successfully',
            'redirect_url' => $cpa_url
        ));
    } else {
        wp_send_json_error(array(
            'message' => 'Failed to submit lead'
        ));
    }
}
add_action('wp_ajax_submit_insurance_lead', 'handle_insurance_lead_submission');
add_action('wp_ajax_nopriv_submit_insurance_lead', 'handle_insurance_lead_submission');

/**
 * AJAX Handler for Contact Form Submission
 */
function handle_contact_form_submission() {
    check_ajax_referer('insurance_form_nonce', 'nonce');
    
    global $wpdb;
    $table_name = $wpdb->prefix . 'insurance_contacts';
    
    $data = array(
        'name' => sanitize_text_field($_POST['name']),
        'email' => sanitize_email($_POST['email']),
        'phone' => sanitize_text_field($_POST['phone']),
        'subject' => sanitize_text_field($_POST['subject']),
        'message' => sanitize_textarea_field($_POST['message']),
        'status' => 'unread'
    );
    
    $result = $wpdb->insert($table_name, $data);
    
    if ($result) {
        // Send email notification
        $to = get_option('insurance_contact_email', get_option('admin_email'));
        $subject = 'New Contact Message: ' . $data['subject'];
        $message = "New contact form submission:\n\n";
        $message .= "Name: {$data['name']}\n";
        $message .= "Email: {$data['email']}\n";
        $message .= "Phone: {$data['phone']}\n";
        $message .= "Subject: {$data['subject']}\n\n";
        $message .= "Message:\n{$data['message']}";
        
        wp_mail($to, $subject, $message);
        
        wp_send_json_success(array(
            'message' => 'Message sent successfully'
        ));
    } else {
        wp_send_json_error(array(
            'message' => 'Failed to send message'
        ));
    }
}
add_action('wp_ajax_submit_contact_form', 'handle_contact_form_submission');
add_action('wp_ajax_nopriv_submit_contact_form', 'handle_contact_form_submission');

/**
 * Add Admin Menu for Lead Management
 */
function cheap_car_insurance_admin_menu() {
    add_menu_page(
        'Insurance Leads',
        'Insurance Leads',
        'manage_options',
        'insurance-leads',
        'insurance_leads_page',
        'dashicons-groups',
        30
    );
    
    add_submenu_page(
        'insurance-leads',
        'Contact Messages',
        'Contact Messages',
        'manage_options',
        'insurance-contacts',
        'insurance_contacts_page'
    );
    
    add_submenu_page(
        'insurance-leads',
        'Settings',
        'Settings',
        'manage_options',
        'insurance-settings',
        'insurance_settings_page'
    );
}
add_action('admin_menu', 'cheap_car_insurance_admin_menu');

/**
 * Leads Admin Page
 */
function insurance_leads_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'insurance_leads';
    
    // Handle status update
    if (isset($_POST['update_status']) && isset($_POST['lead_id'])) {
        $wpdb->update(
            $table_name,
            array('status' => sanitize_text_field($_POST['status'])),
            array('id' => absint($_POST['lead_id']))
        );
    }
    
    // Get all leads
    $leads = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
    
    ?>
    <div class="wrap">
        <h1>Insurance Leads</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>State</th>
                    <th>Vehicle</th>
                    <th>Status</th>
                    <th>Date</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($leads as $lead): ?>
                <tr>
                    <td><?php echo esc_html($lead->id); ?></td>
                    <td><?php echo esc_html($lead->first_name . ' ' . $lead->last_name); ?></td>
                    <td><?php echo esc_html($lead->email); ?></td>
                    <td><?php echo esc_html($lead->phone); ?></td>
                    <td><?php echo esc_html($lead->state); ?></td>
                    <td><?php echo esc_html($lead->vehicle_year . ' ' . $lead->vehicle_type); ?></td>
                    <td>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="lead_id" value="<?php echo esc_attr($lead->id); ?>">
                            <select name="status" onchange="this.form.submit()">
                                <option value="new" <?php selected($lead->status, 'new'); ?>>New</option>
                                <option value="contacted" <?php selected($lead->status, 'contacted'); ?>>Contacted</option>
                                <option value="converted" <?php selected($lead->status, 'converted'); ?>>Converted</option>
                                <option value="rejected" <?php selected($lead->status, 'rejected'); ?>>Rejected</option>
                            </select>
                            <input type="hidden" name="update_status" value="1">
                        </form>
                    </td>
                    <td><?php echo esc_html(date('Y-m-d H:i', strtotime($lead->created_at))); ?></td>
                    <td>
                        <a href="#" onclick="alert('Full details:\n\nAge: <?php echo esc_js($lead->age); ?>\nZIP: <?php echo esc_js($lead->zip_code); ?>\nAccidents: <?php echo $lead->recent_accidents ? 'Yes' : 'No'; ?>\nInsurer: <?php echo esc_js($lead->current_insurer); ?>\nCoverage: <?php echo esc_js($lead->coverage_type); ?>\nOwnership: <?php echo esc_js($lead->ownership); ?>'); return false;">View Details</a>
                    </td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

/**
 * Contact Messages Admin Page
 */
function insurance_contacts_page() {
    global $wpdb;
    $table_name = $wpdb->prefix . 'insurance_contacts';
    
    // Handle status update
    if (isset($_POST['update_status']) && isset($_POST['contact_id'])) {
        $wpdb->update(
            $table_name,
            array('status' => sanitize_text_field($_POST['status'])),
            array('id' => absint($_POST['contact_id']))
        );
    }
    
    $contacts = $wpdb->get_results("SELECT * FROM $table_name ORDER BY created_at DESC");
    
    ?>
    <div class="wrap">
        <h1>Contact Messages</h1>
        <table class="wp-list-table widefat fixed striped">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Subject</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Date</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($contacts as $contact): ?>
                <tr>
                    <td><?php echo esc_html($contact->id); ?></td>
                    <td><?php echo esc_html($contact->name); ?></td>
                    <td><?php echo esc_html($contact->email); ?></td>
                    <td><?php echo esc_html($contact->subject); ?></td>
                    <td><?php echo esc_html(substr($contact->message, 0, 50)) . '...'; ?></td>
                    <td>
                        <form method="post" style="display:inline;">
                            <input type="hidden" name="contact_id" value="<?php echo esc_attr($contact->id); ?>">
                            <select name="status" onchange="this.form.submit()">
                                <option value="unread" <?php selected($contact->status, 'unread'); ?>>Unread</option>
                                <option value="read" <?php selected($contact->status, 'read'); ?>>Read</option>
                                <option value="replied" <?php selected($contact->status, 'replied'); ?>>Replied</option>
                            </select>
                            <input type="hidden" name="update_status" value="1">
                        </form>
                    </td>
                    <td><?php echo esc_html(date('Y-m-d H:i', strtotime($contact->created_at))); ?></td>
                </tr>
                <?php endforeach; ?>
            </tbody>
        </table>
    </div>
    <?php
}

/**
 * Settings Admin Page
 */
function insurance_settings_page() {
    // Save settings
    if (isset($_POST['save_settings'])) {
        update_option('insurance_contact_email', sanitize_email($_POST['contact_email']));
        update_option('insurance_cpa_redirect_url', esc_url_raw($_POST['cpa_redirect_url']));
        echo '<div class="notice notice-success"><p>Settings saved successfully!</p></div>';
    }
    
    $contact_email = get_option('insurance_contact_email', get_option('admin_email'));
    $cpa_url = get_option('insurance_cpa_redirect_url', '');
    
    ?>
    <div class="wrap">
        <h1>Insurance Settings</h1>
        <form method="post">
            <table class="form-table">
                <tr>
                    <th scope="row"><label for="contact_email">Contact Email</label></th>
                    <td>
                        <input type="email" name="contact_email" id="contact_email" value="<?php echo esc_attr($contact_email); ?>" class="regular-text">
                        <p class="description">Email address to receive lead and contact form notifications</p>
                    </td>
                </tr>
                <tr>
                    <th scope="row"><label for="cpa_redirect_url">CPA Redirect URL</label></th>
                    <td>
                        <input type="url" name="cpa_redirect_url" id="cpa_redirect_url" value="<?php echo esc_attr($cpa_url); ?>" class="regular-text">
                        <p class="description">URL to redirect users after form submission (your CPA network tracking link)</p>
                    </td>
                </tr>
            </table>
            <p class="submit">
                <input type="submit" name="save_settings" class="button button-primary" value="Save Settings">
            </p>
        </form>
    </div>
    <?php
}
