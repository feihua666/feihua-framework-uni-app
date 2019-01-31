import store from '@/store/index.js'
import config from '@/common/config.js'
const isArray = function(obj) {
    if (Array.isArray) {
        return Array.isArray(obj);
    } else {
        return Object.prototype.toString.call(obj) === "[object Array]";
    }
}  
const request = function (url, data, success, fail,complete, header, method,checkLogin) {
    let _url = url
    if(_url.indexOf('http') !== 0){
        _url = config.host + url
    }


    let _data = null
    //如果是个对象，把对象为空的不提交，因为encodeURIComponent 会把null转为null字符串
    if (data && (typeof data != 'string' && !isArray(data)) && 'application/x-www-form-urlencoded' == header['Content-Type']){
        _data = {}
        for(let key in data){
            if (data[key] != null){
                _data[key] = data[key]
            }
        }
    }else{
        _data = data
    }
    uni.request({
        url: _url, 
        data: _data,
        header: header,
        method: method,
        success: function (res) {
            let status = res.statusCode
            let code = res.data.code
            if (status >= 200 && status < 300) {
                if (success && typeof success == 'function') {
                    success(res)
                }

            } else {
                //如果未登录
                if(checkLogin && status == 401){
                    uni.removeStorage({key:'store_userinfo'});
                    let  forceLogin = store.state.forcedLogin
                    if(forceLogin){
                        uni.reLaunch({
                            url: '/pages/login/login',
                        });
                    }else {
                        uni.showModal({
                            title: '未登录',
                            content: '您未登录，需要登录后才能继续',
                            /**
                             * 如果需要强制登录，不显示取消按钮
                             */
                            showCancel: true,
                            success: (res) => {
                                if (res.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login/login'
                                    });
                                }
                            }
                        });
                    }
                    return;
                }
                if(status == 403){

                    if(code == 'E403_100002'){
                        //操作太频繁
                        uni.showToast({
                            icon: 'none',
                            title: '您的手速不要太快!'
                        });
                    } else if(code == 'E403_100001'){
                        //权限不足，没有接口请求权限
                        uni.showToast({
                            icon: 'none',
                            title: '权限不足'
                        });
                    }
                }
                if (fail && typeof fail == 'function') {
                    fail(res)

                }

            }
        },
        fail:function (res) {
            if (fail && typeof fail == 'function') {
                fail(res)

            }
        },
        complete:function (res) {
            if (complete && typeof complete == 'function') {
                complete(res)
            }
        }
    })
}
// 封装网络请求
const _get = function(url,options){

    let header = {
        "accept": "application/json"
    }
    if (!options){
        options = {}
    }else{
        if (options.data){
            for(let key in options.data){
                if (isArray(options.data[key])){
                    let arrayStr = ''
                    for (let i = 0; i < options.data[key].length;i++){
                        arrayStr += options.data[key][i]
                        if (i < options.data[key].length-1){
                            arrayStr += ','
                        }
                    }
                    options.data[key] = arrayStr
                }
            }
        }
    }
    if (options.header) {
        for (let key in options.header) {
            header[key] = options.header[key]
        }
    }
    let checkLogin = options.checkLogin
    if(checkLogin !== false){
        checkLogin = true
    }
    request(url, options.data, options.success, options.fail,options.complete, header,'GET',checkLogin)
}
const _post = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    if (!options) {
        options = {}
    }
    if (options.header){
        for (let key in options.header){
            header[key] = options.header[key]
        }
    }
    let checkLogin = options.checkLogin
    if(checkLogin !== false){
        checkLogin = true
    }
    request(url, options.data, options.success, options.fail,options.complete, header, 'POST',checkLogin)
}
const _put = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    if (!options) {
        options = {}
    }
    if (options.header) {
        for (let key in options.header) {
            header[key] = options.header[key]
        }
    }
    let checkLogin = options.checkLogin
    if(checkLogin !== false){
        checkLogin = true
    }
    request(url, options.data, options.success, options.fail,options.complete, header, 'PUT',checkLogin)
}
const _delete = function (url, options) {
    let header = {
        "Content-Type": "application/x-www-form-urlencoded",
        "accept": "application/json"
    }
    if (!options) {
        options = {}
    }
    if (options.header) {
        for (let key in options.header) {
            header[key] = options.header[key]
        }
    }
    let checkLogin = options.checkLogin
    if(checkLogin !== false){
        checkLogin = true
    }
    request(url, options.data, options.success, options.fail,options.complete, header, 'DELETE',checkLogin)
}
const _uploadFile = function(url,options){
    let _url = url
    if (!_url) {
        _url = config.file.uploadUrl
    }
    let checkLogin = options.checkLogin
    if(checkLogin !== false){
        checkLogin = true
    }
    let header = {
        "accept": "application/json"
    }
    uni.uploadFile({
        url: _url, 
        filePath: options.filePath,
        name: 'file',
        header: header,
        formData: options.data,
        success: function (res) {
            let status = res.statusCode
            if (status >= 200 && status < 300) {
                if (options.success && typeof options.success == 'function') {
                    options.success(res)
                }

            } else {
                //如果未登录
                if(checkLogin && status == 401){
                    uni.removeStorage({key:'store_userinfo'});
                    let  forceLogin = store.state.forcedLogin
                    if(forceLogin){
                        uni.reLaunch({
                            url: '/pages/login/login',
                        });
                    }else {
                        uni.showModal({
                            title: '未登录',
                            content: '您未登录，需要登录后才能继续',
                            /**
                             * 如果需要强制登录，不显示取消按钮
                             */
                            showCancel: true,
                            success: (res) => {
                                if (res.confirm) {
                                    uni.navigateTo({
                                        url: '/pages/login/login'
                                    });
                                }
                            }
                        });
                    }
                    return;
                }
                if (options.fail && typeof options.fail == 'function') {
                    options.fail(res)
                }
            }
        },
        fail:function (res) {
            if (options.fail && typeof options.fail == 'function') {
                options.fail(res)
            }
        },
        complete:function (res) {
            if (options.complete && typeof options.complete == 'function') {
                options.complete(res)
            }
        }
    })
}

