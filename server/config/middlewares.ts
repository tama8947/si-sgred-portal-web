export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: [
        'http://localhost:4321', // Astro dev server
        'http://localhost:3000', // Posible puerto alternativo
        'https://infogred_qa.cali.gov.co', // Producción
        process.env.CLIENT_URL || 'http://localhost:4321'
      ]
    }
  },
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
