// common/http.interceptor.js
import md5Libs from "uview-ui/libs/function/md5";

// 这里的Vue为Vue对象(非创建出来的实例)，vm为main.js中“Vue.use(httpInterceptor, app)”这一句的第二个参数，
// 为一个Vue的实例，也即每个页面的"this"
// 如果需要了解这个install方法是什么，请移步：https://uviewui.com/components/vueUse.html
const install = (Vue, vm) => {
	// 此为自定义配置参数，具体参数见上方说明
	Vue.prototype.$u.http.setConfig({
		baseUrl: 'https://localhost:44351',
		// baseUrl: 'http://192.168.31.153:7000',
		// baseUrl: 'https://rss-server.fanfpy.top',
		// baseUrl: 'https://rss-server-v4.fanfpy.top',
		// baseUrl:'https://rss-server-1925635-1258147532.ap-shanghai.run.tcloudbase.com',
		
		
		loadingText: '努力加载中~',
		loadingTime: 120,
		// originalData: true, 
		loadingMask: true, // 展示loading的时候，是否给一个透明的蒙层，防止触摸穿透
		// 设置自定义头部content-type
		// header: {
		// 	'content-type': 'xxx'
		// }
		// ......
	});

	// 请求拦截部分，如配置，每次请求前都会执行，见上方说明
	Vue.prototype.$u.http.interceptor.request = (config) => {
		// ......
		config.metadata = {
			startTime: new Date()
		}
		console.log('---------请求地址--------------')
		console.log(config.url)
		console.log('---------请求时间-------------')
		console.log(vm.$u.timeFormat(new Date(), 'yyyy年mm月dd日 hh时MM分ss秒'))
		
		config.header.timestamp = new Date().getTime();
		config.header.token = md5Libs.md5(config.header.timestamp + 'W@Gp2')
		

		return config;
	}
		Vue.prototype.$u.http.interceptor.response = (res) => {
		console.log('---------请求结束时间-------------')
		console.log(vm.$u.timeFormat(new Date(), 'yyyy年mm月dd日 hh时MM分ss秒'))
		
		if (res.code == 200) {
			// res为服务端返回值，可能有code，result等字段
			// 这里对res.result进行返回，将会在this.$u.post(url).then(res => {})的then回调中的res的到
			// 如果配置了originalData为true，请留意这里的返回值
			return res;
		}
		// else if(res.code == 301){
		// 	console.log("---------当前为游客状态，添加订阅需要登录，请问是否跳转登录----------")
		// 	vm.$u.toast(res.msg);
		// 	return res;
		// }
		 else {
			vm.$u.toast(res.msg);
			
			return false;
		}
	}


}

export default {
	install
}
