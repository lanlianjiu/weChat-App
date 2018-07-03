
function wxRequset(api, params) {
    
    var promise = new Promise(function (resolve, reject) {
        api(Object.assign(params,{
            success: resolve,
            fail: reject
        }))
    });
    return promise;
}

function get(url, data, config) {
    var params = Object.assign(url, data, config, { method:"GET"});
    wxRequset(wx.request,params);
}

function post(url, data, config) {
    var params = Object.assign(url, data, config, { method: "POST" });
    wxRequset(wx.request, params);
}

function upload(url, data, config) {

    var params = Object.assign(url, data, config);
    wxRequset(wx.uploadFile, params);
}

module.exports = {
    get,
    post,
    upload
}
