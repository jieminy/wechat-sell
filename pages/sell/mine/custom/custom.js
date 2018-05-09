Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagList: ['https://51vr.mynatapp.cc/sell/custom/custom.jpg']
  },

  previewImage: function(){
    wx.previewImage({
      urls: this.data.imagList,
    })
  }
})