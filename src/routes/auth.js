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
  {
    path: '/baidu-push',
    handler: authController.pushBaiduDo,
    method:"POST"
  },
];

module.exports = auth;
