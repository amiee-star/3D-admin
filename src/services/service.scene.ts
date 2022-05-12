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
	renderInfo
} from "@/interfaces/api.interface"
import { PageParams, saveSceneParams, sceneListParams, editSceneParams } from "@/interfaces/params.interface"
import { get, patch, post, postJson, del, put } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	login(params: { username: string; password: string }) {
		return postJson<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/login`,
			params
		})
	},
	register(params: { verificationCode: number; telephone: number; password: string; rePassword: string }) {
		return postJson<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/api/index/register`,
			params
		})
	},
	phoneCode(params: number) {
		return get<baseRes<boolean>>({
			url: `${urlFunc.requestHost()}/v1/api/index/send/${params}`
		})
	},
	logout() {
		return get<baseRes<boolean>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/logout`
		})
	},
	fineupload(params: FormData) {
		return post<baseRes<upFileItem>>({
			url: `${urlFunc.requestHost()}/v1/m/file/part`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	},
	fileCancel(params: { uuid: string }) {
		return del<baseRes<any>>({
			url: `${urlFunc.requestHost()}/v1/m/file/cancel/${params.uuid}`
		})
	},
	fileupload(params: FormData) {
		return post<baseRes<upFileItem>>({
			url: `${urlFunc.requestHost()}/v1/m/file`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
		})
	},
	sceneList(params: sceneListParams & PageParams) {
		return get<baseRes<PageData<sceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/page`,
			params
		})
	},
	saveScene(params: saveSceneParams) {
		return postJson<baseRes<PageData<sceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/`,
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
	// 询渲染列表
	renderQueue(params: PageParams) {
		return get<baseRes<renderQueueItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/render/queue`,
			params
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
