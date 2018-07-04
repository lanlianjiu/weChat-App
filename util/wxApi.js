//给Promise扩展函数
Promise.prototype.finally = function (callback) {
    let P = this.constructor;
    return this.then(function (value) {
            P.resolve(callback()).then(function () {
                return value;
            });
        },
        function (reson) {
            P.resolve(callback()).then(function () {
                throw reason;
            });
        });
}

var wxPromise = function (api, params) {

    let promise = new Promise(function (resolve, reject) {
        api(Object.assign({}, params, {
            success: resolve,
            fail: reject
        }))
    });
    return promise;
}


var wxRequest = function (params) {

    let promise = new Promise(function (resolve, reject) {
        wxPromise(wx.request, params)
            .then(function (res) {
                resolve(res)
            })
            .catch(function (error) {
                reject(error)
            })
            .finally(function (complete) {
                console.log(complete);
            })
    });

    return promise;
}


function get(url, data, config) {

    var params = config || {};
    params.method = 'GET';
    params.url = url;
    params.data = data;
    return wxRequest(params)
}


function post(url, data, config) {
    var params = config || {};
    params.method = 'GET';
    params.url = url;
    params.data = data;
    wxRequest(params);
}

function upload(url, data, config) {

    var params = config || {};
    params.url = url;
    params.data = data;
    wxPromise(wx.uploadFile, params);
}

module.exports = {
    get,
    post,
    upload
}