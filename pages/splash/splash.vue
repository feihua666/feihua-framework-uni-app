<template>
	<swiper class="swiper fh-height-100" :indicator-dots="indicatorDots" @change="change" :autoplay="autoplay" :interval="interval" :duration="duration">sssss
		<swiper-item>
			<view class="swiper-item uni-bg-red fh-height-100">A</view>
		</swiper-item>
		<swiper-item>
			<view class="swiper-item uni-bg-green fh-height-100">B</view>
		</swiper-item>
		<swiper-item>
			<view class="swiper-item uni-bg-blue fh-height-100">
				<text class="uni-link" style="margin-bottom: 200upx" @tap="goIndex">立即体验</text>
			</view>
		</swiper-item>
	</swiper>
</template>

<script>
    import {
        mapState,
        mapMutations
    } from 'vuex'
	export default {
        computed: mapState(['splash']),
		data() {
			return {
                indicatorDots: false,
                autoplay: false,
                interval: 2000,
                duration: 500
			};
		},
		methods:{
            ...mapMutations(['setSplash']),
			goIndex(){
                this.setSplash(false)
				uni.setStorageSync('splashShowed',true)
                uni.reLaunch({
                    url:'/pages/index/index'
                })
			},
		    change(e){
			}
		},
		onLoad(){
            console.log('onLoad splash')
            let splashShowed = uni.getStorageSync('splashShowed')
			if(splashShowed){
                this.setSplash(false)
			}
		    let showSplash = this.splash
			if(!showSplash){
                uni.reLaunch({
                    url:'/pages/index/index'
                })
			}
		}
	}
</script>

<style>
	.swiper {
		width: 100%;
		position: absolute;
	}
	swiper-item {
		display: block;
		text-align: center;
	}
	.swiper-item{
		display: flex;
		flex-direction: column-reverse;
	}
</style>
