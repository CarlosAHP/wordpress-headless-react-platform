<?php

// Registrar Custom Post Type: Productos
function catalog_register_product_post_type() {
    $labels = array(
        'name' => 'Productos',
        'singular_name' => 'Producto',
        'menu_name' => 'Productos',
        'add_new' => 'Añadir Nuevo',
        'add_new_item' => 'Añadir Nuevo Producto',
        'edit_item' => 'Editar Producto',
        'new_item' => 'Nuevo Producto',
        'view_item' => 'Ver Producto',
        'search_items' => 'Buscar Productos',
        'not_found' => 'No se encontraron productos',
        'not_found_in_trash' => 'No se encontraron productos en la papelera'
    );

    $args = array(
        'labels' => $labels,
        'public' => true,
        'publicly_queryable' => true,
        'show_ui' => true,
        'show_in_menu' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'productos'),
        'capability_type' => 'post',
        'has_archive' => true,
        'hierarchical' => false,
        'menu_position' => 5,
        'menu_icon' => 'dashicons-cart',
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'show_in_rest' => true,
        'rest_base' => 'products',
        'rest_controller_class' => 'WP_REST_Posts_Controller'
    );

    register_post_type('producto', $args);
}
add_action('init', 'catalog_register_product_post_type');

// Registrar Custom Taxonomy: Categorías
function catalog_register_product_taxonomy() {
    $labels = array(
        'name' => 'Categorías',
        'singular_name' => 'Categoría',
        'search_items' => 'Buscar Categorías',
        'all_items' => 'Todas las Categorías',
        'parent_item' => 'Categoría Padre',
        'parent_item_colon' => 'Categoría Padre:',
        'edit_item' => 'Editar Categoría',
        'update_item' => 'Actualizar Categoría',
        'add_new_item' => 'Añadir Nueva Categoría',
        'new_item_name' => 'Nombre de Nueva Categoría',
        'menu_name' => 'Categorías'
    );

    $args = array(
        'hierarchical' => true,
        'labels' => $labels,
        'show_ui' => true,
        'show_admin_column' => true,
        'query_var' => true,
        'rewrite' => array('slug' => 'categoria-producto'),
        'show_in_rest' => true,
        'rest_base' => 'product-categories'
    );

    register_taxonomy('categoria_producto', array('producto'), $args);
}
add_action('init', 'catalog_register_product_taxonomy');

// Custom Meta Box avanzado para campos de producto
function catalog_add_product_meta_boxes() {
    add_meta_box(
        'catalog_product_details',
        'Detalles del Producto',
        'catalog_product_meta_box_callback',
        'producto',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'catalog_add_product_meta_boxes');

function catalog_product_meta_box_callback($post) {
    wp_nonce_field('catalog_save_product_meta', 'catalog_product_meta_nonce');
    
    $precio = get_post_meta($post->ID, 'precio', true);
    $sku = get_post_meta($post->ID, 'sku', true);
    $disponibilidad = get_post_meta($post->ID, 'disponibilidad', true);
    $destacado = get_post_meta($post->ID, 'producto_destacado', true);
    $stock = get_post_meta($post->ID, 'stock', true);
    $descuento = get_post_meta($post->ID, 'descuento', true);
    
    ?>
    <table class="form-table">
        <tr>
            <th><label for="precio">Precio ($)</label></th>
            <td>
                <input type="number" step="0.01" id="precio" name="precio" 
                       value="<?php echo esc_attr($precio); ?>" class="regular-text" />
                <p class="description">Precio del producto en dólares</p>
            </td>
        </tr>
        <tr>
            <th><label for="sku">SKU</label></th>
            <td>
                <input type="text" id="sku" name="sku" 
                       value="<?php echo esc_attr($sku); ?>" class="regular-text" />
                <p class="description">Código único del producto</p>
            </td>
        </tr>
        <tr>
            <th><label for="stock">Stock</label></th>
            <td>
                <input type="number" id="stock" name="stock" 
                       value="<?php echo esc_attr($stock); ?>" class="regular-text" />
                <p class="description">Cantidad disponible en inventario</p>
            </td>
        </tr>
        <tr>
            <th><label for="descuento">Descuento (%)</label></th>
            <td>
                <input type="number" step="0.01" min="0" max="100" id="descuento" name="descuento" 
                       value="<?php echo esc_attr($descuento); ?>" class="regular-text" />
                <p class="description">Porcentaje de descuento (0-100)</p>
            </td>
        </tr>
        <tr>
            <th><label for="disponibilidad">Disponibilidad</label></th>
            <td>
                <select id="disponibilidad" name="disponibilidad" class="regular-text">
                    <option value="disponible" <?php selected($disponibilidad, 'disponible'); ?>>Disponible</option>
                    <option value="agotado" <?php selected($disponibilidad, 'agotado'); ?>>Agotado</option>
                    <option value="preventa" <?php selected($disponibilidad, 'preventa'); ?>>Preventa</option>
                </select>
            </td>
        </tr>
        <tr>
            <th><label for="producto_destacado">Producto Destacado</label></th>
            <td>
                <input type="checkbox" id="producto_destacado" name="producto_destacado" 
                       value="1" <?php checked($destacado, '1'); ?> />
                <label for="producto_destacado">Marcar como producto destacado</label>
            </td>
        </tr>
    </table>
    <?php
}

function catalog_save_product_meta($post_id) {
    if (!isset($_POST['catalog_product_meta_nonce']) || 
        !wp_verify_nonce($_POST['catalog_product_meta_nonce'], 'catalog_save_product_meta')) {
        return;
    }

    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }

    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = array('precio', 'sku', 'stock', 'descuento', 'disponibilidad');
    
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, $field, sanitize_text_field($_POST[$field]));
        }
    }

    $destacado = isset($_POST['producto_destacado']) ? '1' : '0';
    update_post_meta($post_id, 'producto_destacado', $destacado);

    // Invalidar caché de productos destacados
    delete_transient('catalog_featured_products');
    delete_transient('catalog_products_cache');
}
add_action('save_post_producto', 'catalog_save_product_meta');

