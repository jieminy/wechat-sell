var Utils = require("../../../../../utils/util.js");
var req = require("../../../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: getApp().globalData.serviceUrl + '/buyer/order/detail',
      data: {
        orderId: options.orderid,
        openid: getApp().globalData.openid
      },
      success: function (res) {
        let resData = res.data;
        let order = resData.data;
        that.setData({
          order: order
        });
      }
    });

  },
  cancelOrder: function () {
    let order = this.data.order;
    let that = this;
    wx.request({
      url: getApp().globalData.serviceUrl + '/buyer/order/cancel',
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: Utils.json2Form({
        orderId: order.orderId,
        openid: getApp().globalData.openid
      }),
      success: function (res) {
        let resData = res.data;
        if (resData.code == 0) {
          order.orderStatus = 2;
          that.setData({
            order: order
          });
        }
      }
    })
  },
  pay: function (event) {
    let eventData = event.currentTarget.dataset;
    console.log(eventData);
    req.getRequest('/pay/create?orderId=' + eventData.orderid + '&openid=' + getApp().globalData.openid,
      function (res) {
        console.log(res.data);
        let payment = res.data.data;
        wx.requestPayment({
          'timeStamp': payment.timeStamp,
          'nonceStr': payment.nonceStr,
          'package': payment.package,
          'signType': 'MD5',
          'paySign': payment.paySign,
          'success': function (res) {
            console.log(res);
          },
          'fail': function (res) {
          }
        })
      },
      function (res) {

      }
    )
  }
})