
var request = require('../../util/wxApi.js')
var app = getApp();
Page({
  onLoad: function () {
    // wx.login({
    //   //获取code
    //   success: function (res) {
    //     var code = res.code; //返回code
    //     console.log(code);
    //     var appId = 'wx81228eb4b20c618e';
    //     var secret = '690315463c658abed60d5705ae0291ba';
    //     wx.request({
    //       url: 'https://api.weixin.qq.com/sns/jscode2session?appid=' + appId + '&secret=' + secret + '&js_code=' + code + '&grant_type=authorization_code',
    //       data: {},
    //       header: {
    //         'content-type': 'json'
    //       },
    //       success: function (res) {
    //         var openid = res.data.openid //返回openid
    //         console.log('openid为' + openid);
    //       }
    //     })
    //   }
    // })


    var openId = (wx.getStorageSync('openId'))
    if (openId) {
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            nickName: res.userInfo.nickName,
            avatarUrl: res.userInfo.avatarUrl,
          })
        },
        fail: function () {
          // fail
          console.log("获取失败！")
        },
        complete: function () {
          // complete
          console.log("获取用户信息完成！")
        }
      })
    } else {
      // wx.login({
      //   success: function (res) {
      //     console.log(res.code)
      //     if (res.code) {
      //       wx.getUserInfo({
      //         withCredentials: true,
      //         success: function (res_user) {
      //           wx.request({
      //             //后台接口地址
      //             url: 'http://localhost/SHP/frontend/web/index.php?r=web-content/test',
      //             data: {
      //               code: res.code,
      //               encryptedData: res_user.encryptedData,
      //               iv: res_user.iv
      //             },
      //             method: 'GET',
      //             header: {
      //               'content-type': 'application/json'
      //             },
      //             success: function (res) {
      //               // this.globalData.userInfo = JSON.parse(res.data);
      //               that.setData({
      //                 nickName: res.data.nickName,
      //                 avatarUrl: res.data.avatarUrl,
      //               })
      //               wx.setStorageSync('openId', res.data.openId);
      //             }
      //           })
      //         }, fail: function () {
      //           wx.showModal({
      //             title: '警告通知',
      //             content: '您点击了拒绝授权,将无法正常显示个人信息,点击确定重新获取授权。',
      //             success: function (res) {
      //               if (res.confirm) {
      //                 wx.openSetting({
      //                   success: (res) => {
      //                     if (res.authSetting["scope.userInfo"]) {////如果用户重新同意了授权登录
      //                       wx.login({
      //                         success: function (res_login) {
      //                           if (res_login.code) {
      //                             wx.getUserInfo({
      //                               withCredentials: true,
      //                               success: function (res_user) {
      //                                 wx.request({
      //                                   url: 'https://....com/wx/login',
      //                                   data: {
      //                                     code: res_login.code,
      //                                     encryptedData: res_user.encryptedData,
      //                                     iv: res_user.iv
      //                                   },
      //                                   method: 'GET',
      //                                   header: {
      //                                     'content-type': 'application/json'
      //                                   },
      //                                   success: function (res) {
      //                                     that.setData({
      //                                       nickName: res.data.nickName,
      //                                       avatarUrl: res.data.avatarUrl,

      //                                     })
      //                                     wx.setStorageSync('openId', res.data.openId);
      //                                   }
      //                                 })
      //                               }
      //                             })
      //                           }
      //                         }
      //                       });
      //                     }
      //                   }, fail: function (res) {

      //                   }
      //                 })

      //               }
      //             }
      //           })
      //         }, complete: function (res) {


      //         }
      //       })
      //     }
      //   }
      // })

    }


  },
  globalData: {
    userInfo: null
  }
  
})

