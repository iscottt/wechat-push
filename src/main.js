const { CloudBaseRunServer } = require("./server");
const routes = require("./routes/index");
const schedule = require("node-schedule");
const { pusher, publishWater } = require("./service/authService");

// 启动任务
schedule.scheduleJob("0 0 8 * * *", async () => {
  console.log("========定时任务启动======", new Date());
  await pusher();
});

// 09：30 提醒一次
schedule.scheduleJob("0 30 9 * * *", async () => {
  console.log("========定时任务启动======", new Date());
  await publishWater();
});
// 10：30 提醒一次
schedule.scheduleJob("0 30 10 * * *", async () => {
  console.log("========定时任务启动======", new Date());
  await publishWater();
});
// 14：00 提醒一次
schedule.scheduleJob("0 0 14 * * *", async () => {
  console.log("========定时任务启动======", new Date());
  await publishWater();
});
// 16：00 提醒一次
schedule.scheduleJob("0 0 16 * * *", async () => {
  console.log("========定时任务启动======", new Date());
  await publishWater();
});

// 创建云托管 Server 实例
const server = new CloudBaseRunServer();
// 注册接口路由 降维数组遍历setRoute
for (const route of routes.flat()) {
  server.setRoute(route.path, route.handler);
}
// 监听端口
server.listen(7345);
