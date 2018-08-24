import $request from 'request';
const $config = require('../config');
class Qiniu {
  upload(file, name = '') {
    if (!$config.qiniu || !$config.qiniu.enabled) {
      return;
    }
    var getToken = function (uploadTokenUrl, file) {
      return $request.get(uploadTokenUrl, {})
        .then(function successCallback(response) {
          var response = response.data;
          if (response.success) {
            return uploadFile(file, response.result.token, response.result.key, name)
          } else {
            console.error('Token request error ', response);
          }
        })
    }
    var uploadFile = function (file, token, key, name) {
      return $request.$$upload($config.qiniu.uploadApi, {}, {
        formData: {
          key: key,
          token: token,
          file: file,
          name: name || 'file'
        }
      })
    }
    var uploadTokenUrl = $config.uploadTokenUrl || $config.qiniu.uploadTokenUrl
    if (!uploadTokenUrl) {
      console.error('uploadTokenUrl is null');
      return;
    }

    return new Promise(function (resolve) {
      getToken(uploadTokenUrl, file).then(function (resp) {
        if (!resp.data.hash) {
          return true
        }
        var outParam = $config.qiniu.imgApi + resp.data.key
        resolve(outParam);
      })
    })
  }
}
export default new Qiniu