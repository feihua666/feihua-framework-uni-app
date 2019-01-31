<template>
	<div class="mpvue-picker">
		<div :class="{'pickerMask':showPicker}" @click="maskClick" catchtouchmove="true"></div>
		<div class="mpvue-picker-content " :class="{'mpvue-picker-view-show':showPicker}">
			<div class="mpvue-picker__hd" catchtouchmove="true">
				<div class="mpvue-picker__action" @click="pickerCancel">取消</div>
				<div class="mpvue-picker__action" :style="{color:themeColor}" @click="pickerConfirm">确定</div>
			</div>
			<picker-view indicator-style="height: 40px;" class="mpvue-picker-view" :value="pickerValue" @change="pickerChange">
				<block>
					<picker-view-column>
						<div class="picker-item" v-for="(item,index) in provinceDataList" :key="index">{{item.label}}</div>
					</picker-view-column>
					<picker-view-column>
						<div class="picker-item" v-for="(item,index) in cityDataList" :key="index">{{item.label}}</div>
					</picker-view-column>
					<picker-view-column>
						<div class="picker-item" v-for="(item,index) in areaDataList" :key="index">{{item.label}}</div>
					</picker-view-column>
				</block>
			</picker-view>
		</div>
	</div>
</template>

<script>

    export default {
        data() {
            return {
                pickerValue: [0, 0, 0],
                provinceDataList: [],
                cityDataList: [],
                areaDataList: [],
                /* 是否显示控件 */
                showPicker: false,
                province:[],
                city:[],
                district:[]
            };
        },
        created() {
            this.init()
        },
        props: {
            /* 默认值 */
            pickerValueDefault: {
                type: Array,
                default(){
                    return []
                }
            },
            /* 主题色 */
            themeColor: String
        },
        watch:{
            pickerValueDefault(){
                this.init();
            }
        },
        methods: {
            getIndexById(areaArray,id){
                for(let i = 0;i<areaArray.length;i++){
                    if(areaArray[i].id == id){
                        return i
                    }
                }
                return 0
            },
            // 数据结构转换
            areaConvertToPicker(areaArray){

                let r = []
                for(let i = 0;i<areaArray.length;i++){
                    r.push({
                        label:areaArray[i].name,
                        value:areaArray[i].id
                    })
                }
                return r
            },
            init() {
                let self = this
                this.loadProvince(function () {
                    let provinceId = self.province[0].id
                    if(self.pickerValueDefault.length > 0){
                        provinceId = self.pickerValueDefault[0]
                    }
                    self.provinceDataList = self.areaConvertToPicker(self.province)

                    self.loadCity(provinceId,function () {
                        let cityId = self.city[0].id
                        if(self.pickerValueDefault.length > 1){
                            cityId = self.pickerValueDefault[1]
                        }
                        self.cityDataList = self.areaConvertToPicker(self.city)

                        self.loadDistrict(cityId,function () {
                            self.areaDataList = self.areaConvertToPicker(self.district)

							self.areaValueDefaultToPickerValueDefault()
                        })
                    })
                })
            },
            // 一般只能district加载完成调用
            areaValueDefaultToPickerValueDefault(){
                let d = this.pickerValueDefault
                if(d.length == 0){
                    this.pickerValue = [0,0,0]
                }else{
                    let provinceIndex = this.getIndexById(this.province,d[0])
                    let cityIndex = this.getIndexById(this.city,d[1])
                    let districtIndex = this.getIndexById(this.district,d[2])
                    this.pickerValue = [provinceIndex,cityIndex,districtIndex]
				}
            },
            show() {
                setTimeout(() => {
                    this.showPicker = true;
                }, 0);
            },
            maskClick() {
                this.pickerCancel();
            },
            pickerCancel() {
                this.showPicker = false;
                this._$emit('onCancel');
            },
            pickerConfirm(e) {
                this.showPicker = false;
                this._$emit('onConfirm');
            },
            showPickerView() {
                this.showPicker = true;
            },
            handPickValueDefault() {
            },
            pickerChange(e) {
                let self = this
                let changePickerValue = e.mp.detail.value;
                if (this.pickerValue[0] !== changePickerValue[0]) {
                    // 第一级发生滚动
                    self.loadCity(self.province[changePickerValue[0]].id,function () {
                        let cityId = self.city[0].id
                        self.cityDataList = self.areaConvertToPicker(self.city)

                        self.loadDistrict(cityId,function () {
                            self.areaDataList = self.areaConvertToPicker(self.district)
                            changePickerValue[1] = 0;
                            changePickerValue[2] = 0;
                            self.pickerValue = changePickerValue;
                            self._$emit('onChange');
                        })
                    })
                } else if (this.pickerValue[1] !== changePickerValue[1]) {

                    // 第二级滚动
                    self.loadDistrict(self.city[changePickerValue[1]].id,function () {
                        self.areaDataList = self.areaConvertToPicker(self.district)
                        changePickerValue[2] = 0;
                        self.pickerValue = changePickerValue;
                        self._$emit('onChange');
                    })
                }else if (this.pickerValue[2] !== changePickerValue[2]) {
                    // 三级滚动
                    self.pickerValue = changePickerValue;
                    self._$emit('onChange');
				}

            },
            _$emit(emitName) {
                let pickObj = {
                    label: this._getLabel(),
                    value: this.pickerValue,
                    cityCode: this._getCityCode()
                };
                this.$emit(emitName, pickObj);
            },
            _getLabel() {
                let pcikerLabel = []
                pcikerLabel.push(this.provinceDataList[this.pickerValue[0]].label)
                pcikerLabel.push(this.cityDataList[this.pickerValue[1]].label)
                    pcikerLabel.push(this.areaDataList[this.pickerValue[2]].label)
                return pcikerLabel;
            },
            _getCityCode() {
                let ids = []
                ids.push(this.provinceDataList[this.pickerValue[0]].value)
                ids.push(this.cityDataList[this.pickerValue[1]].value)
                ids.push(this.areaDataList[this.pickerValue[2]].value)
                return ids;
            },
			loadProvince:function(success){
                let self = this
                let proviceStorage = uni.getStorageSync('area_province')
                if (proviceStorage){
                    self.province = proviceStorage

                    if(success && typeof success == 'function'){
                        success()
                    }
                    return
                }
                self.$http.get('/base/areas', {
                    data: {
                        type: 'province',
                        t: new Date().getTime()
                    },
                    success:  function (r) {
                        let content = r.data.data.content
                        self.province = content
                        if(success && typeof success == 'function'){
                            success()
                        }
                        //把省放入缓存
                        uni.setStorageSync('area_province', content)
                    }
                })
            },
            loadCity: function (parentId,success){
                let self = this
                //检查缓存
                let cityStorage = uni.getStorageSync('area_city' + parentId)
                if (cityStorage) {
                    self.city = cityStorage
                    if(success && typeof success == 'function'){
                        success()
                    }
                    return
                }
                self.$http.get('/base/areas', {
                    data: {
                        type: 'city',
                        parentId: parentId,
                        t: new Date().getTime()
                    },
                    success:  function (r) {
                        let content = r.data.data.content

                        if (content) {
                            self.city = content
                            if(success && typeof success == 'function'){
                                success()
                            }
                            //保存在缓存
                            uni.setStorageSync('area_city' + parentId,content)
                        }

                    }
                })
            },
            loadDistrict: function (parentId,success){

                let self = this

                //检查缓存
                let districtStorage = uni.getStorageSync('area_district' + parentId)
                if (districtStorage) {
                    self.district = districtStorage
                    if(success && typeof success == 'function'){
                        success()
                    }
                    return
                }

                self.$http.get('/base/areas', {
                    data: {
                        type: 'district',
                        parentId: parentId,
                        t: new Date().getTime()
                    },
                    success:  function (r) {
                        let content = r.data.data.content
                        if (content) {
                            self.district = content
                            if(success && typeof success == 'function'){
                                success()
                            }
                            //保存在缓存
                            uni.setStorageSync('area_district' + parentId,content)
                        }

                    }
                })
            }
        }
    };
