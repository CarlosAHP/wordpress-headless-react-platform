#!/bin/bash

echo "=========================================="
echo "  VERIFICACIÓN DEL SISTEMA"
echo "=========================================="
echo ""

echo "1. Servicios Docker:"
docker-compose ps
echo ""

echo "2. WordPress REST API Base:"
WP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/wp-json)
if [ "$WP_STATUS" = "200" ]; then
    echo "   ✓ WordPress REST API respondiendo (Status: $WP_STATUS)"
    curl -s http://localhost:8080/wp-json | python3 -m json.tool 2>/dev/null | grep -E '"name"|"description"' | head -2
else
    echo "   ✗ WordPress no responde correctamente (Status: $WP_STATUS)"
    echo "   → Abre http://localhost:8080 para configurar WordPress"
fi
echo ""

echo "3. API Personalizada de Catálogo:"
CATALOG_RESPONSE=$(curl -s "http://localhost:8080/wp-json/catalog/v1/products")
if echo "$CATALOG_RESPONSE" | grep -q "products"; then
    echo "   ✓ API de catálogo funcionando"
    echo "$CATALOG_RESPONSE" | python3 -m json.tool 2>/dev/null | head -15
else
    echo "   ✗ API de catálogo no disponible"
    echo "   → Verifica que el plugin 'Catalog API' esté activado en WordPress"
fi
echo ""

echo "4. Next.js Frontend:"
NEXT_STATUS=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:3000)
if [ "$NEXT_STATUS" = "200" ]; then
    echo "   ✓ Next.js respondiendo (Status: $NEXT_STATUS)"
    echo "   → Abre http://localhost:3000 en tu navegador"
else
    echo "   ✗ Next.js no responde (Status: $NEXT_STATUS)"
    echo "   → Ejecuta: cd nextjs-app && npm run dev"
fi
echo ""

echo "5. Next.js API Route:"
API_ROUTE_RESPONSE=$(curl -s "http://localhost:3000/api/products")
if echo "$API_ROUTE_RESPONSE" | grep -q "products\|error"; then
    echo "   ✓ API Route funcionando"
    echo "$API_ROUTE_RESPONSE" | python3 -m json.tool 2>/dev/null | head -10
else
    echo "   ⚠ API Route puede tener problemas"
fi
echo ""

echo "=========================================="
echo "  RESUMEN"
echo "=========================================="
echo ""
echo "URLs importantes:"
echo "  • WordPress Admin: http://localhost:8080/wp-admin"
echo "  • WordPress REST API: http://localhost:8080/wp-json"
echo "  • Catálogo API: http://localhost:8080/wp-json/catalog/v1/products"
echo "  • Next.js Frontend: http://localhost:3000"
echo "  • Panel Admin: http://localhost:3000/admin"
echo ""

