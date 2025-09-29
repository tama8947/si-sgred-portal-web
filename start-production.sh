#!/bin/bash

# Script de inicio para producción
set -e

echo "🚀 Iniciando aplicación en modo producción..."

# Verificar que las variables de entorno estén configuradas
if [ -z "$JWT_SECRET" ] || [ "$JWT_SECRET" = "your-jwt-secret-here-change-in-production" ]; then
    echo "⚠️  ADVERTENCIA: JWT_SECRET no está configurado correctamente para producción"
    echo "   Genera un secreto seguro con: openssl rand -base64 32"
fi

if [ -z "$ADMIN_JWT_SECRET" ] || [ "$ADMIN_JWT_SECRET" = "your-admin-jwt-secret-here-change-in-production" ]; then
    echo "⚠️  ADVERTENCIA: ADMIN_JWT_SECRET no está configurado correctamente para producción"
    echo "   Genera un secreto seguro con: openssl rand -base64 32"
fi

# Crear directorios necesarios
mkdir -p server/.tmp
mkdir -p server/public/uploads

# Verificar que los builds existan
if [ ! -d "server/dist" ]; then
    echo "❌ Error: No se encontró el build del servidor en server/dist"
    echo "   Ejecuta: yarn build:server"
    exit 1
fi

if [ ! -d "client/dist" ]; then
    echo "❌ Error: No se encontró el build del cliente en client/dist"
    echo "   Ejecuta: yarn build"
    exit 1
fi

echo "✅ Verificaciones completadas"

# Iniciar el servidor Strapi en segundo plano
echo "🔧 Iniciando servidor Strapi..."
(cd server && yarn start) &
SERVER_PID=$!

# Esperar a que el servidor esté listo
echo "⏳ Esperando a que el servidor esté disponible..."
npx wait-on http://localhost:1337 --timeout 60000

if [ $? -eq 0 ]; then
    echo "✅ Servidor Strapi iniciado correctamente"
else
    echo "❌ Error: El servidor Strapi no pudo iniciarse"
    kill $SERVER_PID 2>/dev/null || true
    exit 1
fi

# Iniciar el cliente Astro
echo "🌟 Iniciando cliente Astro..."
(cd client && yarn preview) &
CLIENT_PID=$!

# Función para limpiar procesos al salir
cleanup() {
    echo "🛑 Deteniendo servicios..."
    kill $CLIENT_PID 2>/dev/null || true
    kill $SERVER_PID 2>/dev/null || true
    exit 0
}

# Configurar trap para limpiar al salir
trap cleanup SIGINT SIGTERM

echo "🎉 Aplicación iniciada correctamente!"
echo "📍 Strapi Admin: http://localhost:1337/admin"
echo "🌐 Frontend: http://localhost:4321"
echo "📊 API: http://localhost:1337/api"
echo ""
echo "Presiona Ctrl+C para detener la aplicación"

# Esperar a que los procesos terminen
wait $SERVER_PID $CLIENT_PID