<template>
	<view>
		<view class="search">
			<u-search placeholder="" placeholder="请输入搜索内容" v-model="search_name" :animation="false" @custom="search" @search="search" ></u-search>
		</view>

		<u-cell-group title="推荐">
			<view style="text-align: center; margin: 0 auto;">
				<u-loading :show="load_show" mode="circle"></u-loading>
			</view>
			<u-cell-item v-for="(item,index) in feed_list" hover-class="none" v-bind:title="item.name" :arrow="false"
				:key="index">
				<u-icon slot="right-icon" size="56" name="plus-circle" @click="addSource(item.url)">
				</u-icon>
			</u-cell-item>

		</u-cell-group>

		<view class="add-custom">
			<u-icon size="120" name="plus-circle-fill" @click="openadd"></u-icon>
		</view>


		<u-modal v-model="show" :show-cancel-button="true" content="" @confirm="confirm" :async-close="true">
			<view class="slot-content">
				<u-field v-model="rssUrl" label="源地址" placeholder="源地址">
				</u-field>

			</view>
		</u-modal>


		<!-- <u-modal v-model="isLogin" show-cancel-button="true" @confirm="openLogin" content="当前为游客状态，添加订阅需要登录，请问是否跳转登录"></u-modal> -->

		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				search_name:'',
				keyword: '',
				show: false,
				rssUrl: '',
				feed_list: [],
				load_show: false,
				isLogin:false
			}
		},

		onLoad() {
			var that = this
			that.load_show = true;
			that.$u.api.hotSearch().then(res => {
				that.feed_list = res.data;
				that.load_show = false;
			})
		},


		methods: {
			openadd() {
				//添加自定义源
				this.show = true;
			},
			openLogin(){
				//跳转登录
				var that = this
				that.isLogin = false;
				
				that.$refs.uToast.show({
					title: '跳转登录',
					duration: 200,
					url: 'pages/login1/login1'
				})
			},
			
			search(){
				var that = this
				that.load_show = true;
				that.$u.api.hotSearch({name:that.search_name}).then(res => {
					that.feed_list = res.data;
					that.load_show = false;
				})
			},
			
			confirm() {
				//添加源
				var that = this
				that.$u.api.addRssAdd({
					u_id: getApp().globalData.u_id,
					ourceUrl: that.rssUrl
				}).then(res => {
					
					// if(res.code=='301'){
					// 	that.isLogin = true;
					// 	return;
					// }
					
					that.$refs.uToast.show({
						title: '添加成功'
					})
					that.show = false
				}).catch(res => {
					console.log(res)
					that.show = false
				})
			},
			addSource(e) {
				this.rssUrl = e
				this.confirm();
			},
		}
	}
</script>

<style>
	.search {
		margin: 5rpx;
	}

	.add-custom {
		position: fixed;
		bottom: 80rpx;
		right: 120rpx;
		z-index: 999;
	}
</style>
