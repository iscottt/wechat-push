const { CloudBaseRunServer } = require("./server");
const routes = require("./routes/index");
const schedule = require("node-schedule");
const { pusher } = require("./service/authService");

// 启动任务
const job = schedule.scheduleJob("0 0 8 * * *", async () => {
  console.log("========定时任务启动======", new Date());
  await pusher();
});

// 创建云托管 Server 实例
const server = new CloudBaseRunServer();
// 注册接口路由 降维数组遍历setRoute
for (const route of routes.flat()) {
  server.setRoute(route.path, route.handler);
}
// 监听端口
server.listen(7345);
