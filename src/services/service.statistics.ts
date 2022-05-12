import {
	baseRes,
	PageData,
	callDataItem,
	brokenLineItem,
	countProvinceItem,
	countCountryItem,
	countDeviceItem,
	tempListItem,
	overviewDataItem,
	ratioDataItem,
	rankingListItem,
	userDataItem
} from "@/interfaces/api.interface"
import { PageParams, brokenLineParams, tempListParams } from "@/interfaces/params.interface"
import { get, patch, post, postJson, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//获取访问数据
	getCallData(params: { obj: string; userId: string }) {
		return get<baseRes<callDataItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/getCallData`,
			params
		})
	},
	//获取展厅访问趋势
	getCallDataBrokenLine(params: brokenLineParams) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/getCallDataBrokenLine`,
			params
		})
	},
	//获取省级分布数据
	getCountProvince(params: brokenLineParams) {
		return get<baseRes<countProvinceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/getCountProvince`,
			params
		})
	},
	//获取国家分布数据
	getCountCountry(params: brokenLineParams) {
		return get<baseRes<countCountryItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/getCountCountry`,
			params
		})
	},
	//获取终端分布数据
	getCountDevice(params: brokenLineParams) {
		return get<baseRes<countDeviceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/getCountDevice`,
			params
		})
	},
	//获取展厅访问榜单
	getAccessRanking(params: brokenLineParams) {
		return get<baseRes<countDeviceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/temp/access/ranking`,
			params
		})
	},
	//获取展厅访问时长
	getAccessTime(params: brokenLineParams) {
		return get<baseRes<countDeviceItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/temp/access/time`,
			params
		})
	},
	//根据用户id查询展厅
	getTempList(params: tempListParams) {
		return get<baseRes<tempListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/tbl/event/getTempList`,
			params
		})
	},
	//展厅统计-展厅总览
	getOverviewData() {
		return get<baseRes<overviewDataItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/temp/overview`
		})
	},
	//展厅统计-类型占比
	getRatioData(params: { typeRatio: number }) {
		return get<baseRes<ratioDataItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/temp/type/ratio`,
			params
		})
	},
	//展厅统计-新增趋势
	getTrendlData(params: { queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/temp/add/trend`,
			params
		})
	},
	//用户统计-新增趋势
	getUserTrendlData(params: { queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/user/add/trend`,
			params
		})
	},
	//用户统计-用户展厅数量分布
	getUserTemp(params: { tempType: number }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/user/temp/trend`,
			params
		})
	},
	//展厅统计-新增趋势
	getPublishlData(params: { queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/temp/publish/trend`,
			params
		})
	},
	//精品模板统计-精品模板榜单
	getRankingList(params: { year: string; month: string }) {
		return get<baseRes<rankingListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/boutique/ranking/list`,
			params
		})
	},
	//精品模板统计-精品模板新增趋势
	getBoutiqueAdds(params: { queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<brokenLineItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/boutique/add/trend`,
			params
		})
	},
	//精品模板统计-类型占比
	getBoutiqueRatioData(params: { typeRatio: number }) {
		return get<baseRes<ratioDataItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/boutique/type/ratio`,
			params
		})
	},
	//用户统计-用户总览
	getUser(params: { queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<userDataItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/user/overview/new`,
			params
		})
	},
	//用户统计-用户总览
	getUser2(params: { queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<userDataItem>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/user/overview/new/baidu`,
			params
		})
	},
	//用户统计-用户总览
	getUserRatio(params: { queryType: number; startTimeStr: string; endTimeStr: string }) {
		return get<baseRes<ratioDataItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/statistics/user/type/ratio`,
			params
		})
	}
}
