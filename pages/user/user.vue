<template>
    <view class="uni-column uni-flex uni-flex-item">
        <view class="uni-list">
            <view class="uni-list-cell-divider">

            </view>
            <view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
                <view class="uni-list-cell-navigate uni-navigate-right"   @click="$utils.n.ngt('/pages/user/userinfo')">
                        <view class="uni-media-list-logo">
                            <image v-if="userinfo.photo" :src="$config.file.getDownloadUrl(userinfo.photo)"></image>
                        </view>
                        <view class="uni-media-list-body">
                            <view class="uni-media-list-text-top">{{userinfo.nickname}}</view>
                            <view class="uni-media-list-text-bottom uni-ellipsis">{{userinfo.account}}</view>
                        </view>
                </view>
            </view>
            <view class="uni-list-cell-divider">

            </view>
            <view class="uni-list-cell" hover-class="uni-list-cell-hover">
                <view class="uni-list-cell-navigate">
                    Item2
                    <uni-badge text="1" type="danger"></uni-badge>
                </view>
            </view>
            <view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
                <view class="uni-list-cell-navigate">
                    Item1
                    <uni-badge text="123" type="success"></uni-badge>
                </view>
            </view>
            <view class="uni-list-cell-divider">
                右侧带数字角标+箭头
            </view>
            <view class="uni-list-cell" hover-class="uni-list-cell-hover">
                <view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
                    Item1
                    <uni-badge text="123" type="success"></uni-badge>
                </view>
            </view>
            <view class="uni-list-cell uni-list-cell-last" hover-class="uni-list-cell-hover">
                <view class="uni-list-cell-navigate uni-navigate-right uni-navigate-badge">
                    Item2
                    <uni-badge text="12" type="primary"></uni-badge>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    import uniBadge from "@/components/uni-badge.vue";
    export default {
        components:{uniBadge},
        data () {
            return {
                userinfo: {}
            }
        },
        computed: {
        },
        methods: {

        },
        onLoad () {
            let self = this
            self.$http.getCurrentUserinfo().then(function (content) {
                self.userinfo = content
            })
        }
    }
</script>

<style>

</style>
