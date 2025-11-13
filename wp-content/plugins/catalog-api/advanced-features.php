<?php
/**
 * Funcionalidades Avanzadas de WordPress
 * Demuestra técnicas avanzadas de PHP y WordPress
 */

if (!defined('ABSPATH')) {
    exit;
}

// Cron Job personalizado para limpiar caché cada hora
function catalog_schedule_cache_cleanup() {
    if (!wp_next_scheduled('catalog_hourly_cache_cleanup')) {
        wp_schedule_event(time(), 'hourly', 'catalog_hourly_cache_cleanup');
    }
}
add_action('wp', 'catalog_schedule_cache_cleanup');

function catalog_cleanup_cache() {
    global $wpdb;
    
    // Limpiar transients expirados relacionados con catálogo
    $wpdb->query(
        "DELETE FROM {$wpdb->options} 
         WHERE option_name LIKE '_transient_catalog_%' 
         OR option_name LIKE '_transient_timeout_catalog_%'"
    );
}
add_action('catalog_hourly_cache_cleanup', 'catalog_cleanup_cache');

// Widget personalizado para mostrar estadísticas de productos
class Catalog_Stats_Widget extends WP_Widget {
    public function __construct() {
        parent::__construct(
            'catalog_stats_widget',
            'Estadísticas de Catálogo',
            array('description' => 'Muestra estadísticas de productos')
        );
    }

    public function widget($args, $instance) {
        $cache_key = 'catalog_stats_widget';
        $stats = get_transient($cache_key);

        if (false === $stats) {
            $stats = array(
                'total' => wp_count_posts('producto')->publish,
                'disponibles' => $this->count_products_by_availability('disponible'),
                'destacados' => $this->count_featured_products(),
                'categorias' => wp_count_terms(array('taxonomy' => 'categoria_producto'))
            );
            set_transient($cache_key, $stats, HOUR_IN_SECONDS);
        }

        echo $args['before_widget'];
        if (!empty($instance['title'])) {
            echo $args['before_title'] . apply_filters('widget_title', $instance['title']) . $args['after_title'];
        }
        echo '<ul>';
        echo '<li>Total productos: <strong>' . esc_html($stats['total']) . '</strong></li>';
        echo '<li>Disponibles: <strong>' . esc_html($stats['disponibles']) . '</strong></li>';
        echo '<li>Destacados: <strong>' . esc_html($stats['destacados']) . '</strong></li>';
        echo '<li>Categorías: <strong>' . esc_html($stats['categorias']) . '</strong></li>';
        echo '</ul>';
        echo $args['after_widget'];
    }

    private function count_products_by_availability($status) {
        $args = array(
            'post_type' => 'producto',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'meta_query' => array(
                array(
                    'key' => 'disponibilidad',
                    'value' => $status,
                    'compare' => '='
                )
            ),
            'fields' => 'ids'
        );
        $query = new WP_Query($args);
        return $query->found_posts;
    }

    private function count_featured_products() {
        $args = array(
            'post_type' => 'producto',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'meta_query' => array(
                array(
                    'key' => 'producto_destacado',
                    'value' => '1',
                    'compare' => '='
                )
            ),
            'fields' => 'ids'
        );
        $query = new WP_Query($args);
        return $query->found_posts;
    }

    public function form($instance) {
        $title = !empty($instance['title']) ? $instance['title'] : 'Estadísticas';
        ?>
        <p>
            <label for="<?php echo esc_attr($this->get_field_id('title')); ?>">Título:</label>
            <input class="widefat" id="<?php echo esc_attr($this->get_field_id('title')); ?>" 
                   name="<?php echo esc_attr($this->get_field_name('title')); ?>" 
                   type="text" value="<?php echo esc_attr($title); ?>">
        </p>
        <?php
    }

    public function update($new_instance, $old_instance) {
        $instance = array();
        $instance['title'] = (!empty($new_instance['title'])) ? sanitize_text_field($new_instance['title']) : '';
        delete_transient('catalog_stats_widget');
        return $instance;
    }
}

function catalog_register_widget() {
    register_widget('Catalog_Stats_Widget');
}
add_action('widgets_init', 'catalog_register_widget');

// Customizer API - Agregar opciones de personalización
function catalog_customize_register($wp_customize) {
    // Sección de Catálogo
    $wp_customize->add_section('catalog_settings', array(
        'title' => 'Configuración del Catálogo',
        'priority' => 30,
    ));

    // Setting para productos por página
    $wp_customize->add_setting('catalog_products_per_page', array(
        'default' => 12,
        'sanitize_callback' => 'absint',
    ));

    $wp_customize->add_control('catalog_products_per_page', array(
        'label' => 'Productos por página',
        'section' => 'catalog_settings',
        'type' => 'number',
        'input_attrs' => array(
            'min' => 1,
            'max' => 50,
            'step' => 1,
        ),
    ));

    // Setting para mostrar descuentos
    $wp_customize->add_setting('catalog_show_discounts', array(
        'default' => true,
        'sanitize_callback' => 'wp_validate_boolean',
    ));

    $wp_customize->add_control('catalog_show_discounts', array(
        'label' => 'Mostrar descuentos',
        'section' => 'catalog_settings',
        'type' => 'checkbox',
    ));
}
add_action('customize_register', 'catalog_customize_register');

// Hook para modificar query de productos basado en Customizer
function catalog_modify_products_query($query) {
    if (!is_admin() && $query->is_main_query() && is_post_type_archive('producto')) {
        $per_page = get_theme_mod('catalog_products_per_page', 12);
        $query->set('posts_per_page', $per_page);
    }
}
add_action('pre_get_posts', 'catalog_modify_products_query');

// Filtro avanzado para modificar contenido de productos
function catalog_filter_product_content($content) {
    if (is_singular('producto')) {
        $product_id = get_the_ID();
        $descuento = get_post_meta($product_id, 'descuento', true);
        
        if ($descuento && $descuento > 0) {
            $badge = '<div class="catalog-discount-badge" style="background: #ff4444; color: white; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: center; font-weight: bold;">';
            $badge .= '🔥 ¡Descuento del ' . esc_html($descuento) . '%! 🔥';
            $badge .= '</div>';
            $content = $badge . $content;
        }
    }
    return $content;
}
add_filter('the_content', 'catalog_filter_product_content');

// Action hook para tracking de productos vistos
function catalog_track_product_view() {
    if (is_singular('producto')) {
        $product_id = get_the_ID();
        do_action('catalog_product_viewed', $product_id);
    }
}
add_action('wp', 'catalog_track_product_view');

// Validación avanzada con sanitización
function catalog_sanitize_product_data($data, $postarr) {
    if ($data['post_type'] === 'producto') {
        // Sanitizar título
        $data['post_title'] = sanitize_text_field($data['post_title']);
        
        // Sanitizar contenido
        $data['post_content'] = wp_kses_post($data['post_content']);
        
        // Validar que el precio sea numérico si existe
        if (isset($_POST['precio']) && !empty($_POST['precio'])) {
            $precio = floatval($_POST['precio']);
            if ($precio < 0) {
                $data['post_status'] = 'draft';
                add_action('admin_notices', function() {
                    echo '<div class="error"><p>El precio no puede ser negativo. El producto se guardó como borrador.</p></div>';
                });
            }
        }
    }
    return $data;
}
add_filter('wp_insert_post_data', 'catalog_sanitize_product_data', 10, 2);

