# Solución para Error 404 en /api/global durante Build de Producción

## Problema
Durante el build en el servidor de producción, aparece el error:
```
Request failed with status code 404 Not Found: GET http://localhost:1337/api/global
```

## Causa
El error ocurre porque el contenido global no existe en la base de datos de producción o no está publicado.

## Soluciones Implementadas

### 1. Creación Automática en Bootstrap
Se agregó una función en `server/src/index.ts` que automáticamente:
- Configura permisos públicos para el endpoint `/api/global`
- Crea contenido global por defecto si no existe
- Se ejecuta cada vez que Strapi inicia

### 2. Scripts de Diagnóstico y Reparación

#### Verificar Estado del Contenido Global
```bash
cd server
node scripts/check-global-content.js
```

Este script verifica:
- Si el content type global existe
- Si hay contenido publicado
- Si los permisos públicos están configurados
- Si la API responde correctamente

#### Crear Contenido Global Manualmente
```bash
cd server
node scripts/create-global-content.js
```

Este script:
- Crea contenido global por defecto si no existe
- Verifica que el contenido sea accesible vía API
- Proporciona logs detallados del proceso

## Instrucciones para el Servidor de Producción

### Opción 1: Reiniciar Strapi (Recomendado)
```bash
# Detener el servidor actual
# Reiniciar Strapi para que ejecute el bootstrap automático
cd server
yarn develop
# o
yarn start
```

### Opción 2: Ejecutar Script Manual
```bash
# Si no puedes reiniciar, ejecuta el script manual
cd server
node scripts/create-global-content.js
```

### Opción 3: Verificar y Diagnosticar
```bash
# Para diagnosticar el problema
cd server
node scripts/check-global-content.js
```

## Configuraciones Aplicadas

### Permisos Públicos
- `api::global.global.find` - Permitido para rol público
- `api::global.global.findOne` - Permitido para rol público

### CORS
Configurado para permitir acceso desde:
- `http://localhost:4321` (desarrollo)
- `http://localhost:3000` (desarrollo)
- `https://infogred_qa.cali.gov.co` (QA)
- Variable de entorno `CLIENT_URL`

### Contenido Global por Defecto
```json
{
  "title": "Global",
  "description": "Page responsible for call out, header, and footer data.",
  "banner": null,
  "header": null,
  "footer": null,
  "publishedAt": "fecha_actual"
}
```

## Verificación Post-Solución

Después de aplicar cualquiera de las soluciones, verifica que funcione:

```bash
# Probar la API directamente
curl "http://localhost:1337/api/global"

# Ejecutar el build
yarn build
```

## Notas Importantes

1. **Base de Datos**: Asegúrate de que la base de datos de producción esté accesible
2. **Permisos**: Los scripts requieren que Strapi pueda escribir en la base de datos
3. **Logs**: Revisa los logs de Strapi para mensajes sobre la creación automática del contenido
4. **Backup**: Considera hacer backup de la base de datos antes de ejecutar scripts

## Logs Esperados

Cuando la solución funciona correctamente, deberías ver en los logs de Strapi:
```
info: Permiso público ya existe: api::global.global.find
info: Permiso público ya existe: api::global.global.findOne
info: Contenido global ya existe
```

O si se crea por primera vez:
```
info: Permiso público creado: api::global.global.find
info: Permiso público creado: api::global.global.findOne
info: Contenido global creado automáticamente: [ID]
```