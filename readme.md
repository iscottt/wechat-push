## 企业微信应用推送

## feature

 - [x] 🎉新增和风天气api，查询每日生活指数（https://dev.qweather.com/）
 - [x] 🎉早安推送增加图片（https://developer.work.weixin.qq.com/document/path/90236#%E5%9B%BE%E6%96%87%E6%B6%88%E6%81%AF）
 - [x] 🎉增加支持农历生日

## 农历生日倒计时

```javascript
config.birthdaySolar = '2022-11-29';

/**
 *
 * @param dateTime 日期
 * @param isSolar 是否农历生日
 * @returns {number}
 */
getDistanceSpecifiedTime(dateTime, true);
```
