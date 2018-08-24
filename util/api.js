import { defer } from 'common';
class wxApi {
    constructor() {
        // 缓存 wx 接口方法名
        this.instanceSource = {
            method: Object.keys(wx)
        }
        // 缓存非异步方法
        this.noPromiseMethods = [
            'stopRecord',
            'pauseVoice',
            'stopVoice',
            'pauseBackgroundAudio',
            'stopBackgroundAudio',
            'showNavigationBarLoading',
            'hideNavigationBarLoading',
            'createAnimation',
            'createContext',
            'hideKeyboard',
            'stopPullDownRefresh',
        ]
        //遍历 wx 方法对象，判断是否为异步方法，是则构造 Promise
        for (let key in this.instanceSource) {
            this.instanceSource[key].forEach((method, index) => {
                this[method] = (args) => {
                    // 判断是否为非异步方法或以 wx.on 开头，或以 Sync 结尾的方法
                    if (this.noPromiseMethods.indexOf(method) !== -1 || method.substr(0, 2) === 'on' || /\w+Sync$/.test(method)) {
                        return wx[method](args)
                    }
                    return this.api(method, args)
                }
            })
        }
    }
    /**
     * 以 wx 下 API 作为底层方法
     * @param {String} method 方法名
     * @param {Object} config 参数
     */
    api(method = '', config = {}) {
        let Deferred = new defer();
        config.success = (res) => Deferred.resolve(res)
        config.fail = (res) => Deferred.reject(res)
        wx[method](config);
        return Deferred.promise;
    }
}
export default new wxApi
