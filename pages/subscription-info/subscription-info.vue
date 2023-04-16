<template>
	<view class="wrap">
		<u-form :model="form" ref="uForm">
			<u-form-item label="订阅地址" label-width="200">
				<u-input v-model="form.url" />
			</u-form-item>
			<u-form-item label="名称" label-width="200">
				<u-input v-model="form.name" />
			</u-form-item>
			<u-form-item label="描述" label-width="200">
				<u-input v-model="form.description" type="textarea" />
			</u-form-item>
			<u-form-item label="更新频率" label-width="200">
				<u-input v-model="form.timer" type="select" @click="show = true" />
			</u-form-item>

			<u-action-sheet :list="list" v-model="show" @click="click"></u-action-sheet>

			<u-form-item  label-width="200" label="剩余通知次数">
				<u-input  v-model="form.wxSubscriptionNumber" type="number" disabled="true"></u-input>
				<u-button slot="right" type="success" size="default" shape="square" ripple="true" @click="addSubscription"> + </u-button>
			</u-form-item>

		</u-form>

		<view style="margin-top: 60rpx;">
			<view class="button-rss">
				<u-button @click="save">保存</u-button>
			</view>
			<view class="button-rss">
				<u-button type="error" @click="showModel">删除</u-button>
			</view>
		</view>
		
		<u-modal v-model="isShowModel" :show-cancel-button="true" confirm-color="#fe0000" :mask-close-able="true" @confirm="deleteFeed" content="确认要删除该订阅吗"></u-modal>
		
		<u-toast ref="uToast" />
	</view>
</template>

<script>
	export default {
		data() {
			return {
				f_id:'',
				form: {
					url: '',
					name: '',
					description: '',
					timer: '',
					//微信通知次数
					wxSubscriptionNumber: 0
				},
				show: false,
				isShowModel:false,
				list: [{
						text: '五分钟',
						value: '5'
					},
					{
						text: '十分钟',
						value: '10'
					},
					{
						text: '二十分钟',
						value: '20'
					},
					{
						text: '半小时',
						value: '30'
					},
					{
						text: '一小时',
						value: '60'
					},
					{
						text: '四小时',
						value: '240'
					},
				],
				
			}
		},
		onLoad(e) {
			var that = this
			that.f_id = e.id
			
			that.$u.api.feedInfoByFidAndUid({
				id: e.id,
				u_id: getApp().globalData.u_id
			}).then(res => {
				var data = res.data;
				data.timer = that.list.find(it => it.value == res.data.timer).text
				that.form = data 
			}).catch(res=>{
				console.log(res)
				setTimeout(()=>{
					uni.navigateBack({
						delta: 1
					})
				},800)
				
				
			})
			console.log(that.f_id)
		},
		methods: {
			click(e) {
				// console.log(this.list[e].text)
				
			 this.form.timer =	this.list[e].text
			},
			deleteFeed(){
				var that =this;
				that.$u.api.DeleteFeed({id:that.f_id}).then(res=>{
					if(res.code==200){
						that.$refs.uToast.show({
							title: '删除成功'
						})
						setTimeout(()=>{
							uni.navigateBack({
								delta: 1
							})
						},300)
						
					}
				})
			
			},
			save(){
				// var that = this
				// console.log(that.list.find(it => it.text == that.form.timer).value)
				
				var that =this;
				that.$u.api.EditFeed({
					id:that.f_id,
					url:that.form.url,
					name:that.form.name,
					description:that.form.description,
					min_auto_updatetime:that.list.find(it => it.text == that.form.timer).value
				}).then(res=>{
					that.$refs.uToast.show({
						title: '保存成功'
					})
				})
			},
			addSubscription(){
				var that = this
				// console.log(e)
				uni.requestSubscribeMessage({
				  tmplIds: ['8YgdhqzgeoZCVtZ2Zec00PEu20m2U2F4hrxeX364JdI'],
				  success (res) { 
					  // console.log(res)
					  //请求接口
					  that.$u.api.AddWeChatSubscribe({
						  feed_user_id:that.f_id,
						  touser_id:getApp().globalData.u_id
					  }).then(res=>{
						  if(res.code == 200){
							  that.form.wxSubscriptionNumber = res.data.wxSubscriptionNumber
						  }
					  })
				  },
				  fail(res){
					  // console.log(res)
				  }
				})

			},
			//弹出删除提示模态框
			showModel(){
				var that = this
				
				that.isShowModel = true
			}
		}
	}
</script>

<style>
	.wrap {
		/* padding: 47rpx; */
		margin: 50rpx auto;
		width: 90%;
	}

	.button-rss {
		margin: 40rpx auto;
	}
	@media (prefers-color-scheme: dark) {
		page {
			/* background-color: #000000; */
			filter: invert(1) hue-rotate(180deg);
		}
		
	}
</style>
