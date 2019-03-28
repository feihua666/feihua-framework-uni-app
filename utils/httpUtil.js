import config from '@/config/config.js'
import utils from '@/utils/utils.js'
import { getMsg } from '@/utils/httpReponseCode.js'
/**
 * 定义一下不提示消息的对象
 * @type 404: ['E404_000001']
 */
let noneMessageStatus = {
    404: [],
    401: [],
}

function handlerError (status, code) {
    let statusObj = noneMessageStatus[status]
    if (statusObj) {
        if (statusObj.length === 0) {
            return
        } else {
            for (let obj in statusObj) {
                if (obj === code) {
                    return
                }
            }
        }
    }
    let msg = getMsg(status, code)
    if (msg) {
        utils.message.error(msg)
    }
}
const request = function (url, options) {
    let _url = url
    if(_url.indexOf('http') !== 0){
        _url = config.hostApi + url
    }
    let _data = null
    //如果是个对象，把对象为空的不提交，因为encodeURIComponent 会把null转为null字符串
    if (options.data && (typeof options.data != 'string' && !utils.isArray(options.data)) && 'application/x-www-form-urlencoded' == options.header['Content-Type']){
        _data = {}
        for(let key in options.data){
            if (options.data[key] != null){
                _data[key] = options.data[key]
            }
        }
    }else{
        _data = options.data
    }
    return new Promise((resolve, reject) => {
        uni.request({
            url: _url,
            data: _data,
            header: options.header,
            method: options.method,
            success: function (res) {
                let status = res.statusCode
                let code = res.data.code
                if (status >= 200 && status < 300) {
                    resolve(res)

                } else {
                    handlerError(status, code)
                    reject(res)
                }
            },
            fail:function (res) {
                reject(res)
            },
            complete:function (res) {
                // 暂不支持处理
            }
        })
    })

}
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function get (url, params = {}) {
    return new Promise((resolve, reject) => {
        request(url,{
            data: params,
            header: {"accept": "application/json"},
            method: 'GET'
        }).then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post (url, data = {}) {
    return new Promise((resolve, reject) => {
        request(url,{
            data: data,
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json"
            },
            method: 'POST'
        }).then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 封装postJson请求
 * @param url
 * @param data
 * @returns {Promise}
 */
export function postJson (url, data = {}) {
    return new Promise((resolve, reject) => {
        request(url,{
            data: data,
            header: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            method: 'POST'
        }).then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put (url, data = {}) {
    return new Promise((resolve, reject) => {
        request(url,{
            data: data,
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json"
            },
            method: 'PUT'
        }).then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function putJson (url, data = {}) {
    return new Promise((resolve, reject) => {
        request(url,{
            data: data,
            header: {
                "Content-Type": "application/json",
                "accept": "application/json"
            },
            method: 'PUT'
        }).then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 封装del方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function del (url, params = {}) {
    return new Promise((resolve, reject) => {
        request(url,{
            data: params,
            header: {
                "Content-Type": "application/x-www-form-urlencoded",
                "accept": "application/json"
            },
            method: 'DELETE'
        }).then(response => {
            resolve(response)
        }).catch(err => {
            reject(err)
        })
    })
}

const uploadFile = function(filePath, params = {}){

    return new Promise((resolve, reject) => {
        uni.uploadFile({
            url: config.file.uploadUrl,
            filePath: filePath,
            name: 'file',
            header: {
                "accept": "application/json"
            },
            formData: params,
            success: function (res) {
                let status = res.statusCode
                if (status >= 200 && status < 300) {
                    resolve(res)

                } else {
                    reject(res)
                }
            },
            fail:function (res) {
                reject(res)
            },
            complete:function (res) {

            }
        })
    })
}

/**
 * 根据类型获取字典数据，返回结果应该是一个数组，如果type是以逗号分隔的字符串字典类型，则返回的结果是一个对象key为类型字符串本身
 * @param type
 * @returns {Promise<any>}
 */
let cacheDict = {}
export function getDictsByType (type) {
    let promise = new Promise((resolve, reject) => {
        if (cacheDict[type]) {
            resolve(cacheDict[type])
        } else {
            get('/base/dicts/' + type, {orderby: 'sequence', t: new Date().getTime() + Math.random()}).then(response => {
                let content = response.data.data.content
                let _content = []
                let values = config.dictExcludeValue[type]
                if (values){
                    for(let i = 0;i < content.length;i++){
                        let exist = false
                        for(let j = 0;j < values.length;j++){
                            if (values[j] == content[i].value) {
                                exist = true
                                break
                            }
                        }
                        if (!exist) {
                            _content.push(content[i])
                        }
                    }
                }else {
                    _content = content
                }
                cacheDict[type] = _content
                resolve(_content)
            }).catch(err => {
                reject(err)
            })
        }
    })
    return promise
}


/**
 * 根据字典值和类型获取字典对象
 * @param type
 * @param value
 * @returns {Promise<any>}
 */
export function getDictByValue (type, value) {
    return new Promise((resolve, reject) => {
        getDictsByType(type).then(content => {
            let dicts = content
            if (dicts) {
                for (let i = 0; i < dicts.length; i++) {
                    if (value === dicts[i].value) {
                        resolve(dicts[i])
                        break
                    }
                }
            }
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * 获取后台配置的正则表达式
 * @returns {Promise<any>}
 */
let cacheRegexps = null
export function getRegExps () {
    let promise = new Promise((resolve, reject) => {
        if (cacheRegexps) {
            resolve(cacheRegexps)
        } else {
            get('/regexps', {t: new Date().getTime() + Math.random()}).then(response => {
                cacheRegexps = response.data.data.content
                resolve(cacheRegexps)
            }).catch(err => {
                reject(err)
            })
        }
    })
    return promise
}

/**
 * 获取单个正则，
 * @param type 如：mobile为验证手机号的正则
 * @returns {Promise<any>}
 */
export function getRegExpByType (type) {
    return new Promise((resolve, reject) => {
        getRegExps().then(regexps => {
            let regExps = cacheRegexps
            resolve(regExps[type])
        }).catch(err => {
            reject(err)
        })
    })
}

/**
 * 获取当前登录用户信息
 * @returns {Promise<any>}
 */
export function getCurrentUserinfo () {
    return new Promise((resolve, reject) => {
        get('/base/user/current',{t: new Date().getTime() + Math.random()}).then(response => {
            resolve(response.data.data.content)
        }).catch(err => {
            reject(err)
        })
    })
}
/**
 * 是否已登录
 * @returns {Promise<any>}
 */
export function hasLogin () {
    return new Promise((resolve, reject) => {
        getCurrentUserinfo().then(response => {
            resolve()
        }).catch(err => {
            let statusCode = err.statusCode
            if (statusCode === 401) {
                reject(err)
            }else {
                resolve()
            }
        })
    })
}
const http = {
    get: get,
    post: post,
    postJson: postJson,
    delete: del,
    put: put,
    putJson: putJson,
    getDictsByType: getDictsByType,
    getDictByValue: getDictByValue,
    getRegExps: getRegExps,
    getRegExpByType: getRegExpByType,
    getCurrentUserinfo: getCurrentUserinfo,
    uploadFile: uploadFile,
    hasLogin: hasLogin
}
export default http
