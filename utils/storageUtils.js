const set = function (key, data) {
    return new Promise((resolve, reject) => {
        uni.setStorage({
            key: key,
            data: data,
            success() {
                resolve()
            },fail() {
                reject()
            }
        })
    })
}
const setSync = function (key, data) {
    uni.setStorageSync(key, data)
}
const get = function (key) {
    return new Promise((resolve, reject) => {
        uni.getStorage({
            key: key,
            // res = {data: key对应的内容}
            success(res) {
                resolve(res)
            },fail() {
                reject()
            }
        })
    })
}
const getSync = function (key) {
    return uni.getStorageSync(key)
}
const remove = function (key) {
    return new Promise((resolve, reject) => {
        uni.getStorage({
            key: key,
            success() {
                resolve()
            },fail() {
                reject()
            }
        })
    })
}
const removeSync = function (key) {
    uni.removeStorageSync(key)
}
const clear = function () {
    uni.clearStorage()
}
const clearSync = function () {
    uni.clearStorageSync()
}
const getInfo = function () {
    return new Promise((resolve, reject) => {
        uni.getStorageInfo({
            success: function (res) {
                resolve(res)
            },
            fail: function () {
                reject()
            }
        })
    })
}
const getInfoSync = function () {
    return uni.getStorageInfoSync()
}
export default {
    set: set,
    get: get,
    remove: remove,
    clear: clear,
    setSync: setSync,
    getSync: getSync,
    removeSync: removeSync,
    clearSync: clearSync,
    getInfo: getInfo,
    getInfoSync: getInfoSync
}
