Page({
  data: {
    text: "Page main",
    cart: [],
    total: null,
  },
  onShow: function () {
    // 页面显示
    try {
      let cart = getApp().globalData.cart;
      let total = {
        count: 0,
        money: 0.0
      }
      if (cart) {
        cart.forEach(function (product, idx) {
          total.count += product.count;
          if (product.activity!=null && product.activity.atvId == 1){
            total.money = (total.money * 10000 + product.count * (product.productPrice * 10 * 10)  * (product.activity.discount * 10 * 10))/10000 ;
          }else{
            total.money = (total.money * 100 + product.count * product.productPrice * 100) / 100;
          }
        });
      } else {
        cart = [];
      }
      this.setData({
        cart: cart,
        total: total
      });
    } catch (e) {
      console.log(e);
    }
  },
  onHide: function () {
    // 页面隐藏
    console.log("页面隐藏")
    getApp().globalData.cart = this.data.cart;
    getApp().globalData.total = this.data.total;
  },
  //移除
  minusCount: function (event) {
    let eventData = event.currentTarget.dataset;
    let cart = this.data.cart;
    let product = cart.find(function (v) {
      return v.productId == eventData.id;
    });
    if (product.count >= 1) {
      product.count -= 1;
      let total = this.data.total;
      total.count -= 1;
      if (product.activity != null && product.activity.atvId == 1) {
        total.money = (total.money * 10000 - (product.productPrice * 10 * 10) * (product.activity.discount * 10 * 10)) / 10000;
        }else{
      total.money = (total.money * 10 * 10 - product.productPrice * 10 * 10) / 100;

        }
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
    if (product.activity.atvId == 1) {
      total.money = (total.money * 10000 + (product.productPrice * 10 * 10) * (product.activity.discount * 10 * 10)) / 10000;}else{
    total.money = (total.money * 10 * 10 + product.productPrice * 10 * 10) / 10 / 10;

      }
    this.setData({
      cart: cart,
      total: total
    });
  }

})