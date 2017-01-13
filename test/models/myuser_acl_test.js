/* eslint-disable func-names */

const chai = require('chai');

const expect = chai.expect;
const utils = require('../testUtils');
const dbUtils = require('../dbUtils');
const debug = require('debug')('boilerplate:test:myser');

let app;

// http://tobyho.com/2015/12/16/mocha-with-promises/
describe('Test MyUser ACL', function () {
  this.timeout(5000);

  // start server at each test
  before(() => {
    if ('test' !== process.env.NODE_ENV) {
      return Promise.reject(new Error('NODE_ENV is not set as test'));
    }

    return dbUtils
      .loadAndPopulateAllDBS([])
      .then((_app) => {
        app = _app;
      })

      .catch((err) => {
        debug(err);
        throw err;
      });
  });

  after((done) => {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  it('should not login an unknown user', () =>
    utils(app).json('post', '/MyUsers/login')
      .send({
        email: 'test+notexisting@email.com',
        password: 'foo',
      })
      .expect(401));


  it('GET /MyUsers as anonymous', () =>
    utils(app).json('get', '/MyUsers').expect(401));

  it('POST logout', (done) => {
    utils(app).json('post', '/MyUsers/login')
      .send({
        email: 'test+admin@email.com',
        password: 'foo',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.a('object');
        if (err) return done(err);
        return utils(app).json('post', '/MyUsers/logout', {}, res.body.id)
          .send({})
          .expect(204, done);
      });
  });
});
