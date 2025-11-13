# Técnicas Avanzadas de PHP y WordPress Implementadas

## 1. Custom Meta Boxes Avanzados
- **Ubicación**: `functions.php` - `catalog_add_product_meta_boxes()`
- **Características**:
  - Nonces para seguridad
  - Sanitización de datos
  - Validación de campos
  - Campos: precio, SKU, stock, descuento, disponibilidad, producto destacado

## 2. Sistema de Caché con Transients
- **Ubicación**: `functions.php` - `catalog_get_featured_products()`
- **Características**:
  - Caché de productos destacados (1 hora)
  - Invalidación automática al actualizar productos
  - Reducción de consultas a base de datos

## 3. Hooks y Filtros Personalizados
- **Hooks implementados**:
  - `catalog_product_viewed` - Tracking de productos vistos
  - `save_post_producto` - Limpieza de caché automática
- **Filtros implementados**:
  - `rest_prepare_producto` - Modificar respuesta REST API
  - `the_title` - Agregar indicador a productos destacados
  - `the_content` - Agregar badges de descuento
  - `wp_insert_post_data` - Validación avanzada

## 4. WP_Query Avanzado
- **Consultas complejas**:
  - Meta queries múltiples
  - Tax queries para categorías
  - Ordenamiento personalizado
  - Filtros combinados (destacados + disponibles)

## 5. Shortcodes Avanzados
- **`[catalog_products]`**:
  - Parámetros: categoria, limit, destacados, descuento, layout
  - Renderizado condicional
  - Cálculo de precios con descuento
- **`[catalog_categories]`**:
  - Parámetros: limit, show_count
  - Renderizado de taxonomías

## 6. Cron Jobs Personalizados
- **Ubicación**: `advanced-features.php`
- **Función**: Limpieza automática de caché cada hora
- **Implementación**: `wp_schedule_event()` con hook personalizado

## 7. Widget Personalizado
- **Clase**: `Catalog_Stats_Widget`
- **Características**:
  - Estadísticas en tiempo real
  - Caché de resultados
  - Interfaz de administración
  - Sanitización de datos

## 8. Customizer API
- **Sección**: "Configuración del Catálogo"
- **Settings**:
  - Productos por página
  - Mostrar/ocultar descuentos
- **Sanitización**: `absint()`, `wp_validate_boolean()`

## 9. REST API Extendida
- **Endpoints adicionales**:
  - Filtro por productos destacados
  - Filtro por productos con descuento
  - Cálculo automático de precios finales
  - Campos adicionales: stock, producto_destacado, descuento

## 10. Validación y Sanitización Avanzada
- **Sanitización**:
  - `sanitize_text_field()` - Textos
  - `wp_kses_post()` - Contenido HTML
  - `absint()` - Números enteros
  - `floatval()` - Números decimales
- **Validación**:
  - Precios negativos
  - Campos requeridos
  - Tipos de datos

## 11. Seguridad
- **Nonces**: Verificación en formularios
- **Capability checks**: `current_user_can()`
- **Sanitización**: Todos los inputs
- **Escapado**: Todos los outputs

## 12. Optimización de Performance
- **Transients**: Caché de consultas costosas
- **WP_Query optimizado**: Solo campos necesarios
- **Lazy loading**: Carga diferida de imágenes
- **Invalidación inteligente**: Solo cuando es necesario

## Cómo Verificar las Funcionalidades

### 1. Custom Meta Boxes
- Ve a WordPress Admin → Productos → Añadir Nuevo
- Verás el meta box "Detalles del Producto" con todos los campos

### 2. Productos Destacados
- En el meta box, marca "Producto Destacado"
- El producto aparecerá en la sección destacada de la homepage

### 3. Descuentos
- Agrega un porcentaje de descuento en el meta box
- El precio se calculará automáticamente con el descuento

### 4. Caché
- Los productos destacados se cachean por 1 hora
- Se invalidan automáticamente al actualizar productos

### 5. Shortcodes
- Usa `[catalog_products destacados="true" limit="6"]` en cualquier página
- Usa `[catalog_categories limit="4"]` para mostrar categorías

### 6. Widget
- Ve a Apariencia → Widgets
- Agrega "Estadísticas de Catálogo"

### 7. Customizer
- Ve a Apariencia → Personalizar → Configuración del Catálogo
- Ajusta productos por página y opciones de descuentos

