# 🛍️ Plataforma Web de Catálogo Inteligente

**WordPress Headless + React/Next.js + API REST Personalizada**

Plataforma web moderna basada en arquitectura Headless, donde WordPress funciona como administrador de contenido (CMS) y React/Next.js como frontend dinámico. El sistema incluye temas personalizados, plugins propios en PHP, Custom Post Types, API REST extendida, optimización de performance y buenas prácticas de seguridad.

![Pantalla Principal](fotos/pantalla%20principal.png)

## 📋 Tabla de Contenidos

- [Características Principales](#características-principales)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Funcionalidades Avanzadas](#funcionalidades-avanzadas)
- [API Endpoints](#api-endpoints)
- [Capturas de Pantalla](#capturas-de-pantalla)
- [Desarrollo](#desarrollo)

## ✨ Características Principales

### WordPress Avanzado
- ✅ Tema personalizado desde cero (sin builders)
- ✅ Plugin propio para endpoints adicionales
- ✅ Custom Post Types: Productos
- ✅ Custom Taxonomies: Categorías
- ✅ Hooks y filtros: `add_action`, `add_filter`
- ✅ Shortcodes para componentes dinámicos
- ✅ Seguridad: Sanitización, Nonces, Validación

### API REST Extendida
- ✅ Endpoints personalizados: `/wp-json/catalog/v1/products`
- ✅ Filtros por: Categoría, Precio, Disponibilidad, Destacados, Descuentos
- ✅ Cálculo automático de precios con descuentos
- ✅ Autenticación y permisos

### Frontend en React/Next.js
- ✅ Consumo en tiempo real de API Headless
- ✅ Páginas dinámicas con `getServerSideProps`
- ✅ Componentes reutilizables (Cards, Listas, Grid)
- ✅ Hooks personalizados (useProducts, useDebounce)
- ✅ Carrito de compras con Context API
- ✅ Persistencia en localStorage
- ✅ TailwindCSS para maquetación optimizada
- ✅ SEO técnico: `<Head>` dinámico, Schema JSON, Sitemaps

### Integración Full Stack
- ✅ Panel para administradores (React) conectado al WordPress REST API
- ✅ Sistema de búsqueda con debounce
- ✅ Prefetch de datos para mejorar performance
- ✅ Sistema de caché con Transients

## 🛠️ Tecnologías Utilizadas

### Backend
- **WordPress** - CMS Headless
- **PHP 8+** - Lenguaje del servidor
- **MySQL** - Base de datos
- **PostgreSQL** - Base de datos adicional
- **Docker** - Contenedores

### Frontend
- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **TypeScript** - Tipado estático
- **TailwindCSS** - Framework CSS
- **Context API** - Gestión de estado

### DevOps
- **Docker Compose** - Orquestación de contenedores
- **Git** - Control de versiones
- **GitFlow** - Flujo de trabajo

## 📁 Estructura del Proyecto

```
wordpress/
├── wp-content/
│   ├── themes/
│   │   └── catalog-theme/          # Tema personalizado
│   │       ├── functions.php        # CPT, Taxonomies, Hooks
│   │       ├── style.css
│   │       └── ...
│   └── plugins/
│       └── catalog-api/             # Plugin personalizado
│           ├── catalog-api.php      # API REST endpoints
│           └── advanced-features.php # Funcionalidades avanzadas
├── nextjs-app/                      # Frontend Next.js
│   ├── app/                         # App Router
│   │   ├── page.tsx                 # Homepage
│   │   ├── carrito/                 # Página de carrito
│   │   └── productos/[slug]/        # Detalle de producto
│   ├── components/                  # Componentes React
│   │   ├── ProductCard.tsx
│   │   ├── ProductGrid.tsx
│   │   ├── CartContext.tsx
│   │   └── ...
│   ├── hooks/                       # Custom Hooks
│   │   ├── useProducts.ts
│   │   └── useDebounce.ts
│   └── lib/                         # Utilidades
│       └── api.ts                   # Cliente API
├── docker-compose.yml               # Configuración Docker
├── wp-config.php                    # Config WordPress
└── README.md
```

## 🚀 Instalación

### Requisitos Previos
- Docker y Docker Compose
- Node.js 18+ y npm
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/CarlosAHP/wordpress-headless-react-platform.git
cd wordpress-headless-react-platform
```

2. **Iniciar servicios Docker**
```bash
docker-compose up -d
```

3. **Configurar WordPress**
- Abre `http://localhost:8080` en tu navegador
- Completa la instalación de WordPress
- Activa el tema "Catalog Theme"
- Activa el plugin "Catalog API"
- Configura Permalinks: **Configuración → Enlaces permanentes → "Nombre de la entrada"**

4. **Instalar dependencias de Next.js**
```bash
cd nextjs-app
npm install
```

5. **Ejecutar Next.js**
```bash
npm run dev
```

El frontend estará disponible en `http://localhost:3000`

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` en `nextjs-app/` (opcional):
```env
WORDPRESS_API_URL=http://localhost:8080/wp-json
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Crear Productos de Prueba

Ejecuta el script para crear productos de ejemplo:
```bash
docker exec catalog_wordpress php /var/www/html/create-sample-products.php
```

O desde el navegador (debes estar logueado):
```
http://localhost:8080/create-sample-products.php
```

## 🔧 Funcionalidades Avanzadas

### Técnicas Avanzadas de WordPress/PHP

#### 1. Custom Meta Boxes
- Meta box personalizado con campos: precio, SKU, stock, descuento, disponibilidad
- Validación y sanitización de datos
- Nonces para seguridad

#### 2. Sistema de Caché con Transients
- Caché de productos destacados (1 hora)
- Invalidación automática al actualizar
- Reducción de consultas a BD

#### 3. Hooks y Filtros Personalizados
```php
add_action('catalog_product_viewed', 'catalog_log_product_view');
add_filter('the_title', 'catalog_modify_product_title', 10, 2);
add_filter('the_content', 'catalog_filter_product_content');
```

#### 4. WP_Query Avanzado
- Meta queries múltiples
- Tax queries para categorías
- Filtros combinados (destacados + disponibles)

#### 5. Shortcodes Avanzados
```php
[catalog_products destacados="true" limit="6"]
[catalog_products descuento="true" categoria="electronica"]
[catalog_categories limit="4" show_count="true"]
```

#### 6. Cron Jobs Personalizados
- Limpieza automática de caché cada hora
- `wp_schedule_event()` con hooks personalizados

#### 7. Widget Personalizado
- Estadísticas de catálogo en tiempo real
- Caché de resultados
- Interfaz de administración

#### 8. Customizer API
- Configuración de productos por página
- Opciones de visualización
- Sanitización automática

#### 9. REST API Extendida
- Filtros avanzados: destacados, descuentos
- Cálculo automático de precios finales
- Campos adicionales: stock, producto_destacado

#### 10. Seguridad
- Nonces en formularios
- Capability checks
- Sanitización de inputs
- Escapado de outputs

Ver documentación completa en [TECNICAS-AVANZADAS.md](TECNICAS-AVANZADAS.md)

## 📡 API Endpoints

### Endpoints Principales

#### Listar Productos
```
GET /wp-json/catalog/v1/products
```

**Parámetros:**
- `categoria` - Filtrar por categoría (slug)
- `precio_min` / `precio_max` - Rango de precios
- `disponibilidad` - Estado (disponible/agotado/preventa)
- `destacados` - Solo destacados (true/false)
- `descuento` - Solo con descuento (true/false)
- `page` - Número de página
- `per_page` - Productos por página

**Ejemplo:**
```bash
curl "http://localhost:8080/wp-json/catalog/v1/products?destacados=true&per_page=6"
```

#### Obtener Producto
```
GET /wp-json/catalog/v1/product/{id}
```

#### Crear Producto (Requiere autenticación)
```
POST /wp-json/catalog/v1/product
```

#### Actualizar Producto (Requiere autenticación)
```
PUT /wp-json/catalog/v1/product/{id}
```

#### Eliminar Producto (Requiere autenticación)
```
DELETE /wp-json/catalog/v1/product/{id}
```

## 📸 Capturas de Pantalla

### Pantalla Principal
![Pantalla Principal](fotos/pantalla%20principal.png)
Homepage con hero section, categorías destacadas y productos destacados.

### Listado de Productos
![Listado de Productos](fotos/Captura%20de%20listado%20de%20productos.png)
Grid de productos con filtros, precios con descuentos y botones de carrito.

### Carrito de Compras
![Carrito de Compras](fotos/Carrito%20de%20compras.png)
Página de carrito con resumen, modificación de cantidades y totales.

## 🎯 Características del Frontend

### Carrito de Compras
- ✅ Context API para gestión de estado
- ✅ Persistencia en localStorage
- ✅ Agregar/quitar productos
- ✅ Modificar cantidades
- ✅ Cálculo automático de totales
- ✅ Contador en tiempo real

### Componentes Principales
- **Hero** - Sección principal con CTA
- **FeaturedCategories** - Grid de categorías destacadas
- **FeaturedProducts** - Productos destacados
- **ProductGrid** - Grid responsive de productos
- **ProductCard** - Tarjeta individual con descuentos
- **Filters** - Sistema de filtros con debounce
- **Navigation** - Barra de navegación sticky

### Hooks Personalizados
- `useProducts` - Gestión de productos y filtros
- `useDebounce` - Debounce para búsquedas
- `useCart` - Gestión del carrito

## 🔐 Seguridad

- ✅ Sanitización de todos los inputs
- ✅ Nonces en formularios
- ✅ Validación de permisos
- ✅ Escapado de outputs
- ✅ Protección contra SQL injection
- ✅ Validación de tipos de datos

## 🚦 Desarrollo

### Scripts Disponibles

```bash
# Verificar estado del sistema
./check-status.sh

# Crear productos de prueba
./crear-productos.sh

# Reiniciar servicios Docker
docker-compose restart

# Ver logs de WordPress
docker logs catalog_wordpress

# Ver logs de Next.js
# (en la terminal donde corre npm run dev)
```

### GitFlow

El proyecto usa GitFlow:
- `develop` - Rama de desarrollo
- `staging` - Rama de pruebas
- `main` - Rama de producción

## 📝 Custom Post Types y Taxonomies

### Custom Post Type: Producto
- Slug: `producto`
- REST Base: `products`
- Campos personalizados: precio, SKU, stock, descuento, disponibilidad, producto_destacado

### Custom Taxonomy: Categoría Producto
- Slug: `categoria_producto`
- REST Base: `product-categories`
- Jerárquica: Sí

## 🎨 Personalización

### Agregar Campos Personalizados

Edita `wp-content/themes/catalog-theme/functions.php`:
```php
function catalog_add_custom_field() {
    // Tu código aquí
}
add_action('save_post_producto', 'catalog_save_custom_field');
```

### Modificar Estilos

Los estilos del frontend están en:
- `nextjs-app/app/globals.css` - Estilos globales
- `nextjs-app/tailwind.config.js` - Configuración Tailwind

## 📚 Documentación Adicional

- [Técnicas Avanzadas](TECNICAS-AVANZADAS.md) - Documentación detallada de funcionalidades avanzadas

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la [MIT License](LICENSE).

## 👤 Autor

**Carlos AHP**
- GitHub: [@CarlosAHP](https://github.com/CarlosAHP)

## 🙏 Agradecimientos

- WordPress Community
- Next.js Team
- TailwindCSS
- Docker Community

---

⭐ Si te gusta este proyecto, dale una estrella en GitHub!
