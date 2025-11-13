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

// Agregar campos personalizados al REST API
function catalog_add_custom_fields_to_rest($response, $post) {
    if ($post->post_type === 'producto') {
        $response->data['precio'] = get_post_meta($post->ID, 'precio', true);
        $response->data['disponibilidad'] = get_post_meta($post->ID, 'disponibilidad', true);
        $response->data['sku'] = get_post_meta($post->ID, 'sku', true);
    }
    return $response;
}
add_filter('rest_prepare_producto', 'catalog_add_custom_fields_to_rest', 10, 2);

// Shortcode para mostrar productos
function catalog_products_shortcode($atts) {
    $atts = shortcode_atts(array(
        'categoria' => '',
        'limit' => 10
    ), $atts);

    $args = array(
        'post_type' => 'producto',
        'posts_per_page' => intval($atts['limit']),
        'post_status' => 'publish'
    );

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
    $output = '<div class="catalog-products">';

    if ($query->have_posts()) {
        while ($query->have_posts()) {
            $query->the_post();
            $precio = get_post_meta(get_the_ID(), 'precio', true);
            $output .= '<div class="product-item">';
            $output .= '<h3>' . esc_html(get_the_title()) . '</h3>';
            $output .= '<p>' . esc_html(get_the_excerpt()) . '</p>';
            if ($precio) {
                $output .= '<p class="price">$' . esc_html($precio) . '</p>';
            }
            $output .= '</div>';
        }
        wp_reset_postdata();
    }

    $output .= '</div>';
    return $output;
}
add_shortcode('catalog_products', 'catalog_products_shortcode');

// Enqueue scripts y styles
function catalog_theme_scripts() {
    wp_enqueue_style('catalog-theme-style', get_stylesheet_uri());
}
add_action('wp_enqueue_scripts', 'catalog_theme_scripts');

