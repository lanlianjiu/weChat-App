var wxrequest = require('../../util/network.js')
Page({
  data: {
    image: "",
    sourceTypeIndex: 2,
    sourceType: ['拍照', '相册', '拍照或相册'],

    sizeTypeIndex: 2,
    countIndex: 8,
  },
  onLoad: function () {
    var self = this

    self.setData({
      loading: true
    })
    // var url = "http://localhost/SHP/wxApi/web/v1/users";

    // wxrequest.requestWx(url, {},"GET", function (res) {
    //   console.log(res);
    // },
    // function (res) {
    //   console.log(res);
    // }, 
    // function (res) {
    //   console.log(res);
    // })
  }, 
  sourceTypeChange: function (e) {
    wxrequest.uploadImg(e.detail.value,2,8,function(res) {
      console.log(res);
    })
    //this.chooseImage(e.detail.value);
  }, 
  // chooseImage: function (s) {
  //   var that = this
  //   wx.chooseImage({
  //     sourceType: s,
  //     sizeType: 2,
  //     count: 8,
  //     success: function (res) {
  //       console.log(res)
  //       that.setData({
  //         image: res.tempFilePaths
  //       })
  //     }
  //   })
  // }
})

