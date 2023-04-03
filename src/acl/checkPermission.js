const permissions = require("./../acl/roles.js");

const checkPermission = (role, action) => {
  console.log(role, action);
  const permission = permissions[role][action];
  return permission;
};

module.exports = checkPermission;
