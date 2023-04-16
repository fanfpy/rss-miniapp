<template>
	<view class="warp">
		<view class="user-box u-p-l-30 u-p-r-20 u-p-b-30 my-block" style="text-align: center;padding-top: 50rpx;">
			<view class="u-m-r-10">
				<u-avatar v-if="u_id==''" text="登录" size="large" @click="show = true" bg-color="rgb(234,76,137)">
				</u-avatar>
				<u-avatar v-else :src="imageurl" size="large"></u-avatar>
			</view>
			<view class="u-flex-1">
				<view class="u-font-14 u-tips-color" v-if="u_id==''">游客账户</view>
				<view class="u-font-14 u-tips-color" v-else>{{username}}</view>
			</view>
		</view>


		<view class="u-m-t-20 my-block">
			<u-cell-group>
				<u-cell-item icon="star" title="我的收藏" @click="myStart" :bg-color="bgcolor"></u-cell-item>
				<u-cell-item icon="list-dot" title="订阅管理" @click="myFeed"  :bg-color="bgcolor"></u-cell-item>
				<u-cell-item icon="file-text" title="阅读设置" @click="ReadSetting"  border-bottom="false" :bg-color="bgcolor"></u-cell-item>
			</u-cell-group>
		</view>

		<view class="u-m-t-20 my-block">
			<u-cell-group>
				<u-cell-item icon="info-circle" :bg-color="bgcolor" title="关于" @click="about" :border-bottom="false" :border-top="false">
				</u-cell-item>
			</u-cell-group>
		</view>

		<!-- 	<view v-if="u_id==11" class="u-m-t-20">
			<u-cell-group>
				 <navigator url="../admin/admin" hover-class="navigator-hover">
				<u-cell-item icon="info-circle" title="管理员"></u-cell-item>
				</navigator>
			</u-cell-group>
		</view> -->



		<u-popup v-model="show" mode="center" border-radius="14">
			<view class="popup-class">
				<view class="popup-item-image">
					<u-avatar src="/static/dingyue.png" size="160"></u-avatar>
				</view>
				<view class="popup-item-button">
					<u-button open-type='getUserInfo' size="medium" type="success" throttle-time="800" @click='submit'>
						微信一键登录 </u-button>
				</view>

			</view>
		</u-popup>
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				show: false,
				code: '',
				u_id: '',
				username: '',
				imageurl: '',
			}
		},

		onLoad() {
			//获取用户信息
			var that = this
			if (uni.getUserProfile) {
				console.log('------getUserProfile可用------')
			}
			//获取code
			uni.login({
				provider: 'weixin',
				success: function(loginRes) {
					console.log(`------------获取code成功 返回后端换取openid----------`)
					that.code = loginRes.code
				}
			});


			if (getApp().globalData.u_id != '') {
				that.getUser(getApp().globalData.u_id)
			}


		},
		methods: {
			myFeed() {
				var that = this
				if (getApp().globalData.u_id == '') {
					that.$refs.uToast.show({
						title: '未登录 暂时无法使用'
					})
				} else {
					this.$u.route({
						url: '/pages/subscription-list/subscription-list',
					})

				}
			},
			myStart() {
				var that = this
				if (getApp().globalData.u_id == '') {
					that.$refs.uToast.show({
						title: '未登录 暂时无法使用'
					})
				} else {
					this.$u.route({
						url: '/pages/my-favorite/my-favorite',
					})

				}
			},
			ReadSetting(){
				var that = this
				if (getApp().globalData.u_id == '') {
					that.$refs.uToast.show({
						title: '未登录 暂时无法使用'
					})
				} else {
					this.$u.route({
						url: 'pages/read-setting/read-setting',
					})
				}
			},
			
			about() {
				this.$u.route({
					url: '/pages/about/about',
				})
			},

			submit() {
				console.log('------点击登录------')
				var that = this;
				uni.showLoading({
					title: '加载中',
					mask:true
				});
				uni.getUserProfile({
					desc: '完善用户信息',
					success: function(infoRes) {
						console.log(`------------开始获取基本用户信息-----------`)

						if (that.code != '') {
							that.$u.api.login({
								code: that.code,
								encryptedData: infoRes.encryptedData,
								iv: infoRes.iv
							}).then(res => {
								if (res.code == 200) {
									getApp().globalData.u_id = res.data
									uni.setStorage({
										key: 'u_id',
										data: res.data
									});

									that.getUser(res.data)

									that.$refs.uToast.show({
										title: '登录成功'
									})
									that.show = false
								}
							})
						}



					},
					fail: function(erro) {
						console.log(`------------失败${erro}--------`)
						console.log(erro)
					},
					complete:function(){ uni.hideLoading() }
				});

			},

			getUser(id) {
				var that = this;
				that.$u.api.GetUser({
					u_id: id
				}).then(res => {
					that.u_id = getApp().globalData.u_id
					that.username = res.data.username
					that.imageurl = res.data.imageurl
				})
			}
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
		padding: 7rpx 19rpx;
	}

	.camera {
		width: 54px;
		height: 44px;

		&:active {
			background-color: $uni-bg-color;
		}
	}

	.user-box {
		background-color: #fff;
	}

	.popup-class {
		height: 430rpx;
		width: 370rpx;
		text-align: center;
		padding-top: 100rpx;
	}

	.popup-item-image {
		// margin-top: 40rpx;
	}

	.popup-item-button {
		position: absolute;
		bottom: 30rpx;
		margin: auto;
		left: 0;
		right: 0;

	}

	.my-block {
		padding: 0rpx 17rpx;
		border: #e2e3e6 solid 1rpx;
		margin: 27rpx 0rpx;
		border-radius: 21rpx;
		background-color: rgb(255, 255, 255);
	}


	@media (prefers-color-scheme: dark) {
	
		page {
			// filter: invert(1) hue-rotate(180deg);
			background-color: #000000;
			
		}
		.my-block{
			// background-color: #1c1c1c;
			filter: invert(1) hue-rotate(180deg);
		}
		
		.my-block image{
			filter: invert(1) hue-rotate(180deg);
		}
	}
</style>
