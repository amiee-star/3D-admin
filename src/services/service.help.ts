import { baseRes, PageData, stylesListItem, typeListItem, getSortListItem } from "@/interfaces/api.interface"
import {
	PageParams,
	stylesListParams,
	helpVideoParams,
	getHelpVideoInfoParams,
	fileClassificationParams,
	delFileClassificationParams,
	fileDetailListParams,
	delFileDetailParams,
	addFileDetailParams,
	problemParams,
	typeParams,
	styleParams,
	addProblemParams
} from "@/interfaces/params.interface"
import { get, patch, post, postJson, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	// 帮助视频列表
	getHelpVideoList(params: stylesListParams) {
		return get<baseRes<stylesListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/video/getPageList`,
			params
		})
	},
	//添加帮助视频
	addHelpVideo(params: helpVideoParams) {
		return post<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/video/addInfo`,
			params
		})
	},
	//编辑帮助视频
	updateHelpVideo(params: helpVideoParams) {
		return post<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/video/updateInfo`,
			params
		})
	},
	//查看帮助视频
	getHelpVideoInfo(params: getHelpVideoInfoParams) {
		return get<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/video/getInfo`,
			params
		})
	},
	//删除视频
	delHelpVideoInfo(params: getHelpVideoInfoParams) {
		return del<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/video/delete`,
			params
		})
	},

	// 文档详情列表
	getFileDetailList(params: fileDetailListParams) {
		return get<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/info/getPageList`,
			params
		})
	},
	// 添加文档详情
	addFileDetail(params: addFileDetailParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/info/addInfo`,
			params
		})
	},
	// 删除文档详情
	delFileDetail(params: delFileDetailParams) {
		return del<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/info/delete`,
			params
		})
	},
	// 查询文档详情信息
	getFileDetailInfo(params: delFileDetailParams) {
		return get<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/info/getInfo`,
			params
		})
	},
	// 编辑文档详情
	updateFileDetail(params: addFileDetailParams) {
		return post<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/info/updateInfo`,
			params
		})
	},
	// 问题分页列表
	getProblemList(params: problemParams) {
		return get<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/issue/getPageList`,
			params
		})
	},
	// 添加问题
	addProblem(params: addProblemParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/issue/addInfo`,
			params
		})
	},
	// 修改问题
	updateProblem(params: addProblemParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/issue/updateInfo`,
			params
		})
	},
	// 删除问题
	delProblem(params: delFileClassificationParams) {
		return del<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/issue/delete`,
			params
		})
	},
	// 查询问题信息
	getProblemInfo(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/issue/getInfo`,
			params
		})
	},

	// 添加文档分类
	addType(params: styleParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/category/addInfo`,
			params
		})
	},
	// 修改文档分类
	updateFile(params: styleParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/category/updateInfo`,
			params
		})
	},
	// 查询文档分类信息
	getStyleById(params: { id: string }) {
		return get<baseRes<stylesListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/category/getInfo`,
			params
		})
	},
	// 文档分类列表
	getStylesList(params: fileClassificationParams) {
		return get<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/category/getPageList`,
			params
		})
	},
	// 删除文档
	delFileClassification(params: delFileClassificationParams) {
		return del<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/category/delete`,
			params
		})
	},
	// 分类列表
	getSortList() {
		return get<baseRes<getSortListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/help/doc/category/getList`
		})
	}
}
