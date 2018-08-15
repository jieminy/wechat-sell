var Request = require('request.js');
var Util = require('util.js');
function pay(orderId){
  let openid = getApp().globalData.openid;
  if (Util.isLogin() === false) {
    return;
  }
  Request.getRequest('/pay/create?orderId=' + orderId + '&openid=' + openid,
    function (res) {
      let payment = res.data.data;
      wx.requestPayment({
        'timeStamp': payment.timeStamp,
        'nonceStr': payment.nonceStr,
        'package': payment.package,
        'signType': 'MD5',
        'paySign': payment.paySign,
        'success': function (res) {
          if (res.errMsg == "requestPayment:ok") {
            Request.getRequest('/buyer/order/paid?orderId=' + orderId + '&openid=' + openid,
              function (res) {
                let orderCode = res.data.data.orderCode;
                wx.showModal({
                  title: '取货码: ' + orderCode,
                  content: '（您可在订单详情页面查看您的取货码）',
                  showCancel: false,
                  success: function(res){
                    if(res.confirm){
                      wx.switchTab({
                        url: '/pages/sell/index',
                      })
                    }
                  }
                })
              },
              function (res) {
              }
            );
          }
        },
        'fail': function (res) {
        }
      })
    },
    function (res) {
    }
  )
}
module.exports={
  pay: pay
};