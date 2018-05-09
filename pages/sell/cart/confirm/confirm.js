var Utils = require("../../../../utils/util.js");
var Request = require("../../../../utils/request.js");
var Pay = require("../../../../utils/pay.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    rangeData:[
      ['次日'],
      [
      '请选择配送时间',
      '10:00-11:00' ,
      '11:00-12:00' ,
      '12:00-13:00' ,
      '13:00-14:00' ,
      '14:00-15:00' ,
      '15:00-16:00' ,
      '16:00-17:00' ,
      '17:00-18:00' ,
      '18:00-19:00' ,
      '19:00-20:00' ,
      '20:00-21:00' ,
      '21:00-22:00' ]
      ],
    rangeIdx: [0,0],
    total: {
      count: 0,
      money: 0.0
    },
    discount: 9,
    freight: 0.01,
    isSelfPick: true,
    receiver: null
  },
  /**
   * 选择配送时间
   */
  bindTimeChange: function (e) {
    this.setData({
      rangeIdx: e.detail.value
    });
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
      if (!receiver) {
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
    let total = this.data.total;
    total.money = (100 * total.money - this.data.freight * 100) / 100;
    this.setData({
      isSelfPick: true,
      total: total
    });
  },
  distribute: function () {
    let total = this.data.total;
    total.money = (100 * total.money + this.data.freight * 100) / 100;
    this.setData({
      isSelfPick: false,
      total: total
    });
  },
  createOrder: function () {

    //组装订单数据
    let receiver = this.data.receiver;
    console.log(receiver)
    if (receiver == null || receiver == '') {
      wx.showToast({
        title: '请选择收获地址',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let total = this.data.total;
    let sumPrice = total.money;
    let isSelfPick = this.data.isSelfPick;
    let cart = this.data.cart;
    let discount = this.data.discount;
    let openid = getApp().globalData.openid;
    let distributeType = 1;
    let distributeTime = null;
    let freight = this.data.freight;
    if (isSelfPick == false) {
      distributeType = 2;
      let rangeData = this.data.rangeData;
      let rangeIdx = this.data.rangeIdx;
      distributeTime = rangeData[1][rangeIdx[1]];
      console.log(distributeTime)
      if (rangeIdx[1] == 0 ){
        wx.showToast({
          title: '请选择配送时间',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    }else{
      distributeTime = '10:00-21:30';
      freight = 0;
    }
    
    let orderForm = {
      name: receiver.name,
      phone: receiver.phone,
      address: receiver.address,
      orderAmount: sumPrice,
      openid: openid,
      items: JSON.stringify(cart),
      distributeType: distributeType,
      distributeTime: distributeTime,
      freight: freight
    };

    Request.postRequest('/buyer/order/create',
      orderForm,
      function (res) {
        console.log(res);
        let resData = res.data;
        if (resData.code == 0) {
          cart.forEach(function(product, i){
            product.count = 0;
          });
          wx.setStorageSync("cart", cart);
          //跳转订单详情页面
          wx.navigateTo({
            url: '../../mine/myorder/detail/detail?orderid=' + resData.data.orderId,
          })
          //支付
          Pay.pay(resData.data.orderId);
        }
      },
      function (res) {

      }
    );
  },
  navitoAddress: function () {
    wx.navigateTo({
      url: '../../mine/address/address?isChoose=true',
    })
  }
})