<template>
	<view>
		<view class="content u-skeleton">

			<view class="u-skeleton-fillet u-title" :style="'font-size: '+redaConfig.titleSize+'rpx;'">
				{{article_data.titie}}
			</view>

			<view class="u-skeleton-fillet sub-title">{{article_data.feed_name}} · {{article_data.publishingDate}}
			</view>


			<view class="u-skeleton-fillet u-content"
				:style="'font-size: '+redaConfig.contentSize+'rpx !important;line-height:'+redaConfig.lineHeight+' !important;'">
				<u-parse :html="article_data.content" :selectable="true" :lazy-load="true" :loading-img="loadingimg">
				</u-parse>
			</view>
		</view>
		<u-divider></u-divider>

		<button open-type="share"></button>
		<!--引用组件-->
		<u-skeleton :loading="loading" :animation="true" :bgColor="bgColor" :el-color="elcolor"></u-skeleton>


		<view class="my-tabbar">


			<view class="fooer-icon">
				<image v-if="article_data.is_read == 0" src="/static/unread.png" @click="updateReadState"></image>
				<image v-else src="/static/read.png" @click="updateReadState"></image>
			</view>

			<view class="fooer-icon">
				<image v-if="article_data.is_favorite == 0" src="/static/shoucang.png" @click="fabulousClick"></image>
				<image v-else src="/static/shoucangshixin.png" @click="fabulousClick"></image>
			</view>

			<view class="fooer-icon">
				<image src="/static/down.png" @click="nextClick"></image>
			</view>

			<view class="fooer-icon">
				<image src="/static/share.png"></image>
				<button open-type="share" class="my-share">
				</button>
			</view>
			<view class="fooer-icon">
				<image src="/static/link.png" @click="copyLink"></image>
			</view>

		</view>

		<u-toast ref="uToast" />
	</view>


</template>

<script>
	import tool from "../../common/tool.js";
	export default {
		data() {
			return {
				article_data: null,
				loading: true,
				current: 0,
				eid: null,
				loadingimg: '/static/loading.jpg',
				// 骨架图背景色
				bgColor: wx.getSystemInfoSync().theme == 'dark' ? '#111111' : '#F5F5F5',
				elcolor: wx.getSystemInfoSync().theme == 'dark' ? '#999999' : '#F5F5F5',
				redaConfig: {
					titleSize: 48,
					lineHeight: 1.9,
					contentSize: 32
				},
				recentposition:0
			}
		},

		async onLoad(eid) {
			// console.log(eid)
			console.log(`-------------文章id${eid.id}---------`)
			console.log(eid)


			try {
				const value = uni.getStorageSync('redaConfig');
				if (value) {
					this.redaConfig = value
				}
			} catch (e) {
				// error
			}

			var that = this
			that.eid = eid.id
			console.log(`-------------请求参数---------`)
			console.log({
				u_id: getApp().globalData.u_id,
				eid: eid.id
			})

			 that.getDate(that.eid)
			// let ret = await that.$u.api.RssEntryBySingle({
			// 	u_id: getApp().globalData.u_id,
			// 	eid: eid.id
			// });

			// that.article_data = ret.data
			// setTimeout(() => {
			// 	that.loading = false;
			// }, 300)

		},

		onReady() {
			// var that = this
			// console.log(that.article_data)
			// setTimeout(()=>{
			// 	uni.setNavigationBarTitle({
			// 	    title: that.article_data.titie
			// 	});
			// },300)
		},
		onShareAppMessage(res) {
			var that = this
			console.log(res)
			if (res.from === 'button') { // 来自页面内分享按钮 
				console.log(res.target)
			}
			return {
				title: that.article_data.titie,
				path: `/pages/article/article?id=${that.eid}`
			}

		},

		onShareTimeline(res) {
			var that = this
			return {
				title: that.article_data.titie,
				query: `id=${that.eid}`
			}

		},

		onPageScroll: tool.debounce(function(e) {
			console.log('---------- 滚动位置---------')
			var that = this
			//更新阅读位置				
			that.recentposition = e[0].scrollTop
		}, 100),

		onUnload() {
			console.log('------------页面销毁------------')
			var that = this
			//更新阅读位置
			that.$u.api.UpdateReadPosition({
				u_id:getApp().globalData.u_id,
				feid: that.eid,
				position:that.recentposition});
		},

		methods: {
			fabulousClick() {
				var that = this
				this.$u.api.UpdateFavorite({
					feid: that.eid,
					u_id: getApp().globalData.u_id
				}).then(res => {
					that.article_data.is_favorite = that.article_data.is_favorite == 1 ? 0 : 1
				})
			},
			copyLink() {
				var that = this
				uni.setClipboardData({
					data: that.article_data.link,
					success: function() {
						console.log('copy success');
					}
				});
			},
			updateReadState() {
				var that = this
				this.$u.api.UpdateReadState({
					feid: that.eid,
					u_id: getApp().globalData.u_id
				}).then(res => {
					that.article_data.is_read = that.article_data.is_read == 1 ? 0 : 1
				})
			},
			nextClick() {
				//翻页
				var that = this
				// var next_eid = that.enty_data[1].id
				// that.onLoad({
				// 		id: next_eid,
				// 		index:enty_data_index,
				// 		entry_data:that.entry
				//})


				const read_list = uni.getStorageSync('read_list');
				if (read_list) {
					var data = read_list.find(it => it.id == that.eid);
					var next_index = read_list.indexOf(data) + 1;
				 	 that.getDate(read_list[next_index].id)
					
				}
			},
			async getDate(eid) {
				var that = this;
				let ret = await that.$u.api.RssEntryBySingle({
					u_id: getApp().globalData.u_id,
					eid: eid
				});
				that.eid = eid
				that.article_data = ret.data
				
				setTimeout(() => {
					uni.pageScrollTo({
						scrollTop: ret.data.position,
						duration: 0
					});
					that.loading = false;
				}, 300)
			}
		}
	}
