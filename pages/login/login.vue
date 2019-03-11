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
    import {
        mapState,
        mapMutations
    } from 'vuex'
    //来自 graceUI 的表单验证， 使用说明见手册 http://grace.hcoder.net/doc/info/73-3.html
    import  graceChecker from "@/common/graceChecker.js"
    export default {
        components: {
        },
        data() {
            return {
                positionTop: 0,
                loginLoading:false,
				form: {
				  loginType: 'ACCOUNT',
				  loginClient: 'h5',
				  principal: '',
				  password: '',
				  captcha: '',
				  rememberMe: false
				},
                wxLoginForm:{
                    loginType: 'WX_PLATFORM',
                    loginClient: 'h5',
                    type:'yangwei',
                    rememberMe: false
                },
            }
        },
        // 点击导航返回和接口调用navigateBack都回调，注意getCurrentPages 长度为1时（只有当前页面）不回调
        onBackPress() {
            if (!this.hasLogin && this.$config.forcedLogin) {
                return true;
            }
        },
        computed: mapState(['hasLogin']),
        methods: {
            ...mapMutations(['setGlobalDataInit']),
            loginBtnClick() {
                if(!this.checkLoginForm()){
                    return
                }
				let self = this
                self.loginLoading = true
				this.$http.post('/login',{
					data:this.form,
                    checkLogin:false,
					success: async function (infoRes) {
                        self.loginLoading = false
                        self.loginSuccess()
                    },
					fail:function(res){
						let statusCode = res.statusCode;
						if(statusCode == 401){
							uni.showToast({
								title:'用户名或密码错误',
								icon:'none'
							})
						}else if(statusCode == 400){
							// 需要验证码,后台禁用
							if(res.data.data.code == 'E400_100005'){

							}
						}
                        self.loginLoading = false
					}
				})
            },
            wxLoginAuto(){
                let self = this
                this.$http.post('/login',{
                    data:this.wxLoginForm,
                    checkLogin:false,
                    success: function (infoRes) {
                        self.loginSuccess()
                    },
                    fail:function(res){
                        uni.showToast({
                            title:'登录失败',
                            icon:'none'
                        })
                    },
                    complete:function () {
                        // 完成后清除
                        uni.removeStorage({key:'wxLogin'});
                    }
                })
            },
            // 登录成功调用,用于初始化基础数据
            loginSuccess(){
                uni.showToast({
                    title: '登录成功',
                    icon: 'none',
                    duration:1000
                });
                let self = this
                let globalDataFlag={}
                self.$bus.$off('initGlobalData_loadReg')
                self.$bus.$on('initGlobalData_loadReg',function (data) {
                    globalDataFlag.loadReg = true
                    self.loginSuccessLogical(globalDataFlag)
                })
                self.$bus.$off('initGlobalData_loadDicts')
                self.$bus.$on('initGlobalData_loadDicts',function (data) {
                    globalDataFlag.loadDicts = true
                    self.loginSuccessLogical(globalDataFlag)
                })
                self.$bus.$off('initGlobalData_loadUserinfo')
                self.$bus.$on('initGlobalData_loadUserinfo',function (data) {
                    globalDataFlag.loadUserinfo = true
                    self.loginSuccessLogical(globalDataFlag)
                })
                self.$http.initGobalData(true)
            },
            loginSuccessLogical(globalDataFlag){
                let self = this
                if(globalDataFlag.loadReg && globalDataFlag.loadDicts && (!self.$config.forcedLogin || globalDataFlag.loadUserinfo)){
                    self.$bus.$off('initGlobalData_loadReg')
                    self.$bus.$off('initGlobalData_loadDicts')
                    self.$bus.$off('initGlobalData_loadUserinfo')
                    self.navigateBack()
                }
            },
            navigateBack() {

                let pages = getCurrentPages();
                if(pages && pages.length>1){
                    uni.navigateBack({
                        delta: 1
                    });
                }else{
                    uni.reLaunch({
                        url:'/pages/index/index'
                    })
                }

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

                let self = this
                self.$http.get('/publicplatform/authAuthorizePageUrl/' + self.$config.which,{
                    data:{
                        scope:'snsapi_userinfo',
                        state:'STATE',
                        redirectUrl:self.$config.hostApi + '/publicplatform/getAuthUserInfo/'+ self.$config.which +'?redirectUrl=' + self.$config.host + '/uni-app'
                    },
                    success:function (res) {
                        let url = res.data.data.content
                        uni.setStorageSync('wxLogin',true)
                        window.location.href = url
                    }
                })

            },
        },
        watch:{
        },
        onLoad(options) {
            console.log('onLoad login')
            //微信登录
            if (!this.hasLogin && uni.getStorageSync('wxLogin')) {
                this.wxLoginAuto()
            }
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
