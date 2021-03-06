import api from 'lib/api';
import $request from 'lib/request';
import $user from 'lib/user';
import $http from 'lib/http';
App({
  globalData: {
    version: "1.0.0",
    windowWidth: 0,
    windowHeight: 0
  },
  onLaunch: function () {
    let self = this
    this.checkVersion();
    $user.checkLogin(); //检查登陆态度
  },
  onShow: function () {
    let that = this;
    wx.getSystemInfo({
      success: function (res) {

        let windowHeight = (res.windowHeight * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        let windowWidth = (res.windowWidth * (750 / res.windowWidth)); //将高度乘以换算后的该设备的rpx与px的比例
        that.globalData.windowWidth = windowWidth;
        that.globalData.windowHeight = windowHeight;
      }
    })
  },
  onHide: function () {},
  checkVersion: function () {
    const updateManager = wx.getUpdateManager()
    updateManager.onCheckForUpdate(function (res) {
      // 请求完新版本信息的回调
    })
    updateManager.onUpdateReady(function () {
      wx.showModal({
        title: '更新提示',
        content: '新版本已经准备好，是否重启应用？',
        success: function (res) {
          if (res.confirm) {
            // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
            updateManager.applyUpdate()
          }
        }
      })
    })
    updateManager.onUpdateFailed(function () {
      // 新的版本下载失败
    })
  },
})