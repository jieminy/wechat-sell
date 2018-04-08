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
    receiver: null
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

      //获取收货人
      let receiver = wx.getStorageSync("receiver");
      console.log(receiver);
      if (receiver == undefined || receiver == ""){
        receiver: null
      }
      this.setData({
        receiver: receiver
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
    let receiver = this.data.receiver;
    if (receiver == null){
      return;
    }
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
      name: receiver.name,
      phone: receiver.phone,
      address: receiver.address,
      orderAmount: sumPrice,
      openid: openId,
      items: JSON.stringify(cart)
    };
    wx.request({
      url: getApp().globalData.serviceUrl+'/buyer/order/create',
      data: Utils.json2Form(orderForm),
      method: "POST",
      header: { 
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res){
        let resData = res.data;
        if (resData.code == 0){
          wx.setStorageSync("cart", []);
          getApp().globalData.total = {
            count: 0,
            money: 0.0
          }
          //跳转订单详情页面
          wx.navigateTo({
            url: '../../mine/myorder/detail/detail?orderid=' + resData.data.orderId,
          })
        }
      }
    })
  },
  navitoAddress: function () {
    wx.navigateTo({
      url: '../../mine/address/address?isChoose=true',
    })
  }
})