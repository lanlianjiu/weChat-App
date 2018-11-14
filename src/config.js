/**
 * 小程序配置文件
 */
var _server = 'https://mini.shpWx.com'
var qiniu = {
    enabled: true,
    uploadTokenUrl: 'WX-getUploadToken.do',
    uploadApi: 'http://upload.qiniu.com',
    imgURL: 'http://img.clouddn.com/'
}
var config = {
    _server,
    qiniu: qiniu
};
module.exports = config;