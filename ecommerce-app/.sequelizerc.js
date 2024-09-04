const path = require('path');

module.exports = {
  'config': path.resolve('src/app/config', 'config.json'),
  'models-path': path.resolve('src/app/models'),
  'seeders-path': path.resolve('src/app/seeders'),
  'migrations-path': path.resolve('src/app/migrations')
};
