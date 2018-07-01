var req = require("../../../../utils/request.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //swipper 属性
        indicatorDots: true, //是否显示面板指示点
        autoplay: true, //是否自动切换
        interval: 3000, //自动切换时间间隔,3s
        duration: 1000, //  滑动动画时长1s
        product: {},

        cart: [],
        count: 0,
        swipeIcons: null,
        detailIcons:null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      var that = this;
      let proid = options.proid;
      console.log(proid);
      req.getRequest("/buyer/product/one?proId=" + proid,
          function (res) {
              let product = res.data.data;
              if (product) {
                let swipeIcons = [];
                if (product.swipeIcons){
                  swipeIcons = JSON.parse(product.swipeIcons);
                }
                let detailIcons = [];
                if (product.detailIcons){
                  detailIcons = JSON.parse(product.detailIcons);
                }
                that.setData({
                    product: product,
                    swipeIcons: swipeIcons,
                    detailIcons: detailIcons
                });
              }
          },
          function (res) {

          }
      );
      let cart = getApp().globalData.cart;
      let cartProduct = cart.find(function (v) {
        return v.productId == proid;
      });
      if(cartProduct){
        that.setData({
          count: cartProduct.count,
        });
      }
      if (cart) {
          that.setData({
              cart: cart
          });
      }

    },
    tocart: function () {
        wx.switchTab({
            url: '/pages/sell/cart/cart',
        })
    },
    addProduct: function () {
        let product = this.data.product;
        let cart = this.data.cart;
        if (cart) {
            let cartProduct = cart.find(function (v) {
                return v.productId == product.productId;
            });
            if (cartProduct) {
                cartProduct.count++;
            } else {
                product.count++;
                console.log(product);
                cart.push(product);
            }
        } else {
            product.count++;
            console.log(product);
            cart.push(product);
        }
        console.log(cart);
        this.setData({
            count: ++this.data.count,
            cart: cart
        });
        getApp().globalData.cart = cart;
    },
    //分享
    onShareAppMessage: function () {
      console.log(this.data.product.productId);
      return {
        title: '根本停不下来',
        // path: 'pages/sell/home/detail/detail?proid=' + this.data.product.productId
        path: 'pages/sell/index?proid=' + this.data.product.productId
      }
    }
})
