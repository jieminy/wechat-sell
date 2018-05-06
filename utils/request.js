var Utils = require('../utils/util.js');
function postRequest(url, data, success, fail) {
  console.log("调用公共方法：postRequest");
  wx.request({
    url: getApp().globalData.serviceUrl + url,
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded'
    },
    data: Utils.json2Form(data),
    success: res => {
      success(res);
    },
    fail: res =>
    {
      fail(res);
    }
  })
}

function getRequest(url, success, fail) {
  console.log("调用公共方法：getRequest");
  wx.request({
    url: getApp().globalData.serviceUrl + url,
    success: res => {
      success(res);
    },
    fail: res => {
      fail(res);
    }
  });
}

module.exports = {
  getRequest: getRequest,
  postRequest: postRequest
}