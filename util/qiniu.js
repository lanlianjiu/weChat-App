import request from 'request';
(function () {
    function upload(params) {
        if (!request.config.qiniu || !request.config.qiniu.enabled) {
            return;
        }
        var uploadTokenUrl = request.config.uploadTokenUrl || request.config.qiniu.uploadTokenUrl
        if (!uploadTokenUrl) {
            console.error('uploadTokenUrl is null');
            return;
        }
        return request.get(uploadTokenUrl, {}).then(function (response) {
            if (response.data.success) {
                var token = response.data.result.token
                var key = response.data.result.key
                return request.upload(request.config.qiniu.uploadApi, {
                    file: params.file,
                    name: 'file',
                    key: key,
                    token: token,
                }).then(function () {
                    params.fileParam = request.config.qiniu.imgURL + key
                    return params
                })
            }
        })
    }
    module.exports = {
        upload: upload,
    }
})();