Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagList: ['https://gongyuxian.com/sell/custom/custom.jpg'],
    wechatNumber: "‭lbf119862231"
  },

  previewImage: function(){
    wx.previewImage({
      urls: this.data.imagList,
    })
  },

  copy: function(){
    wx.setClipboardData({
      data: this.data.wechatNumber,
      success: function (res) {
        wx.showToast({
          title: '已复制到剪贴板',
          icon: 'success',
          duration: 3000
        })
      }
    });
  }
})