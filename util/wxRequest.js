import InterceptorManager from 'InterceptorManager'
import Utils from '../util/util'
const config = require('../config') //配置

/**
 * Promise 封装 wx.request 请求方法
 * 
 * @param {Object} defaults 配置项
 * @param {String} defaults._server 基础请求路径
 * @param {Object} defaults.header 请求头
 * @param {Array} defaults.transformRequest 转换请求数据
 * @param {Array} defaults.transformResponse 转换响应数据
 * @param {Function} defaults.validateStatus 基于响应状态返回成功或失败
 * 
 */
class Request {
    constructor() {
        Object.assign(this, {
            config,
        })
        this.__init()
    }
    /**
     * 初始化
     */
    __init() {
        this.__initInterceptor()
        this.__initDefaults()
        this.__initMethods()
    }
    /**
     * 初始化默认拦截器
     */
    __initInterceptor() {
        this.interceptors = new InterceptorManager
        this.interceptors.use({
            request(request) {
                request.requestTimestamp = new Date().getTime()
                //请求前设置token
                const globalData = getApp().globalData
                if (globalData.auth && globalData.auth.token) {
                    request.header.token = globalData.auth.token
                }
                if (config.testUserId) {
                    request.data.testUserId = config.testUserId
                }
                wx.showLoading({
                    title: '加载中...',
                    mask: true
                })
                return request
            },
            requestError(requestError) {
                wx.hideLoading();
                wx.showToast({
                    title: '网络连接失败',
                    icon: 'none'
                })
                return Promise.reject(requestError)
            },
            response(response) {
                setTimeout(function () {
                    wx.hideLoading()
                }, 100)
                response.responseTimestamp = new Date().getTime()
                return response
            },
            responseError(responseError) {
                wx.hideLoading();
                let errorMesg = ''
                switch (responseError.statusCode) {
                    case 401:
                        errorMesg = '未登陆'
                        break
                    case 404:
                        errorMesg = '请求失败,请检查请求地址是否正确'
                        break
                }
                if (errorMesg.length > 0) {
                    wx.showToast({
                        title: errorMesg,
                        icon: 'none'
                    })
                }
                return Promise.reject(responseError)
            },
        })
    }

    /**
     * 初始化默认参数
     */
    __initDefaults() {
        const defaults = {
            // 基础请求路径
            _server: '',
            // 请求头
            header: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // 转换请求数据
            transformRequest: [
                (data, header) => {
                    return data
                },
            ],
            // 转换响应数据
            transformResponse: [
                (data, header) => {
                    if (typeof data === 'string') {
                        try {
                            data = JSON.parse(data)
                        } catch (e) { /* Ignore */ }
                    }
                    return data
                },
            ],
            // 基于响应状态返回成功或失败
            validateStatus: status => status >= 200 && status < 300,
        }
        // 合并参数
        this.defaults = Object.assign({}, defaults, this.config)
    }

    /**
     * 遍历对象构造方法，方法名以小写字母+后缀名
     */
    __initMethods() {
        // 发起请求所支持的方法
        const instanceSource = {
            method: [
                'GET',
                'POST',
                'UPLOAD',
            ],
        }

        // 遍历对象构造方法
        for (let key in instanceSource) {
            instanceSource[key].forEach((method, index) => {
                this[method.toLowerCase()] = (url, data, config) => {
                    return this.__defaultRequest(url, data, Object.assign({}, config, {
                        method
                    }))
                }
            })
        }

        // Promise.all - 合并处理请求
        this.all = promises => Promise.all(promises)
    }

    /**
     * 以 request 底层方法
     * @param {String} url    接口地址
     * @param {Object} data 请求参数
     * @param {Object|String} config 配置项|接口地址
     * @param {String} config.method 请求方法
     * @param {Object} config.header 设置请求的 header
     * @param {String} config.dataType 请求的数据类型
     */
    __defaultRequest(url, data = {}, config = {}) {

        // 判断参数类型，如果第一个参数为字符串则赋值于 url，第二个参数为 config 配置
        if (typeof config === 'string') {
            config = Object.assign({}, {
                url: arguments[0]
            }, arguments[2])
        }
        // 合并参数
        const defaults = Object.assign({
            method: 'GET',
            dataType: 'json',
        }, this.defaults, config)

        const {
            _server,
            header,
            validateStatus
        } = defaults

        // 配置请求参数
        const $$config = {
            url: url,
            data: data,
            header: defaults.header,
            method: defaults.method,
            dataType: defaults.dataType,
        }

        // 配置请求路径 prefix
        if (this.$$prefix && !Utils.isAbsoluteURL($$config.url)) {
            $$config.url = Utils.combineURLs(this.$$prefix, $$config.url)
        }

        // 配置请求路径 _server
        if (_server && !Utils.isAbsoluteURL($$config.url)) {
            $$config.url = Utils.combineURLs(_server, $$config.url)
        }

        if (($$config.method.toLowerCase() == 'upload')) {
            $$config.formData = $$config.data
            $$config.filePath = $$config.formData.file
            $$config.name = $$config.formData.name
            $$config.api = 'uploadFile'
            $$config.header['Content-Type'] = 'multipart/form-data'
        }
        // 注入拦截器
        const chainInterceptors = (promise, interceptors) => {
            for (let i = 0, ii = interceptors.length; i < ii;) {
                let thenFn = interceptors[i++]
                let rejectFn = interceptors[i++]
                promise = promise.then(thenFn, rejectFn)
            }
            return promise
        }

        // 转换数据
        const transformData = (data, header, status, fns) => {
            fns.forEach(fn => {
                data = fn(data, header, status)
            })
            return data
        }

        // 转换响应数据
        const transformResponse = res => {
            const __res = Object.assign({}, res, {
                data: transformData(res.data, res.header, res.statusCode, defaults.transformResponse),
            })
            return validateStatus(res.statusCode) ? __res : Promise.reject(__res)
        }

        // 发起HTTPS请求
        const serverRequest = config => {
            const __config = Object.assign({}, config, {
                data: transformData($$config.data, $$config.header, undefined, defaults.transformRequest),
            })
            return this.__http(__config).then(transformResponse, transformResponse)
        }

        let requestInterceptors = [] //请求前
        let responseInterceptors = [] //响应
        let promise = Promise.resolve($$config)

        // 缓存拦截器
        this.interceptors.forEach(n => {
            if (n.request || n.requestError) {
                requestInterceptors.push(n.request, n.requestError)
            }
            if (n.response || n.responseError) {
                responseInterceptors.unshift(n.response, n.responseError)
            }
        })

        // 注入请求前拦截器
        promise = chainInterceptors(promise, requestInterceptors)


        // 发起HTTPS请求
        promise = promise.then(serverRequest)

        // 注入响应拦截器
        promise = chainInterceptors(promise, responseInterceptors)

        return promise
    }

    /**
     * __http 
     */
    __http(obj) {
        var ApiFn = obj.api || 'request';
        return new Promise((resolve, reject) => {
            obj.success = (res) => resolve(res)
            obj.fail = (res) => reject(res)
            wx[ApiFn](obj)
        })
    }
}

export default new Request