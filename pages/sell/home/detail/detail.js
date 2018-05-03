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
        swipeIcons: null
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
                console.log(product);
                if (product) {
                    let swipeIcons = JSON.parse(product.swipeIcons);
                    console.log(swipeIcons);
                    that.setData({
                        product: product,
                        swipeIcons: swipeIcons
                    });
                }
            },
            function (res) {

            }
        );
        let cart = wx.getStorageSync("cart");
        if (cart) {
            this.setData({
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
        wx.setStorageSync("cart", cart);
    },

})
