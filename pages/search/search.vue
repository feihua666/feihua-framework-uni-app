<template>
	<view class="uni-flex uni-flex-item uni-column">
		<view class="fh-search-view uni-flex width100 padding30 justify-content-space-between" >
			<view style="width:80%;">
				<input type="text" focus class="uni-input padding0"  placeholder="关键字" v-model="form.keyword" @confirm="doSearch"
					   placeholder-class="placeholder-class" confirm-type="search">
			</view>
			<view style="width:15%;" class="uni-link" @tap="doSearch">{{action == 's' ? '搜索':'取消'}}</view>

		</view>
		<view class="height100">
			<view v-if="oldKeywordList.length>0">
				<view class="uni-flex justify-content-space-between padding30">
					<text>历史搜索</text>
					<view>
						<uni-icon type="trash" @tap="oldDelete"></uni-icon>
					</view>
				</view>
				<view>
					<view class="tag-view" v-for="key in oldKeywordList">
						<uni-tag size="small" :text="key" @tap="form.keyword = (key)"></uni-tag>
					</view>
				</view>
			</view>
		</view>

	</view>
</template>

<script>
    import uniTag from '@/components/uni-tag.vue'
    import uniIcon from '@/components/uni-icon.vue'
    import UniIcon from "../../components/uni-icon";

    export default {
        components: {
            UniIcon,
            uniTag
        },
	    computed:{
	      action(){
	          if(this.form.keyword != null && this.form.keyword.length  > 0 || this.initKeyword != this.form.keyword){
	              return 's'
			  }
	          return 'c'
		  }
		},
		data() {
			return {
				form:{
				    //标识是否执行搜索，如果未改变搜索条件为false
				    isSearch:false,
					searchType:'',
					storeMutation:'setSearch',
                    keyword:''
				},
				initKeyword:'',
                oldKeywordList:[],
				//上个页面的参数
				option:null
			};
		},
        onLoad(option) {

	        this.option = option
	        this.form.keyword = option.keyword
	        this.initKeyword = option.keyword
			this.form.isSearch = false
			this.form.searchType = option.searchType
			if(option.storeMutation){
                this.form.storeMutation = option.storeMutation
            }

            this.loadOldKeyword();
        },
		methods:{
	        doSearch(){
	            let data = this.form
                if(this.action == 's'){
                    this.form.isSearch = true
					this.$store.commit(this.form.storeMutation,this.form);
                    this.saveKeyword(this.form.keyword)
                    uni.navigateBack({
                        delta: 1
					})
                }else{
                    this.$store.commit(this.form.storeMutation,this.form);
                    uni.navigateBack({
                        delta: 1
                    })
                }
			},
            //加载历史搜索,自动读取本地Storage
            loadOldKeyword() {
                uni.getStorage({
                    key: 'OldKeys',
                    success: (res) => {
                        var OldKeys = JSON.parse(res.data);
                        this.oldKeywordList = OldKeys;
                    }
                });
            },
            //清除历史搜索
            oldDelete() {
                uni.showModal({
                    content: '确定清除历史搜索记录？',
                    success: (res) => {
                        if (res.confirm) {
                            console.log('用户点击确定');
                            this.oldKeywordList = [];
                            uni.removeStorage({
                                key: 'OldKeys'
                            });
                        } else if (res.cancel) {
                            console.log('用户点击取消');
                        }
                    }
                });
            },
            //保存关键字到历史记录
            saveKeyword(keyword) {
                uni.getStorage({
                    key: 'OldKeys',
                    success: (res) => {
                        console.log(res.data);
                        var OldKeys = JSON.parse(res.data);
                        var findIndex = OldKeys.indexOf(keyword);
                        if (findIndex == -1) {
                            OldKeys.unshift(keyword);
                        } else {
                            OldKeys.splice(findIndex, 1);
                            OldKeys.unshift(keyword);
                        }
                        //最多10个纪录
                        OldKeys.length > 10 && OldKeys.pop();
                        uni.setStorage({
                            key: 'OldKeys',
                            data: JSON.stringify(OldKeys)
                        });
                        this.oldKeywordList = OldKeys; //更新历史搜索
                    },
                    fail: (e) => {
                        var OldKeys = [keyword];
                        uni.setStorage({
                            key: 'OldKeys',
                            data: JSON.stringify(OldKeys)
                        });
                        this.oldKeywordList = OldKeys; //更新历史搜索
                    }
                });
            }
		}
	}
</script>

<style lang="scss">
.fh-search-view{
	background-color: $uni-bg-color-grey;
}
</style>
<style>
	.tag-view {
		margin: 10upx 20upx;
		display: inline-block;
	}
</style>