const { i18n } = require('./next-i18next.config');
// const withPlugins = require("next-compose-plugins");
//
// module.exports = withPlugins([], {});

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
  trailingSlash: true,
  i18n
}

module.exports = nextConfig