// Agregar campos personalizados al REST API con filtros avanzados
function catalog_add_custom_fields_to_rest($response, $post) {
    if ($post->post_type === 'producto') {
        $precio = get_post_meta($post->ID, 'precio', true);
        $descuento = get_post_meta($post->ID, 'descuento', true);
        $precio_final = $precio;
        
        if ($descuento && $descuento > 0) {
            $precio_final = $precio * (1 - ($descuento / 100));
        }
        
        $response->data['precio'] = $precio;
        $response->data['precio_original'] = $precio;
        $response->data['descuento'] = $descuento;
        $response->data['precio_final'] = number_format($precio_final, 2, '.', '');
        $response->data['disponibilidad'] = get_post_meta($post->ID, 'disponibilidad', true);
        $response->data['sku'] = get_post_meta($post->ID, 'sku', true);
        $response->data['stock'] = get_post_meta($post->ID, 'stock', true);
        $response->data['producto_destacado'] = get_post_meta($post->ID, 'producto_destacado', true) === '1';
    }
    return $response;
}
add_filter('rest_prepare_producto', 'catalog_add_custom_fields_to_rest', 10, 2);

// Sistema de caché con Transients para productos destacados
function catalog_get_featured_products($limit = 6) {
    $cache_key = 'catalog_featured_products_' . $limit;
    $products = get_transient($cache_key);

    if (false === $products) {
        $args = array(
            'post_type' => 'producto',
            'posts_per_page' => $limit,
            'post_status' => 'publish',
            'meta_query' => array(
                array(
                    'key' => 'producto_destacado',
                    'value' => '1',
                    'compare' => '='
                ),
                array(
                    'key' => 'disponibilidad',
                    'value' => 'disponible',
                    'compare' => '='
                )
            ),
            'orderby' => 'date',
            'order' => 'DESC'
        );

        $query = new WP_Query($args);
        $products = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product_id = get_the_ID();
                $products[] = array(
                    'id' => $product_id,
                    'title' => get_the_title(),
                    'excerpt' => get_the_excerpt(),
                    'slug' => get_post_field('post_name', $product_id),
                    'precio' => get_post_meta($product_id, 'precio', true),
                    'precio_final' => catalog_calculate_final_price($product_id),
                    'descuento' => get_post_meta($product_id, 'descuento', true),
                    'featured_image' => get_the_post_thumbnail_url($product_id, 'medium'),
                    'link' => get_permalink($product_id)
                );
            }
            wp_reset_postdata();
        }

        set_transient($cache_key, $products, HOUR_IN_SECONDS);
    }

    return $products;
}

function catalog_calculate_final_price($product_id) {
    $precio = floatval(get_post_meta($product_id, 'precio', true));
    $descuento = floatval(get_post_meta($product_id, 'descuento', true));
    
    if ($descuento > 0) {
        return $precio * (1 - ($descuento / 100));
    }
    
    return $precio;
}

