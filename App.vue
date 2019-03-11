<script>
	export default {
		onLaunch: async function () {
            console.log('App Launch')
        },
		onShow: function () {
			console.log('App Show')
		},
		onHide: function () {
			console.log('App Hide')
		},
        methods:{
        },
        watch:{
        }
	}
</script>
<style>

	/*每个页面公共css */
    /* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
    @import './uni.css';
    /* uni-app默认全局使用flex布局。因为flex布局有利于跨更多平台，尤其是采用原生渲染的平台。如不了解flex布局，请参考http://www.w3.org/TR/css3-flexbox/。如不使用flex布局，请删除或注释掉本行。*/
    body,
        /* page 标签暂时不知道是哪里出现 todo */
    page {
        min-height: 100%;
        display: flex;
    }

    /* #ifdef MP-BAIDU */
    page {
        width: 100%;
        height: 100%;
        display: block;
    }

    /* swan 是百度 小程序的xml文件*/
    swan-template {
        width: 100%;
        min-height: 100%;
        display: flex;
    }
    /* #endif */


    .fh-padding-30{
        padding:30upx;
    }
    .fh-padding-right-30{
        padding-right:30upx;
    }
    .fh-padding-left-30{
        padding-left:30upx;
    }
    .fh-padding-top-30{
        padding-top:30upx;
    }
    .fh-padding-bottom-30{
        padding-bottom:30upx;
    }
    .fh-margin-right-30{
        margin-right:30upx;
    }
    .fh-margin-left-30{
        margin-left:30upx;
    }
    .fh-margin-top-30{
        margin-top:30upx;
    }
    .fh-margin-bottom-30{
        margin-bottom:30upx;
    }
    .fh-padding-0{
        padding:0;
    }
    .fh-justify-content-center{
        justify-content: center;
    }
    .fh-align-items-center{
        align-items: center;
    }
    .fh-justify-content-space-between{
        justify-content:space-between;
    }
    .fh-height-100{
        height: 100%;
    }
    .fh-width-100{
        width: 100%;
    }
    .fh-text-align-right{
        text-align: right;
    }
    button[size=mini][loading]:before{
        width:25upx !important;
        height:25upx !important;
    }
</style>
