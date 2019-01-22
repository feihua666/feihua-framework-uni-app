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

        <view class="uni-row uni-flex fh-padding-30 "  style="justify-content: center;">
            <navigator class="uni-link" url="/pages/regist/regist">注册账号</navigator>
            <text>|</text>
            <navigator class="uni-link" url="/pages/password/forget">忘记密码</navigator>
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
                loginSuccess:false,
				form: {
				  loginType: 'ACCOUNT',
				  loginClient: 'h5',
				  principal: '',
				  password: '',
				  captcha: '',
				  rememberMe: false
				}
            }
        },
        // 点击导航返回和接口调用navigateBack都回调，注意getCurrentPages 长度为1时（只有当前页面）不回调
        onBackPress() {
            if (!this.hasLogin && this.forcedLogin) {
                return true;
            }
        },
        computed: mapState(['hasLogin','forcedLogin']),
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
                        // 获取当前登录用户信息,在app.vue中也有重复获取用户

                        self.$http.initGobalData(true)

                        uni.showToast({
                            title: '登录成功',
                            icon: 'none',
                            duration:1000
                        });
                        self.loginSuccess = true

                        self.loginLoading = false

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
            navigateBack() {

                let pages = getCurrentPages();
                console.log(pages)
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
            }
        },
        watch:{
            hasLogin(hasLogin){
                if(hasLogin && this.loginSuccess){
                    this.navigateBack()
                }
            }
        },

        onLoad() {
            console.log('onLoad login')
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
