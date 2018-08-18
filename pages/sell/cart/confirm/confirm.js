var Util = require("../../../../utils/util.js");
var Request = require("../../../../utils/request.js");
var Pay = require("../../../../utils/pay.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    rangeData: [
      ['次日'],
      [
        '请选择配送时间',
        '10:00-11:00',
        '11:00-12:00',
        '12:00-13:00',
        '13:00-14:00',
        '14:00-15:00',
        '15:00-16:00',
        '16:00-17:00',
        '17:00-18:00',
        '18:00-19:00',
        '19:00-20:00',
        '20:00-21:00',
        '21:00-22:00']
    ],
    rangeIdx: [0, 0],
    total: {
      count: 0,
      money: 0.00
    },
    discount: 9,
    freight: 1,
    isSelfPick: true,
    receiver: null,
    amount: 0.00,
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
    console.log();
    let receiver = getApp().globalData.receiver;
    if (receiver && receiver.openid && receiver.openid == getApp().globalData.openid){
    }else{
      receiver = null;
    }

    let amount = getApp().globalData.total.money ;
    if (!this.data.isSelfPick) {
      amount = amount + this.data.freight
    }
    // 页面显示
    this.setData({
      cart: getApp().globalData.cart,
      total: getApp().globalData.total,
      receiver: receiver,
      amount: amount
    });

 
  },
  onHide: function() {
    let receiver = this.data.receiver;
    if (receiver && receiver.openid && receiver.openid == getApp().globalData.openid) {
      getApp().globalData.receiver = receiver;
      // getApp().globalData.total = this.data.total;
    }
  },
  selfpick: function () {
    if (this.data.isSelfPick == false) {
      let amount = this.data.amount;
      let freight = this.data.freight;
      amount = amount.sub(freight);
      this.setData({
        isSelfPick: true,
        amount: amount
      });
    }
  },
  distribute: function () {
    if (this.data.isSelfPick == true) {
      let amount = this.data.amount;
      let freight = this.data.freight;
      amount = amount.add(freight);
      this.setData({
        isSelfPick: false,
        amount: amount
      });
    }
  },
  createOrder: function () {
    if (Util.isLogin() === false) {
      return;
    }
    let isSelfPick = this.data.isSelfPick;
    //组装订单数据
    let receiver = this.data.receiver;
    if (!isSelfPick && receiver == null) {
      wx.showToast({
        title: '请选择收获地址',
        icon: 'none',
        duration: 2000
      });
      return;
    }
    let sumPrice = this.data.amount;
  
    let cart = this.data.cart;
    let cartForm = [];
    cart.forEach(function(product, i){
      if (product.count != 0){
        cartForm.push(product);
      }
    });
    if (cartForm.length == 0){
      wx.showToast({
        title: '请先选择商品！',
        icon: "none",
        duration: 3000
      });
      return;
    }
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
      if (rangeIdx[1] == 0) {
        wx.showToast({
          title: '请选择配送时间',
          icon: 'none',
          duration: 2000
        });
        return;
      }
    } else {
      receiver = {
        name: null,
        phone: null,
        address: null,
      }
      distributeTime = '10:00-21:30';
      freight = 0;
    }

    let orderForm = {
      name: receiver.name,
      phone: receiver.phone,
      address: receiver.address + " " + receiver.detail,
      orderAmount: sumPrice,
      openid: openid,
      items: JSON.stringify(cartForm),
      distributeType: distributeType,
      distributeTime: distributeTime,
      freight: freight
    };

    Request.postRequest('/buyer/order/create',
      orderForm,
      function (res) {
        let resData = res.data;
        if (resData.code == 0) {
          cart.forEach(function (product, i) {
            product.count = 0;
          });
          getApp().globalData.cart = cart;
          getApp().globalData.total = {
            count: 0,
            money: 0.00
          }
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