const loadUserinfo = function (force) {
    if(!force){
        let storageUserinfo = uni.getStorageSync('store_userinfo')
        if(storageUserinfo){
            store.commit('setUserinfo',storageUserinfo)
            return
        }
    }


    // 获取当前登录用户信息
    _get('/base/user/current',{
        checkLogin:false,
        success: async function (res) {
            let content = res.data.data.content
            uni.setStorageSync('store_userinfo',content)
            store.commit('setUserinfo',content)
        },complete:function () {
        }
    })
}
//全局字典初始化
const loadDicts = function(force){
    if(!force) {
        let storageDicts = uni.getStorageSync('store_dicts')
        if (storageDicts) {
            store.commit('setDicts', storageDicts)
            return
        }
    }
    let dictType = config.dict.join(',')
    _get('/base/dicts/' + dictType,{
        data:{
            orderby: 'sequence'
        },
        success: function (res) {
            let content = res.data.data.content;
            uni.setStorageSync('store_dicts',content)
            store.commit('setDicts',content)
        }
    })
}
const loadReg = function(force){
    if(!force) {
        let storageReg = uni.getStorageSync('store_reg')
        if (storageReg) {
            store.commit('setRegs', storageReg)
            return
        }
    }
    _get('/base/developer/regexps',{
        success: function (res) {
            let content = res.data.data.content;
            uni.setStorageSync('store_reg',content)
            store.commit('setRegs',content)
        }
    })
}
const _initGobalData = function (force) {
    loadReg(force);
    loadDicts(force);
    loadUserinfo(force);
}
const http = {
    get: _get,
    post: _post,
    put: _put,
    delete: _delete,
    initGobalData: _initGobalData,
    uploadFile: _uploadFile
}
export default http