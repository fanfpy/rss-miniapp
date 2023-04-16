<template>
	<view v-if="render">
		<view @touchstart="touchStart" @touchend="touchEnd">
			<!-- 自定义导航栏 -->
			<u-navbar :is-back="false" :title="title==''?'全部文章':title" :background="background" :border-bottom="false">
				<view class="slot-wrap">
					<view @click="showMenuCilck" style="width: 44px;height: 44px; display: flex;">
						<u-icon name="list" size="48"></u-icon>
					</view>
				</view>
			</u-navbar>

			<!-- 顶部提示 -->
			<u-top-tips ref="uTips" :navbar-height="statusBarHeight + navbarHeight"></u-top-tips>

			<u-popup v-model="showMenu" width="85%" :custom-style="popupCustomStyle">

				<view class="popup">
					<view class="user-box u-p-l-30 u-p-r-20 u-p-b-10" style="text-align: center;padding-top: 120rpx;">
						<view class="u-m-r-10">
							<u-avatar src="/static/dingyue.png" size="160"></u-avatar>
						</view>
					</view>

					<view class="my-block">

						<u-cell-item icon="list" title="全部文章" @click="ClickByFid({feedId:'',feedName:'全部文章'})">
						</u-cell-item>

						<u-cell-group v-for="(item,index) in feed_list" :key="index">
							<!-- <u-cell-group :title="item.groupName" v-for="(item,index) in feed_list" :key="index"> -->
							<u-cell-item v-for="(itemmin,i) in item.items" :key="i" :icon="itemmin.feedIcon"
								:title="itemmin.feedName" @click="ClickByFid(itemmin)">
								<u-tag :text="itemmin.unread" slot="right-icon" shape="circle" type="info" />
							</u-cell-item>
						</u-cell-group>
					</view>

					<ad unit-id="adunit-cac070c662dc8bbb" ad-intervals="30"></ad>

				</view>



			</u-popup>

			<uni-row class="demo-uni-row">
				<uni-col :xs="24" :sm="8" :md="6" :lg="6" :xl="6">
					<!-- 首页 -->
					<view class="wrap">
						<view class="item" v-for="(item,index) in entry" @click="openArticle(item.id,index)"
							hover-class="hover-class" :key="index">
							<u-row>
								<u-col v-bind:span="(item.image_url==null||item.image_url=='')?12:8">
									<view
										v-bind:class=" item.is_read==0?'item-child u-line-2 item-child-title':'item-child u-line-2 item-child-title-read'">
										{{item.title}}
									</view>
									<view class="item-child u-line-1 item-child-author">
										<image :src="item.icon_url"
											style="width: 32rpx;height: 32rpx;vertical-align: middle;">
										</image>
										<text style="margin: auto 10rpx;"> · </text>
										<text>{{item.feed_name}}</text>
										<text style="margin: auto 10rpx;"> · </text>
										<text>{{item.todo}}</text>
									</view>
									<view class="item-child u-line-2 item-child-subtitle">{{item.sub_title}}</view>
								</u-col>
								<u-col v-if="(item.image_url !=null && item.image_url !='')" span="4">
									<u-image class="item-right-image" width="100%" height="250rpx" border-radius="11rpx"
										v-bind:src="item.image_url" mode="aspectFill" lazy-load="true">
										<u-loading slot="loading"></u-loading>
										<view slot="error" style="font-size: 24rpx;">加载失败</view>
									</u-image>
								</u-col>
							</u-row>


						</view>

						<view class="card-foot" slot="foot">
							<u-loading mode="circle" :show="isLoading"></u-loading>
						</view>
					</view>

				</uni-col>
				<uni-col :xs="0" :sm="16" :md="18" :lg="18" :xl="18">
					<!-- <pages-detail-detail ref="detailPage"></pages-detail-detail> -->
					<pages-article-article></pages-article-article>
				</uni-col>
			</uni-row>

			<u-toast ref="uToast" />
		</view>
	</view>
</template>

