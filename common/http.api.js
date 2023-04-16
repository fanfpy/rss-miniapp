// /common/http.api.js

// 如果没有通过拦截器配置域名的话，可以在这里写上完整的URL(加上域名部分)

//推荐订阅列表
let hotSearchUrl = '/api/RssFeed/HotFeed';
//添加订阅
let addRssAddUrl = '/api/RssFeed/add';
// 查询用户订阅列表
let feedListByUidUrl = '/api/RssFeed/FeedListByUid';
// 登录接口
let loginUrl = '/api/User/login';

let GetUserUrl = '/api/User/GetUser';
//检查用户是否合法
let CheckUserUrl ='/api/User/CheckUser';
//获取订阅源详细信息
let feedInfoByFidAndUidUrl = '/api/RssFeed/feedInfo';
//删除订阅
let DeleteFeedUrl = '/api/RssFeed/delete'
//编辑
let EditFeedUrl =  '/api/RssFeed/edit'
//关于
let AbuotUrl = '/api/RssAbout'
//分组信息
let GroupInfoUrl = '/api/RssGroup/GroupInfo'
//获取推荐
let GetRecommendUrl = '/api/RssFeed/GetRecommend'


// 作废 20220103
//更新rssEntry
// let UpdateRssEntryUrl = '/api/RssEntry/update';
// //主页显示数据
// let RssEntryUrl = '/api/RssEntry';
// //打开详细页面展示
// let RssEntryBySingleUrl = '/api/RssEntry/getSingle';
// //点击喜欢按钮
// let UpdateFavoriteUrl = '/api/RssEntry/UpdateFavorite'


//替代的api
//主页显示数据
let RssEntryUrl = '/api/Index';
//打开详细页面展示
let RssEntryBySingleUrl = '/api/Index/getSingle';
//点击喜欢按钮
let UpdateFavoriteUrl = '/api/Index/UpdateFavorite'

//更新阅读状态 2022 01 15
let UpdateReadStateUrl ='/api/Index/UpdateIsRead'
//增加订阅通知次数
let AddWeChatSubscribeUrl ='/api/WeChatSubscribe/add'
//分类api
let RssCategoryUrl = '/api/RssCategory'

let FeedSearchUrl ='api/RssFeed/Search' 


//增加更新阅读位置
let UpdateReadPositionUrl ='/api/Index/UpdateReadPosition'




// 此处第二个参数vm，就是我们在页面使用的this，你可以通过vm获取vuex等操作，更多内容详见uView对拦截器的介绍部分：
// https://uviewui.com/js/http.html#%E4%BD%95%E8%B0%93%E8%AF%B7%E6%B1%82%E6%8B%A6%E6%88%AA%EF%BC%9F
const install = (Vue, vm) => {
	// 此处没有使用传入的params参数
	
	let hotSearch 		=(params = {}) => vm.$u.get(hotSearchUrl,params);
	let addRssAdd 		=(params = {}) => vm.$u.get(addRssAddUrl, params);
	let feedListByUid 	=(params = {}) => vm.$u.get(feedListByUidUrl, params);
	let login 			=(params = {}) => vm.$u.get(loginUrl, params);
	let CheckUser		=(params = {}) => vm.$u.get(CheckUserUrl, params);
	// let UpdateRssEntry	=(params = {}) => vm.$u.post(UpdateRssEntryUrl, params);
	let RssEntry		=(params = {}) => vm.$u.post(RssEntryUrl, params);
	let RssEntryBySingle =(params = {}) => vm.$u.get(RssEntryBySingleUrl, params);
	let feedInfoByFidAndUid  =(params = {}) => vm.$u.post(feedInfoByFidAndUidUrl, params);
	let UpdateFavorite	=(params = {}) => vm.$u.post(UpdateFavoriteUrl, params);
	let GetUser 		=(params = {}) => vm.$u.post(GetUserUrl, params);
	let DeleteFeed		=(params = {}) => vm.$u.delete(DeleteFeedUrl, params);
	let EditFeed 		=(params = {}) => vm.$u.post(EditFeedUrl, params);
	let Abuot			=(params = {}) => vm.$u.get(AbuotUrl,params);
	let GroupInfo		=(params = {}) => vm.$u.post(GroupInfoUrl, params);
	let GetRecommend    =(params = {}) => vm.$u.post(GetRecommendUrl, params);
	let UpdateReadState =(params = {}) => vm.$u.post(UpdateReadStateUrl, params);
	let AddWeChatSubscribe = (params={})=>vm.$u.post(AddWeChatSubscribeUrl,params);
	let RssCategory  =(params = {}) => vm.$u.get(RssCategoryUrl, params);
	let FeedSearch  =(params = {}) => vm.$u.get(FeedSearchUrl, params);
	let UpdateReadPosition  =(params = {}) => vm.$u.post(UpdateReadPositionUrl, params);
	
	
	// 将各个定义的接口名称，统一放进对象挂载到vm.$u.api(因为vm就是this，也即this.$u.api)下
	vm.$u.api = {hotSearch, addRssAdd,
	feedListByUid,login,
	CheckUser,
	// UpdateRssEntry,
	RssEntry,RssEntryBySingle,feedInfoByFidAndUid,
	UpdateFavorite,GetUser,DeleteFeed,
	EditFeed,Abuot,GroupInfo,GetRecommend
	,UpdateReadState,AddWeChatSubscribe
	,RssCategory,FeedSearch,UpdateReadPosition};
}

export default {
	install
}