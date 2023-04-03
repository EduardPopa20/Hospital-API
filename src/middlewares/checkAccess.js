const checkPermission = require("../acl/checkPermission");

const checkAccess = (action) => {
  return (req, res, next) => {
    const user = req.user;
    const permission = checkPermission(user.role, action);
    if (!permission) {
      return res.status(403).json({ message: "You are not authorized to perform this action" });
    }

    next();
  };
};

module.exports = checkAccess;
