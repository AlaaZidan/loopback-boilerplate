/* eslint-disable no-param-reassign, strict */

'use strict';

const crypto = require('crypto');
const Promise = require('bluebird');
const debug = require('debug')('coreapi:soul');
const utils = require('loopback-datasource-juggler/lib/utils');

module.exports = Soul => {
  Soul.prototype.removeRole = function addRole(roleName) {
    const that = this;
    const app = Soul.app;
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;

    return Role.findOne({ where: { name: roleName } })
      .then(role => {
        if (null === role) {
          const error = new Error(`Role ${roleName} not found.`);
          error.code = 'NO_ROLE';
          throw error;
        }

        return RoleMapping
          .findOne({ where: { principalId: that.id, roleId: role.id } })

          // Seriously? one line? I'm impressed
          // We delete only if exists
          .then(roleMapping => (roleMapping ? roleMapping.destroy() : null));
      });
  };

  Soul.prototype.addRole = function addRole(roleName) {
    const that = this;

    const app = Soul.app;
    const Role = app.models.Role;
    const RM = app.models.RoleMapping;
    let role;

    return Role.findOne({ where: { name: roleName } })
      .then(_role => {
        role = _role;
        if (null === role) {
          const error = new Error(`Role ${roleName} not found.`);
          error.code = 'NO_ROLE';
          throw error;
        }

        return RM.findOne({ where: { principalId: that.id, roleId: role.id } });
      })

      // Seriously? one line? I'm impressed
      // If the use already has that role we do not add another rolemapping
      .then(rm => rm || role.principals.create({ principalType: RM.USER, principalId: that.id }));
  };

  // https://github.com/strongloop/loopback/issues/1077
  // https://groups.google.com/d/msg/loopbackjs/b8_sjeRIoOs/DpK4enKDAwAJ
  // var utils = require('loopback-datasource-juggler/lib/utils');
  // const override = Soul.login;
  Soul.login = function soulLogin(credentials, include, callback) {
    if (typeof include === 'function') {
      callback = include;
      include = undefined;
    }

    // TODO: custom login

    callback = callback || utils.createPromiseCallback();

    return callback.$promise;
  };

  const isStatic = true;
  const model = Soul;

  // TODO: change the ACL. By default only GET from the models in common/models

  // Removes (POST)
  model.disableRemoteMethod('create', isStatic);

  // With current set of database permissions is not clear what the following is doing.
  // Removes (PUT)
  model.disableRemoteMethod('upsert', isStatic);

  // Removes (DELETE)
  model.disableRemoteMethod('delete', isStatic);
  model.disableRemoteMethod('deleteById', isStatic);

  // Removes (POST)
  model.disableRemoteMethod('updateAll', isStatic);

  // Removes (PUT)
  model.disableRemoteMethod('updateAttributes', false);
  model.disableRemoteMethod('createChangeStream', isStatic);

  model.disableRemoteMethod('__create__accessTokens', false);
  model.disableRemoteMethod('__delete__accessTokens', false);
  model.disableRemoteMethod('__destroyById__accessTokens', false);
  model.disableRemoteMethod('__updateById__accessTokens', false);

  model.disableRemoteMethod('__create__roles', false);
  model.disableRemoteMethod('__delete__roles', false);
  model.disableRemoteMethod('__destroyById__roles', false);
  model.disableRemoteMethod('__updateById__roles', false);
  model.disableRemoteMethod('__unlink__roles', false);
  model.disableRemoteMethod('__link__roles', false);
};
