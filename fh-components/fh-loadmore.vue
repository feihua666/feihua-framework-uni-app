<template>
	<view>
		<slot></slot>
		<uni-load-more :loadingType="loadMore.loadingType"></uni-load-more>
	</view>
</template>

<script>
    import uniLoadMore from '@/components/uni-load-more.vue'
	export default {
        components: {
            uniLoadMore
        },
		props:{
            success: null
		},
		data() {
			return {
                loadMore:{
                    loadingType:0
                }
			};
		},
		methods:{
            // options.pullDownRefresh = true 是下拉刷新，否则为卡拉触底加载更多
            loadData(url,options){
                let self = this
                if (self.loadMore.loadingType !== 0) {
                    return;
                }
                self.loadMore.loadingType = 1;
                let requestPage = {
                    pageNo:options.data.pageNo
				}
				let responsePage = {
                    pageNum: 0
                }

				self.$http.get(url,{
				    data:options.data,
					success:function (res) {
				        responsePage.pageNum = res.data.data.page.pageNum
						if(options.success && typeof options.success == 'function'){
                            options.success(res)
						}
                    },
					fail:function (res) {
                        if(options.fail && typeof options.fail == 'function'){
                            options.fail(res)
                        }
                    },
					complete:function (res) {
                        if(options.complete && typeof options.complete == 'function'){
                            options.complete(res)
                        }
                        if(options.pullDownRefresh == true){
                            uni.stopPullDownRefresh();
						}
                        if(responsePage.pageNum <= requestPage.pageNo){
                            self.loadMore.loadingType = 2;
                        }else{
                            self.loadMore.loadingType = 0;
                        }
                    }
				})
			}
		}
	}
</script>

<style>

</style>
