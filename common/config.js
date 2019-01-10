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
    dict:[
		'gender', //性别
		'gender' //性别
	]
}
export default config