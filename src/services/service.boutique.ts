import {
	baseRes,
	boutiqueInfo,
	hallInfo,
	PageData,
	sceneListItem,
	styleItem,
	styleListItem,
	templateItem,
	typeItem,
	upFileItem,
	treeItem,
	reselectItem
} from "@/interfaces/api.interface"
import {
	PageParams,
	fineuploadParams,
	saveSceneParams,
	sceneListParams,
	serviceConfigParams
} from "@/interfaces/params.interface"
import { get, post, postJson } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//展厅列表
	boutiqueList(params: sceneListParams & PageParams) {
		return get<baseRes<PageData<sceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/boutique/getPageList`,
			params
		})
	},
	//展厅-类型 查询有效的类型列表
	typeList() {
		return get<baseRes<typeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneType/tree/list`
		})
	},
	//展厅-行业 查询有效的 行业列表
	styleList() {
		return get<baseRes<treeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/tree/list`
		})
	},
	//选择展厅
	templateList(params: { keyword?: string }) {
		return get<baseRes<templateItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/boutique/getTempBaseList`,
			params
		})
	},
	//选择展厅
	templateCaseList(params: { keyword: string }) {
		return get<baseRes<templateItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/case/getTempCaseList`,
			params
		})
	},
	//添加精品展厅
	addBoutique(params: any) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/boutique/addInfo`,
			params
		})
	},
	//修改-获取展厅信息
	getBoutiqueInfo(params: any) {
		return get<baseRes<boutiqueInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/template/boutique/getUpdateInfo`,
			params
		})
	},
	//修改-获取展厅信息
	updateBoutiqueInfo(params: any) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/boutique/updateInfo`,
			params
		})
	},
	//删除精品展厅
	deleteBoutique(params: { boutiqueId: number }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/boutique/deleteById`,
			params
		})
	},
	//回显分类和行业
	reselect(id: string) {
		return get<baseRes<reselectItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/${id}/reselect`
		})
	}
}