</script>

<style>
	.pickerMask {
		position: fixed;
		z-index: 1000;
		top: 0;
		right: 0;
		left: 0;
		bottom: 0;
		background: rgba(0, 0, 0, 0.6);
	}
	.mpvue-picker-content {
		position: fixed;
		bottom: 0;
		left: 0;
		width: 100%;
		transition: all 0.3s ease;
		transform: translateY(100%);
		z-index: 3000;
	}
	.mpvue-picker-view-show {
		transform: translateY(0);
	}
	.mpvue-picker__hd {
		display: flex;
		padding: 9px 15px;
		background-color: #fff;
		position: relative;
		text-align: center;
		font-size: 17px;
	}
	.mpvue-picker__hd:after {
		content: ' ';
		position: absolute;
		left: 0;
		bottom: 0;
		right: 0;
		height: 1px;
		border-bottom: 1px solid #e5e5e5;
		color: #e5e5e5;
		transform-origin: 0 100%;
		transform: scaleY(0.5);
	}
	.mpvue-picker__action {
		display: block;
		flex: 1;
		color: #1aad19;
	}
	.mpvue-picker__action:first-child {
		text-align: left;
		color: #888;
	}
	.mpvue-picker__action:last-child {
		text-align: right;
	}
	.picker-item {
		text-align: center;
		line-height: 40px;
		text-overflow: ellipsis;
		white-space: nowrap;
		font-size: 16px;
	}
	.mpvue-picker-view {
		position: relative;
		bottom: 0;
		left: 0;
		width: 100%;
		height: 238px;
		background-color: rgba(255, 255, 255, 1);
	}
</style>
