//app.js
var Request = require('/utils/request.js');
App({
  data: {
    cart: [],
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    //读取本地存储
    let cart = wx.getStorageSync("cart");
    if (cart) {
      this.globalData.cart = cart;
    }
    let receiver = wx.getStorageSync("receiver");
    if (receiver) {
      this.globalData.receiver = receiver;
    }
    this.getUserInfo();
  },
  onShow: function () {
    console.log('app show')
  },
  globalData: {
    //用户信息
    userInfo: null,
    //总价
    total: {
      count: 0,
      money: 0.0
    },
    //购物车
    cart: [],
    //位置
    location: "",
    //收获地址
    receiver: null,
    openid: "",
    serviceUrl: "https://gongyuxian.com/sell"
    // serviceUrl: "https://51vr.mynatapp.cc/sell"
  },
  onHide: function () {
    wx.setStorageSync("cart", this.globalData.cart);
    wx.setStorageSync("receiver", this.globalData.receiver);
  },
  getUserInfo: function () {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo;

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res);
              }

              // 登录
              wx.login({
                success: res => {
                  // 发送 res.code 到后台换取 openId, sessionKey, unionId
                  if (res.code) {
                    Request.getRequest("/weixin/auth?code=" + res.code,
                      function (res) {
                        if (res.data.data) {
                          getApp().globalData.openid = res.data.data;
                        }
                      },
                      function (res) {
                      }
                    );
                  } else {
                    console.log('登录失败！' + res.errMsg)
                  }
                }
              })

            }
          })
        } else {
          wx.showModal({
            title: '用户未授权',
            content: '如需正常使用小程序功能，请先进行授权',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"] === true) {
                      this.getUserInfo();
                    }
                  },
                  fail: (res)=>{
                    this.getUserInfo();
                  }
                })
              }
            }
          })
        }
      }
    })
  }
})