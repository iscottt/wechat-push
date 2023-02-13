const { test, getIp, pushBaidu } = require('../service/authService');

async function testDo() {
  return await test();
}

async function getIpDo(event, req, res) {
  return await getIp(event, req, res);
}

async function pushBaiduDo(event, req, res, params) {
  return await pushBaidu(event, req, res, params)
}
module.exports = {
  testDo,
  getIpDo,
  pushBaiduDo
};
