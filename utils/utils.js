const isArray = function (obj) {
    if (Array.isArray) {
        return Array.isArray(obj)
    } else {
        return Object.prototype.toString.call(obj) === '[object Array]'
    }
}
const copy = function (message) {
    // #ifndef H5
    uni.setClipboardData({
        data:message,
        success(res) {
            uni.showToast({
                icon: 'none',
                title: '复制成功'
            });
        }
    })
    // #endif
    // #ifdef H5
    // 多年以\n分隔
    let input = document.createElement("textarea");
    input.readOnly = "readOnly"
    input.value = message;
    document.body.appendChild(input);
    input.select();
    input.setSelectionRange(0, input.value.length);
    document.execCommand('Copy');
    document.body.removeChild(input);
    uni.showToast({
        icon: 'none',
        title: '复制成功'
    });

    // #endif
}
// 导航
const navigate = {
    // navigateTo
    ngt(url){
        uni.navigateTo({
            url: url
        });
    },
    // navigateRelunch
    ngr(url){
        uni.reLaunch({
            url:url
        })
    }
}
// 图片
const pic = {
    // urls为图片url，如果为 字符串类型，只接收一个参数，如果为数组，可指定第二个参数
    pvi(urls,url){
        let param = {
        }
        if(typeof urls == 'string'){
            param.urls = [urls]
        }else{
            param.urls = urls
            if(url){
                param.current = url
            }
        }

        uni.previewImage(param)
    }
}
const message = {
    success (msg) {
        uni.showToast({
            title: msg,
            icon: 'none'
        })
    },
    error (msg) {
        uni.showToast({
            title: msg,
            icon: 'none'
        })
    }
}
// 深度获取对象属性，attr支持点，如：a.b.c
const dGetValue = function (obj, attr) {
    let value = obj
    let key = attr.split('.')
    for (let i = 0; i < key.length; i++) {
        value = value[key[i]]
    }
    return value
}
const isWeixn = function(){
    if (navigator && navigator.userAgent) {
        let ua = navigator.userAgent.toLowerCase()
        if(ua.match(/MicroMessenger/i)=="micromessenger") {
            return true
        } else {
            return false
        }
    } else {
        return false
    }

}
const objToParam = function(param) {
    if(typeof param == 'object'){
        let r = ''
        for(let key in param) {
            r += '&' + key + '=' + param[key]
        }
        if (r) {
            return r.substring(1)
        }
    }
    return param
}
// 拼接url参数
const concatUrlParam = function(url,param){
    let strParam = objToParam(param)
    if(url && strParam) {
        let r = ''
        let urlArray = url.split('#')
        let _url = urlArray[0]
        if(_url.indexOf('?') != -1){
            r += _url + '&' + strParam
        }else {
            r += _url + '?' + strParam
        }
        if(urlArray.length >1){
            r += '#' + urlArray[1]
        }

        return r
    }
    return url
}
const getUrlParam = function (url, name) {
    //构造一个含有目标参数的正则表达式对象
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r;
    if (url) {
        r = url.substr(url.indexOf("?"));
    } else {
        r = window.location.search;
    }
    //匹配目标参数
    r = r.substr(1).match(reg);
    //返回参数值
    if (r != null){
        return decodeURI(r[2]).split('#')[0]
    }
    return null;
}
export default {
    isArray: isArray,
    copy: copy,
    n: navigate,
    pic: pic,
    message: message,
    dGetValue: dGetValue,
    isWeixn: isWeixn,
    concatUrlParam: concatUrlParam,
    getUrlParam: getUrlParam

}
