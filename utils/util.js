const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
} 

function isLogin(){
  let openid = getApp().globalData.openid;
  if (openid == null || openid == '') {
    wx.showToast({
      title: '用户异常，请重新打开小程序！',
      duration: 3000
    });
    return false;
  }
  return true;
} 


module.exports = {
  formatTime: formatTime,
  json2Form: json2Form,
  isLogin: isLogin
}
