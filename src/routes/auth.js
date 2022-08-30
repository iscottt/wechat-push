const authController = require("../controller/authController");

/**
 * 接口路由
 * @author yupi
 */
const auth = [
  {
    path: "/test",
    handler: authController.testDo,
  },
];

module.exports = auth;
