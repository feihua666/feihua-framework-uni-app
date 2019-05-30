<template>
    <view class="uni-column uni-flex uni-flex-item ">
        <view class="uni-input-group">
            <view class="uni-input-row">
                <text class="uni-label">账号：</text>
                <input type="text" focus v-model="form.principal" placeholder="请输入账号"></input>
            </view>
            <view class="uni-input-row">
                <text class="uni-label">密码：</text>
                <input type="password" v-model="form.password" placeholder="请输入密码"></input>
            </view>
        </view>
        <view class="fh-padding-30">
            <button type="primary" :loading="loginLoading" @tap="loginBtnClick">登录</button>
        </view>

        <view class="uni-row uni-flex fh-padding-30 fh-justify-content-center">
            <navigator class="uni-link" url="/pages/regist/regist">注册账号</navigator>
            <text>|</text>
            <navigator class="uni-link" url="/pages/password/forget">忘记密码</navigator>
        </view>
        <view class="uni-row uni-flex fh-padding-30 fh-justify-content-center">
            <button type="primary" size="mini" @tap="wxLoginBtnClick">微信直接登录</button>
        </view>
    </view>
</template>

<script>
    //来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
    import  graceChecker from "@/utils/graceChecker.js"
    export default {
        components: {
        },
        data() {
            return {
                positionTop: 0,
                loginLoading:false,
				form: {
				  loginType: 'ACCOUNT',
                    client: this.$config.client,
				  principal: '',
				  password: '',
				  captcha: '',
				  rememberMe: false
				},
                wxLoginForm:{
                    loginType: 'WX_PLATFORM',
                    client: this.$config.client,
                    type:this.$config.which,
                    openid: '',
                    rememberMe: false
                },
            }
        },
        // 点击导航返回和接口调用navigateBack都回调，注意getCurrentPages 长度为1时（只有当前页面）不回调
        onBackPress() {
        },
        methods: {
            loginBtnClick() {
                if(!this.checkLoginForm()){
                    return
                }
				let self = this
                self.loginLoading = true
				this.$http.post('/login',this.form).then(function (res) {
                    self.loginLoading = false
                    self.loginSuccess()
                }).catch(function (res) {
                    let statusCode = res.statusCode;
                    if(statusCode == 401){
                        uni.showToast({
                            title:'用户名或密码错误',
                            icon:'none'
                        })
                    }else if(statusCode == 400){
                        // 需要验证码,后台已禁用，不需要处理
                        if(res.data.data.code == 'E400_100005'){

                        }
                    }
                    self.loginLoading = false
                })
            },
            wxLogin(){
                let self = this
                let p = {
                    code: this.$utils.getUrlParam(null,'code')|| ''
                }
                if (!p.code) {
                    return
                }
                uni.showLoading({
                    title: ''
                });
                console.log('wxlogin')
                self.$http.post('/publicplatform/authUserInfo/' + self.$config.which +'/' + self.$config.client,p).then(function (res) {
                    let openid = res.data.data.content
                    self.wxLoginForm.openid = openid
                    self.$http.post('/login',self.wxLoginForm).then(function () {
                        uni.hideLoading();
                        self.loginSuccess()
                    }).catch(function (res) {
                        uni.hideLoading();
                        uni.showToast({
                            title:'微信登录失败',
                            icon:'none'
                        })
                    })
                }).catch(function () {
                    uni.hideLoading();
                    uni.showToast({
                        title:'获取微信用户信息失败',
                        icon:'none'
                    })
                })

            },
            // 登录成功调用,用于初始化基础数据
            loginSuccess(){
                uni.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration:1000
                });
                //  登录成功之后跳转到首页，首页会有页面跳转逻辑，
                //  注意注意注意！！！这里为什么没有直接跳转到登录前的页面，因为会有问题，这里如果直接跳转到登录前的页面，后退就又是登录页面了，如果用relunch会没有的返回按钮，很尴尬
                uni.reLaunch({
                    url:'/pages/index/index'
                })
            },
            checkLoginForm(){
                let rule = [
                    {name:"principal", checkType : "notnull", checkRule:"",  errorMsg:"请输入帐号"},
                    {name:"password", checkType : "notnull", checkRule:"",  errorMsg:"请输入密码"}
                ];
                let checkRes = graceChecker.checkForm(this.form, rule);
                return checkRes
            },
            wxLoginBtnClick(){
                uni.removeStorageSync('wxLoginAuto')
                let self = this
                self.$http.get('/publicplatform/authAuthorizePageUrl/' + self.$config.which,{
                    scope:'snsapi_userinfo',
                    state:'STATE',
                    redirectUrl:self.$config.hostContext + '/pages/login/login'
                }).then(function (res) {
                    let url = res.data.data.content
                    window.location.href = url
                })
            }
        },
        watch:{
        },
        onLoad(options) {
            console.log('onLoad login')
            let self = this
            this.wxLogin()
        }
    }
</script>

<style>

    .uni-input-row .uni-label{
        width:26%;
    }
    .uni-input-row input{
        width:100%;
    }

</style>
