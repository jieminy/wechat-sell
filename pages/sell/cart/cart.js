Page({
  data: {
    text: "Page main",
    cart: [],
    total: {
      count: 0,
      money: 0.0
    },
  },
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
  onHide: function () {
    // 页面隐藏
    console.log("页面隐藏")
      console.log(this.data.total)
    wx.setStorageSync("cart", this.data.cart);
    getApp().globalData.total = this.data.total;
  },
  //移除
  minusCount: function (event) {
    let eventData = event.currentTarget.dataset;
    let cart = this.data.cart;
    let product = cart.find(function (v){
        return v.productId == eventData.id;
    });
    if(product.count >= 1){
      product.count -= 1;
        let total = this.data.total;
        total.count -= 1;
        total.money = (total.money * 10 - product.productPrice * 10) / 10;
        this.setData({
            cart: cart,
            total: total
        });
    }
  },
  //增加
  addCount: function (event) {
    let eventData = event.currentTarget.dataset;
    let cart = this.data.cart;
      console.log(cart);
    let product = cart.find(function (v) {
        return v.productId == eventData.id;
    });
    product.count += 1;
    let total = this.data.total;
    total.count += 1;
    total.money = (total.money * 10 + product.productPrice * 10) / 10;
    this.setData({
      cart: cart,
      total: total
    });
  }

})