const authController = require('../controller/authController');

/**
 * 接口路由
 * @author yupi
 */
const auth = [
  {
    path: '/test',
    handler: authController.testDo,
  },
  {
    path: '/get-ip',
    handler: authController.getIpDo,
  },
];

module.exports = auth;
