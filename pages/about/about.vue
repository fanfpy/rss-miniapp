<template>
	<view class="u-content">
		<u-parse :html="content"></u-parse>
		<u-toast ref="uToast" />
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				content:''
			}
		},
		onLoad() {
			var that = this
			that.$u.api.Abuot().then(res => {
				that.content =res.data.text
			})
		},
		methods: {

		}
	}
</script>

<style>
.u-content {
		margin-top: 70rpx;
		padding: 0rpx 30rpx;
	}
</style>
