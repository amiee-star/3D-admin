import {
	baseRes,
	PageData,
	formListItem,
	formTypeItem,
	bannerListItem,
	sortTypeItem,
	caseListItem,
	hcaseListItem,
	sortListItem,
	bindcaseItem,
	upgradeListItem,
	upgradeEditItem,
	polymerizationInfo,
	visitorsListItem
} from "@/interfaces/api.interface"
import {
	PageParams,
	formsParams,
	handleFormParams,
	bannerListParams,
	bannerParams,
	caseParams,
	caseListParams,
	hallListParams,
	bindcaseParams,
	polymerizationParams,
	addPolymerization,
	currencyParams,
	upgradeAddInfoParams,
	visitorsListParams,
	exportVisitorsParams
} from "@/interfaces/params.interface"
import { get, post, postJson, del, put, postBlob } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//表单列表
	formList(params: formsParams & PageParams) {
		return get<baseRes<PageData<formListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/forms`,
			params
		})
	},

	//查询定制类型列表
	getFormType() {
		return get<baseRes<formTypeItem>>({
			url: `${urlFunc.requestHost()}/v1/m/forms/custom/type`
		})
	},
	//查询定制类型列表
	getFormTypeHall() {
		return get<baseRes<formTypeItem>>({
			url: `${urlFunc.requestHost()}/v1/m/form/customs/type`
		})
	},
	//查询定制类型列表
	getFormStatus() {
		return get<baseRes<formTypeItem>>({
			url: `${urlFunc.requestHost()}/v1/m/forms/handle/status`
		})
	},
	//删除表单
	deleteForm(params: { id: number }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/forms/${params.id}`
		})
	},
	//展厅定制删除表单
	deleteHallForm(params: { id: number }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/form/customs/${params.id}`
		})
	},
	//处理表单
	handleForm(params: handleFormParams) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/forms/handle`,
			params
		})
	},
	//展厅定制处理
	hallHandleForm(params: handleFormParams) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/form/customs/handle`,
			params
		})
	},
	// 关联展厅
	getBindCase(params: bindcaseParams) {
		return get<baseRes<bindcaseItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/getBindCase`,
			params
		})
	},
	//banner
	bannerList(params: bannerListParams & PageParams) {
		return get<baseRes<PageData<bannerListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/banners`,
			params
		})
	},
	//Banner类型列表
	getBannerType() {
		return get<baseRes<formTypeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/banners/type`
		})
	},
	//新增banner
	addBanner(params: bannerParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/banners`,
			params
		})
	},
	//查询Banner详情
	getBannerById(params: { id: number }) {
		return get<baseRes<bannerListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/banners/${params.id}`
		})
	},
	//修改Banner详情
	updateBanner(params: bannerParams) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/banners`,
			params
		})
	},
	//删除banner
	deleteBanner(params: { id: number }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/banners/${params.id}`
		})
	},
	//查询行业分类列表
	getIndustryList(params: { keyword: string }) {
		return get<baseRes<sortTypeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/trades/combo`,
			params
		})
	},
	//精品案例列表
	getCaseList(params: caseParams & PageParams) {
		return get<baseRes<PageData<caseListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/getPageList`,
			params
		})
	},
	//添加精品案例
	addCase(params: caseParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/addInfo`,
			params
		})
	},
	//根据id查询精品案例
	getCaseById(params: { id: string }) {
		return get<baseRes<caseListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/getById`,
			params
		})
	},
	//根据id查询精品案例
	getUpdateCase(params: { id: string }) {
		return get<baseRes<caseListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/getUpdateInfo`,
			params
		})
	},
	//根据id查询精品案例
	updateCase(params: caseParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/updateInfo`,
			params
		})
	},
	//删除精品案例
	deleteCase(params: { id: number }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/deleteById`,
			params
		})
	},
	//行业案例列表
	caseList(params: caseListParams & PageParams) {
		return get<baseRes<PageData<hcaseListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/trade/cases`,
			params
		})
	},
	//查询行业案例详情
	getHCaseListById(params: { id: number }) {
		return get<baseRes<hcaseListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/trade/cases/${params.id}`
		})
	},
	//添加行业案例
	addCaseList(params: caseListParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/trade/cases`,
			params
		})
	},
	//修改行业案例
	updatehCase(params: caseListParams) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/trade/cases`,
			params
		})
	},
	//行业分类列表
	sortList(params: caseListParams & PageParams) {
		return get<baseRes<PageData<sortListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/trades`,
			params
		})
	},
	//添加行业分类
	addSortList(params: caseListParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/trades`,
			params
		})
	},
	getSortById(params: { id: number }) {
		return get<baseRes<sortListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/trades/${params.id}`
		})
	},
	//修改行业分类
	updatehSort(params: caseListParams) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/trades`,
			params
		})
	},
	//删除行业分类
	deleteSort(params: { id: number }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/trades/${params.id}`
		})
	},
	//删除行业案例
	deletehCase(params: { id: number }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/trade/cases/${params.id}`
		})
	},
	bannnerShowType() {
		return get<baseRes<formTypeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/banners/show/type`
		})
	},
	//获取展厅定制列表
	hallList(params: hallListParams & PageParams) {
		return get<baseRes<PageData<sortListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/form/customs`,
			params
		})
	},
	// 获取聚合分页列表
	getPolymerizationList(params: polymerizationParams & PageParams) {
		return get<baseRes<PageData<sortListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/agg/banners`,
			params
		})
	},
	// 新增聚合页
	addPolymerization(params: addPolymerization) {
		return postJson<baseRes<PageData<sortListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/agg/banners`,
			params
		})
	},
	// 删除聚合页
	delPolymerization(params: { id: number }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/agg/banners/${params.id}`
		})
	},
	// 查询聚合页详情
	getPolymerizationInfo(params: { id: number }) {
		return get<baseRes<polymerizationInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/template/agg/banners/${params.id}`
		})
	},
	// 编辑聚合页
	editPolymerization(params: polymerizationParams & PageParams) {
		return put<baseRes<PageData<sortListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/agg/banners`,
			params
		})
	},
	//迭代列表
	getupgradeList(params: currencyParams) {
		return get<baseRes<PageData<upgradeListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/upgrade/getPageList`,
			params
		})
	},
	//添加迭代
	upgradeAddInfo(params: upgradeAddInfoParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/upgrade/addInfo`,
			params
		})
	},
	//编辑迭代
	upgradeEditInfo(params: upgradeAddInfoParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/upgrade/editInfo`,
			params
		})
	},
	//编辑查询
	upgradeGetEditInfo(params: { id: string }) {
		return get<baseRes<upgradeEditItem>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/upgrade/getEditInfo`,
			params
		})
	},
	//删除
	upgradeDelete(params: { id: string }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/upgrade/delete`,
			params
		})
	},
	//获取访客信息列表
	visitorsList(params: visitorsListParams & PageParams) {
		return postJson<baseRes<PageData<visitorsListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/visitors`,
			params
		})
	},
	//导出前端用户
	exportVisitors(params: exportVisitorsParams) {
		return postBlob<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/visitors/export`,
			params
		})
	}
}
