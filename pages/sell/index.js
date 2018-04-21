var bmap = require('../../libs/bmap-wx.min.js');
var req = require('../../utils/request.js');
var wxMarkerData = [];
Page({
  data: {
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
    toView: 'blue',
    //菜单
    menus: null,
    advertisements: null,
    smallCategories: [],
    menuIndex: 0,
    //购物车
    cart: [],
    total: {
      count: 0,
      money: 0.0
    },
    //地图
    markers: [],
    latitude: '',
    longitude: '',
    rgcData: {},
    address: '',
    //是否显示加载更多
    isHideLoadMore: true,
    //swipper 属性
    indicatorDots: true, //是否显示面板指示点
    autoplay: true, //是否自动切换
    interval: 3000, //自动切换时间间隔,3s
    duration: 1000, //  滑动动画时长1s
  },

  onLoad: function () {
    var that = this;
      // wx.setStorageSync("cart", []);
    //加载菜单
    req.getRequest('/buyer/product/list',
      function (res) {
        let menus = res.data.data;
        if (!menus) {
          menus = [];
        }
        that.initProducts(menus, that.data.menuIndex);
      },
      function (res) {
        console.log(res);
      }
    );

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
    if (this.data.menus) {
        this.initCart(this.data.menus, this.data.menuIndex, this.data.smallCategories);
    }
    //加载购物车数据
    try {
      let cart = wx.getStorageSync("cart");
      this.setData({
        cart: cart
      });
    } catch (e) {
      console.log(e);
    }
  },
  onHide: function () {
    wx.setStorageSync("cart", this.data.cart);
    getApp().globalData.total = this.data.total;
  },
  //加载商品
  initProducts: function (menus, index) {
    var that = this;
    //加载商品
    console.log("加载商品");
    let page = menus[index].page;
      //首次赋值
    if (!page) {
      page = 1;
      menus[index].page = 1;
    }
      //page>=2 page自增 获取下一页商品
      if (page >= 2) {
      page++;
          menus[index].page = page;
      }
      //-1代表无更多商品
      if (page == -1) {
          return;
      }
    req.getRequest('/buyer/product/list/small/prodcut?parentId=' + menus[index].categoryId + '&page=' + page,
      function (res) {
        let clildCategories = res.data.data;
          let smallCategories = menus[index].clildCategories
          //都有数据合并
          if (smallCategories && clildCategories) {
              smallCategories = smallCategories.concat(clildCategories)
          }
          //没有查询到更多数据
          else if (smallCategories) {
              smallCategories = smallCategories;
              menus[index].page = -1;
        }
          //查询到数据但是menus[index].clildCategories无数据
          else if (clildCategories) {
              smallCategories = clildCategories;
          }
          //无任何数据
          else {
              smallCategories = [];
              menus[index].page = -1;
          }
          that.initCart(menus, index, smallCategories);
      },
      function (res) {
        console.log(res);
      }
    );

  },
  //初始化购物车
  initCart: function (menus, index, clildCategories) {
    let total = {
      count: 0,
      money: 0.0
    };
    let cart = wx.getStorageSync("cart");
    if (cart) {
      var i;
      var j;
      var k;
      clildCategories.forEach(
        //小类目-商品数组
        function (childCategory, index) {
          childCategory.productInfos.forEach(
            //商品
            function (product, i) {
              cart.forEach(
                function (cartProduct, j) {
                  //去除无效数据
                  if (cartProduct.count == 0) {
                    cart.pop(cartProduct);
                  }
                  if (cartProduct.productId == product.productId) {
                    product.count = cartProduct.count;
                    total.count += cartProduct.count;
                    total.money = (cartProduct.count * (10 * product.productPrice) + total.money * 10) / 10;
                  }
                }
              );
            }
          );
        }
      );

    } else {
      cart = [];
    }
    menus[index].childCategories = clildCategories;
    this.setData({
      cart: cart,
      total: total,
      menus: menus,
      smallCategories: clildCategories,
      advertisements: menus[index].advertisements
    });
  },
  //选择菜单
  selectMenu: function (event) {
    let eventData = event.currentTarget.dataset;
    let menus = this.data.menus;
    let clildCategories = menus[eventData.idx].clildCategories;
    if (clildCategories) {
      this.setData({
        smallCategories: clildCategories
      })
    } else {
      this.initProducts(menus, eventData.idx);
    }
    this.setData({
      menuIndex: eventData.idx
    });
    // this.data.toView = 'red'

  },
  //添加
  addCount: function (event) {
    //获取目标product
    let eventData = event.currentTarget.dataset;
    let menus = this.data.menus;
    let menu = menus.find(function (v) {
      return v.categoryId == eventData.ctid;
    });
    let childCategory = menu.childCategories.find(function (v) {
      return v.categoryId == eventData.sctid;
    });

    let product = childCategory.productInfos.find(function (v) {
      return v.productId == eventData.id;
    });

    product.count += 1;

    let total = this.data.total;
    total.count += 1;
    //小数精度问题
    total.money = (product.productPrice * 10 + total.money * 10) / 10;
    //set数据
    this.setData({
      total: total,
      menus: menus,
      smallCategories: menu.childCategories,
    });

    //加入购物车缓存
    this.cartStore(product);

  },
  //移除
  minusCount: function (event) {
    //获取目标product
    let eventData = event.currentTarget.dataset;
    let menus = this.data.menus;
    let menu = menus.find(function (v) {
      return v.categoryId == eventData.ctid;
    });
    let childCategory = menu.childCategories.find(function (v) {
      return v.categoryId == eventData.sctid;
    });

    let product = childCategory.productInfos.find(function (v) {
      return v.productId == eventData.id;
    });

    //数量为0时不进行操作
    if (product.count == 0) {
      return;
    }

    product.count -= 1;

    let total = this.data.total;

    total.count -= 1;
    total.money = (total.money * 10 - product.productPrice * 10) / 10;
    this.setData({
      menus: menus,
      smallCategories: menu.childCategories,
    });

    getApp().globalData.total = total;
    //移除购物车缓存
    this.cartStore(product);

  },
  //购物车缓存
  cartStore: function (product) {
    try {
      let cart = this.data.cart;
      if (!cart) {
        cart = [];
      } else {
        let prod = cart.find(function (v) {
          return v.productId == product.productId;
        });
        if (prod) {
          cart.pop(prod);
        }
      }
      if (product.count >= 1) {
        cart.push(product);
      }
    } catch (e) {
      console.log(e);
    }
  },
  //下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉");
    wx.showNavigationBarLoading() //在标题栏中显示加载

    //模拟加载
    setTimeout(function () {
      // complete
      wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh()      //停止下拉刷新
    }, 1500);
  },
  //上滑加载
    lower: function (e) {
    console.log("上滑");
  }

});

