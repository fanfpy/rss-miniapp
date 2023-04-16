<script>
	const updateManager = uni.getUpdateManager();
	export default {
		async onLaunch() {
			console.log('App onLaunch')
			
			var that = this;

			await that.$u.api.Abuot().then(res => {
				console.log('--小程序生命周期--')
				getApp().globalData.isPro = res.data.is_pro == '1'
				if (!getApp().globalData.isPro) {
					//审核时使用审核模板
					console.log('审核')
					uni.redirectTo({
						url: '/pages/test/test'
					})
				}
			})
			this.$isResolve()
			



			console.log('---------uview版本----------');
			console.log(that.$u.config.v);
			console.log('App Launch')
			try {
				const value = uni.getStorageSync('u_id');
				if (value) {
					getApp().globalData.u_id = value
				}
			} catch (e) {}

			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				console.log('---------请求新版本---------')
				console.log(res.hasUpdate);
			});

			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});

			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
			});

		},

		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		globalData: {
			api_key: '',
			u_id: '',
			isPro:false
		},
		onThemeChange: function(options) {
			console.log(options, '系统主题');
		}
	}
</script>

<style lang="scss">
	/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
	@import "uview-ui/index.scss";
</style>
