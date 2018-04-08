var bmap = require('../../libs/bmap-wx.min.js'); 
var wxMarkerData = []; 
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
    //地图
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    address: ''
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    var that = this;
    // wx.setStorageSync("cart", []);
    wx.request({
      url: "https://51vr.mynatapp.cc/sell/buyer/product/list",
      success: function (res) {
        var list = res.data.data;
        if (list == null) {
          list = [];
        }
        that.initCart(list);
      }
    });
    //百度地图
    var BMap = new bmap.BMapWX({
      ak: 'NEgN0GEeMAmRS01KwFQarCGayZWVrLy7' 
    }); 
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      that.setData({
        markers: wxMarkerData
      });
      that.setData({
        latitude: wxMarkerData[0].latitude
      });
      that.setData({
        longitude: wxMarkerData[0].longitude
      });
      that.setData({
        address: wxMarkerData[0].address
      });
      console.log(wxMarkerData);
    };
    // 发起regeocoding检索请求 
    BMap.regeocoding({
      fail: fail,
      success: success,
      iconPath: '../../images/marker_red.png',
      iconTapPath: '../../images/marker_red.png'
    }); 
  },
  onShow: function () {
    if(this.data.menus.length != 0){
      this.initCart(this.data.menus);
    }
  },
  //初始化购物车数据
  initCart: function (list) {
    console.log("初始化购物车");
    let total =  {
      count: 0,
      money: 0.0
    };
    let cart = wx.getStorageSync("cart");
    if (cart != null && cart.length >= 1) {
      var c;
      var i;
      var j;
      var k;
      for (c in list) {
        //小类目集合
        let proSmCts = list[c].productSmallCategories;
        for (i in proSmCts) {
          //小类目
          let proSmCt = proSmCts[i];
          for (j in proSmCt.productInfos) {
            //商品
            let product = proSmCt.productInfos[j];
            for (k in cart) {
              if (cart[k].productId == product.productId) {
                product.count = cart[k].count;
                total.count += product.count;
                total.money = (product.count * (10 * product.productPrice) + total.money * 10) / 10;
                if(product.count == 0){
                  cart.pop(cart[k]);
                }
              }
            }
          }
        }
      }
      wx.setStorageSync("cart", cart);
      getApp().globalData.total = total;
    }

    var smallcts = list[0].productSmallCategories;
    if (smallcts == null) {
      smallcts = [];
    }
    this.setData({
      menus: list,
      smallCategories: smallcts
    });
  },
  //选择菜单
  selectMenu: function (event) {
    let eventData = event.currentTarget.dataset;
    let menus = this.data.menus;
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
    //小数精度问题
    total.money = (product.productPrice * 10 + total.money * 10) /10;
    //set数据
    this.setData({
      menus: lmenus,
      smallCategories: menu.productSmallCategories,
    });
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
    total.money = (total.money * 10 - product.productPrice * 10) / 10;
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

});

