Page({
  onLoad: function () {
    var self = this

    self.setData({
      loading: true
    })

    wx.request({
      url: "http://localhost/SHP/appApi/v1/users",
      data: {
        noncestr: Date.now()
      },
      dataType:'json',
      success: function (result) {
        wx.showToast({
          title: '请求成功',
          icon: 'success',
          mask: true,
          duration: 2000
        })
        self.setData({
          loading: false
        })
        console.log('request success', result)
      },

      fail: function ({ errMsg }) {
        console.log('request fail', errMsg)
        self.setData({
          loading: false
        })
      },
      complete:function (params) {
        console.log(234242)
      }
    })

  },
})

