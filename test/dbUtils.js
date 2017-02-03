const _ = require('lodash');
const mysql = require('mysql2');
const fs = require('fs');
const debug = require('debug')('boilerplate:test:dbutils');
const Promise = require('bluebird');
const server = require('../server/server');

const loadSQLScripts = (scriptsDirs) => {
  if (undefined === process.env.MYSQL_USER) {
    throw new Error('process.env.MYSQL_USER is not set');
  }

  if (undefined === process.env.MYSQL_PASSWORD) {
    throw new Error('process.env.MYSQL_PASSWORD is not set');
  }

  const connectionSettings = {
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    multipleStatements: true,
  };
  debug(connectionSettings);
  let dirs = [];
  if (_.isArray(scriptsDirs)) {
    dirs = scriptsDirs;
  } else {
    dirs.push(scriptsDirs);
  }

  const fileNames = [];

  _.each(dirs, (scriptsDir) => {
    const dirFiles = fs.readdirSync(scriptsDir);
    _.each(dirFiles, (fileName) => {
      fileNames.push(`${scriptsDir}/${fileName}`);
    });
  });

  let connection;
  return mysql.createConnectionPromise(connectionSettings)
    .then((_connection) => {
      connection = _connection;
      return Promise
        .each(fileNames, (fileName) => {
          debug(fileName);
          return connection.query(fs.readFileSync(fileName, 'utf8').toString());
        });
    })
    .then(() => {
      const createMysqlUserScript = 'test/db_populate_data/createMysqlUser.sql';
      debug(createMysqlUserScript);
      return connection.query(fs.readFileSync(createMysqlUserScript, 'utf8').toString());
    })
    .then(() => connection.end().catch(() => connection.destroy()))
    .then(() => { });
};

// const loadJSONScripts = (scriptDirs) => {
//   const isEmpty = !scriptDirs;
//   return Promise.resolve(() => isEmpty);
// };

const createUserWithRole = (email, password, roleName) => {
  if (undefined === roleName) {
    return server.models.MyUser.create({ email, password });
  }

  return server.models.MyUser
    .create({ email, password })
    .then(user => user.assignRole(roleName));
};


const startloopbackApp = (app) => {
  app.start();
  return new Promise((resolve, reject) => {
    app.on('started', resolve);
    app.on('error', reject);
  });
};

/* eslint-disable global-require */
const loadLoopbackApp = () => Promise.resolve(require('../server/server'));
/* eslint-enable */


const loadOnlyLoopbackDB = app =>
  server.datasources.db.automigrate()
    .then(() => {
      const Role = server.models.Role;
      debug('Database tables updated');

      // TODO: add custom roles
      return Promise.all([
        Role.findOrCreate({ where: { name: 'admin' } }, { name: 'admin' }),
      ]);
    })
    .then(() => app);


// TODO: add test users
const populateLooopbackDB = app =>
  Promise.all([
    createUserWithRole('test+admin@email.com', 'foo', 'admin'),
  ])
    .then(() => {
      debug('Test users with roles created');
    })
    .then(() => { })
    .then(() => app);

const loadAndPopulateAllDBS = scriptsDirs =>
  loadSQLScripts(scriptsDirs)
    // loadJSONScripts(scriptsDirs)
    .then(() => loadLoopbackApp())
    .then(app => loadOnlyLoopbackDB(app))
    .then(app => populateLooopbackDB(app))
    .catch(err => debug(err));

exports.loadLegacyDBs = loadSQLScripts;
exports.populateLooopbackDB = populateLooopbackDB;
exports.loadOnlyLoopbackDB = () => loadLoopbackApp().then(app => loadOnlyLoopbackDB(app));
exports.loadAndPopulateAllDBS = loadAndPopulateAllDBS;
exports.startloopbackApp = startloopbackApp;
exports.loadLoopbackApp = loadLoopbackApp;
