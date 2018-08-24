import interceptorManager from 'InterceptorManager';
import {defer} from 'common';
import api from 'api';

const REQUEST_METHOD = {
    get: 'GET',
    post: 'POST',
    upload: 'UPLOAD',
};
class Net {
    constructor() {
        this.defaults = {
            dataType: 'json',
            data: {
            },
            header: {
            }
        }
    }
    extend(obj1, obj2) {
        obj1 = obj1 || {};
        obj2 = obj2 || {};

        var result = {};
        Object.assign(result, obj1);

        for (var key in obj2) {
            if (result[key]) {
                if ('object' === typeof result[key]) {
                    obj2[key] = obj2[key] || {};
                    Object.assign(obj2[key], result[key])
                }
            }
            result[key] = obj2[key]
        }
        return result;
    }

    promiseThenAppend(requestHandlePromise, onCallback, args) {
        return requestHandlePromise.then(function (isIntercept) {
            if (isIntercept === true) {
                return true
            }
            if (!onCallback) {
                return false
            }
            return onCallback.apply(this, args)
        })
    }
    requestHandle(config) {
        Object.assign({}, this.extend(this.defaults, config))
        let requestHandleDeferred = new defer()
        let requestHandlePromise = requestHandleDeferred.promise

        let interceptors = interceptorManager.bulidInterceptor(config.interceptors)
        let len = interceptors.length;

        for (let i = len - 1; i >= 0; i--) {
            if (!interceptors[i].request) {
                continue
            }
            requestHandlePromise = this.promiseThenAppend(
                requestHandlePromise,
                interceptors[i].request,
                [config])
        }
        let deferred = new defer()
        requestHandlePromise.then(function (isIntercept) {
            if (isIntercept !== true) {
                deferred.resolve(config);
            } else {
                deferred.reject(config);
            }
        });
        requestHandleDeferred.resolve();
        return deferred.promise
    }
    requestHandleError() {
    }
    responseHandle(config, response, deferred) {
        let responseDeferred = new defer()
        let responsePromise = responseDeferred.promise
        var args = [config, response, deferred]

        let interceptors = interceptorManager.bulidInterceptor(config.interceptors)
        var len = interceptors.length;
        for (var i = len - 1; i >= 0; i--) {
            if (!interceptors[i].response) {
                continue
            }
            responsePromise = this.promiseThenAppend(
                responsePromise,
                interceptors[i].response,
                args)
        }
        responsePromise.then(function (isIntercept) {
            if (isIntercept !== true) {
                if (isIntercept) {
                    deferred.resolve(isIntercept);
                    return
                }
                deferred.resolve(response);
            }
        });
        responseDeferred.resolve();
    }
    responseHandleError(config, response, deferred) {
        var responseDeferred = new defer()
        var responsePromise = responseDeferred.promise
        var args = [config, response, deferred]

        let interceptors = interceptorManager.bulidInterceptor(config.interceptors)
        for (var i in interceptors) {
            if (!interceptors[i].responseError) {
                continue
            }
            responsePromise = this.promiseThenAppend(
                responsePromise,
                interceptors[i].responseError,
                args)
        }
        responsePromise.then(function (isIntercept) {
            if (isIntercept !== true) {
                deferred.reject(response);
            }
        });
        responseDeferred.resolve();
    }

    __http(config) {
        let deferred = new defer()
        let api = config.api || 'request';

        config.success = function (res) {
            deferred.resolve(res)
        }
        config.fail = function (res) {
            console.log('fail--', res);
            deferred.reject(res)
        }
        wx[api](config)
        return deferred.promise
    }

    request(config) {
        let $this = this;
        let deferred = config.deferred
        this.__http(config).then(function successCallback(response) {

            $this.responseHandle(config, response, deferred)
        }, function errorCallback(response) {
            $this.responseHandleError(config, response, deferred)
        })
    }

    get(url, data, config) {
        let $this = this;
        config = config || {}
        config.method = REQUEST_METHOD.get
        config.url = url
        config.data = data
        config.header = config.header || {}
        config.deferred = new defer();

        this.requestHandle(config).then(function requestSuccess(config) {
            $this.request(config)
        }, function requestError(config) {
            $this.requestHandleError(config)
        })
        return config.deferred.promise
    }

    post(url, data, config) {
        var $this = this
        config = config || {}
        config.method = REQUEST_METHOD.post
        config.url = url
        config.data = data
        config.header = config.header || {}

        if (!config.header['Content-Type']) {
            config.header['Content-Type'] = 'application/x-www-form-urlencoded';
        }
        config.deferred = new defer()

        this.requestHandle(config).then(function requestSuccess(config) {
            $this.request(config)
        }, function requestError(config) {
            $this.requestHandleError(config)
        })
        return config.deferred.promise;
    }

    upload(url, data, config) {
        var $this = this
        config = config || {}

        config.method = REQUEST_METHOD.upload
        config.api = 'uploadFile'
        config.url = url
        config.data = data || {}

        config.formData = config.formData || {}
        config.filePath = config.formData.file //上传文件资源的路径
        config.name = config.formData.name //文件对应的 key

        config.header = config.header || {}
        config.header['Content-Type'] = 'multipart/form-data';

        config.deferred = new defer()
        this.requestHandle(config).then(function requestSuccess(config) {
            $this.request(config)
        }, function requestError(config) {
            $this.requestHandleError(config)
        })
        return config.deferred.promise;
    }

    showMask() {
        wx.showLoading({
            title: '加载中...',
            mask: true
        })
    }
    hideMask() {
        wx.hideLoading()
    }

    $$request(deferred) {
        let $this = this;
        $this.showMask()
        return deferred.then(function successCallback(response) {
            return response
        }, function errorCallback(response) {
            return response
        }).finally(function () {
            $this.hideMask()
        });
    }

    $$get(url, data, config) {
        return this.$$request(this.get.apply(this, arguments));
    }

    $$post(url, data, config) {
        return this.$$request(this.post.apply(this, arguments));
    }

    $$upload(url, data, config) {
        return this.$$request(this.upload.apply(this, arguments));
    }
}

export default new Net;
