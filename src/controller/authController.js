const { test } = require("../service/authService");

async function testDo() {
  return await test();
}
module.exports = {
  testDo,
};
