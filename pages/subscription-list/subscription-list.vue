<template>
	<view>

		<view class="content">
			<view style="margin: 0rpx auto;text-align: center;">
				<u-loading :show="showLoading" mode="circle"></u-loading>
			</view>
			<!-- <u-card margin="0rpx" title="订阅列表"> -->
			<view class="card-class" >
				<u-card margin="0rpx" title="订阅列表" title-size="50">
					<view class="u-card" slot="body">
						<view class="u-body-item u-flex u-border-bottom u-col-between" hover-class="hover-class" c
							v-for="(item,index) in feed_list" @click="openInfo(item.id)" :key="index">
							<view class="item">
								<view class="u-body-item-title u-line-1">
									<u-icon :name="item.icon_url" size="28" style="margin:7rpx;"></u-icon>
									{{item.title}}
								</view>
								<view class="u-body-item-source u-line-2">{{item.subtitle==null?'':item.subtitle}}</view>
							</view>
						</view>
					</view>
				</u-card>
			</view>
			
		</view>
		<!-- <view class="add-button">
			<u-button @click="openAppsubscribe">添加订阅</u-button>
		</view> -->
		<u-toast ref="uToast" />

	</view>

</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello',
				feed_list: [],
				showLoading: false,
				page: 1
			}
		},
		onLoad() {
			var that = this;
			console.log('首页开始初始化')

			//that.getData(that.page)
		},
		onPullDownRefresh() {
			//下拉刷新
			this.feed_list = []
			this.page = 1
			this.getData(this.page)
		},
		onReachBottom() {
			//上拉 翻页
			this.page = this.page + 1;
			this.getData(this.page)
		},
		onShow() {
			uni.startPullDownRefresh()
		},
		methods: {

			openAppsubscribe() {
				this.$u.route({
					url: 'pages/add_subscribe/add_subscribe'
				})
			},

			openInfo(id) {
				this.$u.route({
					url: 'pages/subscription-info/subscription-info',
					params: {
						id: id
					},
				})
			},

			getData(page) {
				var that = this
				//展示数据
				that.showLoading = true;
				that.$u.api.feedListByUid({
					u_id: getApp().globalData.u_id,
					page: page
				}).then(res => {
					that.feed_list = that.feed_list.concat(res.data)
					uni.stopPullDownRefresh()
					that.showLoading = false
				})


			},
		}
	}
</script>

<style>
	page{
		background-color: #f5f5f5;
		/* // background-color: #ededed;; */
	}
	.content{
		/* margin-bottom: 120rpx; */
		min-height: 100vh;
		width: 100%;
		padding: 7rpx 19rpx;
	}
	.navbar-right {
		margin-right: 24rpx;
		display: flex;
	}

	.right-item {
		margin: 0 12rpx;
		position: relative;
		color: #ffffff;
		display: flex;
	}
	

	/* .u-card-wrap {
		background-color: $u-bg-color;
		padding: 1px;
	} */

	.u-body-item {
		/* font-size: 32rpx;
		color: #333; */
		padding: 20rpx 10rpx;
	}

	.u-body-item-source {
		color: #909399;
		font-size: 26rpx;
	}

	.u-body-item-title {
		color: rgb(48, 49, 51);
		font-weight: bold;
		font-size: 36rpx;
	}

	.u-body-item-body {
		color: #909399;
		font-size: 33rpx;
	}

	/* 	.u-body-item image {
		width: 120rpx;
		flex: 0 0 120rpx;
		height: 120rpx;
		border-radius: 8rpx;
		margin-left: 12rpx;
	} */
	.hover-class {
		background-color: rgb(235, 237, 238);
	}

	.add-button {
		position: fixed;
		margin: auto;
		left: 0;
		right: 0;
		bottom: 50rpx;
		width: 600rpx;
		/* background: red; */
		text-align: center;
		opacity: 1;
	}
	.item{
		padding: 17rpx 0rpx;
				border-color: #e2e3e6;
				border-radius: 21rpx;
				background-color: rgb(255,255,255);
				width: 100%;
	}
	@media (prefers-color-scheme: dark) {
		page{
			 background-color: #111111;
			 /* color: #c3c3c3; */
		}
		.card-class{
			filter: invert(1) hue-rotate(180deg);
		}
		page image{
			filter: invert(1) hue-rotate(180deg);
		}
	}
</style>
