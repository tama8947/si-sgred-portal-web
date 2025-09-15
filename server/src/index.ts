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
  bootstrap({ strapi }) {
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
