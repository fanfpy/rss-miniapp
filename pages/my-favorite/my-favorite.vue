<template>
	<view>
		<view class="wrap">
			<view class="item" v-for="(item,index) in entry" @click="openArticle(item.id)" hover-class="hover-class" :key="index">
				<u-row>
					<u-col v-bind:span="(item.image_url==null||item.image_url=='')?12:8">
						<view class="item-child u-line-2 item-child-title">{{item.title}}</view>
						<view class="item-child u-line-1 item-child-subtitle">
							<image :src="item.icon_url" style="width: 32rpx;height: 32rpx;vertical-align: middle;">
							</image>
							<text style="margin: auto 10rpx;"> · </text>
							<text>{{item.feed_name}}</text>
							<text style="margin: auto 10rpx;"> · </text>
							<text>{{item.todo}}</text>
						</view>
						<view class="item-child u-line-2">{{item.sub_title}}</view>
					</u-col>
					<u-col v-if="(item.image_url !=null && item.image_url !='')" span="4">
						<image class="item-right-image" v-bind:src="item.image_url" mode="aspectFill"></image>
					</u-col>
				</u-row>
			</view>
	
			<view class="card-foot" slot="foot">
				<u-loading mode="circle" :show="isLoading"></u-loading>
			</view>
	
	
		</view>
	
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				page: 1,
				entry: [],
				isLoading: false,
				count: 0
			}
		},
		onLoad(){
			uni.startPullDownRefresh()
		},
		
		onPullDownRefresh() {
			console.log('-------下拉刷新--------')
			var that = this;
			// that.$u.api.UpdateRssEntry({
			// 		u_id: getApp().globalData.u_id
			// 	})
			// 	.then(res => {
			// 		that.entry = [],
			// 			that.page = 1,
			// 			that.getData(that.page)
			// 	}).catch(() => {
			// 		that.entry = [],
			// 			that.page = 1,
			// 			that.getData(that.page)
			// 	})
			that.entry = []
			this.getData(this.page)
		},
		onReachBottom() {
			
			//上拉 翻页
			this.page = this.page + 1;
			this.getData(this.page)
		},
		methods: {
			openArticle(e) {
				this.$u.route({
					url: 'pages/article/article',
					params: {
						id: e
					}
				})
			},
			getData(page) {
				var that = this
				//展示首页数据
				that.isLoading = true;
			
				that.$u.api.RssEntry({
					u_id: getApp().globalData.u_id,
					page: page,
					is_favorite:1
				}).then(res => {
					that.entry = that.entry.concat(res.data)
					// that.count = res.count
					uni.stopPullDownRefresh()
					that.isLoading = false
				})
			
			},
			
		}
	}
</script>

<style>
	
	page{
		background-color: rgb(245,245,245);
		// background-color: #ededed;;
	}
	
	.wrap {
		/* padding: 24rpx auto; */
		/* line-height: 1.5rem; */
		min-height: 100vh;
		width: 100%;
		padding: 7rpx 19rpx;
	}

	.hover-class {
		background-color: rgb(235, 237, 238);
	}

	.item-child {
		margin: 13rpx 0rpx;
	}

	.item-child-title {
		font-size: 1.2rem;
	}

	.item-child-subtitle {
		color: #5e6d82;
		font-size: 0.75rem;
		line-height: 1.8rem;
	}


	.item-right-image {
		width: 100%;
		height: 250rpx;
		border-radius: 11rpx;
		vertical-align: middle;
	}

	.card-foot {
		text-align: center;
		margin: 0 auto;
	}

	.item {
		padding: 22rpx 17rpx;
		border: #e2e3e6 solid 1rpx;
		margin: 27rpx 0rpx;
		border-radius: 21rpx;
		background-color: rgb(255,255,255);
	}
	@media (prefers-color-scheme: dark) {
	
		/* DarkMode 下的样式 start */
		page {
			background-color: #000000;
		}
		.item {
			padding: 22rpx 17rpx;
			border: #2b2b2b solid 1rpx;
			margin: 27rpx 0rpx;
			border-radius: 21rpx;
			background-color: #1c1c1c;
		}
		
		.item-child-title {
			font-size: $uni-font-size-title;
			color: #c3c3c3;
			line-height: 140%;
		}
		
		.item-child-title-read {
			font-size: $uni-font-size-title;
			color: #999999;
			line-height: 150%;
		}
		
		.item-child-author {
			color: $uni-font-size-subtitle;
			font-size: 0.75rem;
			line-height: 1.8rem;
			color: #c3c3c3;
		}
		
		.item-child-subtitle {
			color: #858f9a;
			line-height: 140%;
		}
		
		
	}
</style>
