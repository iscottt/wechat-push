const config = require('../config/config');
const { axiosGet, axiosPost } = require('../core/useAxios');
const axios = require('axios');
const { Lunar } = require('../core/useDays');
const { Buffer } = require('buffer');

/**
 * 获取企业微信token
 * @returns {Promise<*>}
 */
async function getCompanyToken() {
  const corpId = config.corpId;
  const corpSecret = config.corpSecret;
  const result = await axiosGet(`https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corpId}&corpsecret=${corpSecret}`);
  return result.data.access_token;
}

/**
 * 早安提醒
 * @returns {Promise<void>}
 */
async function companyPublishGreet() {
  const token = await getCompanyToken();
  const data = await getInfo();
  const params = {
    touser: '@all',
    msgtype: 'news',
    agentid: config.agentid,
    news: {
      articles: [
        {
          picurl: 'https://ethanwp.oss-cn-shenzhen.aliyuncs.com/download/IMG_0519.JPG',
          title: '早上好，宝宝~',
          description:
            '今天是：🎉 ' +
            data.todayStr +
            ' 🎉\n今日天气：' +
            data.weatherStr +
            '\n今日气温：' +
            data.weatherLow +
            '℃~' +
            data.weatherHigh +
            '℃\n体感温度：' +
            data.feel +
            '℃\n\n🥰今天是我们在一起的第' +
            data.linaAi +
            '天\n🎂距离宝宝生日还有' +
            data.birthday +
            '天\n\n🤧今日感冒指数：' +
            data.cold +
            '\n\n🔔小胖温馨提示：今日紫外线' +
            data.UV,
        },
      ],
    },
    enable_id_trans: 0,
    enable_duplicate_check: 0,
    duplicate_check_interval: 1800,
  };
  await axiosPost(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`, params);
}

/**
 * 喝水提醒
 * @returns {Promise<void>}
 */
async function companyPublishWater() {
  const token = await getCompanyToken();
  const params = {
    touser: '@all',
    msgtype: 'news',
    agentid: config.agentid,
    news: {
      articles: [
        {
          title: '提醒喝水小助手',
          description: '👉 小胖牌提醒喝水小助手来啦！宝宝要主动喝水，而不是等到口渴了才去喝很多水，要做每天喝8杯水的乖宝宝哦~',
          url: 'URL',
          picurl: 'https://ethanwp.oss-cn-shenzhen.aliyuncs.com/download/water.webp',
        },
      ],
    },
    enable_id_trans: 0,
    enable_duplicate_check: 0,
    duplicate_check_interval: 1800,
  };
  await axiosPost(`https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${token}`, params);
}

/**
 * 获取天气生活指数
 * @returns {Promise<{UV: *, cold: *}>}
 */
async function getSuggest() {
  const url = `https://devapi.qweather.com/v7/indices/1d?location=${config.lon},${config.lat}&key=${config.qWeatherKey}&type=5,9`;
  const { data } = await axiosGet(url, {});
  const dailies = data.daily;
  return {
    UV: dailies[0].text,
    cold: dailies[1].text,
  };
}

/**
 * 测试推送接口
 * @returns {Promise<void>}
 */
async function test() {
  await companyPublishGreet();
  return 'success';
}
/**
 * 测试推送接口
 * @returns {Promise<void>}
 */
async function getIp(event, req, res) {
  const url = `https://whois.pconline.com.cn/ipJson.jsp`;
  const data = await axiosGet(
    url,
    { json: true, ip: req.query.ip },
    {
      headers: {
        'Content-Type': 'application/json;charset=utf-8',
      },
      responseType: 'arraybuffer',
    }
  ); // 使用TextDecoder
  var enc = new TextDecoder('GBK');
  var uint8_msg = new Uint8Array(data.data);
  return enc.decode(uint8_msg);
}

/**
 * 将天气转换为带emoji的字符
 * @param weather
 * @returns {Promise<string|*>}
 */
async function formatStrToEmoji(weather) {
  if (~weather.indexOf('晴')) {
    return weather + '☀️';
  } else if (~weather.indexOf('雨')) {
    return weather + '🌧';
  } else if (~weather.indexOf('雪')) {
    return weather + '🌨️';
  } else if (~weather.indexOf('雾')) {
    return weather + '🌫️';
  } else if (~weather.indexOf('雷')) {
    return weather + '⛈️';
  } else if (~weather.indexOf('阴')) {
    return weather + '☁️️';
  } else if (~weather.indexOf('多云')) {
    return weather + '⛅️️️';
  } else {
    return weather;
  }
}

/**
 * 获取模板展示信息
 */
async function getInfo() {
  const weatherAk = config.weatherAk;
  const { data } = await axiosGet(`https://api.map.baidu.com/weather/v1/`, {
    district_id: config.district_id,
    data_type: 'all',
    ak: weatherAk,
  });
  // 获取今天的信息
  const today = data.result.forecasts[0];
  const feel = data.result.now.feels_like;
  const wind = data.result.now.wind_dir + ' ' + data.result.now.wind_class;
  const todayStr = `${today.date} ${today.week}`;
  // 今日天气
  const weatherStr = await formatStrToEmoji(today.text_day);
  const weatherHigh = today.high;
  const weatherLow = today.low;
  // 在一起多少天
  const linaAi = getDateByDays();
  // 距生日还剩多少天
  const birthday = getDistanceSpecifiedTime(config.isSloar ? config.birthdaySolar : config.birthday, config.isSloar);
  // 天气建议
  const exponent = await getSuggest();
  return {
    todayStr,
    weatherStr,
    weatherHigh,
    weatherLow,
    feel,
    wind,
    linaAi,
    birthday,
    UV: exponent.UV,
    cold: exponent.cold,
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
  return parseInt((d2 - d1) / ONE_DAY);
}

/**
 * 早安心语
 * @returns {Promise<string|DocumentFragment>}
 */
async function getTips() {
  const { data } = await axiosGet('http://api.tianapi.com/caihongpi/index', {
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
  const tips = ['天气炎热，请注意防暑防晒~', `近期空气干燥，注意经常补充水分，以保身体健康~`, '天气转热，保证吃好，心情舒畅，燥热较少。', '持续高温天闷热，防暑降温莫忽略，冷饮冷食谨慎吃。'];
  if (~weather.indexOf('晴')) {
    return tips[Math.floor(Math.random() * 4)];
  } else if (~weather.indexOf('雨')) {
    return '今天将降雨，出门请别忘带伞~';
  } else if (~weather.indexOf('雪')) {
    return '雪天路滑，出行时请注意防滑~';
  } else if (~weather.indexOf('雾')) {
    return '今天将降雨，出门请别忘带伞~';
  } else if (~weather.indexOf('雷')) {
    return '今天将有雷雨，路面湿滑，能见度低，行走时注意观察周围环境，避免滑倒、及时避让车辆。';
  } else if (~weather.indexOf('阴')) {
    return '阴天也要注意保暖多穿点衣服哦~';
  } else {
    return '不管是晴天还是雨天，每天都是爱你的一天~';
  }
}

/**
 *
 * @param dateTime
 * @param isSolar 是否农历生日
 * @returns {number}
 */
function getDistanceSpecifiedTime(dateTime, isSolar) {
  // 指定日期和时间
  let EndTime;
  if (isSolar) {
    const date = dateTime.split('-');
    const result = Lunar.toSolar(date[0], date[1], date[2]);
    EndTime = new Date(`${result[0]}-${result[1]}-${result[2]}`);
  } else {
    EndTime = new Date(dateTime);
  }
  // 当前系统时间
  const NowTime = new Date();
  // 两个时间的相差天数
  return Math.ceil(Math.abs(NowTime.getTime() - EndTime.getTime()) / 86400000);
}

/**
 * 测试推送接口
 * @returns {Promise<void>}
 */
async function pushBaidu(event, req, res, params) {
  const url = `http://data.zz.baidu.com/urls?token=${params.token}&site=${params.site}`;
  const data = JSON.parse(params)
  if (!data.urls) {
    return {
      code: 400,
      message: "urls不能为空！"
    }
  }
  return axios({
    url,
    method: 'post',
    data: data.urls.join('\n'),
    headers: {
      'Content-Type': 'text/plain'
    }
  }).then(res => {
    return res.data;
  })
}

module.exports = {
  companyPublishGreet,
  companyPublishWater,
  test,
  getIp,
  pushBaidu
};