// Hook personalizado para limpiar caché cuando se actualiza un producto
add_action('save_post_producto', function($post_id) {
    delete_transient('catalog_featured_products_6');
    delete_transient('catalog_featured_products_8');
    delete_transient('catalog_products_cache');
});

// Shortcode avanzado para mostrar productos destacados
function catalog_products_shortcode($atts) {
    $atts = shortcode_atts(array(
        'categoria' => '',
        'limit' => 10,
        'destacados' => 'false',
        'descuento' => 'false',
        'layout' => 'grid'
    ), $atts, 'catalog_products');

    $args = array(
        'post_type' => 'producto',
        'posts_per_page' => intval($atts['limit']),
        'post_status' => 'publish'
    );

    if ($atts['destacados'] === 'true') {
        $args['meta_query'][] = array(
            'key' => 'producto_destacado',
            'value' => '1',
            'compare' => '='
        );
    }

    if ($atts['descuento'] === 'true') {
        $args['meta_query'][] = array(
            'key' => 'descuento',
            'value' => '0',
            'compare' => '>'
        );
    }

    if (!empty($atts['categoria'])) {
        $args['tax_query'] = array(
            array(
                'taxonomy' => 'categoria_producto',
                'field' => 'slug',
                'terms' => sanitize_text_field($atts['categoria'])
            )
        );
    }

    $query = new WP_Query($args);
    $output = '<div class="catalog-products catalog-layout-' . esc_attr($atts['layout']) . '">';

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $product_id = get_the_ID();
            $precio = get_post_meta($product_id, 'precio', true);
            $descuento = get_post_meta($product_id, 'descuento', true);
            $precio_final = catalog_calculate_final_price($product_id);
            
            $output .= '<div class="product-item">';
            $output .= '<h3>' . esc_html(get_the_title()) . '</h3>';
            $output .= '<p>' . esc_html(get_the_excerpt()) . '</p>';
            
            if ($precio) {
                $output .= '<div class="price">';
                if ($descuento > 0) {
                    $output .= '<span class="price-original">$' . esc_html($precio) . '</span> ';
                    $output .= '<span class="price-final">$' . number_format($precio_final, 2) . '</span> ';
                    $output .= '<span class="discount-badge">-' . esc_html($descuento) . '%</span>';
                } else {
                    $output .= '<span class="price-final">$' . esc_html($precio) . '</span>';
                }
                $output .= '</div>';
            }
            $output .= '</div>';
        }
        wp_reset_postdata();
    }

    $output .= '</div>';
    return $output;
}
add_shortcode('catalog_products', 'catalog_products_shortcode');

// Shortcode para categorías destacadas
function catalog_categories_shortcode($atts) {
    $atts = shortcode_atts(array(
        'limit' => 6,
        'show_count' => 'true'
    ), $atts, 'catalog_categories');

    $terms = get_terms(array(
        'taxonomy' => 'categoria_producto',
        'hide_empty' => true,
        'number' => intval($atts['limit'])
    ));

    if (is_wp_error($terms) || empty($terms)) {
        return '';
    }

    $output = '<div class="catalog-categories">';
    foreach ($terms as $term) {
        $count = $atts['show_count'] === 'true' ? ' (' . $term->count . ')' : '';
        $output .= '<div class="category-item">';
        $output .= '<a href="' . esc_url(get_term_link($term)) . '">';
        $output .= esc_html($term->name) . $count;
        $output .= '</a>';
        if ($term->description) {
            $output .= '<p>' . esc_html($term->description) . '</p>';
        }
        $output .= '</div>';
    }
    $output .= '</div>';

    return $output;
}
add_shortcode('catalog_categories', 'catalog_categories_shortcode');

// Filtro personalizado para modificar títulos de productos
function catalog_modify_product_title($title, $post_id = null) {
    if ($post_id && get_post_type($post_id) === 'producto') {
        $destacado = get_post_meta($post_id, 'producto_destacado', true);
        if ($destacado === '1') {
            $title = '⭐ ' . $title;
        }
    }
    return $title;
}
add_filter('the_title', 'catalog_modify_product_title', 10, 2);

// Action hook personalizado para logging de productos vistos
function catalog_log_product_view($product_id) {
    if (get_post_type($product_id) === 'producto') {
        $views = get_post_meta($product_id, 'product_views', true);
        $views = $views ? intval($views) + 1 : 1;
        update_post_meta($product_id, 'product_views', $views);
    }
}
add_action('catalog_product_viewed', 'catalog_log_product_view');

// Enqueue scripts y styles
function catalog_theme_scripts() {
    wp_enqueue_style('catalog-theme-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'catalog_theme_scripts');
