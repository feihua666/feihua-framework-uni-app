<template>
    <view class="uni-column uni-flex uni-flex-item ">
        <view class="uni-input-group">
            <view class="uni-input-row">
                <text class="uni-label">账号：</text>
                <input type="text" focus clearable v-model="form.account" placeholder="请输入账号"></input>
            </view>
            <view class="uni-input-row">
                <text class="uni-label">密码：</text>
                <input type="password" displayable v-model="form.password" placeholder="请输入密码"></input>
            </view>
            <view class="uni-input-row">
                <text class="uni-label">邮箱：</text>
                <input type="text" clearable v-model="form.email" placeholder="可登录或找回密码"></input>
            </view>
        </view>
        <view class="fh-padding-30">
            <button type="primary" :loading="registBtnLoading" @tap="register">注册</button>
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
                registBtnLoading:false,
                form:{
                    account: '',
                    password: '',
                    email: ''
                }
            }
        },
        computed: mapState(['regs']),
        methods: {
            register() {

                if(!this.checkRegistForm()){
                    return;
                }
                let self = this
                self.registBtnLoading = true
                self.$http.post('/base/user/regist',{
                    data:self.form,
                    success:function (res) {
                        uni.showToast({
                            icon: 'none',
                            title: '恭喜注册成功'
                        });
                        self.registBtnLoading = false
                        uni.navigateBack({
                            delta: 1
                        });
                    },
                    fail:function (res) {
                        let statusCode = res.statusCode
                        let _data = res.data.data;
                        if(statusCode == 409){
                            if(_data.code == 'E409_100002'){
                                uni.showToast({
                                    icon: 'none',
                                    title: '帐号已存在'
                                });
                            }else if(_data.code == 'E409_100003'){
                                uni.showToast({
                                    icon: 'none',
                                    title: '邮箱已存在'
                                });
                            }else if(_data.code == 'E409_100004'){
                                uni.showToast({
                                    icon: 'none',
                                    title: '手机号已存在'
                                });
                            }
                        }else if(statusCode == 400){
                            uni.showToast({
                                icon: 'none',
                                title: '参数不正确'
                            });
                        }
                        self.registBtnLoading = false
                    }
                })
            },
            checkRegistForm(){
                let rule = [
                    {name:"account", checkType : "reg", checkRule:this.regs.password,  errorMsg:"帐号8~16字母数字组合"},
                    {name:"password", checkType : "reg", checkRule:this.regs.password,  errorMsg:"密码8~16字母数字组合"},
                    {name:"email", checkType : "email", checkRule:"",  errorMsg:"请输入正确的邮箱"}
                ];
                let checkRes = graceChecker.checkForm(this.form, rule);
                return checkRes
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
