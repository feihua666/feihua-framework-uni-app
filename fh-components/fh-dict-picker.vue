<template>
    <mpvue-picker ref="mpvuePicker" :mode="mpvuePicker.mode" :deepLength="mpvuePicker.deepLength" :pickerValueDefault="mpvuePicker.pickerValueDefault"
                  @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="mpvuePicker.pickerValueArray"></mpvue-picker>
</template>

<script>
    import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    export default {
        components: {
            mpvuePicker
        },
        data() {
            return {
                mpvuePicker:{
                    mode:'selector',
                    deepLength:1,
                    pickerValueDefault:[0],
                    pickerValueArray:[]
                }
            };
        },
        computed:{
		},
        props: {
            // 默认字典值
            valueDefault:{
                type:String,
                default(){
                    return null
                }
            },
            // 字典类型
            type:{
                type:String,
                default(){
                    return null
                }
            }
        },
        mounted(){
            console.log('dictpickerload')
            if(this.type){
                let self = this
                self.$http.getDictsByType(this.type).then(function (dictItems) {
                    self.dictConvertToPicker(dictItems)
                })
            }
        },
        methods: {
            // 字典数据转为列选择数据结构
            dictConvertToPicker(dictArray){

                let r = []
                for(let i = 0;i<dictArray.length;i++){
                    r.push({
                        label:dictArray[i].name,
                        value:dictArray[i].value
                    })
                }
                this.mpvuePicker.pickerValueArray = r
            },
            show(){

                this.$refs.mpvuePicker.show()
            },
            onConfirm(obj){
                obj.value = obj.value[0]
                this.$emit('onConfirm', obj);
            },
            onCancel(obj){
                this.$emit('onCancel', obj);
            }
        },
        watch:{
            valueDefault(oldValue,newVaule){
                let self = this
                self.$http.getDictsByType(this.type).then(function (dictItems) {
                    let exist = false
                    for(let i = 0;i<dictItems.length;i++){
                        if(self.valueDefault == dictItems[i].value){
                            self.mpvuePicker.pickerValueDefault = [i]
                            exist = true
                            return
                        }
                    }
                    if(exist == false){
                        self.mpvuePicker.pickerValueDefault = [0]
                    }
                })
            },
            type(oldValue,newVaule){
                if(this.type){
                    let self = this
                    self.$http.getDictsByType(this.type).then(function (dictItems) {
                        self.dictConvertToPicker(dictItems)

                    })
                }
            }
        }
    }
</script>

<style>
</style>
