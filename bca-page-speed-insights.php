<?php
/**
 * Plugin Name:       Blk Canvas - Page Speed Insights
 * Description:       Example block written with ESNext standard and JSX support – build step required.
 * Requires at least: 5.8
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            The WordPress Contributors
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       bca-page-speed-insights
 *
 * @package           create-block
 */
if (!defined('ABSPATH')) {
    exit;
}
define('BCA_PAGE_SPEED_INSIGHTS_PATH', plugin_dir_path( __FILE__ ) );
define('BCA_PAGE_SPEED_INSIGHTS_URI', plugin_dir_url( __FILE__ ) );

include_once BCA_PAGE_SPEED_INSIGHTS_PATH . '/includes/admin.php';

