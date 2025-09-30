// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  async bootstrap({ strapi }) {
    // Configurar permisos públicos para el content type global
    await configurePublicPermissions(strapi);

    // Crear contenido global si no existe
    await ensureGlobalContent(strapi);

    // Ejemplo: upsert por slug en un Content Type "category"
    const UID = 'api::category-document.category-document';

    if (!strapi.contentTypes[UID]) {
      strapi.log.warn(`Seed omitido: no existe el CT ${UID}`);
      return;
    }

    const repo = strapi.db.query(UID);

    const ensure = async (where, data) => {
      const found = await repo.findOne({ where });
      if (!found) {
        await repo.create({ data });
        strapi.log.info(`Seed creado: ${data.title || data.slug || 'sin-titulo'}`);
      } else {
        strapi.log.info(`Seed omitido (existe): ${data.title || data.slug || 'sin-titulo'}`);
      }
    };
  },
};

async function configurePublicPermissions(strapi) {
  try {
    // Obtener el rol público
    const publicRole = await strapi
      .query('plugin::users-permissions.role')
      .findOne({ where: { type: 'public' } });

    if (!publicRole) {
      strapi.log.error('No se encontró el rol público');
      return;
    }

    // Configurar permisos para el content type global
    const globalPermissions = [
      {
        action: 'api::global.global.find',
        subject: null,
        properties: {},
        conditions: [],
      },
      {
        action: 'api::global.global.findOne',
        subject: null,
        properties: {},
        conditions: [],
      }
    ];

    for (const permission of globalPermissions) {
      const existingPermission = await strapi
        .query('plugin::users-permissions.permission')
        .findOne({
          where: {
            action: permission.action,
            role: publicRole.id,
          },
        });

      if (!existingPermission) {
        await strapi.query('plugin::users-permissions.permission').create({
          data: {
            ...permission,
            role: publicRole.id,
          },
        });
        strapi.log.info(`Permiso público creado: ${permission.action}`);
      } else {
        strapi.log.info(`Permiso público ya existe: ${permission.action}`);
      }
    }
  } catch (error) {
    strapi.log.error('Error configurando permisos públicos:', error);
  }
}

async function ensureGlobalContent(strapi) {
  try {
    const globalUID = 'api::global.global';
    
    if (!strapi.contentTypes[globalUID]) {
      strapi.log.warn('Content type global no encontrado');
      return;
    }

    // Verificar si ya existe contenido global
    const existingGlobal = await strapi.entityService.findMany(globalUID, {
      publicationState: 'live',
    });

    if (!existingGlobal || (Array.isArray(existingGlobal) && existingGlobal.length === 0)) {
      // Crear contenido global por defecto
      const defaultGlobalData = {
        title: 'Global',
        description: 'Page responsible for call out, header, and footer data.',
        banner: null,
        header: null,
        footer: null,
        publishedAt: new Date(),
      };

      const createdGlobal = await strapi.entityService.create(globalUID, {
        data: defaultGlobalData,
      });

      strapi.log.info('Contenido global creado automáticamente:', createdGlobal.id);
    } else {
      strapi.log.info('Contenido global ya existe');
    }
  } catch (error) {
    strapi.log.error('Error creando contenido global:', error);
  }
}
