<template>
	<view class="warp">
		<!-- <u-divider>示例文本</u-divider> -->
		<view class="case">
			<view style="color: #999;">示例文本</view>
			<view :style="'font-size: '+redaConfig.titleSize+'rpx;'">满江红·写怀</view>
			<text>\n</text>
			<view :style="'font-size: '+redaConfig.contentSize+'rpx;line-height:'+redaConfig.lineHeight+' ;'">
				<text>怒发冲冠，凭栏处、潇潇雨歇。抬望眼、仰天长啸，壮怀激烈。三十功名尘与土，八千里路云和月。莫等闲、白了少年头，空悲切。\n靖康耻，犹未雪。臣子恨，何时灭。驾长车，踏破贺兰山缺。壮志饥餐胡虏肉，笑谈渴饮匈奴血。待从头、收拾旧山河，朝天阙。
				</text>
			</view>
		</view>
		<view class="setting">
			<u-form :model="redaConfig">
				<u-form-item label="标题字体大小" label-width="200">
					<u-input v-model="redaConfig.titleSize" type="select" @click="showTitleSize = true" />
				</u-form-item>
				
				
				<u-form-item label="行高" label-width="200">
					<u-input v-model="redaConfig.lineHeight" type="select" @click="showLineHeight = true" />
				</u-form-item>
				
				<u-form-item label="内容字体大小" label-width="200">
					<u-input v-model="redaConfig.contentSize" type="select" @click="showContentSize = true" />
				</u-form-item>
				
				
				<u-select :list="titleSizeList" v-model="showTitleSize" @confirm="clickTitleSize" :default-value="titleSizeDefaultValue"></u-select>
				<u-select :list="lineHeightList" v-model="showLineHeight" @confirm="clickLineHeight" :default-value="lineHeightDefaultValue"></u-select>
				<u-select :list="contentSizeList" v-model="showContentSize" @confirm="clickContentSize" :default-value="contentSizeDefaultValue"></u-select>
				
			</u-form>
			<view class="button-rss">
				<u-button @click="save">保存</u-button>
			</view>
		</view>
		
		<u-toast ref="uToast" />
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				redaConfig: {
					titleSize: 48,
					lineHeight: 1.9,
					contentSize: 32
				},
				showTitleSize:false,
				showLineHeight:false,
				showContentSize:false,
				titleSizeList:[],
				lineHeightList:[],
				contentSizeList:[],
				titleSizeDefaultValue:[],
				lineHeightDefaultValue:[],
				contentSizeDefaultValue:[],
			}
		},
		
		onLoad() {
			
			let that = this
			
			try {
				const value = uni.getStorageSync('redaConfig');
				if (value) {
					that.redaConfig = value
				}
			} catch (e) {
				// error
			}
			
			for(var i=28;i<=68;i++){
				that.titleSizeList.push({value:i+'',label:i+''});
			}
			var data = that.titleSizeList.find(it => it.value == that.redaConfig.titleSize);
			that.titleSizeDefaultValue =[that.titleSizeList.indexOf(data)]
			
			
			for(var i=9;i<=29;i++){
				that.lineHeightList.push({value:i/10+'',label:i/10+''});
			}
			
			var data1 = that.lineHeightList.find(it => it.value == that.redaConfig.lineHeight);
			that.lineHeightDefaultValue =[that.lineHeightList.indexOf(data1)]
			
			for(var i=12;i<=52;i++){
				that.contentSizeList.push({value:i+'',label:i+''});
			}
			var data2 = that.contentSizeList.find(it => it.value == that.redaConfig.contentSize);
			that.contentSizeDefaultValue =[that.contentSizeList.indexOf(data2)]
			
			
		},
		methods: {
			clickTitleSize(e){
				console.log(e[0].value)
				this.redaConfig.titleSize = e[0].value
			},
			clickLineHeight(e){
				console.log(e[0].value)
				this.redaConfig.lineHeight = e[0].value
			},
			clickContentSize(e){
				console.log(e[0].value)
				this.redaConfig.contentSize = e[0].value
			},
			save(){
				uni.setStorageSync('redaConfig', this.redaConfig);
				this.$refs.uToast.show({
					title: '保存成功',
					// 如果不传此type参数，默认为default，也可以手动写上 type: 'default'
					type: 'success', 
					// 如果不需要图标，请设置为false
					// icon: false
				})
			}
		}
	}
</script>

<style lang="scss">
	page {
		// background-color: $uni-bg-color;
	}

	.case {
		padding: 20rpx 40rpx;
		// margin: 20rpx auto;
		position: fixed;
		top: 20rpx;
		left: 5%;
		min-height: 700rpx;
		width: 90%;
		border-radius: 5%;
		z-index: -999;
	}

	.setting {
		position: fixed;
		bottom: 0;
		left: 5%;
		width: 90%;
		border-radius: 5%;
		background-color: #ffffff;
		// height: 120rpx;
		padding: 27rpx 23rpx;
		margin-bottom: 40rpx;
	}
	@media (prefers-color-scheme: dark) {
		page {
			/* background-color: #000000; */
			filter: invert(1) hue-rotate(180deg);
		}
		
	}
</style>
