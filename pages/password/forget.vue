<template>
    <view class="uni-column uni-flex uni-flex-item ">
        <view class="uni-input-group">
            <view class="uni-input-row">
                <text class="uni-label">邮箱：</text>
                <input type="text" focus clearable v-model="form.email" placeholder="请输入邮箱"></input>
            </view>
            <view class="uni-input-row fh-code">
                <text class="uni-label uni-flex">验证码：</text>
                <input type="text" class="uni-flex" clearable v-model="form.code" placeholder="请输入验证码"></input>
                <view class="uni-flex">
                    <button type="primary" style="white-space: nowrap;" :loading="sendLoading" :disabled="time > 0"  size="mini" @tap="sendCode">{{reFetch}}获取{{showTime}}</button>
                </view>
            </view>
            <view class="uni-input-row">
                <text class="uni-label">新密码：</text>
                <input type="password" clearable v-model="form.password" placeholder="请输入新密码"></input>
            </view>
        </view>

        <view class="fh-padding-30">
            <button type="primary" class="primary" :loading="findLoading" @tap="findPassword">提交</button>
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
                form:{
                    email: '',
                    code: '',
                    password: '',
                },
                sendLoading:false,
                findLoading:false,
                // 标识是否已获取过验证吗
                hasFetch:false,
                // 获取验证码倒计时变量
                time:-1,
                // clearInterval 返回值
                setTime:null
            }
        },
        computed:{
            reFetch (){
                return this.hasFetch? '重新':''
            },
            showTime(){
                return this.time > 0 ? ' '+ this.time : ''
            }
        },
        beforeDestroy() {
            clearInterval(this.setTime)
        },
        methods: {
            // 发送验证码
            sendCode(){
                if(!this.checkFormEmail()){
                    return
                }
                let self = this

                self.sendLoading = true;
                self.$http.post('/base/user/sendcode',{
                    type:'email',
                    identifier:self.form.email
                }).then(function (res) {
                    uni.showToast({
                        icon: 'none',
                        title: '已发送重置邮件至注册邮箱，请注意查收。',
                        duration: 3000
                    });
                    self.time = 60;

                    self.setTime = setInterval(function () {
                        self.time = self.time - 1;
                        if(self.time < 0){
                            clearInterval(self.setTime)
                        }
                    },1000)
                    self.hasFetch = true
                    self.sendLoading = false;
                }).catch(function (res) {
                    uni.showToast({
                        icon: 'none',
                        title: '发送验证码失败，请查检邮箱是否正确',
                        duration: 3000
                    });
                    self.sendLoading = false;
                })

            },
            findPassword() {
                if(!this.checkForm()){
                    return
                }
                let self = this
                self.findLoading = true;
                self.$http.put('/base/user/password/forget/find',{
                    type:'email',
                    identifier:self.form.email,
                    password: self.form.password,
                    code:self.form.code
                }).then(function (res) {
                    self.findLoading = false
                    uni.navigateBack({
                        delta: 1
                    });
                }).catch(function (res) {
                    let statusCode = res.statusCode
                    if(statusCode == 400){
                        uni.showToast({
                            icon: 'none',
                            title: '验证码不正确'
                        });
                    }else if(statusCode == 404){
                        uni.showToast({
                            icon: 'none',
                            title: '邮箱不存在'
                        });
                    }
                    self.findLoading = false
                })
            },
            checkFormEmail(){
                let rule = [
                    {name:"email", checkType : "email", checkRule:"",  errorMsg:"请输入正确的邮箱"}
                ];
                let checkRes = graceChecker.checkForm(this.form, rule);
                return checkRes
            },
            checkForm(){
                let rule = [
                    {name:"email", checkType : "email", checkRule:"",  errorMsg:"请输入正确的邮箱"},
                    {name:"code", checkType : "notnull", checkRule:"",  errorMsg:"请输入验证码"},
                    {name:"password", checkType : "password", checkRule:'',  errorMsg:"密码8~16字母数字组合"}
                ];
                let checkRes = graceChecker.checkForm(this.form, rule);
                return checkRes
            }
        }
    }
</script>

<style>

    .uni-input-row .uni-label{
        width:30%;
    }
    .uni-input-row.fh-code{
        align-items: center;
    }
    .uni-input-row.fh-code .uni-label{
        width:40%;
    }
    .uni-input-row input{
        width:100%;
    }
</style>
