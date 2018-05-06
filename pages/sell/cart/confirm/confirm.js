var Utils = require("../../../../utils/util.js");
var Request = require("../../../../utils/request.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cart: [],
    rangeData: [
      { value: '10:00-11:00' },
      { value: '11:00-12:00' },
      { value: '12:00-13:00' },
      { value: '13:00-14:00' },
      { value: '14:00-15:00' },
      { value: '15:00-16:00' },
      { value: '16:00-17:00' },
      { value: '17:00-18:00' },
      { value: '18:00-19:00' },
      { value: '19:00-20:00' },
      { value: '20:00-21:00' },
      { value: '21:00-22:00' }],
    rangeIdx: 9,
    total: {
      count: 0,
      money: 0.0
    },
    discount: 9,
    isSelfPick: true,
    receiver: null
  },
  /**
   * 选择配送时间
   */
  bindTimeChange: function (e) {
    this.setData({
      timeIdx: e.detail.value
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
      if (receiver == undefined || receiver == "") {
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
    //组装订单数据
    let receiver = this.data.receiver;
    if (receiver == null) {
      return;
    }
    let total = this.data.total;
    let sumPrice = total.money;
    let isSelfPick = this.data.isSelfPick;
    let cart = this.data.cart;
    let discount = this.data.discount;
    let openid = getApp().globalData.openid;
    let distributeType = 1;
    if (isSelfPick == false) {
      distributeType = 2;
    }
    let rangeData = this.data.rangeData;
    let distributeTime = rangeData[this.data.rangeIdx].value;
    let orderForm = {
      name: receiver.name,
      phone: receiver.phone,
      address: receiver.address,
      orderAmount: sumPrice,
      openid: openid,
      items: JSON.stringify(cart),
      distributeType: distributeType,
      distributeTime: distributeTime
    };
    Request.postRequest('/buyer/order/create',
      orderForm,
      function (res) {
        console.log(res);
        let resData = res.data;
        if (resData.code == 0) {
          cart.forEach(function(product,i){
            product.count = 0;
          });
          wx.setStorageSync("cart", cart);
          //跳转订单详情页面
          wx.navigateTo({
            url: '../../mine/myorder/detail/detail?orderid=' + resData.data.orderId,
          })
          //支付
          Request.getRequest('/pay/create?orderId=' + resData.data.orderId + '&openid=' + openid,
            function (res) {
              console.log(res.data);
              let payment = res.data.data;
              wx.requestPayment({
                'timeStamp': payment.timeStamp,
                'nonceStr': payment.nonceStr,
                'package': payment.package,
                'signType': 'MD5',
                'paySign': payment.paySign,
                'success': function (res) {
                  console.log(res);
                  if (res.errMsg == "requestPayment:ok"){
                    Request.getRequest('/buyer/order/paid?orderId=' + resData.data.orderId + '&openid=' + openid,
                      function(res){
                        console.log(res);
                        let orderCode = res.data.data.orderCode;
                        wx.showToast({
                          title: '支付成功',
                          duration:1000
                        })
                        wx.switchTab({
                          url: '/pages/sell/index',
                        })
                   
                     
                      },
                      function(res){
                      }
                    );
                  }
                },
                'fail': function (res) {
                }
              })
            },
            function (res) {

            }
          )
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