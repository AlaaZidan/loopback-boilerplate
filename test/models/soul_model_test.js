/* eslint-env mocha */
/* eslint-disable strict, global-require, func-names, prefer-arrow-callback */
'use strict';

const chai = require('chai');
const expect = chai.expect;
const app = require('../../server/server');
const dbUtils = require('../dbUtils');
const debug = require('debug')('coreapi:test:soul_test');
const _ = require('lodash');

describe('Test Soul model', function () {
  this.timeout(5000);

  // start server at each test
  before((done) => {
    if ('test' !== process.env.NODE_ENV) {
      return done(new Error('NODE_ENV is not set as test'));
    }

    return dbUtils
      .loadOnlyLoopbackDB()
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

  it('should create a new user', function (done) {
    return app.models.Soul
      .create({ email: 'test+user@email.com', password: 'password' })
      .then(user => {
        debug(user);
        expect(user).to.be.a('object');
        return done();
      })
      .catch(err => {
        debug(err);
        return done(err);
      });
  });

  it('should add a new role to the user', function (done) {
    return app.models.Soul
      .create({ email: 'anothertest@email.com', password: 'password' })
      .then(user => user.assignRole('admin'))
      .then(() => app.models.Soul.findOne({
        where: { email: 'anothertest@email.com' },
        include: 'roles',
      }))
      .then(user => {
        debug(user);
        expect(user).to.be.a('object');
        expect(user.roles()).to.be.a('array');
        expect(user.roles()).to.have.lengthOf(1);
        const isAdminRoleFound = _.find(user.roles(), role => 'admin' === role.name);
        expect(isAdminRoleFound).to.be.a('object');
        expect(isAdminRoleFound.name).to.be.equal('admin');
        return done();
      })
      .catch(err => {
        debug(err);
        return done(err);
      });
  });

  it('should remove a role from the user', function (done) {
    return app.models.Soul
      .findOne({ where: { email: 'anothertest@email.com' } })
      .then(user => user.unassignRole('admin'))
      .then(() => app.models.Soul.findOne({
        where: { email: 'anothertest@email.com' },
        include: 'roles',
      }))
      .then(user => {
        debug(user);
        expect(user).to.be.a('object');
        expect(user.roles()).to.be.a('array');
        expect(user.roles()).to.have.lengthOf(0);
        return done();
      })
      .catch(err => {
        debug(err);
        return done(err);
      });
  });
});
