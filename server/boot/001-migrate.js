const debug = require('debug')('boilerplate:migrate');

module.exports = function migrateDatabase(server) {
  const Role = server.models.Role;

  if ('test' === process.env.NODE_ENV) {
    return Promise.resolve();
  }

  return server.datasources.db.autoupdate()
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
