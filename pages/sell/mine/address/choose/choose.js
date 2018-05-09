var bmap = require('../../../../../libs/bmap-wx.min.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sugData: []
  },
  bindKeyInput: function (e) {
    var that = this;
    if (e.detail.value === '') {
      that.setData({
        sugData: ''
      });
      return;
    }
    var BMap = new bmap.BMapWX({
      ak: 'KGPa32yj0bHnP7iAwIDX494yvm6R2auq'
    });
    var fail = function (data) {
      console.log(data)
    }
    var success = function (data) {
      var sugData = [];
      for (var i = 0; i < data.result.length; i++) {
        sugData.push(data.result[i].name);
      }
      console.log(sugData);
      that.setData({
        sugData: sugData
      });
    }
    BMap.suggestion({
      query: e.detail.value,
      region: '北京',
      city_limit: true,
      fail: fail,
      success: success
    });
  },
  chooseLocation : function (event) {
    let eventData = event.currentTarget.dataset;
    console.log(eventData.item);
    getApp().globalData.location = eventData.item;
    wx.navigateBack({
      delta: 1
    })
  }
 
})