Page({

  /**
   * 页面的初始数据
   */
  data: {
    imagList: ['https://gongyuxian.com/sell/custom/custom.jpg']
  },

  previewImage: function(){
    wx.previewImage({
      urls: this.data.imagList,
    })
  },

  call: function(){
    wx.makePhoneCall({
      phoneNumber: '15802603699',
    })
  }
})