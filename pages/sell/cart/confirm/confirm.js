var Utils = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    total: {
      count: 0,
      money: 0.0
    },
    discount: 9,
    isSelfPick: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
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
    // 页面显示
    try {
      let letCart = wx.getStorageSync("cart");
      this.setData({
        cart: letCart,
        total: getApp().globalData.total
      });
    } catch (e) {
      console.log(e);
    }
  },
  selfpick: function () {
    this.setData({
      isSelfPick: true
    });
  },
  distribute: function () {
    this.setData({
      isSelfPick: false
    });
  },
  createOrder: function () {
    let total = this.data.total;
    let sumPrice = total.money;
    let isSelfPick = this.data.isSelfPick;
    let cart = this.data.cart;
    let discount = this.data.discount;
    if (isSelfPick){
      sumPrice = sumPrice * discount / 10;
    }
    let openId = getApp().globalData.openid;
    let orderForm = {
      name: "张三",
      phone: "15802603699",
      address: "西城嘉苑",
      orderAmount: sumPrice,
      openid: openId,
      items: JSON.stringify(cart)
    };
    console.log(orderForm);
    wx.request({
      url: getApp().globalData.serviceUrl+'/buyer/order/create',
      data: Utils.json2Form(orderForm),
      method: "POST",
      header: { 
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        console.log("成功回掉");
        let resData = res.data;
        console.log(resData);
        if (resData.code == 0){
          wx.setStorageSync("cart", []);
          getApp().globalData.total = {
            count: 0,
            money: 0.0
          }
          console.log(wx.getStorageSync("cart"));
          console.log(getApp().globalData.total); 
        }
      }
    })
  }
})