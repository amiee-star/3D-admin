import { baseRes, PageData, stylesListItem, typeListItem, treeItem } from "@/interfaces/api.interface"
import { stylesListParams, styleParams, typeListParams, typeParams } from "@/interfaces/params.interface"
import { get, patch, post, postJson, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	getStylesList(params: stylesListParams) {
		return get<baseRes<stylesListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/new/page/list`,
			params
		})
	},
	stylesTree() {
		return get<baseRes<treeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/one/list`
		})
	},
	getTypeList(params: stylesListParams) {
		return get<baseRes<typeListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneType/new/page/list`,
			params
		})
	},
	typeTree() {
		return get<baseRes<typeListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneType/one/list`
		})
	},
	addStyle(params: styleParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/add/new`,
			params
		})
	},
	addType(params: typeParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sceneType/add/new`,
			params
		})
	},
	getStyleById(params: { id: string }) {
		return get<baseRes<stylesListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/getById`,
			params
		})
	},
	getTypeById(params: { id: string }) {
		return get<baseRes<typeListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneType/getById`,
			params
		})
	},
	updateStyle(params: styleParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/updateInfo`,
			params
		})
	},
	updateType(params: typeParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sceneType/updateInfo`,
			params
		})
	},
	deleteStyle(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/delete`,
			params
		})
	},
	deleteType(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sceneType/delete`,
			params
		})
	}
}
