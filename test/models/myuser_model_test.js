/* eslint-env mocha */
/* eslint-disable global-require, func-names, prefer-arrow-callback */

const chai = require('chai');

const expect = chai.expect;
const dbUtils = require('../dbUtils');
const debug = require('debug')('boilerplate:test:MyUser_test');
const _ = require('lodash');

let app;

// http://tobyho.com/2015/12/16/mocha-with-promises/
describe('Test MyUser model', function () {
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

  it('should create a new user', () =>
    app.models.MyUser
      .create({ email: 'test+user@email.com', password: 'password' })
      .then((user) => {
        debug(user);
        expect(user).to.be.a('object');
      })
      .catch((err) => {
        debug(err);
        throw err;
      }));

  it('should add a new role to the user', () =>
    app.models.MyUser
      .create({ email: 'anothertest@email.com', password: 'password' })
      .then(user => user.assignRole('admin'))
      .then(() => app.models.MyUser.findOne({
        where: { email: 'anothertest@email.com' },
        include: 'roles',
      }))
      .then((user) => {
        debug(user);
        expect(user).to.be.a('object');
        expect(user.roles()).to.be.a('array');
        expect(user.roles()).to.have.lengthOf(1);
        const isAdminRoleFound = _.find(user.roles(), role => 'admin' === role.name);
        expect(isAdminRoleFound).to.be.a('object');
        expect(isAdminRoleFound.name).to.be.equal('admin');
      })
      .catch((err) => {
        debug(err);
        throw err;
      }));

  it('should remove a role from the user', () =>
    app.models.MyUser
      .findOne({ where: { email: 'anothertest@email.com' } })
      .then(user => user.unassignRole('admin'))
      .then(() => app.models.MyUser.findOne({
        where: { email: 'anothertest@email.com' },
        include: 'roles',
      }))
      .then((user) => {
        debug(user);
        expect(user).to.be.a('object');
        expect(user.roles()).to.be.a('array');
        expect(user.roles()).to.have.lengthOf(0);
      })
      .catch((err) => {
        debug(err);
        throw err;
      }));
});
