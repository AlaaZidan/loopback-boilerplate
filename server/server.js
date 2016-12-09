const loopback = require('loopback');
const boot = require('loopback-boot');
const debug = require('debug')('boilerplate:server');

const app = module.exports = loopback();

// https://docs.strongloop.com/display/public/LB/Making+authenticated+requests
app.use(loopback.token({ model: app.models.accessToken, currentUserLiteral: 'me' }));

app.start = function start() {
  // start the web server
  return app.listen(() => {
    app.emit('started');
    const baseUrl = app.get('url').replace(/\/$/, '');
    debug('Web server listening at: %s', baseUrl);
    if (app.get('loopback-component-explorer')) {
      const explorerPath = app.get('loopback-component-explorer').mountPath;
      debug('Browse your REST API at %s%s', baseUrl, explorerPath);
    }
  });
};

// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, (err) => {
  if (err) throw err;

  // start the server if `$ node server.js`
  if (require.main === module) {
    app.start();
  }
});
