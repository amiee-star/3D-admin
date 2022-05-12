import {
	authInfoData,
	baseRes,
	PageData,
	sceneListItem,
	upFileItem,
	userData,
	userListItem,
	platformsItem,
	renderQueueItem,
	renderInfo,
	templateListItem,
	templateItem,
	addHallParams,
	hallListItem,
	hallItem
} from "@/interfaces/4Dapi.interface"

import {
	PageParams,
	addTemplatesParams,
	sceneListParams,
	editSceneParams,
	cloneHallParams
} from "@/interfaces/4Dparams.interface"
import { get, patch, post, postJson, del, put, fromData } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	// 添加模板
	addTemplates(params: addTemplatesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/`,
			params
		})
	},

	// 模板列表
	templateList(params: PageParams) {
		return get<baseRes<PageData<templateListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/`,
			params
		})
	},

	// 展厅列表种的模板列表
	templateList2(params: any) {
		return get<baseRes<PageData<templateListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/search`,
			params
		})
	},

	// 删除模板
	deleteTemplate(params: string) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/${params}`,
			params
		})
	},

	// 批量删除模板
	deleteTemplates(params: { ids: any[] }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/batch`,
			params
		})
	},

	// 修改模板
	updateTemplate(params: addTemplatesParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/`,
			...params
		})
	},

	// 更新模板
	updateChangeTemplate(params: any) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/change/`,
			...params
		})
	},

	// 查看模板详情
	getTemplateInfo(params: string) {
		return get<baseRes<templateItem>>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/${params}`,
			params
		})
	},

	//  分页查询用户信息(下拉框专用)
	searchUsers(params: { keyword: string }) {
		return get<baseRes<PageData<userListItem[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/combo`,
			params
		})
	},

	//校验有效面积
	validArea(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/scene/${params.id}/validate/valid/area`
		})
	},

	//添加展厅
	addHall(params: addHallParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/`,
			params
		})
	},

	// 展厅列表
	hallList(params: PageParams) {
		return get<baseRes<PageData<hallListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/`,
			params
		})
	},

	// 删除展厅
	deleteHall(params: string) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/${params}`,
			params
		})
	},

	// 批量删除模板
	deleteHalls(params: { ids: any[] }) {
		console.log(params)
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/batch`,
			params
		})
	},

	// 修改展厅
	updateHall(params: addHallParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/`,
			...params
		})
	},

	// 查看展厅详情
	getHallInfo(params: string) {
		return get<baseRes<hallItem>>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/${params}`,
			params
		})
	},

	// 发布展厅
	publishHall(params: string) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/${params}/publish`
		})
	},

	// 复制展厅
	cloneHall(params: cloneHallParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/new/template/copy`,
			params
		})
	},
	//!!!!!!
	//  获取来源
	sceneFrom() {
		return get<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/combox`
		})
	},
	//  修改模板信息
	editScene(params: editSceneParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene`,
			...params
		})
	},
	// 删除模型
	deleteScene(params: string) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/${params}`
		})
	},
	// 更新模型
	updateObj(params: { objUrl: string; objFileSize: number; sid: string }) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/obj`,
			...params
		})
	},
	// 更新全景图
	updatePano(params: { panoUrl: string; panoSize: number; sid: string }) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/pano`,
			...params
		})
	},
	// 导入模版
	updateImport(params: { type: number; name: string; url: string }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/import`,
			params
		})
	},
	// 查询模板信息
	getSceneInfo(params: { id: string }) {
		return get<baseRes<editSceneParams>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/${params.id}`
		})
	},
	// 获取模板来源列表
	getSceneFromList(params: { id: string }) {
		return get<baseRes<[]>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/${params.id}/src`
		})
	},
	// 查询用户角色与授权资源信息
	getMemuList(params: { id: string }) {
		return get<baseRes<authInfoData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/${params.id}/auth/info`
		})
	},
	// 模板小地图
	miniMap(id: string, params: FormData) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/${id}/small/map`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	},
	scenePublish(id: string) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/${id}/publish`
		})
	},
	resetNeighbors(id: string) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/${id}/reset/neighbors`
		})
	},
	// 展厅小地图
	miniTempMap(id: string, params: FormData) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/${id}/temp/map`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	},
	// 渲染状态
	renderFlowStatus() {
		return get<baseRes<platformsItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getRenderStatusList`
		})
	},

	// 置顶
	topping(params: string) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/render/queue/${params}/top`
		})
	},
	// 取消排队
	cancelQueue(params: string) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/render/queue/${params}/cancel`
		})
	},
	// 查看渲染详情
	viewRenderInfo(params: string) {
		return get<baseRes<renderInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/template/render/queue/${params}`
		})
	},
	// 查看渲染详情
	reshading(params: string) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/${params}/rerender`
		})
	}
}
