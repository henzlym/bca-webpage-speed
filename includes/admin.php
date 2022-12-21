<?php
// Exit if accessed directly.
if (!defined('ABSPATH')) exit;

if (!class_exists('__Prefix_Admin')) {
    class __Prefix_Admin
    {

        public $pages;
        public $current_page;
        
        public function __construct()
        {
            $this->set_pages();
            add_action('init', array($this, 'init'));
        }
        public function init()
        {
            // create admin setting page
            add_action('admin_menu', array($this, 'add_admin_menus'));
            // add admin styles/scripts
            add_action('admin_head', array($this, 'admin_head'));
            // 
            add_action('admin_enqueue_scripts', array($this, 'enqueue_admin_assets'));
        }
        public function enqueue_admin_assets()
        {
            if (isset($_GET['page']) && !empty($_GET['page']) && 'page-speed-insights' === $_GET['page']) {
                $asset = include_once BCA_PAGE_SPEED_INSIGHTS_PATH . '/build/index.asset.php';
                // wp_enqueue_script( 'puppeteer', 'https://unpkg.com/puppeteer-web', [], $asset['version'], true );
                wp_enqueue_script( 'page-speed-insights', BCA_PAGE_SPEED_INSIGHTS_URI . '/build/index.js', $asset['dependencies'], $asset['version'], true );
            }
        }
        public function set_pages()
        {
            $this->pages = array(
                array(
                    // 'page_slug' => 'options-general.php',
                    'page_title' => 'Page Speed Insights',
                    'menu_title' => 'Page Speed Insights',
                    'capability' => 'manage_options',
                    'menu_slug' => 'page-speed-insights',
                    'function' => array($this, 'menu_page'),
                    'icon_url' => 'dashicons-block-default',
                    'position' => 65,
                    'page' => 'index.php'
                )
            );
        }
        public function admin_head()
        {
?>
            <style>
            </style>
<?php
        }
        public function add_admin_menus()
        {
            foreach ($this->pages as $key => $page) {
                
                $this->current_page = $page['page'];
                
                if (isset($page['page_slug'])) {
                    add_submenu_page(
                        $page['page_slug'],
                        $page['page_title'],
                        $page['menu_title'],
                        $page['capability'],
                        $page['menu_slug'],
                        $page['function'],
                        $page['position'],
                    );
                } else {
                    add_menu_page(
                        $page['page_title'],
                        $page['menu_title'],
                        $page['capability'],
                        $page['menu_slug'],
                        $page['function'],
                        $page['icon_url'],
                        $page['position'],
                    );
                }
            }
        }
        public function menu_page()
        {

            if (!current_user_can('manage_options')) {
                return;
            }

            if (isset($_GET['password']) && $_GET['password']) {
                add_settings_error('__prefix_admin_notices', '__prefix_admin_notices_code', 'This is a message notice after an action has been performed', 'updated');
            }
            // add error/update messages
            settings_errors('__prefix_admin_notices');

            include_once BCA_PAGE_SPEED_INSIGHTS_PATH . 'includes/pages/' . $this->current_page;
        }
    }

    new __Prefix_Admin;
}
