var Util = require("../../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
      receiver: {},
      location: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (options.recId != undefined && options.recId != null) {
      wx.request({
        url: getApp().globalData.serviceUrl + '/buyer/receiver/one',
        data: {
          recId: options.recId
        },
        success: function (res) {
          let resData = res.data;
          console.log(resData.data);
          that.setData({
              receiver: resData.data,
              location: resData.data.address
          });
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //choose页面选择地址naviback后赋值
    let location = getApp().globalData.location;
    this.setData({
        location: location
    });
  },

  formSubmit: function (e) {
    if (Util.isLogin() === false){
      return;
    }
    let receiver = e.detail.value;
    receiver.openid = getApp().globalData.openid;
    let recData = this.data.receiver;
    if (recData.recId != null) {
      receiver.recId = recData.recId;
    }
    if (receiver.name == '') {
      wx.showToast({
        title: '请填写收货人',
        duration: 3000
      })
      return;
    }
    if (receiver.phone == ''){
      wx.showToast({
        title: '请填写联系电话',
        duration: 3000
      })
      return;
    }
    if (receiver.address == '') {
      wx.showToast({
        title: '请填写收获地址',
        duration: 3000
      })
      return;
    }
    if (receiver.detail == '') {
      wx.showToast({
        title: '请填写楼号门牌',
        duration: 3000
      })
      return;
    }
    console.log('form发生了submit事件，携带数据为：', receiver);
    wx.request({
      url: getApp().globalData.serviceUrl + '/buyer/receiver/save',
      data: Util.json2Form(receiver),
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        let resData = res.data;
        console.log(resData);
        if (resData.code == 0) {
          wx.navigateBack({
            delta: 1
          })
        }
      }
    })
  },

    //获取位置
  getLocation: function () {
    // wx.navigateTo({
    //   url: '../choose/choose',
    // })
    wx.showToast({
      title: '现只支持天鸿公寓',
      icon: "none"
    })
  }
})