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
    grant_type: "client_credential",
    appid: "wxeefb4bc1e975db3b",
    secret: "a2edcbee408af7079098d659096e16b9",
  };
  let res = await axiosGet("https://api.weixin.qq.com/cgi-bin/token", params);
  return res.data.access_token;
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
    touser: "os1X15ihIP0y8yYR7M3zUGfSkOGQ",
    template_id: "wMFEGQ9fY3ZU6YJQEywtL_IbMJVnF20HafhlA9VhBvg",
    topcolor: "#FF0000",
    data,
  };
  // pp
  const params2 = {
    touser: "os1X15kygleLTzD49K-6CzvmMrL0",
    template_id: "wMFEGQ9fY3ZU6YJQEywtL_IbMJVnF20HafhlA9VhBvg",
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
 * @returns {Promise<void>}
 */
async function getInfo() {
  const wetherAk = "fmktg3K1ZKY8u2ONOawAOF2qwhab1KKS";
  // AgCf7h8qxVbpFQaArMvltqNLR5e1rx03
  const result = await axiosGet(`https://api.map.baidu.com/weather/v1/`, {
    district_id: "330100",
    data_type: "fc",
    ak: wetherAk,
  });
  const today = result.data.result.forecasts[0];
  //今天是
  const todayStr = `${today.date} ${today.week}`;
  //今日天气
  const weatherStr = today.text_day;
  const weatherHigh = today.high;
  const weatherLow = today.low;
  const tips = formatTips(today.text_day);
  const linaAi = getDateByDays();
  const birthday = getDistanceSpecifiedTime("2022-12-22");
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
 * 获取区间天数
 */
function getDateByDays() {
  const startDate = new Date("2021-03-16");
  const endDate = new Date();
  let d1 = Date.parse(startDate);
  let d2 = Date.parse(endDate);
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
    key: "65fde3d56315ff3eba6b679e3e17779d",
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
 * 纪念日倒计时
 * @param dateTime
 */
function getDistanceSpecifiedTime(dateTime) {
  // 指定日期和时间
  const EndTime = new Date(dateTime);
  // 当前系统时间
  const NowTime = new Date();
  const t = EndTime.getTime() - NowTime.getTime();
  const d = Math.floor(t / 1000 / 60 / 60 / 24);
  const h = Math.floor((t / 1000 / 60 / 60) % 24);
  if (h > 0 && d > 0) {
    return d + 1 + "天";
  }
  if (h > 0 && d <= 0) {
    return h + "小时";
  }
}

module.exports = {
  authVerityApi,
  test,
  pusher,
};
