function postRequest() {

}

function getRequest(url, success, fail) {
    console.log("调用公共方法：getRequest");
    wx.request({
        url: getApp().globalData.serviceUrl + url,
        success: res = > {
        success(res);
},
    fail: res =
>
    {
        fail(res);
    }
})
    ;
}

module.exports = {
    getRequest: getRequest
}