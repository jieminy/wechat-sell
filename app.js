//app.js
var Request = require('/utils/request.js');
var bmap = require('/libs/bmap-wx.min.js');
require('./utils/number.extend.js');
var wxMarkerData = [];
App({
  data: {
    cart: [],
  },
  onLaunch: function () {

    // wx.clearStorageSync();
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
    // wx.showModal({
    //   title: '用户未授权',
    //   content: '如需正常使用小程序功能，请先进行授权',
    //   showCancel: false,
    //   success: function (res) {
    //     if (res.confirm) {
    //       wx.openSetting({
    //         success: (res) => {
    //           if (res.authSetting["scope.userInfo"] === true) {
    //             this.getUserInfo();
    //           }
    //         },
    //         fail: (res) => {
    //           this.getUserInfo();
    //         }
    //       })
    //     }
    //   }
    // })
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
      money: 0.00
    },
    //购物车
    cart: [],
    //位置
    location: "天鸿公寓",
    //收获地址
    receiver: null,
    openid: null,
    serviceUrl: "https://gongyuxian.com/sell",
    //百度地图
    ak: 'KGPa32yj0bHnP7iAwIDX494yvm6R2auq',
    // serviceUrl: "http://localhost:8082/sell"
  },
  onHide: function () {
    wx.setStorageSync("cart", this.globalData.cart);
    wx.setStorageSync("receiver", this.globalData.receiver);
  },
  authorize: function(){
    var that = this;
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo'] && res.authSetting['scope.userLocation']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          that.getUserInfo();
        } else {
          wx.showModal({
            title: '获取位置未授权',
            content: '如需正常使用公寓鲜，请先进行授权',
            showCancel: false,
            confirmText: '授权',
            success: function (res) {
              if (res.confirm) {
                wx.openSetting({
                  success: (res) => {
                    if (res.authSetting["scope.userInfo"] === true && res.authSetting["scope.userLocation"] === true) {
                      that.getUserInfo();
                    }else{
                      that.authorize();
                    }
                  },
                  fail: (res) => {
                    that.authorize();
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  //获取用户信息
  getUserInfo: function () {
    var that = this;
    wx.getUserInfo({
      success: res => {
        // 可以将 res 发送给后台解码出 unionId
        that.globalData.userInfo = res.userInfo;

        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        if (that.userInfoReadyCallback) {
          that.userInfoReadyCallback(res);
        }

        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
            if (res.code) {
              Request.getRequest("/weixin/auth?code=" + res.code,
                function (res) {
                  if (res.data.data) {
                    that.globalData.openid = res.data.data;
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

        //定位 暂时注释掉
        // that.getLocation();
      },
      fail: res=>{
        wx.switchTab({
          url: 'mine/mine',
        })
      }
    })
  
  },
  //定位
  getLocation: function () {
    var that = this;
    //百度地图
    var BMap = new bmap.BMapWX({
      ak: that.globalData.ak
    });
    var fail = function (data) {
      console.log(data)
      that.authorize();
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.globalData.location = wxMarkerData[0].address;
      if (getCurrentPages()[0] && getCurrentPages()[0].reWriteLocation){
        getCurrentPages()[0].reWriteLocation();
      }
      // typeof hd == "function" && hd(that.globalData.location);
    };
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
    });
  }

})