<script>
	// import article from '@/pages/article/article.vue'
	export default {
		// components:{article},
		data() {
			return {
				title: '',
				u_id: '',
				page: 1,
				entry: [],
				isLoading: false,
				count: 0,
				showMenu: false,
				feed_list: [], //侧边栏
				f_id: null, //订阅源id
				// 状态栏高度，H5中，此值为0，因为H5不可操作状态栏
				statusBarHeight: uni.getSystemInfoSync().statusBarHeight,
				// 导航栏内容区域高度，不包括状态栏高度在内
				navbarHeight: 44,
				background: {
					backgroundColor: wx.getSystemInfoSync().theme == 'dark' ? '#000000' : '#F5F5F5',
				},
				popupCustomStyle: {
					filter: wx.getSystemInfoSync().theme == 'dark' ? 'invert(1) hue-rotate(180deg)' : ''
				},
				render: false
			}
		},

		async onLoad() {

			var that = this;
			console.log('首页开始初始化')

			await this.$onLaunched;
			if (getApp().globalData.isPro) {
				this.render = true
			}

			const read_list = uni.getStorageSync('read_list');
			if (read_list) {
				that.entry = read_list
			}

			try {
				const value = uni.getStorageSync('u_id');
				// console.log(value)
				if (value) {
					getApp().globalData.u_id = value,
						console.log('-------主页获取本地u_id成功---------')
					console.log(that.u_id)
					that.u_id = getApp().globalData.u_id;
					console.log('------- u_id 发送改变 会触发下拉刷新---------')
					console.log(that.u_id)

				} else {
					//游客账户
					console.log('-------游客账户---------')
					uni.startPullDownRefresh();
				}
				//进行一次下拉刷新
				//uni.startPullDownRefresh();
			} catch (e) {
				// erro
				console.log(e)
				console.log('-------主页本地u_id失败---------')
			}



		},
		onPullDownRefresh() {
			console.log('-------下拉刷新--------')
			var that = this;

			that.entry = [],
				that.page = 1,
				that.getData(that.page)

			that.$u.api.GroupInfo({
				u_id: getApp().globalData.u_id
			}).then(res => {
				that.feed_list = res.data;
			})
		},

		onReachBottom() {
			//上拉 翻页
			this.page = this.page + 1;
			this.getData(this.page)
		},

		onShareAppMessage(res) {
			return {
				title: 'RSS订阅器',
				path: '/pages/index/index'
			}
		},

		onShareTimeline() {
			return {
				title: 'RSS订阅器'
			}
		},

		onReady() {
			var that = this

			//#ifdef MP-WEIXIN

			if (getApp().globalData.u_id != '') {
				that.$u.api.CheckUser({
					u_id: getApp().globalData.u_id
				}).then(res => {
					// that.getData(that.page)
				}).catch(() => {
					console.log('----------不存在的用户 清除掉登录信息-----------')
					getApp().globalData.u_id = '';
					uni.removeStorage({
						key: ''
					});
				})
			} else {
				//给提示
				console.log('---------游客提示----------------')
				that.$refs.uTips.show({
					title: '当前为游客账户，如需订阅，请前往我的页面登录',
					type: 'info',
					duration: '10000'
				})
			}

			//#endif

			//#ifdef H5
			if (getApp().globalData.api_key == '') {
				console.log('跳转登录')
				that.$refs.uToast.show({
					title: '跳转登录',
					duration: 2000,
					url: 'pages/login/login'
				})
			}
			//#endif

		},
		async onShow() {
			var that = this

			that.u_id = getApp().globalData.u_id;

		},

		methods: {
			openArticle(e, index) {
				var that = this
				//将当前的阅读状态修改为已读				
				that.entry[index].is_read = 1;

				if (this._isWidescreen) {
					console.log('--------宽屏触发-------------------')
				} else {
					console.log('--------窄屏触发-------------------')
					this.$u.route({
						url: 'pages/article/article',
						params: {
							id: e
							// ,
							// index: index
						}
					})
				}


			},
			getData(page) {
				var that = this
				//展示首页数据

				that.isLoading = true;

				that.$u.api.RssEntry({
					u_id: getApp().globalData.u_id,
					page: page,
					f_id: that.f_id
				}).then(res => {
					that.entry = that.entry.concat(res.data)
					that.count = res.count
					uni.stopPullDownRefresh()
					that.isLoading = false

					uni.setStorageSync('read_list', that.entry);

					if (that.entry.length == 0) {
						that.$refs.uTips.show({
							title: '无订阅内容，可前往订阅管理添加订阅',
							type: 'info',
							duration: '10000'
						})
					}

				})


			},
			showMenuCilck() {
				var that = this
				that.showMenu = true
			},
			/**  
			 * 触摸开始  
			 **/
			touchStart(e) {
				console.log("触摸开始")
				this.touchStartX = e.touches[0].clientX;
				this.touchStartY = e.touches[0].clientY;
			},

			/**  
			 * 触摸结束  
			 **/
			touchEnd(e) {
				var that = this
				console.log("触摸结束")
				let deltaX = e.changedTouches[0].clientX - this.touchStartX;
				let deltaY = e.changedTouches[0].clientY - this.touchStartY;
				if (Math.abs(deltaX) > 50 && Math.abs(deltaX) > Math.abs(deltaY)) {
					if (deltaX >= 0) {
						console.log("左滑")
						//左划弹出左侧菜单
						that.showMenu = true
					} else {
						console.log("右滑")
						that.showMenu = false
					}
				} else if (Math.abs(deltaY) > 50 && Math.abs(deltaX) < Math.abs(deltaY)) {
					if (deltaY < 0) {
						console.log("上滑")
					} else {
						console.log("下滑")
					}
				} else {
					console.log("可能是误触！")
				}
			},


			ClickByFid(feed) {
				this.f_id = feed.feedId;
				this.title = feed.feedName;
				this.page = 1;
				this.showMenu = false;
				this.entry = [];
				this.getData(this.page)
			}
		},
		watch: {
			u_id: function() {
				var that = this
				console.log(`---------u_id生变化 下拉刷新---------`);
				uni.startPullDownRefresh();
			}
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color;
	}

	.slot-wrap {
		display: flex;
		align-items: center;
		/* 如果您想让slot内容占满整个导航栏的宽度 */
		flex: 1;
		padding: 0 30rpx;
	}

	.wrap {
		min-height: 100vh;
		// width: 100%;
		padding: 7rpx 19rpx;
	}

	.hover-class {
		background-color: $uni-bg-color-hover;
	}

	.popup {
		padding: 0rpx 20rpx;
		background-color: #F5F5F5;
	}

	.item {
		padding: 22rpx 17rpx;
		border: #e2e3e6 solid 1rpx;
		margin: 27rpx 0rpx;
		border-radius: 21rpx;
		background-color: rgb(255, 255, 255);
	}

	.item-child-title {
		font-size: $uni-font-size-title;
		color: $uni-color-title;
		line-height: 140%;
	}

	.item-child-title-read {
		font-size: $uni-font-size-title;
		color: #858f9a;
		line-height: 150%;
	}

	.item-child-author {
		color: $uni-font-size-subtitle;
		font-size: 0.75rem;
		line-height: 1.8rem;
		color: #858f9a;
	}

	.item-child-subtitle {
		color: #858f9a;
		line-height: 140%;
	}

	.my-block {
		border: #e2e3e6 solid 1rpx;
		margin: 27rpx 0rpx;
		border-radius: 21rpx;
		background-color: rgb(255, 255, 255);
	}

	@media (prefers-color-scheme: dark) {

		/* DarkMode 下的样式 start */
		page {
			background-color: #000000;
		}

		;

		.popup image {
			// background-color: #000000;
			// padding: 0rpx 20rpx;
			filter: invert(1) hue-rotate(180deg);
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

		.my-block {
			// border: #e2e3e6 solid 1rpx;
			// margin: 27rpx 0rpx;
			// border-radius: 21rpx;
			// background-color: rgb(255, 255, 255);
			// filter: invert(1) hue-rotate(180deg);
		}


		/* DarkMode 下的样式 end */
	}


	.item-child {
		margin: 11rpx 0rpx;
	}



	.item-child-desc {}


	.item-right-images {
		width: 100%;
		height: 250rpx;
		border-radius: 11rpx;
		vertical-align: middle;
	}

	.card-foot {
		text-align: center;
		margin: 0 auto;
	}

	.collapse-item {
		color: red;
		padding-bottom: 10px;
	}
</style>
