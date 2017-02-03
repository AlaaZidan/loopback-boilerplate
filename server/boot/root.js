const version = require('../version.json');

const tag = version.tag || 'NOTAG';
const short = version.short || 'NOCOMMIT';
const branch = version.branch || 'NOBRANCH';
const message = version.message || 'NOMESSAGE';
const vnumber = version.vnumber || 'NOMESSAGE';

const started = new Date();

module.exports = (server) => {
  const baseUrl = process.env.API_HOST_URL || 'http://localhost:3000';
  const explorerPath =
    server.get('loopback-component-explorer') ?
      server.get('loopback-component-explorer').mountPath : undefined;

  const modelDiagramPath =
    server.get('loopback-component-model-diagram') ?
      server.get('loopback-component-model-diagram').mountPath : undefined;


  // Install a `/` route that returns server status
  const router = server.loopback.Router();
  router.get('/', (req, resp) => {
    const versionResp = {
      started,
      uptime: (Date.now() - Number(started)) / 1000,
      version: `${vnumber}-${short}`,
      link: `https://github.com/redbabel/loopback-boilerplate/commit/${short}`,
      tag: `${tag}`,
      commit: `${short}`,
      branch: `${branch}`,
      message: `${message}`,
      explorer: `${baseUrl}${explorerPath}`,
      modelDiagram: `${baseUrl}${modelDiagramPath}`,
    };
    return resp.status(200).send(versionResp);
  });

  server.use(router);
};
