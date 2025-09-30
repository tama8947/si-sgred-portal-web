#!/usr/bin/env node

/**
 * Script para verificar el estado del contenido global en Strapi
 * Uso: node scripts/check-global-content.js
 */

const strapi = require('@strapi/strapi');

async function checkGlobalContent() {
  try {
    console.log('🔍 Iniciando verificación del contenido global...');
    
    // Inicializar Strapi
    const app = await strapi().load();
    
    const globalUID = 'api::global.global';
    
    // Verificar si el content type existe
    if (!app.contentTypes[globalUID]) {
      console.error('❌ Content type global no encontrado');
      process.exit(1);
    }
    
    console.log('✅ Content type global encontrado');
    
    // Verificar contenido publicado
    const publishedGlobal = await app.entityService.findMany(globalUID, {
      publicationState: 'live',
    });
    
    console.log('📊 Contenido global publicado:', publishedGlobal);
    
    // Verificar contenido en borrador
    const draftGlobal = await app.entityService.findMany(globalUID, {
      publicationState: 'preview',
    });
    
    console.log('📝 Contenido global en borrador:', draftGlobal);
    
    // Verificar permisos públicos
    const publicRole = await app.query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });
    
    if (publicRole) {
      const permissions = await app.query('plugin::users-permissions.permission')
        .findMany({
          where: { role: publicRole.id },
          filters: {
            action: {
              $contains: 'global'
            }
          }
        });
      
      console.log('🔐 Permisos públicos para global:', permissions);
    }
    
    // Probar la API directamente
    try {
      const apiResult = await app.service(globalUID).find({
        populate: '*'
      });
      console.log('🌐 Resultado de API:', apiResult);
    } catch (apiError) {
      console.error('❌ Error en API:', apiError.message);
    }
    
    console.log('✅ Verificación completada');
    
  } catch (error) {
    console.error('❌ Error durante la verificación:', error);
  } finally {
    process.exit(0);
  }
}

checkGlobalContent();