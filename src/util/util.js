const formatTime= (time) =>{
  if (typeof time !== 'number' || time < 0) {
    return time
  }

  var hour = parseInt(time / 3600)
  time = time % 3600
  var minute = parseInt(time / 60)
  time = time % 60
  var second = time

  return ([hour, minute, second]).map(function (n) {
    n = n.toString()
    return n[1] ? n : '0' + n
  }).join(':')
}

const formatLocation =(longitude, latitude) =>{
  if (typeof longitude === 'string' && typeof latitude === 'string') {
    longitude = parseFloat(longitude)
    latitude = parseFloat(latitude)
  }

  longitude = longitude.toFixed(2)
  latitude = latitude.toFixed(2)

  return {
    longitude: longitude.toString().split('.'),
    latitude: latitude.toString().split('.')
  }
}

/**
 * 合并路径
 * @param {string} baseURL 基础路径
 * @param {string} relativeURL 相对路径
 * @returns {string} 合并后的路径
 */
const combineURLs = (baseURL, relativeURL) => {
	return relativeURL ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '') : baseURL
}

/**
 * 判断是否绝对路径
 * @param {string} url 路径
 * @returns {boolean} 返回真值表示绝对路径，假值表示非绝对路径
 */
const isAbsoluteURL = url => {
	return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url)
}

const imgLoadSizeBuild  = url =>{
  if (!url) {
      return url
  }
  var imgParam = 'imageView2/2/w/' + wx.getSystemInfoSync().windowWidth
  return url.indexOf('?') > -1 ? url + '&' + imgParam : url + '?' + imgParam
}

export default {
  formatTime,
  formatLocation,
  combineURLs,
  isAbsoluteURL,
  imgLoadSizeBuild
}
