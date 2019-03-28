<template>
		<view class="fh-picture-list fh-width-100 uni-flex fh-flex-wrap">
			<view v-for="(item,index) in images"  class="fh-picture-item uni-center" :style="itemStyle">
				<image class="fh-picture-item-imge fh-width-100 fh-height-100" :src="$config.file.getDownloadUrl(item.thumbUrl)" @tap="$utils.pic.pvi($config.file.getDownloadUrl(item.originUrl))" mode="aspectFill"></image>
				<text class='fh-pickture-delete' @click='onDelete(item)' :data-index="index">x</text>
			</view>
			<view v-for="(item,index) in picList" :key="index" class="fh-picture-item uni-center" :style="itemStyle">
				<image class="fh-picture-item-imge fh-width-100 fh-height-100" :src="item.url ? item.url:item.tempUrl" @tap="$utils.pic.pvi(item.url ? item.url:item.tempUrl)" mode="aspectFill"></image>
				<view v-show="item.uploading" class="fh-pickture-uploading uni-center fh-width-100">上传中</view>
				<text class='fh-pickture-delete' @click='deleteImage(index)' :data-index="index">x</text>
			</view>

			<view class='fh-picture-item uni-center' :style="itemStyle" v-show="currentCount < count" v-for="n in (showAllAdd ? count-currentCount : 1)">
				<view class="fh-add-image uni-flex fh-justify-content-center fh-align-items-center fh-height-100" @click='chooseImage'>
				<view class="fh-pictrue-add-text">+</view>
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
                default:[]
			},
			onDelete:{
                default:function(item){}
			},
			onUploadSuccess:{
                default:function(res){}
			},
			//最大上传数量
            count: {
                type: Number,
                default:1
            },
			// 每一项的样式表，一般用来设置宽度和高度
            itemStyle:{
                default:''
			},
			//是否显示所有未上传的+号
			showAllAdd:{
                default:false
			},
			//图片路径
			path:{
                default:''
			}
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
							self.$http.uploadFile(res.tempFiles[i].path,{
                                path:self.path,
                                t:new Date().getTime()
                            }).then(function (res) {
                                self.onUploadSuccess(res)
                                for(let m=0;m<self.picList.length;m++){
                                    if(self.picList[m].index == index){
                                        self.deleteImage(m)
                                    }
                                }
                            })
                        }
                    }
                })
            },
            deleteImage(index) {
            	this.picList.splice(index, 1);
            }
        }
    }
</script>

<style>

.fh-picture-item{
	margin: 10upx;
	display: inline-block;
	position: relative;
	width:150upx;
	height:150upx;
	background-color: #eee;
	cursor: pointer;
	color: #ddd;
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
	border: 2px solid white;
}
.fh-pictrue-add-text{
	font-size: 80upx;
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
