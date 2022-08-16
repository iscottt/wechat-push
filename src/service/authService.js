const config = require("../config/config");
const { axiosGet, axiosPost } = require("../core/useAxios");
const sha1 = require("node-sha1"); //加密模块

/**
 * 默认的接口进行微信公众号验证
 * @param event
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
async function authVerityApi(event, req, res) {
  const token = config.token; //获取配置的token
  const signature = req.query.signature; //获取微信发送请求参数signature
  const nonce = req.query.nonce; //获取微信发送请求参数nonce
  const timestamp = req.query.timestamp; //获取微信发送请求参数timestamp

  const str = [token, timestamp, nonce].sort().join(""); //排序token、timestamp、nonce后转换为组合字符串
  const sha = sha1(str); //加密组合字符串

  //如果加密组合结果等于微信的请求参数signature，验证通过
  if (sha === signature) {
    const { echostr } = req.query; //获取微信请求参数echostr
    res.send(echostr + ""); //正常返回请求参数echostr
  } else {
    res.send("验证失败");
  }
}

/**
 * 获取微信的token进行验证
 * @returns {Promise<*>}
 */
async function getToken() {
  const params = {
    grant_type: config.grant_type,
    appid: config.appid,
    secret: config.secret,
  };
  let { data } = await axiosGet(
    "https://api.weixin.qq.com/cgi-bin/token",
    params
  );
  return data.access_token;
}

/**
 * 推送
 * @returns {Promise<void>}
 */
async function pusher() {
  const token = await getToken();
  const url =
    "https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" +
    token;
  const data = await getInfo();
  // bb
  const params = {
    ...config.user_bb,
    topcolor: "#FF0000",
    data,
  };
  // pp
  const params2 = {
    ...config.user_pp,
    topcolor: "#FF0000",
    data,
  };
  await axiosPost(url, params);
  await axiosPost(url, params2);
}

/**
 * 测试推送接口
 * @returns {Promise<void>}
 */
async function test() {
  return await pusher();
}

/**
 * 获取模板展示信息
 */
async function getInfo() {
  const weatherAk = config.weatherAk;
  const { data } = await axiosGet(`https://api.map.baidu.com/weather/v1/`, {
    district_id: "330100",
    data_type: "fc",
    ak: weatherAk,
  });
  // 获取今天的信息
  const today = data.result.forecasts[0];
  const todayStr = `${today.date} ${today.week}`;
  // 今日天气
  const weatherStr = today.text_day;
  const weatherHigh = today.high;
  const weatherLow = today.low;
  // 天气温馨提示
  const tips = formatTips(today.text_day);
  // 在一起多少天
  const linaAi = getDateByDays();
  // 距生日还剩多少天
  const birthday = getDistanceSpecifiedTime(config.birthday);
  // 早安心语（彩虹屁）
  const text = await getTips();
  return {
    today: {
      value: todayStr,
      color: "#00BFFF",
    },
    weatherStr: {
      value: weatherStr,
      color: "#00FFFF",
    },
    weatherHigh: {
      value: weatherHigh,
      color: "#FF6347",
    },
    weatherLow: {
      value: weatherLow,
      color: "#173177",
    },
    linaAi: {
      value: linaAi,
      color: "#FF1493",
    },
    birthday: {
      value: birthday,
      color: "#FFA500",
    },
    tips: {
      value: tips,
      color: "#67c23a",
    },
    text: {
      value: text,
      color: "#FF69B4",
    },
  };
}

/**
 * 获取纪念日天数
 * @returns {number}
 */
function getDateByDays() {
  const startDate = new Date(config.anniversary);
  const endDate = new Date();
  const d1 = Date.parse(startDate);
  const d2 = Date.parse(endDate);
  const ONE_DAY = 1000 * 60 * 60 * 24;
  // 时间戳相减 / 天数
  let day = parseInt((d2 - d1) / ONE_DAY);
  return day;
}

/**
 * 早安心语
 * @returns {Promise<string|DocumentFragment>}
 */
async function getTips() {
  const { data } = await axiosGet("http://api.tianapi.com/caihongpi/index", {
    key: config.tipsKey,
  });
  return data.newslist[0].content;
}

/**
 * 不同天气的提示语
 * @param weather
 * @returns {string}
 */
function formatTips(weather) {
  const tips = [
    "天气炎热，请注意防暑防晒~",
    `近期空气干燥，注意经常补充水分，以保身体健康~`,
    "天气转热，保证吃好，心情舒畅，燥热较少。",
    "持续高温天闷热，防暑降温莫忽略，冷饮冷食谨慎吃。",
  ];
  if (~weather.indexOf("晴")) {
    return tips[Math.floor(Math.random() * 4)];
  } else if (~weather.indexOf("雨")) {
    return "今天将降雨，出门请别忘带伞~";
  } else if (~weather.indexOf("雪")) {
    return "雪天路滑，出行时请注意防滑~";
  } else if (~weather.indexOf("雾")) {
    return "今天将降雨，出门请别忘带伞~";
  } else if (~weather.indexOf("雷")) {
    return "今天将有雷雨，路面湿滑，能见度低，行走时注意观察周围环境，避免滑倒、及时避让车辆。";
  }
}

/**
 * 生日倒计时
 * @param dateTime
 */
function getDistanceSpecifiedTime(dateTime) {
  // 指定日期和时间
  const EndTime = new Date(dateTime);
  // 当前系统时间
  const NowTime = new Date();
  // 两个时间的相差天数
  return Math.ceil(Math.abs(NowTime.getTime() - EndTime.getTime()) / 86400000);
}

module.exports = {
  authVerityApi,
  test,
  pusher,
};
