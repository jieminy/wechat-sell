Page({
  data: {
    text: "Page main",
    background: [
      {
        color: 'green',
        sort: 1
      },
      {
        color: 'red',
        sort: 2
      },
      {
        color: 'yellow',
        sort: 3
      }
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 3000,
    duration: 1200,
    toView: 'blue',
    menus: [],
    smallCategories: [],
    selectedMenuId: 1,
    list: [],
    total: {
      count: 0,
      money: 0
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    wx.request({
      url: "https://51vr.mynatapp.cc/sell/buyer/product/list",
      success: function (res) {
        var list = res.data.data;
        if (list == null) {
          list = [];
        }

        var smallcts = res.data.data[0].productSmallCategories;
        if (smallcts == null) {
          smallcts = [];
        }

        //初始化购物车数据
        let cart = wx.getStorageSync("cart");
        if(cart !=null && cart.length >= 1){
          var i;
          var j;
          var k;
          for (i in smallcts) {
            for (j in smallcts[i].productInfos) {
              let product = smallcts[i].productInfos[j];
              for (k in cart) {
                if (cart[k].productId == product.productId) {
                  product.count = cart[k].count;
                  cart.splice(k,1);
                }
              }
            }
          }
        }

        that.setData({
          menus: list,
          smallCategories: smallcts
        });
      }
    })
  },
  //选择菜单
  selectMenu: function (event) {
    let eventData = event.currentTarget.dataset;
    let menus = this.data.menus;
    console.log(menus);
    let menu = menus.find(function(v){
      return eventData.categoryid == v.categoryId;
    })
    this.setData({
      smallCategories: menu.productSmallCategories
    })
    // this.data.toView = 'red'
  
  },
  //添加
  addCount: function (event) {
    let eventData = event.currentTarget.dataset;
    let total = getApp().globalData.total;
    let lmenus = this.data.menus;
    let menu = lmenus.find(function(v){
      return v.categoryId == eventData.ctid;
    });
    let smcategory = menu.productSmallCategories.find(function (v) {
      return v.smallCategoryId == eventData.sctid;
    });
  
    let product = smcategory.productInfos.find(function (v) {
      return v.productId == eventData.id;
    });
    product.count += 1;
    total.count += 1;
    total.money += product.productPrice;
    //set数据
    this.setData({
      menus: lmenus,
      smallCategories: menu.productSmallCategories,
    });
    console.log(total);
    getApp().globalData.total = total;
    //加入购物车缓存
    try {
      let cart = wx.getStorageSync("cart");
      console.log(cart);
      if(cart == undefined){
        cart = [];
      }
      else{
        let prod = cart.find(function (v) {
          return v.productId == product.productId;
        });
        if (prod != null && prod != undefined) {
          cart.pop(prod);
        }
      }
      cart.push(product);
      console.log(cart);
      wx.setStorageSync("cart", cart);
    } catch (e) {
      console.log(e);
    }
  },
  //移除
  minusCount: function (event) {
    let eventData = event.currentTarget.dataset;
    let total = getApp().globalData.total;
    let lmenus = this.data.menus;
    let menu = lmenus.find(function (v) {
      return v.categoryId == eventData.ctid;
    });
    let smcategory = menu.productSmallCategories.find(function (v) {
      return v.smallCategoryId == eventData.sctid;
    })

    let product = smcategory.productInfos.find(function (v) {
      return v.productId == eventData.id;
    })
    if (product.count == 0) {
      return
    }
    product.count -= 1;
    total.count -= 1
    total.money -= product.productPrice
    this.setData({
      menus: lmenus,
      smallCategories: menu.productSmallCategories,
    })
    getApp().globalData.total = total;
    //移除购物车缓存
    try {
      let cart = wx.getStorageSync("cart");
      if (cart == undefined) {
        cart = [];
      }
      else {
        let prod = cart.find(function (v) {
          return v.productId == product.productId;
        });
        if (prod != null && prod != undefined) {
          cart.pop(prod);
        }
      }
      if(product.count != 0){
        cart.push(product);
      }
      console.log(cart);
      wx.setStorageSync("cart", cart);
    } catch (e) {
      console.log(e);
    }
  },
})
