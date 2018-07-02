function requestWx(url, data, method, success, fail, complete) {
    wx.request({
        url: url,
        data: data,
        method: method, // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            success(res);
        },
        fail: function (res) {
            fail(res);
        },
        complete: function (res) {
            complete(res);
        }
    })
}

function uploadImg(s, t, c, success) {
    wx.chooseImage({
        sourceType: s,
        sizeType: t,
        count: c,
        success: function (res) {
            success(res);
        }
    })
}

module.exports = {
    requestWx: requestWx,
    uploadImg: uploadImg
}