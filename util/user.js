import $request from 'request';
import api from 'api';
import {defer} from 'common';

class User {
    constructor() {
        this.listenerList = [];
    }
    addListener(listener) {
        this.listenerList.push(listener);
    }
    trigger = function () {
        if (this.listenerList.length == 0) {
            return;
        }
        var params = Array.prototype.slice.call(arguments, 1);
        for (var listener in this.listenerList) {
            this.listenerList[listener].resolve()
        }
        this.listenerList = []
    }

    checkLogin() {
        let self = this
        api.checkSession()
            .then(function (res) {
                console.log('已登录');
            }, function (error) {
                //登录态过期
                self.login()
            })
    }
    login(callback) {
        let $this = this;
        var deferred = new defer();
        this.addListener(deferred);
        if (this.listenerList.length == 1) {
            api.login().then(function (res) {
                if (res.code) {
                    return $request.post('/WechatMP/miniLogin.do', {
                        jsCode: res.code
                    }).then(function (res) {
                        let result = res.data;
                        if (result.success) {
                            wx.setStorageSync('tokenId', result.result.tokenId)
                            wx.setStorageSync("sessionid", res.header["Set-Cookie"])
                            $this.trigger();
                        } else {
                            wx.showToast({
                                title: result.msg,
                                icon: 'none'
                            })
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }, function (error) {
                //登录态过期
                console.log(error);
            })
        }
        return deferred.promise
    }

    getUserInfo(callback) {
        let self = this
        let userInfo = wx.getStorageSync('userInfo');

        if (userInfo) {
            callback(userInfo)
        } else {
            _getUserInfo()
        }
        function _getUserInfo() {
            // 查看是否授权
            wx.getSetting({
                success: function (res) {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
                        api.getUserInfo()
                            .then(function (res) {
                                self.updateUserInfo(res)
                                callback(res.userInfo)
                            })
                    } else {
                        wx.navigateTo({ url: '/page/authorize/authorize' })
                    }
                }
            })
        }
    }

    updateUserInfo(data) {
        let self = this
        $request.post('/WechatMP/updateMiniUser.do', {
            encryptedData: data.encryptedData,
            iv: data.iv
        }).then(function (res) {
            let result = res.data;
            if (result.success) {
                wx.setStorageSync('userInfo', data.userInfo)
            } else {
                wx.showToast({
                    title: result.msg,
                    icon: 'none'
                })
            }
        })
    }
}
export default new User;