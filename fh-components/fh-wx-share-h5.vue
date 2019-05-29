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
            let self = this
            setTimeout(function () {
                self.myready(self.shareContent)
            },3000)
		},
        methods:{
            myready (shareContent) {
                let self = this
                if (!shareContent || !shareContent.title || !shareContent.imgUrl) {
                    return
				}
                let link = shareContent.link
                if(!shareContent.link){
                    link = window.location.href
                }
                let singlemessageLink = self.$utils.concatUrlHashParam(link,{from: 'singlemessage',f_u: self.$store.state.userinfo.id})
                let timelineLink = self.$utils.concatUrlHashParam(link,{from: 'timeline',f_u: self.$store.state.userinfo.id})
                jWeixin.error(function(res){
                    // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                });
                jWeixin.ready(function () {
                    //需在用户可能点击分享按钮前就先调用
                    // 自定义“分享给朋友”及“分享到QQ”按钮的分享内容
                    jWeixin.updateAppMessageShareData({
                        title: shareContent.title, // 分享标题
                        desc: shareContent.desc || '', // 分享描述
                        link: singlemessageLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: shareContent.imgUrl, // 分享图标
                        success: function (res) {
                            // 设置成功
                        }
                    })

                    // 自定义“分享到朋友圈”及“分享到QQ空间”按钮的分享内容
                    jWeixin.updateTimelineShareData({
                        title: shareContent.title, // 分享标题
                        link: timelineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: shareContent.imgUrl, // 分享图标
                        success: function (res) {
                            // 设置成功

                        }
                    })
					// 获取“分享到朋友圈”按钮点击状态及自定义分享内容接口（即将废弃）
                    jWeixin.onMenuShareTimeline({
                        title: shareContent.title, // 分享标题
                        link: timelineLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: shareContent.imgUrl, // 分享图标
                        success: function () {
                            // 用户点击了分享后执行的回调函数
							self.$http.pageShareRecord({
                                url:timelineLink,
                                type:shareContent.type,
                                contentId:shareContent.contentId,
                                contentName:shareContent.contentName,
                                shareTo:'朋友圈'
							})
                        }
                    });
                    jWeixin.onMenuShareAppMessage({
                        title: shareContent.title, // 分享标题
                        desc: shareContent.desc, // 分享描述
                        link: singlemessageLink, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
                        imgUrl: shareContent.imgUrl, // 分享图标
                        type: '', // 分享类型,music、video或link，不填默认为link
                        dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
                        success: function () {
							// 用户点击了分享后执行的回调函数
                            self.$http.pageShareRecord({
                                url:singlemessageLink,
                                type:shareContent.type,
                                contentId:shareContent.contentId,
                                contentName:shareContent.contentName,
                                shareTo:'微信朋友'
                            })
                        }
                    });
                });
                let p = {
                    which: self.$config.which,
                    realUrl: (window.location.href.split('#')[0])
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
                            jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData', 'onMenuShareTimeline','onMenuShareAppMessage'], // 必填，需要使用的JS接口列表
							success:function (res) {
                            },
							fail:function (res) {
                            }
                        });
                    })
			}
        },
		watch: {
            shareContent (val) {
                let self = this
                setTimeout(function () {
                    self.myready(val)
                },1000)

			}
		}
    }
</script>

<style>
</style>
