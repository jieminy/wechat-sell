Page({

  /**
   * 页面的初始数据
   */
  data: {
    receivers: [],
    isChoose: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.isChoose == "true"){
      this.setData({
        isChoose: true
      })
    }
    
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
    var that = this;
    wx.request({
      url: getApp().globalData.serviceUrl + '/buyer/receiver/list',
      data:{
        openid: getApp().globalData.openid
      },
      success: function (res) {
        let resData = res.data;
        that.setData({
          receivers: resData.data
        });
      }
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },
  addAddress: function () {
    wx.navigateTo({
      url: 'manage/manage',
    })
  },
  edit: function (event) {
    let eventData = event.currentTarget.dataset;
    wx.navigateTo({
      url: 'manage/manage?recId=' + eventData.recid,
    })
  },
  deleteRec: function (event) {
    let eventData = event.currentTarget.dataset;
    var that = this;
    wx.request({
      url: getApp().globalData.serviceUrl + '/buyer/receiver/del',
      data: {
        recId: eventData.recid,
        openid: getApp().globalData.openid
      },
      success: function (res) {
        let resData = res.data;
        if(resData.code == 0){
          that.setData({
            receivers: resData.data
          });
        }
      }
      
    })
  },
  chooseCurrentReceiver: function (event) {
    if (this.data.isChoose == true){
      let eventData = event.currentTarget.dataset;
      let receiver = this.data.receivers[eventData.idx];
      wx.setStorageSync("receiver", receiver);
      wx.navigateBack({
        delta: 1
      })
    }else{
      console.log("else");
    }
  },
  
})