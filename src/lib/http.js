import interceptorManager from 'interceptorManager';
import $user from 'user';
import $request from 'request';
const $config = require('../config');

(function () {
    // 基于响应状态返回成功或失败
    var validateStatus = function (statusCode) {
        return status => status >= 200 && status < 300;
    }();

    //注入请求拦截器
    interceptorManager.use({
        request(config) {
            if (config.url && !config.url.startsWith('http')) {
                if (!config.url.startsWith($config._server)) {
                    config.url = $config._server + config.url
                }
            }
            config.data = config.data || {}
            //请求前设置token
            if (wx.getStorageSync('tokenId')) {
                config.data.tokenId = wx.getStorageSync('tokenId')
            }
            if (wx.getStorageSync("sessionid")) {
                config.header['cookie'] = wx.getStorageSync("sessionid")//读取cookie
            }
            if ($config.testUserId) {
                config.data.testUserId = $config.testUserId
            }
            if ($config.testSystemId) {
                config.data.testSystemId = $config.testSystemId
            }
        }
    })

    //注入请求失败拦截器
    interceptorManager.use({
        requestError: function (config) {
        }
    })
    //注入响应拦截器
    interceptorManager.use({
        response: function (config, response, deferred) {
            if (typeof response.data === 'string') {
                try {
                    response.data = JSON.parse(response.data)
                } catch (e) { /* Ignore */ }
            }
            if (!validateStatus(response.statusCode)) {
                switch (response.statusCode) {
                    case 401:
                        //请求失败401 重新登陆后，重新请求接口
                        return $user.login().then(function () {
                            return retry(config)
                        })
                        break
                    case 404:
                        wx.showToast({
                            title: '请求失败,请检查请求地址是否正确!',
                            icon: 'none'
                        })
                        break
                }
            }
        }
    })

    //注入响应失败拦截器
    interceptorManager.use({
        responseError: function (config, response) {
            wx.showToast({
                title: '网络连接失败,请稍后在试!',
                icon: 'none'
            })
        }
    })


    //请求重新
    var retry = function (config) {
        let DEFAULT_OPTIONS = {
            maxRetry: 1, //最大重试次数
            retryDelay: 1000,//重试间隔时间
        };
        config.__retryCount = config.__retryCount || 0;
        if (config.__retryCount >= DEFAULT_OPTIONS.maxRetry) {
            return
        }
        config.__retryCount += 1;

        var backoff = new Promise(function (resolve) {
            setTimeout(function () {
                resolve();
            }, DEFAULT_OPTIONS.retryDelay || 1);
        });
        return backoff.then(function () {
            let { url, method, data } = config;
            let fn = method.toLowerCase();
            return $request[fn](url, data, config).then(function (res) {
                return res;
            });
        });
    }
})();