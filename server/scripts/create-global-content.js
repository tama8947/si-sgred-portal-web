#!/usr/bin/env node

/**
 * Script para crear contenido global en Strapi si no existe
 * Uso: node scripts/create-global-content.js
 */

const strapi = require('@strapi/strapi');

async function createGlobalContent() {
  try {
    console.log('🚀 Iniciando creación de contenido global...');
    
    // Inicializar Strapi
    const app = await strapi().load();
    
    const globalUID = 'api::global.global';
    
    // Verificar si el content type existe
    if (!app.contentTypes[globalUID]) {
      console.error('❌ Content type global no encontrado');
      process.exit(1);
    }
    
    console.log('✅ Content type global encontrado');
    
    // Verificar contenido existente
    const existingGlobal = await app.entityService.findMany(globalUID, {
      publicationState: 'live',
    });
    
    if (existingGlobal && (!Array.isArray(existingGlobal) || existingGlobal.length > 0)) {
      console.log('ℹ️  Contenido global ya existe:', existingGlobal);
      console.log('✅ No es necesario crear contenido');
      process.exit(0);
    }
    
    // Crear contenido global por defecto
    const defaultGlobalData = {
      title: 'Global',
      description: 'Page responsible for call out, header, and footer data.',
      banner: null,
      header: null,
      footer: null,
      publishedAt: new Date(),
    };
    
    console.log('📝 Creando contenido global con datos por defecto...');
    
    const createdGlobal = await app.entityService.create(globalUID, {
      data: defaultGlobalData,
    });
    
    console.log('✅ Contenido global creado exitosamente:', {
      id: createdGlobal.id,
      title: createdGlobal.title,
      publishedAt: createdGlobal.publishedAt
    });
    
    // Verificar que se puede acceder vía API
    try {
      const apiResult = await app.service(globalUID).find({
        populate: '*'
      });
      console.log('🌐 Verificación de API exitosa - contenido accesible');
    } catch (apiError) {
      console.error('⚠️  Advertencia - Error en verificación de API:', apiError.message);
    }
    
    console.log('🎉 Proceso completado exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la creación:', error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

createGlobalContent();