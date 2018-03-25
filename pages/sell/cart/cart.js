Page({
  data: {
    text: "Page main",
    cart: [],
    total: {
      count: 0,
      money: 0
    },
  },
  onShow: function () {
    // 页面显示
    try {
      let letCart = wx.getStorageSync("cart");
      console.log(letCart);
      this.setData({
        cart: letCart
      });
    } catch (e) {
      console.log(e);
    }
    //获取global total
    this.setData({
      total: getApp().globalData.total
    });
    console.log(getApp().globalData.total);
  },
  onHide: function () {
    // 页面隐藏
  }

})