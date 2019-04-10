<template>
	<view class="fh-width-100">
        <!-- 固定在顶部的导航栏 -->
        <uni-nav-bar fixed="true" :left-container="false" :right-container="false">
            <view class="uni-flex fh-align-items-center fh-justify-content-center fh-height-100  fh-width-100">
                <view class="fh-search-view uni-flex fh-align-items-center" @tap="goSearch">
                    <view class="uni-swiper-msg">
                        <view class="uni-swiper-msg-icon  uni-flex fh-align-items-center">
                            <uni-icon type="search" size="22" color="#666666"></uni-icon>
                        </view>
                        <view v-if="keyword">{{keyword}}</view>
                        <swiper v-else vertical="true" autoplay="true" circular="true" interval="9000">
                            <swiper-item>
                                aaaa
                            </swiper-item>
                            <swiper-item>
                                bbbb
                            </swiper-item>
                        </swiper>
                    </view>

                </view>

            </view>

        </uni-nav-bar>
        <!-- 使用非原生导航栏后需要在页面顶部占位 -->
        <view style="height:80px;"></view>
        <image class="logo" src="../../static/logo.png"></image>
		<view>
            <text class="title">{{title}}</text>
        </view>
	</view>
</template>

<script>
    import uniNavBar from '@/components/uni-nav-bar.vue'
    import uniIcon from '@/components/uni-icon.vue'
	export default {
        components: {
            uniNavBar,
            uniIcon
        },
		data() {
			return {
			    keyword:'',
				title: 'Hello'
			}
		},
		onLoad() {
            console.log('onLoad index')
            this.pageLogical()
		},
        onReady() {
            console.log('onReady index')
        },
        onPullDownRefresh(){
            console.log('refresh');
            setTimeout(function () {
                uni.stopPullDownRefresh();
            }, 1000);
        },
        methods: {

            // 以下是搜索相关 ***************************
            // 跳转到搜索页面
            goSearch(){
                let self = this
                this.$bus.$off('indexSearch')
                this.$bus.$on('indexSearch',function (data) {
                    self.doSearch(data)
                })
                this.$utils.n.ngt('/pages/search/search?searchType=index&keyword=' + this.keyword)
            },
            doSearch(data){
                this.keyword = data.keyword
                // 执行搜索
            },

            // 以下是页面跳转相关逻辑 ***************************
            pageLogical(){
                let self = this
                let splashShowed = this.$storageUtils.getSync('splashShowed')
                // 先判断引导页是否需要展示，如果需要展示，展示引导页
                if(!splashShowed){
                    uni.reLaunch({
                        url:'/pages/splash/splash'
                    })
                }else{
                    this.$http.hasLogin().then(function () {
                        // 已登录
                        // 首页数据处理
                        //
                        self.navigateToPage()
                    }).catch(function (res) {
                        console.log(res);
                        // 未登录
                        if(self.$config.forcedLogin){
                            uni.reLaunch({
                                url: '/pages/login/login'
                            });
                        }
                    })
                }
            },
            // 是否需要导航，一般分享的用到
            navigateToPage(){
                let page = uni.getStorageSync('navigateToPage')
                uni.removeStorageSync('navigateToPage')
                if(page){
                    this.$utils.n.ngt(page)
                }
            }
        },
        watch:{

        }
	}
</script>

<style>
    .fh-search-view {
        width: 50%;
        display: flex;
        background-color: #e7e7e7;
        height: 30px;
        border-radius: 15px;
        padding: 0 4%;
        flex-wrap:nowrap;
        margin:7px 0;
        line-height:30px;
    }
    swiper{
        font-size: 16px;
    }
</style>
