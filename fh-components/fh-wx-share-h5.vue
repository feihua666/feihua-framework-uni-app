<template>
	<div></div>
</template>

<script>
    export default {
        components: {
        },
        props:{
            shareContent: {
                default: null
			}
        },
        data() {
            return {
            }
        },
        mounted(){
            this.myready(this.shareContent)
		},
        methods:{
            myready (shareContent) {
                if (!shareContent) {
                    return
				}
                let link = shareContent.link
                if(!shareContent.link){
                    /*let urlArray = window.location.href.split('#')
					if(urlArray.length > 1){
                        link = this.$utils.concatUrlParam(urlArray[0],'sharePage=' + urlArray[1])
					}else{
                        link = urlArray[0]
					}*/
                    link = window.location.href
                }
                jWeixin.error(function(res){
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
                jWeixin.ready(function () {
                    //需在用户可能点击分享按钮前就先调用
                    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                    jWeixin.updateAppMessageShareData({
                        title: shareContent.title, // 分享标题
                        desc: shareContent.desc, // 分享描述
                        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: shareContent.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                        },
                        fail: function (res) {

                        }
                    })

                    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                    jWeixin.updateTimelineShareData({
                        title: shareContent.title, // 分享标题
                        link: link, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: shareContent.imgUrl, // 分享图标
                        success: function () {
                            // 设置成功
                        },
                        fail: function (res) {

                        }
                    })

                });
                let self = this
                let p = {
                    which: self.$config.which,
                    realUrl: window.location.href.split('#')[0]
                }
                self.$http.get('/publicplatform/getJsInterfaceConfig',p)
                    .then(function (res) {
                        let content = res.data.data.content
                        jWeixin.config({
                            debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                            appId: content.appId, // 必填，公众号的唯一标识
                            timestamp: content.timestamp, // 必填，生成签名的时间戳
                            nonceStr: content.nonceStr, // 必填，生成签名的随机串
                            signature: content.signature,// 必填，签名
                            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData'], // 必填，需要使用的JS接口列表
							success:function (res) {
                            }
                        });
                    })
			}
        },
		watch: {
            shareContent (val) {
                this.myready(val)
			}
		}
    }
</script>

<style>
</style>
