const { authVerityApi, test } = require("../service/authService");

async function authVerity(event, req, res) {
  return await authVerityApi(event, req, res);
}

async function testDo(event, req, res) {
  return await test(event, req, res);
}
module.exports = {
  authVerity,
  testDo,
};
