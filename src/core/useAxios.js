const axios = require('axios');
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
const axiosPost = function (url, params) {
  return new Promise((resolve, reject) => {
    axios
      .post(url, params)
      .then((res) => {
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};
const axiosGet = function (url, params, config = {}) {
  return new Promise((resolve, reject) => {
    axios
      .get(url, {
        params,
        ...config,
      })
      .then((res) => {
        console.log('res', res.data);
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
};

module.exports = { axiosPost, axiosGet };
