const express = require("express");
const bodyParser = require("body-parser");
const MyError = require("./exception");
const http = require("http");
const morgan = require("morgan");

// 请求大小限制
const requestLimit = "5120kb";

class ExpressServer {
  constructor() {
    this.app = express();
    // 上下文请求路径
    this.contextPath = "/api";
    // 请求日志
    this.app.use(morgan("short"));
    this.app.use(
      bodyParser.urlencoded({ extended: false, limit: requestLimit })
    );
    this.app.use(bodyParser.json({ limit: requestLimit }));
    this.app.set("x-powered-by", false);
    this.app.all("*", (req, res, next) => {
      // 开启跨域
      res.setHeader("Access-Control-Allow-Credentials", "true");
      const origin = req.get("Origin");
      // 允许的地址 http://127.0.0.1:9000 这样的格式
      if (origin) {
        res.setHeader("Access-Control-Allow-Origin", origin);
      }
      // 允许跨域请求的方法
      res.setHeader(
        "Access-Control-Allow-Methods",
        "POST, GET, OPTIONS, DELETE, PUT"
      );
      // 允许跨域请求 header 携带哪些东西
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since"
      );
      next();
    });
    this.server = http.createServer(this.app);
  }

  setRoute(path, handlerFunction, method) {
    const handler = async (req, res) => {
      const event = req.body;
      let result;
      try {
        const startTime = new Date().getTime();
        let params;
        if (event.file) {
          let eventCopy = { ...event };
          eventCopy.file = undefined;
          params = JSON.stringify(eventCopy);
        } else {
          params = JSON.stringify(event);
        }
        console.log(`req start path = ${req.path}, params = ${params}`);
        result = await handlerFunction(event, req, res, params);
        console.log(
          `req end path = ${req.path}, params = ${params}, costTime = ${new Date().getTime() - startTime
          }`
        );
      } catch (e) {
        // 全局异常处理
        if (e instanceof MyError) {
          result = {
            code: e.code,
            message: e.message,
            data: null,
          };
        } else {
          result = {
            code: 500,
            data: null,
            message: "server error",
          };
        }
        console.error(
          `req error path = ${req.path}, params = ${JSON.stringify(event)}`,
          e
        );
      }
      res.send(result);
    };
    // this.app.get(this.contextPath + path, handler);

    // TODO: 代码优化
    switch (method) {
      case "POST":
        this.app.post(this.contextPath + path, handler);
        break;
      case "GET":
        this.app.get(this.contextPath + path, handler);
        break;
      default:
        this.app.post(this.contextPath + path, handler);
        break;
    }
  }

  listen(port) {
    this.server.listen(port);
    let url = `http://localhost:${port}`;
    if (this.contextPath) {
      url += this.contextPath;
    }
    console.log(`server start at ${url}, env = ${process.env.NODE_ENV}`);
  }
}

module.exports.CloudBaseRunServer = ExpressServer;
