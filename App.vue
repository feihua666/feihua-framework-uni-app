<script>
	export default {
		onLaunch: async function () {
            console.log('App Launch')
            // 单页面应用在历史模式下，微信分享的签名url只能是第一次的url这里记录一下以待签名使用
            window.entryUrl = window.location.href
        },
		onShow: function () {
            console.log('App Show')
            let self = this

            let splashShowed = this.$storageUtils.getSync('splashShowed')
            if(!splashShowed){
                uni.reLaunch({
                    url:'/pages/splash/splash'
                })
            }else{
                this.$http.hasLogin().then(function () {
                }).catch(function () {
                    // 总之一句话，用户没有登录，需要登录的页面跳转到登录，不需要登录的页面不处理，登录成功后跳转到index页面
                    // 如果没有登录，记录入口页面，登录成功后导航到入口页面，具体导航操作在登录页面执行
                    let hash = window.location.href.replace(self.$config.hostContext,'')
                    // 登录成功后要跳转的地址
                    let afterLoginPage = ''
                    if(hash && hash.indexOf('/pages') == 0){
                        if (hash.indexOf('/pages/login/login') != 0) {
                            afterLoginPage = hash
                        }
                    }else {
                        // 这里没有给afterLoginPage赋值，是因为第一次访问的url没有找到，系统会自动跳转到index页面，不需处理
                        hash = '/pages/index/index'
                    }
                    // 不需要登录的页面配置
                    let noLoginPages = self.$config.noLoginPages
                    let needLogin = true
                    for (let i = 0; i < noLoginPages.length; i++) {
                        if (hash.indexOf(noLoginPages[i]) == 0){
                            needLogin = false
                            break
                        }
                    }
                    // 如果需要登录，记录一下登录后要跳转的地址
                    if (needLogin) {
                        if (afterLoginPage) {
                            uni.setStorageSync('navigateToPage',afterLoginPage)
                        }
                        console.log('needLogin=' + needLogin)
                        uni.reLaunch({
                            url:'/pages/login/login'
                        })
                    }
                })
            }

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
    button[size=mini][loading]:before{
        width:25upx !important;
        height:25upx !important;
    }

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
    .fh-padding-0{
        padding:0;
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

</style>
