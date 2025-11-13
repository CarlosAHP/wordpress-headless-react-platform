#!/bin/bash

echo "Creando productos y categorías de ejemplo..."
echo ""
echo "Opción 1: Ejecutar desde navegador (recomendado)"
echo "  Abre: http://localhost:8080/create-sample-products.php"
echo "  (Debes estar logueado como administrador)"
echo ""
echo "Opción 2: Ejecutar desde terminal"
echo "  docker exec -it catalog_wordpress php /var/www/html/create-sample-products.php"
echo ""

read -p "¿Ejecutar desde terminal ahora? (s/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Ss]$ ]]; then
    docker exec catalog_wordpress php /var/www/html/create-sample-products.php
fi

