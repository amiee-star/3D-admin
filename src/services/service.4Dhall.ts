import { addHallParams, hallItem, hallListItem, PageData } from "@/interfaces/4Dapi.interface"
import { cloneHallParams } from "@/interfaces/4Dparams.interface"
import { baseRes, upFileItem } from "@/interfaces/api.interface"
import {
	PageParams,
	fineuploadParams,
	saveSceneParams,
	sceneListParams,
	serviceConfigParams
} from "@/interfaces/params.interface"
import { get, post, postJson, del, patch } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	fileupload(params: FormData) {
		return post<baseRes<upFileItem>>({
			url: `${urlFunc.requestHost()}/v1/m/file/upload/new`,
			params,
			headers: {
				"Content-Type": "multipart/form-data;"
			}
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
	}
}
