//app.js
App({
  data:{
      cart: [],
      appId: "wx4f166bfc8a364fb1"
  },
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
              url: getApp().globalData.serviceUrl + "/weixin/auth",
              data: {
                  code: res.code
              },
              success: res = > {
              console.log(res);


          wx.requestPayment({
              'timeStamp': '',
              'nonceStr': '',
              'package': '',
              'signType': 'MD5',
              'paySign': '',
              'success': function (res) {
              },
              'fail': function (res) {
              }
          })
          let resData = res.data;
          let openid = resData.data;
          if (openid) {
              getApp().globalData.openid = openid;
          }
          if (resData.code != 0) {
              wx.showModal({
                  title: '提示',
                  content: '登录失败',
              })
          }
      }
      })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
    
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  onShow: function () {
    console.log('app show')
  },
  globalData: {
    userInfo: null,
    total: {
      count: 0,
      money: 0.0
    },
    location: "",
    openid: "wxffsaare23425ajk",
    serviceUrl: "https://51vr.mynatapp.cc/sell"
  }
})