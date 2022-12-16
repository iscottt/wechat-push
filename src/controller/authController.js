const { test, getIp } = require('../service/authService');

async function testDo() {
  return await test();
}

async function getIpDo(event, req, res) {
  return await getIp(event, req, res);
}
module.exports = {
  testDo,
  getIpDo,
};
