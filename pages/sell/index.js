var bmap = require('../../libs/bmap-wx.min.js');
var req = require('../../utils/request.js');
var wxMarkerData = [];
Page({
  data: {
    //菜单
    menus: null,
    advertisements: null,
    smallCategories: [],
    menuIndex: 0,
    //购物车
    cart: [],
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
    //加载菜单
    req.getRequest('/buyer/product/list',
      function (res) {
        let menus = res.data.data;
        if (!menus) {
          menus = [];
        }
        that.loadProductOfNextPage(menus, that.data.menuIndex);
      },
      function (res) {
        console.log(res);
      }
    );

    //百度地图
    var BMap = new bmap.BMapWX({
       ak: 'KGPa32yj0bHnP7iAwIDX494yvm6R2auq'
    });
    var fail = function (data) {
      console.log(data)
    };
    var success = function (data) {
      wxMarkerData = data.wxMarkerData;
      console.log(wxMarkerData[0]);
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
    //加载购物车数据
    try {
      let cart = getApp().globalData.cart;
      this.setData({
        cart: cart
      });
    } catch (e) {
      console.log(e);
    }
    let location = getApp().globalData.location;
    if(location){
      this.setData({
        address: location
      });
    }
    if (this.data.menus) {
      this.initCart(this.data.menus, this.data.menuIndex, this.data.smallCategories);
    }
  },
  onHide: function () {
    getApp().globalData.cart = this.data.cart;
  },

  //初始化购物车
  initCart: function (menus, index, clildCategories) {

    let cart = this.data.cart;
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
                  if (cartProduct.productId == product.productId) {
                    product.count = cartProduct.count;
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
    console.log(menus);
    this.setData({
      cart: cart,
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
    this.setData({
      menuIndex: eventData.idx
    });
    // this.initProducts(menus, eventData.idx);
    this.loadProductOfNextPage(menus, eventData.idx);
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

    //set数据
    this.setData({
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

    this.setData({
      menus: menus,
      smallCategories: menu.childCategories,
    });

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
        for (let i = 0; i < cart.length; i++) {
          if (product.productId == cart[i].productId) {
            cart.splice(i, 1);
            console.log(cart);
          }
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
    let menus = this.data.menus;
    let index = this.data.menuIndex;
    //初始化数据page childCategories
    menus[index].page = 0;
    menus[index].childCategories = [];
    this.loadProductOfNextPage(menus, index);
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh()      //停止下拉刷新

  },
  //上滑加载
  lower: function () {
    let menus = this.data.menus;
    let index = this.data.menuIndex;
    this.loadProductOfNextPage(menus, index);
  },
  //商品详情
  detail: function (event) {
    let eventData = event.currentTarget.dataset;
    wx.navigateTo({
      url: 'home/detail/detail?proid=' + eventData.proid,
    })
  },
  //加载下一页的商品数据
  loadProductOfNextPage: function (menus, index){

    var that = this;
    let page = menus[index].page;
    if (!page) {
      page = 0;
      menus[index].page = page;
    }
    //-1代表无更多商品
    if (page == -1) {
      that.setData({
        smallCategories: menus[index].childCategories,
        advertisements: menus[index].advertisements
      });
      return;
    }
    this.setData({
      isHideLoadMore: false
    });
    //查询下一页
    page++;
    req.getRequest('/buyer/product/list/small/prodcut?parentId=' + menus[index].categoryId + '&page=' + page,
      function (res) {
        that.setData({
          isHideLoadMore: true
        });
        let childCategories = res.data.data;
        let smallCategories = menus[index].childCategories
        if(!smallCategories){
          smallCategories = [];
        }
        smallCategories = smallCategories.concat(childCategories)
        if (childCategories.length >= 1) {
          menus[index].page = page;
        } else {
          menus[index].page = -1;
        }
        that.initCart(menus, index, smallCategories);
      },
      function (res) {

      }
    );
  },

  getLocation: function(){
    wx.navigateTo({
      url: 'mine/address/choose/choose',
    })
  }

});

