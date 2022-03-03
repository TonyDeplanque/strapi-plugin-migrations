'use strict';

module.exports = async ({strapi}) => {
  const config = strapi.config.get('plugin.migrations');
  if (config.autoStart) {
    await strapi.plugin('migrations').service('migrations').migrations()
  }
};
