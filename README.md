# Plataforma Web de Catálogo Inteligente

WordPress Headless + React/Next.js + API Personalizada

## Estructura del Proyecto

- `wp-content/` - Contenido de WordPress (temas, plugins)
- `nextjs-app/` - Frontend en Next.js
- `docker-compose.yml` - Configuración de Docker
- `wp-config.php` - Configuración de WordPress

## Inicio Rápido

### 1. Iniciar WordPress y PostgreSQL

```bash
docker-compose up -d
```

WordPress estará disponible en `http://localhost:8080`

### 2. Instalar dependencias de Next.js

```bash
cd nextjs-app
npm install
```

### 3. Ejecutar Next.js

```bash
npm run dev
```

Frontend disponible en `http://localhost:3000`

## API Endpoints

- `GET /wp-json/catalog/v1/products` - Listar productos
- `GET /wp-json/catalog/v1/product/{id}` - Obtener producto

### Parámetros de filtrado

- `categoria` - Filtrar por categoría
- `precio_min` / `precio_max` - Rango de precios
- `disponibilidad` - Estado de disponibilidad
- `page` - Número de página
- `per_page` - Productos por página

## Custom Post Types

- **Producto** - Tipo de contenido personalizado para productos
- **Categoría Producto** - Taxonomía para categorizar productos

## Campos Personalizados

- `precio` - Precio del producto
- `disponibilidad` - Estado (disponible/agotado)
- `sku` - Código SKU

