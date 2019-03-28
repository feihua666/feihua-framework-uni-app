<template>
	<view class="uni-list">
		<checkbox-group @change="checkboxChange">
			<label class="uni-list-cell uni-list-cell-pd" v-for="(item,index) in dictItems" :key="item.value">
				<view>
					<checkbox :value="item.value" :data-index="index" :disabled="item.disabled" :checked="item.checked" />
				</view>
				<view>{{item.name}}</view>
			</label>
		</checkbox-group>
	</view>
</template>

<script>
	export default {
	    props:{
	        max:{
	            type:Number,
				default(){
	                return 0
				}
			},
			type:null,
			valueDefault:{
	            type:Array,
				defalut(){
	                return []
				}
			}
        },
		created(){

	        let self = this
			self.$http.getDictsByType(this.type).then(function (dictItems) {
                for(let i=0;i<dictItems.length;i++){
                    self.dictItems.push({
                        name:dictItems[i].name,
                        value:dictItems[i].value,
                        disabled:false,
                        checked:false
                    })
                }
                self.init(self.valueDefault)
            })

		},
		data() {
			return {
				dictItems:[]
			};
		},
		watch:{
            valueDefault(){
                this.init(this.valueDefault)
			}
		},
		methods:{
	        init(values){
                let items = this.dictItems
                for (let i = 0, lenI = items.length; i < lenI; ++i) {
                    items[i].checked = false;
                    for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                        if (items[i].value == values[j]) {
                            items[i].checked = true;
                            break
                        }
                    }
                }
			},
			_emit(emitName){
                let items = this.dictItems
				let temp = {
                    items:[],
					values:[]
				}
                for (let i = 0, lenI = items.length; i < lenI; ++i) {
                    if(items[i].checked){
                        temp.items.push(items[i])
                        temp.values.push(items[i].value)
					}
                }
	            this.$emit(emitName,temp)
			},
            checkboxChange: function (e) {
                let values = e.detail.value;
                let items = this.dictItems
                let _values = []
                let self = this
				if(values.length > this.max && this.max != 0){

                    for (let i = 0, lenI = items.length; i < lenI; ++i) {
                        if (items[i].checked) {
                            _values.push(items[i].value)
                        }
                    }
				}
                self.init(values)

				// 以下主要控制不能多选
                if(values.length > this.max && this.max != 0){
                    for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                        let exist = false
                        for (let i = 0, lenI = _values.length; i < lenI; ++i) {
                            if(_values[i] == values[j]){
                                exist = true
                                break
                            }
                        }
                        if(exist == false){
                            for (let i = 0, lenI = items.length; i < lenI; ++i) {
                                if (items[i].value == values[j] && items[i].checked) {

                                    uni.showToast({
                                        title:`最多选中${this.max}个`,
                                        icon:'none'
                                    })
									setTimeout(function () {
                                        items[i].checked = false
                                        self._emit('onChange')
                                    },500)
									break
                                }
                            }
                            break
                        }
                    }
                }else {
                    this._emit('onChange')
				}

            }
		}
	}
</script>

<style>
	.uni-list-cell {
		justify-content: flex-start
	}
</style>
