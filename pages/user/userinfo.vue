<template>
    <view class="uni-column uni-flex uni-flex-item">
        <view class="uni-list">
            <view class="uni-list-cell-divider">

            </view>
            <view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
                <view class="uni-list-cell-navigate uni-navigate-right  uni-media-list  uni-pull-right">

                        <view class="uni-media-list-logo">
                            <image v-if="userinfo.photo" :src="$config.file.getDownloadUrl(userinfo.photo)"></image>
                        </view>
                        <view class="uni-media-list-body fh-justify-content-center">
                            <view class="uni-media-list-text-top">头像</view>
                        </view>
                </view>
            </view>
            <view class="uni-list-cell-divider">

            </view>
            <view class="uni-list-cell" hover-class="uni-list-cell-hover">
                <view class="uni-list-cell-navigate">
                    昵称
                    <view>{{userinfo.nickname}}</view>
                </view>
            </view>

        </view>
        <view class="fh-padding-30">
            <button v-if="hasLogin" type="default" @tap="logoutBtnClick">退出登录</button>
        </view>
    </view>
</template>

<script>
    import uniBadge from "@/components/uni-badge.vue";
    export default {
        components:{uniBadge},
        data () {
            return {
                hasLogin: false,
                userinfo: {
                }
            }
        },
        computed: {
        },
        onLoad () {
            let self = this
            self.$http.getCurrentUserinfo().then(function (content) {
                self.userinfo = content
            })
            self.$http.hasLogin().then(function (content) {
                self.hasLogin = true
            })
        },
        methods: {
            logoutBtnClick() {

                let self = this
                uni.showModal({
                    title: '您点击了退出按钮',
                    content: '确认要退出吗',
                    /**
                     * 如果需要强制登录，不显示取消按钮
                     */
                    showCancel: true,
                    success: (res) => {
                        if (res.confirm) {
                            //退出登录
                            self.$http.post('/logout').then(function () {
                                /**
                                 * 如果需要强制登录跳转回登录页面
                                 */
                                if (self.$config.forcedLogin) {
                                    uni.navigateTo({
                                        url: '/pages/login/login',
                                    });
                                }else{
                                    uni.reLaunch({
                                        url: '/pages/index/index',
                                    });
                                }
                            })
                        }
                    }
                });
            }
        }
    }
</script>

<style>

</style>
