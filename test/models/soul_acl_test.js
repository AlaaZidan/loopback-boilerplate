/* eslint-env mocha */
/* eslint-disable strict, global-require, func-names */
'use strict';

const chai = require('chai');
const expect = chai.expect;
const utils = require('../testUtils');
const app = require('../../server/server');
const dbUtils = require('../dbUtils');
const debug = require('debug')('coreapi:test:soul_test');
const _ = require('lodash');

describe('Test Soul ACL', function () {
  this.timeout(5000);

  // start server at each test
  before((done) => {
    if ('test' !== process.env.NODE_ENV) {
      return done(new Error('NODE_ENV is not set as test'));
    }

    // TODO: create scripts
    return dbUtils
      .loadOnlyLoopbackDB()
      .then(() => dbUtils.populateLooopbackDB())

      // .loadAndPopulateAllDBS([
      //   // 'test/sql/loadScript1.sql',
      //   // 'test/sql/loadScript2.sql',
      //   'test/db_populate_data/populate_data.sql',
      // ])
      .then(done)
      .catch(err => {
        debug(err);
        return done(err);
      });
  });

  after((done) => {
    app.removeAllListeners('started');
    app.removeAllListeners('loaded');
    done();
  });

  it('POST login', (done) => {
    utils(app).json('post', '/Souls/login')
      .send({
        email: 'test+notexisting@email.com',
        password: 'foo',
      })
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.a('object');
        expect(res.body.userId).to.be.a('number');
        return app.models.Soul.findById(res.body.userId, { include: 'roles' })
          .then((soul) => {
            expect(soul).to.be.a('object');
            expect(soul.roles()).to.be.a('array');
            expect(soul.roles()).to.have.length.of.at.least(1);
            const isAdminRoleFound = _.find(soul.roles(), role => 'admin' === role.name);
            expect(isAdminRoleFound).to.be.a('object');
            expect(isAdminRoleFound.name).to.be.equal('admin');

            return done();
          })
          .catch((errCatch) =>
            done(errCatch)
          );
      });
  });

  it('GET /Souls as anonymous', (done) =>
    utils(app)
      .json('get', '/Souls')
      .expect(401, done)
  );

  it('POST logout', (done) => {
    utils(app).json('post', '/Souls/login')
      .send({
        email: 'test+admin@email.com',
        password: 'foo',
      })
      .expect(200)
      .end((err, res) => {
        expect(res.body).to.be.a('object');
        if (err) return done(err);
        return utils(app).json('post', '/Souls/logout', {}, res.body.id)
          .send({})
          .expect(204, done);
      });
  });
});
