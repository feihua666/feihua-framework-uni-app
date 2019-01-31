<template>
		<view class="fh-picture-list fh-width-100">
			<view v-for="(item,index) in images"  class="fh-picture-item uni-center">
				<image class="fh-picture-item-imge fh-width-100 fh-height-100" :src="$config.file.getDownloadUrl(item)" @tap="$utils.pvi($config.file.getDownloadUrl(item))" mode="aspectFill"></image>
				<text class='fh-pickture-delete' @click='onDelete(index)' :data-index="index">x</text>
			</view>
			<view v-for="(item,index) in picList" :key="index" class="fh-picture-item uni-center">
				<image class="fh-picture-item-imge fh-width-100 fh-height-100" :src="item.url ? item.url:item.tempUrl" @tap="$utils.pvi(item.url ? item.url:item.tempUrl)" mode="aspectFill"></image>
				<view v-show="item.uploading" class="fh-pickture-uploading uni-center fh-width-100">上传中</view>
				<text class='fh-pickture-delete' @click='deleteImage(index)' :data-index="index">x</text>
			</view>

			<view class='fh-picture-item fh-picture-item-last' v-show="currentCount < count">
				<view class="fh-add-image fh-width-100 fh-height-100 uni-center" @click='chooseImage'>

				<text class="fh-pictrue-add-text">+</text>
				</view>
			</view>
		</view>
</template>

<script>
    export default {
        data() {
            return {
				// 值={url,tempUrl,uploading}
                picList: []
            };
        },
		computed:{
            currentCount(){
                return this.images.length + this.picList.length
			}
		},
        props: {
            //默认回显图片地址
            images:{
                type: Array,
				value:[]
			},
			onDelete:{
                value:function(index){}
			},
			onUploadSuccess:{
                value:function(res){}
			},
			//最大上传数量
            count: {
                type: Number,
                value: 1
            },
			//图片路径
			path:''
        },
        methods: {
            // 选择图片
            chooseImage() {
                let self = this
				let count = this.count
				if(this.currentCount == count){
				    return
				}else{
                    count = this.count - this.currentCount
				}
                uni.chooseImage({
                    count:count,
                    sizeType: ['compressed'],
                    sourceType: ['album', 'camera'],
                    success(res) {
                        if(res.tempFiles.length > count){
                            uni.showToast({
								icon:'none',
								title:'最多选择' + count + '张'
							})
							return
						}

                        for (let i in res.tempFiles) {
                            let index = self.picList.length
                            self.picList.push({
								index:index,
								tempUrl:res.tempFiles[i].path,
								uploading:true
							})
							//上传,使用默认上传路径
							self.$http.uploadFile(null,{
                                filePath: res.tempFiles[i].path,
                                data:{
                                    path:self.path,
									t:new Date().getTime()
                                },
                                success:function (res ) {
                                    self.onUploadSuccess(res)
                                },
								complete:function () {
                                    for(let m=0;m<self.picList.length;m++){
                                        if(self.picList[m].index == index){
                                            self.deleteImage(m)
                                        }
                                    }
                                }
							})
                        }
                    }
                })
            },
            deleteImage(index) {
                console.log(index)
            	this.picList.splice(index, 1);
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