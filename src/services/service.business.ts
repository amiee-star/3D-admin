import {
	PageParams,
	businessListParams,
	addBusiness,
	createResourceParams,
	addTheme,
	topicTempListParams,
	tempAdd,
	tempEdit,
	topicUserParams,
	topicUserAdd,
	businessHallParams,
	cloneHallParams,
	brokenLineParams,
	tempListParams
} from "@/interfaces/params.interface"
import {
	baseRes,
	PageData,
	resourceInfoItem,
	hallInfo,
	getResourceInfoItem,
	businessInfo,
	areaInterva,
	bestTemp,
	listData,
	tempListItem,
	tempKeywordItem,
	topicTempInfo,
	topicUserItem,
	themeInfo,
	businessListItem,
	tempPageListItem,
	topicTempItem,
	topicUserListItem,
	serviceConfigItem,
	hallTableInfo,
	loginListItem,
	platformsItem,
	userDataItem,
	userDataItem2,
	brokenLineItem,
	callDataItem,
	countProvinceItem,
	countCountryItem,
	countDeviceItem,
	userListItem
} from "@/interfaces/api.interface"
import { get, post, postJson, put, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//企业列表
	businessList(params: businessListParams & PageParams) {
		return get<baseRes<businessListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/info/getPageList`,
			params
		})
	},
	//企业信息
	businessInfo(params: { id: string }) {
		return get<baseRes<businessInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/company/info/select/id`,
			params
		})
	},

	//新增企业列表
	businessAdd(params: addBusiness) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/info/`,
			params
		})
	},

	//编辑企业列表
	businessEdit(params: addBusiness) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/info/`,
			params
		})
	},
	//企业重置密码
	companyResetPass(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/info/${params.id}/reset/password`
		})
	},

	//企业资源信息
	resourceInfo(params: { companyId: string }) {
		return get<baseRes<resourceInfoItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/resource/info`,
			params
		})
	},

	//历史订单
	resourceList(params: any) {
		return get<baseRes<any>>({
			url: `${urlFunc.requestHost()}/v1/m/company/resource/list`,
			params
		})
	},

	//创建套餐
	createResource(params: createResourceParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/resource/add`,
			params
		})
	},

	//升级套餐
	updateResource(params: createResourceParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/resource/upgrade`,
			params
		})
	},
	//获取资源详情
	getResourceInfo(params: { resourceId: string }) {
		return get<baseRes<getResourceInfoItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/resource/details`,
			params
		})
	},

	//主题列表
	themeList(params: { companyId: string } & businessListParams & PageParams) {
		return get<baseRes<themeInfo[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/getPageList`,
			params
		})
	},
	//主题详情
	themeInfo(params: { id: string }) {
		return get<baseRes<themeInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/getById`,
			params
		})
	},

	//新增主题
	themeAdd(params: addTheme) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/`,
			params
		})
	},

	//编辑主题
	themeEdit(params: addTheme) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/`,
			params
		})
	},

	//面积区间
	areasList(id: string) {
		return get<baseRes<areaInterva[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users/area/${id}`
		})
	},

	//获取企业模版列表
	getTempList(params: { companyId: string }) {
		return get<baseRes<tempListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/temp/getPageList`,
			params
		})
	},

	//来源展厅
	selectTempKeyword(params: { keyword: string }) {
		return get<baseRes<tempKeywordItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/temp/selectTempKeyword`,
			params
		})
	},

	//添加模版展厅
	companyTempAdd(params: { companyId: string; tempId: string; name: string; createType: number }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/temp/add`,
			params
		})
	},

	//编辑模版展厅
	companyTempEdit(params: { companyId: string; tempId: string; name: string; createType: number }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/temp/edit`,
			params
		})
	},

	//根据id查模版展厅信息
	tempSelectById(params: { id: string }) {
		return get<baseRes<tempListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/temp/selectById`,
			params
		})
	},

	//根据id删除企业模版
	companyTempDelete(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/temp/delete`,
			params
		})
	},

	//主题模板列表
	topicTempList(params: PageParams & { topicId: string }) {
		return get<baseRes<listData<topicTempInfo>>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/getPageList`,
			params
		})
	},

	//平台精品模板库
	selectBoutiqueList(params: PageParams & topicTempListParams) {
		return get<baseRes<bestTemp[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/selectBoutiqueList`,
			params
		})
	},
	//企业专属模板库
	selectCompanyTempList(params: PageParams & topicTempListParams) {
		return get<baseRes<bestTemp[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/selectCompanyTempList`,
			params
		})
	},
	//添加模板库
	tempAdd(params: tempAdd) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/add`,
			params
		})
	},

	//模板详情
	tempInfo(params: { id: string }) {
		return get<baseRes<topicTempInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/selectById`,
			params
		})
	},
	//模板删除
	tempDelete(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/delete`,
			params
		})
	},

	//模板编辑
	TempEdit(params: tempEdit) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/edit`,
			params
		})
	},
	//主题用户列表
	topicUsersList(params: PageParams & topicUserParams) {
		return get<baseRes<topicUserItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users`,
			params
		})
	},
	//添加主题用户
	topicUsersAdd(params: topicUserAdd) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users`,
			params
		})
	},
	//编辑主题用户
	topicUsersEdit(params: topicUserAdd) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users`,
			params
		})
	},
	//主题用户详情
	topicUsersInfo(id: string) {
		return get<baseRes<topicUserItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users/${id}`
		})
	},
	//主题用户详情
	resetPassWord(id: string) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users/${id}/password`
		})
	},

	//分配资源
	userResources(params: topicUserAdd) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users/resources`,
			params
		})
	},
	//模板用户列表
	selectTopicUserList(params: { topicId: string; keyword: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/temp/selectTopicUserList`,
			params
		})
	},
	//企业列表
	getCompanyList() {
		return get<baseRes<businessListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getCompanyList`
		})
	},
	//主题列表
	getTopicList(params: { companyId: string }) {
		return get<baseRes<businessListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getTopicList`,
			params
		})
	},
	//展厅列表
	getTempPageList(params: tempPageListItem) {
		return get<baseRes<tempPageListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getPageList`,
			params
		})
	},
	//选择模板
	getTopicTempList(params: { keywords: string; topicId: string }) {
		return get<baseRes<topicTempItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getTopicTempList`,
			params
		})
	},
	//选择用户
	getTopicUserList(params: { keywords: string; topicId: string }) {
		return get<baseRes<topicUserListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getTopicUserList`,
			params
		})
	},
	//添加展厅
	addBusinessHall(params: businessHallParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/add`,
			params
		})
	},

	//查询面积列表(下拉框)
	areaSelect() {
		return get<baseRes<areaInterva[]>>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users/areas/combo`
		})
	},

	//编辑展厅
	editBusinessHall(params: { id: string }) {
		return get<baseRes<hallInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getEdit`,
			params
		})
	},
	//编辑展厅
	saveEditHall(params: hallInfo) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/edit`,
			params
		})
	},
	// 删除展厅
	deleteHall(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/deleteById`,
			params
		})
	},
	// 复制展厅
	cloneHall(params: cloneHallParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/copy`,
			params
		})
	},
	// 增值服务查询
	getServiceConfig(params: { tempId: string }) {
		return get<baseRes<serviceConfigItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getServiceConfig`,
			params
		})
	},
	// 增值服务保存
	updateServiceConfig(params: { tempId: string; varLook: number }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/updateServiceConfig`,
			params
		})
	},
	// 企业发布展厅
	publishHall(params: { tempId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/${params.tempId}/publish`
		})
	},
	// 查看展厅信息
	getHallInfo(params: { tempId: string }) {
		return get<baseRes<hallTableInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/company/user/temp/getTemplateInfo`,
			params
		})
	},
	// 回收资源
	recycle(params: { userId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/topic/users/resources/recycle`,
			params
		})
	},
	//登录模版列表
	loginList(params: PageParams) {
		return get<baseRes<listData<loginListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/company/login/style/`,
			params
		})
	},
	//更新模版
	updateTemplate(id: string) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/temp/${id}/publish`
		})
	},
	//添加登录模版
	addLoginStyle(params: loginListItem) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/login/style/`,
			params
		})
	},
	//编辑登录模版
	editLoginStyle(params: loginListItem) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/login/style/`,
			params
		})
	},
	//查询登录模版
	viewLoginStyle(id: string) {
		return get<baseRes<loginListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/login/style/${id}`
		})
	},
	//查询登录模版
	delLoginStyle(id: string) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/company/login/style/${id}`
		})
	},
	//订单状态
	rackStatus() {
		return get<baseRes<platformsItem>>({
			url: `${urlFunc.requestHost()}/v1/m/company/login/style/rack/status/combo`
		})
	},
	//用户统计-用户总览
	getUser(params: { companyId: string; topicId: string }) {
		return get<baseRes<userDataItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/user/overview`,
			params
		})
	},
	//用户统计-展厅总览
	getUser2(params: { companyId: string; topicId: string }) {
		return get<baseRes<userDataItem2>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/temp/overview`,
			params
		})
	},
	//用户统计-新增趋势
	getUserTrendlData(params: { companyId: string; queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/user/add/trend`,
			params
		})
	},
	//用户统计-展厅新增/发布趋势
	getUserTrendlData2(params: { companyId: string; queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/temp/add/trend`,
			params
		})
	},
	//展厅访问趋势
	getUserTrendlData3(params: { companyId: string; queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/getCallDataBrokenLine`,
			params
		})
	},
	//获取访问数据
	getCallData(params: { companyId: string; obj: string; topicId: string }) {
		return get<baseRes<callDataItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/getCallData`,
			params
		})
	},
	//获取省级分布数据
	getCountProvince(params: brokenLineParams) {
		return get<baseRes<countProvinceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/getCountProvince`,
			params
		})
	},
	//获取国家分布数据
	getCountCountry(params: brokenLineParams) {
		return get<baseRes<countCountryItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/getCountCountry`,
			params
		})
	},
	//获取终端分布数据
	getCountDevice(params: brokenLineParams) {
		return get<baseRes<countDeviceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/getCountDevice`,
			params
		})
	},
	//获取展厅访问榜单
	getAccessRanking(params: brokenLineParams) {
		return get<baseRes<countDeviceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/temp/access/ranking`,
			params
		})
	},
	//获取展厅访问时长
	getAccessTime(params: brokenLineParams) {
		return get<baseRes<countDeviceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/temp/access/time`,
			params
		})
	},
	//根据主题id 查询展厅
	getTempList2(params: tempListParams) {
		return get<baseRes<tempListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/getTempList`,
			params
		})
	},
	//  分页查询用户信息(下拉框专用)
	searchTopic(params: { companyId: string; keyword: string }) {
		return get<baseRes<PageData<userListItem[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/company/topic/list`,
			params
		})
	}
}
