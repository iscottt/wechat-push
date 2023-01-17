const { CloudBaseRunServer } = require('./server');
const routes = require('./routes/index');
const schedule = require('node-schedule');
const { companyPublishGreet, companyPublishWater } = require('./service/authService');

// 启动任务
schedule.scheduleJob('0 30 7 * * *', async () => {
  console.log('========定时任务启动======', new Date());
  await companyPublishGreet();
});

// 09：30 提醒一次
schedule.scheduleJob('0 30 09 ? * MON-FRI', async () => {
  console.log('========定时任务启动======', new Date());
  await companyPublishWater();
});
// 10：30 提醒一次
schedule.scheduleJob('0 30 10 ? * MON-FRI', async () => {
  console.log('========定时任务启动======', new Date());
  await companyPublishWater();
});
// 14：00 提醒一次
schedule.scheduleJob('0 0 14 ? * MON-FRI', async () => {
  console.log('========定时任务启动======', new Date());
  await companyPublishWater();
});
// 16：00 提醒一次
schedule.scheduleJob('0 0 16 ? * MON-FRI', async () => {
  console.log('========定时任务启动======', new Date());
  await companyPublishWater();
});

// 创建云托管 Server 实例
const server = new CloudBaseRunServer();
// 注册接口路由 降维数组遍历setRoute
for (const route of routes.flat()) {
  server.setRoute(route.path, route.handler);
}
// 监听端口
server.listen(7345);
