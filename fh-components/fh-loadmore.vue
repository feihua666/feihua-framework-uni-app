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
		},
		data() {
			return {
                loadMore:{
                    loadingType:0
                },
                page:{
                    pageNo:1,
                    pageSize:10
                }
			};
		},
		methods:{
            // options.pullDownRefresh = true 是下拉刷新，否则为上拉触底加载更多
            loadData(url,options){
                let self = this
                if(options.pullDownRefresh == true){
                    self.page.pageNo =1
                }else {
                    if (self.loadMore.loadingType !== 0) {
                        return;
                    }
                    self.page.pageNo =  self.page.pageNo + 1
                }

                self.loadMore.loadingType = 1;
                let requestPage = {
                    pageNo:self.page.pageNo
				}
				let responsePage = {
                    pageNum: 0
                }

                let _data = options.data
                if(!_data){
                    _data = {}
                }
                _data.pageNo = self.page.pageNo
                _data.pageSize = self.page.pageSize
                return new Promise((resolve, reject) => {
                    self.$http.get(url,_data).then(function (res) {
                        responsePage.pageNum = res.data.data.page.pageNum
                        if(options.pullDownRefresh == true){
                            uni.stopPullDownRefresh();
                        }
                        if(responsePage.pageNum <= requestPage.pageNo){
                            self.loadMore.loadingType = 2;
                        }else{
                            self.loadMore.loadingType = 0;
                        }
                        resolve(res)
                    }).catch(function (res) {
                        if(options.pullDownRefresh == true){
                            uni.stopPullDownRefresh();
                        }
                        if(responsePage.pageNum <= requestPage.pageNo){
                            self.loadMore.loadingType = 2;
                        }else{
                            self.loadMore.loadingType = 0;
                        }
                        reject(res)
                    })
                })

			}
		}
	}
</script>

<style>

</style>
