//const host = 'http://master.com/api'
const host = ''
const hostApi = host + '/api'
const config = {
    host: host,
    hostApi: hostApi,
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
            return ''
        }
    },
    // 是否需要强制登录
    forcedLogin: true,
    // 标识是小程序下是公众帐号，如果不是，可以配置为空
    which:'yangwei',
    // 这里后端会加客户端配置
    loginClient: 'uni-app'
}
export default config
