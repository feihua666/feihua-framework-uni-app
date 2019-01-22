const host = 'http://10.1.65.100:5555/api'
const config = {
    host: host,
    cookieKey:'cookieKey',
    file: {
        // 文件上传地址
        uploadUrl: host + '/upload/file',
        // 文件下载地址
        downloadUrl: host + '/file',
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
    // 字典默认全局一次完成加载，请至少设置两个字典值，否则dictUtils没有判断特殊情况，这是因为字典请求接口，请求多个和请求一个响应返回数据结构不同导致
    dict:[
		'gender', //性别
		'gender' //性别
	]
}
export default config