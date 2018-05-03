var Utils = require("../../../../../utils/util.js");
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
      if (getApp().globalData.location != "") {
      let location = getApp().globalData.location;
      this.setData({
          location: location
      });
      getApp().globalData.location = "";
    }
  },

  formSubmit: function (e) {
    let receiver = e.detail.value;
    receiver.openid = getApp().globalData.openid;
    let recData = this.data.receiver;
    if (recData.recId != null) {
      receiver.recId = recData.recId;
    }
    console.log('form发生了submit事件，携带数据为：', receiver);
    wx.request({
      url: getApp().globalData.serviceUrl + '/buyer/receiver/save',
      data: Utils.json2Form(receiver),
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
    wx.navigateTo({
      url: '../choose/choose',
    })
  }
})