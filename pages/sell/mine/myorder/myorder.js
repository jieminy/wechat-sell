Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("监听页面加载onLoad");
    wx.request({
      url: getApp().globalData.serviceUrl +'/buyer/order/list',
      data:{
        openid: getApp().globalData.openid
      },
      success: function(res) {
        let resData = res.data;
        that.setData({
          orders: resData.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  detail: function (event) {
    let eventData = event.currentTarget.dataset;
    let orderId = eventData.orderid;
    wx.navigateTo({
      url: 'detail/detail?orderid=' + orderId,
    })
  }

})