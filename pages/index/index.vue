<template>
	<view class="width100">
        <!-- 固定在顶部的导航栏 -->
        <uni-nav-bar fixed="true" :left-container="false" :right-container="false">
            <view class="uni-flex align-items-center justify-content-center height100  width100">
                <view class="fh-search-view uni-flex align-items-center" @tap="goSearch">
                    <view class="uni-swiper-msg">
                        <view class="uni-swiper-msg-icon">
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
        <view style="height:80px;">...</view>
        <image class="logo" src="../../static/logo.png"></image>
		<view>
            <text class="title">{{title}}</text>
        </view>
	</view>
</template>

<script>
    import {
        mapState
    } from 'vuex'
    import uniNavBar from '@/components/uni-nav-bar.vue'
    import uniIcon from '@/components/uni-icon.vue'
	export default {
        components: {
            uniNavBar,
            uniIcon
        },
        computed: mapState(['forcedLogin', 'hasLogin','userinfo','search']),
		data() {
			return {
			    keyword:'',
				title: 'Hello'
			}
		},
		onLoad() {
            console.log('onLoad index')
            console.log(this.hasLogin);
            if (!this.hasLogin) {
                if(this.forcedLogin){
                    uni.navigateTo({
                        url: '/pages/login/login'
                    });
                }
            }
		},
		methods: {

            goSearch(){
                uni.navigateTo({
                    url: '/pages/search/search?searchType=index&keyword=' + this.keyword
                });
            }
		},
        watch:{
            search (search){
                if(search.isSearch && 'index' == search.searchType){
                    console.log(search)
                }
                this.keyword = search.keyword
            }
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
</style>
