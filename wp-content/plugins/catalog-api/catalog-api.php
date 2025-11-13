<?php
/**
 * Plugin Name: Catalog API
 * Description: API REST personalizada para el catálogo de productos
 * Version: 1.0
 */

if (!defined('ABSPATH')) {
    exit;
}

class Catalog_API {
    public function __construct() {
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        register_rest_route('catalog/v1', '/products', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_products'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route('catalog/v1', '/product/(?P<id>\d+)', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_product'),
            'permission_callback' => '__return_true'
        ));

        register_rest_route('catalog/v1', '/product', array(
            'methods' => 'POST',
            'callback' => array($this, 'create_product'),
            'permission_callback' => array($this, 'check_permission')
        ));

        register_rest_route('catalog/v1', '/product/(?P<id>\d+)', array(
            'methods' => array('PUT', 'PATCH'),
            'callback' => array($this, 'update_product'),
            'permission_callback' => array($this, 'check_permission')
        ));

        register_rest_route('catalog/v1', '/product/(?P<id>\d+)', array(
            'methods' => 'DELETE',
            'callback' => array($this, 'delete_product'),
            'permission_callback' => array($this, 'check_permission')
        ));
    }

    public function check_permission() {
        return current_user_can('edit_posts');
    }

    public function get_products($request) {
        $params = $request->get_query_params();
        
        $args = array(
            'post_type' => 'producto',
            'post_status' => 'publish',
            'posts_per_page' => isset($params['per_page']) ? intval($params['per_page']) : 10,
            'paged' => isset($params['page']) ? intval($params['page']) : 1
        );

        // Filtro por categoría
        if (isset($params['categoria']) && !empty($params['categoria'])) {
            $args['tax_query'] = array(
                array(
                    'taxonomy' => 'categoria_producto',
                    'field' => 'slug',
                    'terms' => sanitize_text_field($params['categoria'])
                )
            );
        }

        $query = new WP_Query($args);
        $products = array();

        if ($query->have_posts()) {
            while ($query->have_posts()) {
                $query->the_post();
                $product_id = get_the_ID();
                
                $products[] = array(
                    'id' => $product_id,
                    'title' => get_the_title(),
                    'content' => get_the_content(),
                    'excerpt' => get_the_excerpt(),
                    'slug' => get_post_field('post_name', $product_id),
                    'precio' => get_post_meta($product_id, 'precio', true),
                    'disponibilidad' => get_post_meta($product_id, 'disponibilidad', true),
                    'sku' => get_post_meta($product_id, 'sku', true),
                    'featured_image' => get_the_post_thumbnail_url($product_id, 'full'),
                    'categories' => wp_get_post_terms($product_id, 'categoria_producto', array('fields' => 'all')),
                    'date' => get_the_date('c', $product_id)
                );
            }
            wp_reset_postdata();
        }

        // Filtro por precio
        if (isset($params['precio_min']) || isset($params['precio_max'])) {
            $products = array_filter($products, function($product) use ($params) {
                $precio = floatval($product['precio']);
                $min = isset($params['precio_min']) ? floatval($params['precio_min']) : 0;
                $max = isset($params['precio_max']) ? floatval($params['precio_max']) : PHP_INT_MAX;
                return $precio >= $min && $precio <= $max;
            });
        }

        // Filtro por disponibilidad
        if (isset($params['disponibilidad']) && !empty($params['disponibilidad'])) {
            $products = array_filter($products, function($product) use ($params) {
                return $product['disponibilidad'] === sanitize_text_field($params['disponibilidad']);
            });
        }

        return new WP_REST_Response(array(
            'products' => array_values($products),
            'total' => $query->found_posts,
            'pages' => $query->max_num_pages
        ), 200);
    }

    public function get_product($request) {
        $product_id = intval($request['id']);
        $product = get_post($product_id);

        if (!$product || $product->post_type !== 'producto' || $product->post_status !== 'publish') {
            return new WP_Error('not_found', 'Producto no encontrado', array('status' => 404));
        }

        $response = array(
            'id' => $product_id,
            'title' => get_the_title($product_id),
            'content' => get_the_content(null, false, $product_id),
            'excerpt' => get_the_excerpt($product_id),
            'slug' => $product->post_name,
            'precio' => get_post_meta($product_id, 'precio', true),
            'disponibilidad' => get_post_meta($product_id, 'disponibilidad', true),
            'sku' => get_post_meta($product_id, 'sku', true),
            'featured_image' => get_the_post_thumbnail_url($product_id, 'full'),
            'categories' => wp_get_post_terms($product_id, 'categoria_producto', array('fields' => 'all')),
            'date' => get_the_date('c', $product_id)
        );

        return new WP_REST_Response($response, 200);
    }

    public function create_product($request) {
        $data = $request->get_json_params();
        
        $post_data = array(
            'post_title' => sanitize_text_field($data['title']),
            'post_content' => wp_kses_post($data['content']),
            'post_excerpt' => sanitize_textarea_field($data['excerpt']),
            'post_type' => 'producto',
            'post_status' => 'publish'
        );

        $post_id = wp_insert_post($post_data);

        if (is_wp_error($post_id)) {
            return new WP_Error('create_failed', 'Error al crear producto', array('status' => 500));
        }

        if (isset($data['precio'])) {
            update_post_meta($post_id, 'precio', sanitize_text_field($data['precio']));
        }
        if (isset($data['disponibilidad'])) {
            update_post_meta($post_id, 'disponibilidad', sanitize_text_field($data['disponibilidad']));
        }
        if (isset($data['sku'])) {
            update_post_meta($post_id, 'sku', sanitize_text_field($data['sku']));
        }

        return new WP_REST_Response(array('id' => $post_id, 'message' => 'Producto creado'), 201);
    }

    public function update_product($request) {
        $product_id = intval($request['id']);
        $data = $request->get_json_params();

        $post_data = array('ID' => $product_id);
        
        if (isset($data['title'])) {
            $post_data['post_title'] = sanitize_text_field($data['title']);
        }
        if (isset($data['content'])) {
            $post_data['post_content'] = wp_kses_post($data['content']);
        }
        if (isset($data['excerpt'])) {
            $post_data['post_excerpt'] = sanitize_textarea_field($data['excerpt']);
        }

        $result = wp_update_post($post_data);

        if (is_wp_error($result)) {
            return new WP_Error('update_failed', 'Error al actualizar producto', array('status' => 500));
        }

        if (isset($data['precio'])) {
            update_post_meta($product_id, 'precio', sanitize_text_field($data['precio']));
        }
        if (isset($data['disponibilidad'])) {
            update_post_meta($product_id, 'disponibilidad', sanitize_text_field($data['disponibilidad']));
        }
        if (isset($data['sku'])) {
            update_post_meta($product_id, 'sku', sanitize_text_field($data['sku']));
        }

        return new WP_REST_Response(array('id' => $product_id, 'message' => 'Producto actualizado'), 200);
    }

    public function delete_product($request) {
        $product_id = intval($request['id']);
        $result = wp_delete_post($product_id, true);

        if (!$result) {
            return new WP_Error('delete_failed', 'Error al eliminar producto', array('status' => 500));
        }

        return new WP_REST_Response(array('message' => 'Producto eliminado'), 200);
    }
}

new Catalog_API();

