'use strict';
const migrations = require('../services/migrations')

module.exports = {
  default: ({ env }) => ({
    autoStart: env('MIGRATION_AUTO_START') === 'true' ?? false,
    migrationFolderPath : env('MIGRATION_FOLDER_PATH') ?? 'migrations'
  })
};
