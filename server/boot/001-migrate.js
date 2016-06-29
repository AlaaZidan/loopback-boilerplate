const debug = require('debug')('coreapi:migrate');

module.exports = function migrateCoreMysql(server) {
  const Role = server.models.Role;

  return server
    .datasources.coreMysql
    .autoupdate()
    .then(() => {
      debug('Database tables updated');

      // TODO: add custom roles
      return Promise.all([
        Role.findOrCreate({ where: { name: 'admin' } }, { name: 'admin' }),
      ]);
    })
    .then(() => {
      debug('All roles created');
    })

    .catch((err) => {
      debug(err);
      throw err;
    });
};
