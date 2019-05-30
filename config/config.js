//const host = 'http://master.com/api'
const host = 'http://yangwei.ngrok.ahbdz.com'
const hostApi = host + '/api'
const config = {
    host: host,
    hostApi: hostApi,
    hostContext: host + '/uni-app',
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
    client: 'h5',
    // 忽略的字典值
    dictExcludeValue:{
        gender:['unknown']
    },
    // 不需要登录的页面，可以只写一个前缀
    noLoginPages: ['/pages/login/login']
}
export default config