</script>

<style lang="scss">
	.content {
		padding: 20rpx 40rpx;
		word-wrap: break-word;
	}

	.u-content {
		// line-height: 1.8rem;
		margin-top: 70rpx !important;
		min-height: 1000rpx;
		margin-bottom: 170rpx;
		font-size: 32rpx !important;
		cursor: auto !important;
		color: #575757;
		line-height: 1.8rem !important;
	}

	.u-title {
		margin: 0.6em 0 0.3em;
		font-size: 48rpx;
		line-height: 1.6em;
		min-height: 120rpx;
		letter-spacing: .02em;
		line-height: 1.7;
		cursor: auto !important;
	}

	.sub-title {
		font-weight: 400;
		margin-top: 20rpx;
		font-size: 28rpx;
		color: rgba(0, 0, 0, .5);
		display: block;
		height: 1em;

	}

	.my-tabbar {
		position: fixed;
		bottom: 0;
		padding-bottom: constant(safe-area-inset-bottom);
		/* 兼容 iOS < 11.2 */
		padding-bottom: env(safe-area-inset-bottom);
		/* 兼容 iOS >= 11.2 */
		width: 100%;
		height: 90;
		display: flex;
		border-top: #C0C4CC solid 1rpx;
		background-color: #ffffff;
		z-index: 999;
	}

	.fooer-icon {
		flex: 1;
		text-align: center;
		margin-top: 5rpx;
	}



	.my-share {
		position: absolute;
		top: 0;
		opacity: 0;
		width: 20% !important;
		height: 100% !important;
		z-index: 999;
		margin: 0rpx 50rpx;
	}

	.fooer-icon image {
		width: 61rpx;
		height: 61rpx;
	}

	@media (prefers-color-scheme: dark) {

		/* DarkMode 下的样式 start */
		.u-content {
			// line-height: 1.8rem;
			margin-top: 70rpx !important;
			min-height: 1000rpx;
			margin-bottom: 170rpx;
			font-size: 32rpx !important;
			cursor: auto !important;
			color: #c3c3c3;
			line-height: 1.8em !important;
		}

		.u-title {
			margin: 0.6em 0 0.3em;
			font-size: 48rpx;
			line-height: 1.6em;
			min-height: 120rpx;
			letter-spacing: .02em;
			line-height: 1.7;
			cursor: auto !important;
			color: #c3c3c3;
		}

		.sub-title {
			font-weight: 400;
			margin-top: 20rpx;
			font-size: 28rpx;
			color: #999999;
			display: block;
			height: 1em;

		}

		.my-tabbar {
			position: fixed;
			bottom: 0;
			padding-bottom: constant(safe-area-inset-bottom);
			/* 兼容 iOS < 11.2 */
			padding-bottom: env(safe-area-inset-bottom);
			/* 兼容 iOS >= 11.2 */
			width: 100%;
			height: 90;
			display: flex;
			border-top: #C0C4CC solid 1rpx;
			background-color: #111111;
			z-index: 999;
		}

		.fooer-icon image {
			width: 61rpx;
			height: 61rpx;
			filter: invert(1) hue-rotate(180deg);
		}

		/* DarkMode 下的样式 end */
	}
</style>
