//const host = 'http://master.com/api'
const host = 'http://yangwei.ngrok.ahbdz.com'
const hostApi = host + '/api'
const config = {
    host: host,
    hostApi: hostApi,
    cookieKey:'cookieKey',
    file: {
        // 文件上传地址
        uploadUrl: hostApi + '/upload/file',
        // 文件下载地址
        downloadUrl: hostApi + '/file',
        getDownloadUrl: function (path) {
            if (path) {
                if (path.indexOf('http') === 0) {
                    return path
                } else {
                    return this.downloadUrl + path
                }
            }
            return this.downloadUrl
        }
    },
    // 是否需要强制登录
    forcedLogin: true,
    which:'yangwei',
    // 字典默认全局一次完成加载，请至少设置两个字典值，否则dictUtils没有判断特殊情况，这是因为字典请求接口，请求多个和请求一个响应返回数据结构不同导致
    dict:[
		'gender', //性别
		'gender' //性别
	]
}
export default config
