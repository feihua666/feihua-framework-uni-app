import store from '../store'

export default {
    // 获取单个字典文本
    getLabelByValue:function (type,value) {
        let r = ''
        let storeDicts = store.state.dicts
        if(storeDicts[type]){
            for(let i = 0;i < storeDicts[type].length;i++){
                let dict = storeDicts[type][i]
                if(dict.value == value){
                    r = dict.name
                    break
                }
            }
        }
        return r
    },
    // 获取多个值字典文本，多个value请以逗号分隔
    getLabelsByValues:function (type,value) {
        let r = []
        let storeDicts = store.state.dicts
        let valueArray = value.split(',')
        if(storeDicts[type]){

            for(let i = 0;i < storeDicts[type].length;i++){
                let dict = storeDicts[type][i]
                for(let j=0;j<valueArray.length;j++){
                    let _value = valueArray[j]
                    if(dict.value == _value){
                        r.push(dict.name)
                        break
                    }
                }
            }
        }

        return r.join(',')
    },
    // 获取字典数组
    getDictByType(type){
        let storeDicts = store.state.dicts
        return storeDicts[type]
    }

}