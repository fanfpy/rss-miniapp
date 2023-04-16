<template>
	<view class="wrap">
		<u-row gutter="16">
			<u-col span="12">
				<u-search placeholder="搜索" v-model="search_name" shape="square"  :animation="false" @custom="search" @search="search"></u-search>
			</u-col>
		</u-row>
		<u-row gutter="21">
			<view class="recommend  u-row-center">
				<u-col span="4" v-for="(item,index) in recommend" :key="index">
					<view class="demo-layout">
						<u-image :src="item.icon" width="83rpx" height="83rpx" shape="circle"  @click="addSource(item.url)">
						</u-image>
						<view style="font-size: 23rpx;margin: 10rpx auto;">{{item.name}}</view>
						<u-icon size="56" name="plus-circle" @click="addSource(item.url)"></u-icon>
					</view>
				</u-col>
				<u-col span="4">
					<view class="demo-layout">
						<u-image src="/static/add-circle.png" width="83rpx" height="83rpx" shape="circle"  @click="addCustomSource">
						</u-image>
						<view style="font-size: 23rpx;margin: 10rpx auto;">添加自定义源</view>
						<u-icon size="56" name="plus-circle" @click="addCustomSource"></u-icon>
					</view>
				</u-col>
			</view>
		</u-row>

		<view class="my-block">
			
			<u-cell-group>
				<u-cell-item v-for="(item,index) in feed_list" hover-class="none" v-bind:title="item.name" :arrow="false" center="true"
					:key="index" :icon="item.icon" :icon-style="iconStyle" :bg-color="bgcolor">
					<u-icon slot="right-icon" size="56" name="plus-circle" @click="addSource(item.url)">
					</u-icon>
				</u-cell-item>
				
				<ad unit-id="adunit-0bbf978eb385658a" ad-intervals="30"></ad>
				
			</u-cell-group>
		</view>
		

		<u-modal v-model="show" :show-cancel-button="true" content="" @confirm="confirm" :async-close="true">
			<view class="slot-content">
				<u-field v-model="rssUrl" label="源地址" placeholder="源地址">
				</u-field>
			</view>
		</u-modal>
		<view style="display: flex;  align-items: center;  justify-content: center;">
			<u-loading mode="circle" :show="isLoding"></u-loading>
		</view>
		<u-toast ref="uToast" />

	</view>
</template>

<script>
	let interstitialAd = null
	export default {
		data() {
			return {
				isLoding: false,
				titleStyle: {
					'fontSize': '34rpx'
				},
				iconStyle: {
					'size': '64rpx'
				},
				show:false,
				search_name: '',
				recommend: [],
				feed_list: [],
				rssUrl: '',
				// bgcolor:wx.getSystemInfoSync().theme == 'dark' ? '#1c1c1c' : '#F5F5F5'
			}
		},
		onLoad() {
			console.log(uni.getSystemInfoSync().theme)
			var that = this
			that.isLoding = true;
			that.$u.api.GetRecommend().then(res => {
				that.recommend = res.data
				that.$u.api.hotSearch().then(res => {
					that.feed_list = res.data;
					that.isLoding = false;
				})
			});
			
			if (wx.createInterstitialAd) {
			  interstitialAd = wx.createInterstitialAd({
			    adUnitId: 'adunit-cfa2cf2f51635b02'
			  })
			  interstitialAd.onLoad(() => {})
			  interstitialAd.onError((err) => {})
			  interstitialAd.onClose(() => {})
			}

		},
		methods: {
			addSource(e) {
				var that = this
				that.$u.api.addRssAdd({
					u_id: getApp().globalData.u_id,
					ourceUrl: e
				}).then(res => {
					console.log('---------成功------')
					that.$refs.uToast.show({
						title: '添加成功'
					})
					that.show = false
				}).catch(res => {
					console.log('请求失败')
					that.show = false
				})
			},
			addCustomSource(){
				this.rssUrl=''
				this.show=true
			},
			confirm(){
				this.addSource(this.rssUrl)
				
				// 在适合的场景显示插屏广告
				if (interstitialAd) {
				  interstitialAd.show().catch((err) => {
				    console.error(err)
				  })
				}
			},
			search(){
				var that = this
				that.load_show = true;
				that.$u.api.hotSearch({name:that.search_name}).then(res => {
					that.feed_list = res.data;
					that.load_show = false;
				})
			},

		}
	}
</script>

<style scoped lang="scss">
	
	page {
		 background-color: $uni-bg-color;
	}
	
	.wrap {
		// padding: 24rpx;
		
		min-height: 100vh;
		width: 100%;
		padding: 7rpx 19rpx;
	}


	.recommend {
		margin: 40rpx 0;
	}

	.demo-layout {
		margin: 12rpx auto;
		text-align: center;


	}

	.demo-layout u-image {
		display: flex; //flex布局
		justify-content: center; //水平轴线居中

	}
	.my-block{
		margin: 27rpx 0rpx;
		border-radius: 21rpx;
		background-color: rgb(255, 255, 255);
	}
	
	
</style>
