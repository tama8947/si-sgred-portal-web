export default ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  url: process.env.NODE_ENV === 'development' ? undefined : env('PUBLIC_URL', 'https://infogred_qa.cali.gov.co/cms'),
  proxy : { enabled: true, ssl: true },
});
