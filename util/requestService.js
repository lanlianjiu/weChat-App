// 本服务用于封装请求
// 返回的是一个promisepromise

var sendRrquest = function (url, method, data,header,dataType) {
    var promise = new Promise(function (resolve, reject) {
        
        wx.request({
            url: url,
            data: data,
            dataType: dataType,
            method: method,
            header: header,
            success: resolve,
            fail: reject
        })
    });
    Promise.prototype.finally = function (callback) {
        let P = this.constructor;
        return this.then(
            value => P.resolve(callback()).then(() => value),
            reason => P.resolve(callback()).then(() => { throw reason })
        );
    };
    return promise;
};

module.exports.sendRrquest = sendRrquest 