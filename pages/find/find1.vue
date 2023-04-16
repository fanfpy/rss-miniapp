<template>
	<view class="warp">
		<u-row>
			<view class="haed">
				<u-col span="10">
					<!-- <view  @click="OnClicksearch"> -->
					<view>
						<u-search input-align="center" shape="square"
							:bg-color="theme == 'dark' ? '#1c1c1c' : '#f5f5f5'" :show-action="false" height="70"
							:animation="true" v-model="search_name" @search="search"></u-search>
					</view>
				</u-col>
				<u-col span="2">
					<view class="add-feed">
						<image src="/static/feed.png" class="add-feed-icon" @click="addCustomSource"></image>
					</view>
				</u-col>
			</view>

		</u-row>

		<u-row>
			<view class="tabs-class">
				<u-tabs name="cate_name" bg-color="#f2f2f2" count="cate_count" :list="list" :is-scroll="true"
					:current="current" @change="change">
				</u-tabs>
			</view>
		</u-row>


		<u-row>
			<u-col span="12">
				<view class="feed-list">
					<u-row v-for="(item,index) in feed_list" :key="item.id">
						<view :class="index%2==0?'feed-list-item-odd':'feed-list-item-even'"
							hover-class="feed-list-item-hover" @click="addSource(item.url)">
							<u-col span="2">
								<image class="icon" :src="item.icon">
								</image>
							</u-col>
							<u-col span="10">
								<view class="item-title u-line-1">
									<rich-text style="position: relative;top: 20rpx;" :nodes="item.name"></rich-text>
								</view>
								<rich-text class="item-desc u-line-1" :nodes="item.name"></rich-text>
							</u-col>
						</view>
					</u-row>
				</view>

			</u-col>
		</u-row>

		<u-modal v-model="show" :show-cancel-button="true" content="" @confirm="confirm" :async-close="true">
			<view class="slot-content">
				<u-field v-model="rssUrl" label="源地址" placeholder="源地址">
				</u-field>
			</view>
		</u-modal>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				isLoding: false,
				recommend: [],
				feed_list: [],
				search_name: '',
				list: [{
					cate_name: '搜索'
				}],
				current: 0,
				rssUrl: '',
				show: false,
				theme: wx.getSystemInfoSync().theme
			}
		},
		onLoad() {

			var that = this
			that.isLoding = true;

			that.$u.api.RssCategory().then(category_res => {
				that.list = that.list.concat(category_res.data)
				that.current = 1;

				// that.setTime()

				that.$u.api.GetRecommend().then(res => {
					// that.recommend = res.data
					that.feed_list = res.data
					that.current = 1;
					//标签定位到推荐
				});
			})


		},
		onReady() {
			var that = this

		},
		methods: {
			openFeed() {},
			change(index) {
				var that = this
				that.current = index;
				//切换标签
				//假如切换到搜索
				if (index == 0) {
					that.feed_list = []
				} else if (index == 1) {
					that.current = 1;
					that.$u.api.GetRecommend().then(res => {
						that.feed_list = res.data
					})
				} else {
					that.$u.api.hotSearch({
						groupid: index
					}).then(res => {
						that.feed_list = res.data;
					})
				}
			},
			search() {
				var that = this
				that.$u.api.FeedSearch({
					name: that.search_name
				}).then(res => {
					
					// res.data.forEach((it,index)=>{
					// 	// console.log(it.name)
						
					// 	it.name = it.name.replace(that.search_name,`<text style="background-color: $uni-bg-color">${that.search_name}</text>`)
					// })
					
					that.feed_list = res.data;
					that.current = 0;
				})
			},
			addCustomSource() {
				this.rssUrl = ''
				this.show = true
			},
			addSource(e) {
				var that = this
				that.$u.api.addRssAdd({
					u_id: getApp().globalData.u_id,
					ourceUrl: e
				}).then(res => {
					console.log('---------成功------')
					that.$refs.uToast.show({
						title: '添加成功',
						type: 'success'
					})
					that.show = false
				}).catch(res => {
					console.log(res)
					console.log('请求失败')
					that.show = false
				})
			},
			confirm() {
				this.addSource(this.rssUrl)

				// 在适合的场景显示插屏广告
				if (interstitialAd) {
					interstitialAd.show().catch((err) => {
						console.error(err)
					})
				}
			},
		}
	}
</script>

<style lang="scss">
	page {
		background-color: $uni-bg-color;
	}

	.warp {
		min-height: 100vh;
		width: 100%;
		padding: 19rpx 19rpx;
	}

	.add-feed {
		// margin: 15rpx auto;
	}

	.add-feed-icon {
		width: 65rpx;
		height: 65rpx;
	}

	.feed-list {
		padding: 0 11rpx;
		border: #e2e3e6 solid 1rpx;
		margin: 11rpx 0rpx;
		border-radius: 21rpx;
		background-color: white;
	}

	.feed-list-item-hover {
		background-color: $uni-bg-color-hover;
	}

	.feed-list-item-odd {
		height: 120rpx;
		background-color: #fcfcfc;
		padding-left: 11rpx;
	}

	.feed-list-item-even {
		height: 120rpx;
		background-color: #ffffff;
		padding-left: 11rpx;
		// background-color: #72aa91;
	}

	.icon {
		width: 71rpx;
		height: 71rpx;
		border-radius: 21rpx;
		margin-top: 24.5rpx;
	}

	.feed-list .item-title {
		height: 60rpx;
		color: #232323;
		font-size: 1rem;
	}

	.feed-list .item-desc {
		height: 60rpx;
		color: #999999;
		font-size: 0.8rem;
	}

	.tabs-class {
		padding: 0 11rpx;
	}

	@media (prefers-color-scheme: dark) {

		/* DarkMode 下的样式 start */
		page {
			background-color: #000000;
			// filter: invert(1);
		}

		// .haed{
		// 	filter: invert(1);
		// }


		.add-feed {
			filter: invert(1);
		}

		.feed-list {
			// filter: invert(1);
			background-color: #000000;
			border: #000000 0rpx;
		}

		.feed-list image {
			// filter: invert(1);	
		}

		.feed-list-item-odd {
			// filter: invert(1) hue-rotate(180deg);
			background-color: #252526;
		}

		.feed-list-item-even {
			// filter: invert(1) hue-rotate(180deg);
			background-color: #3f3f46;
		}

		.item-title {
			filter: invert(1) hue-rotate(180deg);
		}

		.item-desc {
			filter: invert(1) hue-rotate(180deg);
		}

		.tabs-class {
			filter: invert(1) hue-rotate(180deg);
		}
	}
</style>
