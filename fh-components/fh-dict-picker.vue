<template>
    <mpvue-picker ref="mpvuePicker" :mode="mpvuePicker.mode" :deepLength="mpvuePicker.deepLength" :pickerValueDefault="mpvuePicker.pickerValueDefault"
                  @onConfirm="onConfirm" @onCancel="onCancel" :pickerValueArray="mpvuePicker.pickerValueArray"></mpvue-picker>
</template>

<script>
    import mpvuePicker from '@/components/mpvue-picker/mpvuePicker.vue';
    import {
        mapState
    } from 'vuex'
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
            ...mapState(['dicts'])
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
                this.dictConvertToPicker(this.dicts[this.type])
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
                this.$emit('onConfirm', obj);
            },
            onCancel(obj){
                this.$emit('onCancel', obj);
            }
        },
        watch:{
            valueDefault(oldValue,newVaule){
                let exist = false
                for(let i = 0;i<this.dicts[this.type].length;i++){
                    if(this.valueDefault == this.dicts[this.type][i].value){
                        this.mpvuePicker.pickerValueDefault = [i]
                        exist = true
                        return
                    }
                }
                if(exist == false){
                    this.mpvuePicker.pickerValueDefault = [0]
                }
            },
            type(oldValue,newVaule){
                if(this.type){
                    this.dictConvertToPicker(this.dicts[this.type])
                }
            }
        }
    }
</script>

<style>

.fh-picture-item{
	margin-right: 20upx;
	margin-top: 20upx;
	display: inline-block;
	position: relative;
	width:150upx;
	height:150upx;
	background-color: #eee;
	cursor: pointer;
	color: #ddd;
}
.fh-picture-item-last{
	margin-right: 0;
}
.fh-pickture-delete{
	position: absolute;
	top: -11rpx;
	right: -11rpx;
	color: rgba(255, 255, 255, 0.49);
	border-radius: 50%;
	width: 40rpx;
	height: 40rpx;
	line-height: 35rpx;
	text-align: center;
	background-color: #ff8616;
}
.fh-pictrue-add-text{
	position: absolute;
	font-size: 100upx;
	left:50%;
	top:50%;
	margin-left: -38upx;
	margin-top: -60upx;
	line-height: 1;
}
.fh-pickture-uploading{
	line-height: 150upx;
	position: absolute;
	left:0;
	top:0;
	bottom: 0;
	top: 0;
}
</style>