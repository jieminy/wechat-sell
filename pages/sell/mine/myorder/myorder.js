var Util = require('../../../../utils/util.js');
var Request = require('../../../../utils/request.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orders: [],
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("监听页面加载onLoad");

    if (Util.isLogin()){
      wx.request({
        url: getApp().globalData.serviceUrl +'/buyer/order/list',
        data:{
          openid: getApp().globalData.openid
        },
        success: function(res) {
          let resData = res.data;
            console.log(resData.data);
          that.setData({
            orders: resData.data
          });
        }
      })
    }
  },

  detail: function (event) {
    let eventData = event.currentTarget.dataset;
    let orderId = eventData.orderid;
    wx.navigateTo({
      url: 'detail/detail?orderid=' + orderId,
    })
  },

  upper: function(){
    wx.startPullDownRefresh();
    wx.showNavigationBarLoading(); //在标题栏中显示加载
    let page = this.data.page;
    let orders = this.data.orders;
    var that = this;
    Request.getRequest('/buyer/order/list?openid=' + getApp().globalData.openid,
      function (res) {
        if (res.data.data.length >= 1) {
          orders = res.data.data;
          console.log(orders);
        } else {
          page = -1;
          console.log("无更多订单");
        }
        that.setData({
          page: page,
          orders: orders
        });
        wx.hideNavigationBarLoading();
        wx.stopPullDownRefresh();
      },
      function (res) {
      }
    );
  },

  lower: function(){
    let page = this.data.page;
    if(page==-1){
      return;
    }
    let orders = this.data.orders;
    var that = this;
    Request.getRequest('/buyer/order/list?openid=' + getApp().globalData.openid + '&&page=' + ++page,
      function(res){
        if(res.data.data.length >= 1){
          orders = orders.concat(res.data.data);
          console.log(orders);
        }else{
          page = -1;
          console.log("无更多订单");
        }
        that.setData({
          page: page,
          orders: orders
        });
      },
      function(res){

      }
    );
  }

})