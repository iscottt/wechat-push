## 企业微信应用推送

## feature

 - [x] 🎉新增和风天气api，查询每日生活指数（https://dev.qweather.com/）
 - [x] 🎉早安推送增加图片（https://developer.work.weixin.qq.com/document/path/90236#%E5%9B%BE%E6%96%87%E6%B6%88%E6%81%AF）
 - [x] 🎉增加支持农历生日


## 运行服务

**本地运行或服务器运行都需要讲ip地址添加到企业微信应用的可信ip名单**

> 本地运行服务需要本地电脑有nodejs环境，可自行百度安装nodejs

 - 下载代码后修改 `/src/config/config.js` 填入对应的key和其他的配置
 - windows打开cmd终端，mac打开系统自带终端，并且cd到代码根目录
 - 在项目根目录运行 `npm install` 安装项目所需依赖
 - 运行 `npm run start:dev` 启动服务
 - 浏览器打开 `localhost:7315/api/test` 测试推送

> 服务器运行服务

同样的我们需要在服务器上安装nodejs环境，可自行百度安装

 - 将代码上传到服务器
 - cd 进入代码根目录，运行 `npm install`
 - 全局安装pm2 `npm intsall pm2 -g`
 - 运行启动服务 `pm2 start ./src/main.js -n wechat-push`
 - 如果服务启动之后，你又对代码进行了修改，那么需要重启服务 `pm2 restart wechat-push`