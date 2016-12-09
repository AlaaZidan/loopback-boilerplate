// const debug = require('debug')('boilerplate:myuser');

module.exports = (MyUser) => {
  MyUser.prototype.unassignRole = function unassignRole(roleName) {
    const that = this;

    const app = MyUser.app;
    const Role = app.models.Role;
    const RoleMapping = app.models.RoleMapping;

    return Role.findOne({ where: { name: roleName } })
      .then((role) => {
        if (null === role) {
          const error = new Error(`Role ${roleName} not found.`);
          error.code = 'NO_ROLE';
          throw error;
        }

        return RoleMapping
          .findOne({ where: { principalId: that.id, roleId: role.id } })
          .then(roleMapping => (roleMapping ? roleMapping.destroy() : null));
      });
  };

  MyUser.prototype.assignRole = function assignRole(roleName) {
    const that = this;

    const app = MyUser.app;
    const Role = app.models.Role;
    const RM = app.models.RoleMapping;
    let role;

    return Role.findOne({ where: { name: roleName } })
      .then((_role) => {
        role = _role;

        if (null === role) {
          const error = new Error(`Role ${roleName} not found.`);
          error.code = 'NO_ROLE';
          throw error;
        }

        return RM.findOne({ where: { principalId: that.id, roleId: role.id } });
      })

      .then(rm => rm || role.principals.create({ principalType: RM.USER, principalId: that.id }));
  };
};
