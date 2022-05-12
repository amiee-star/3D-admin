import {
	baseRes,
	hallInfo,
	hallTableInfo,
	PageData,
	sceneListItem,
	styleItem,
	styleListItem,
	templateItem,
	typeItem,
	upFileItem,
	userData,
	seviceConfigItem,
	zuheSceneListItem,
	platformsItem,
	pricelistItem
} from "@/interfaces/api.interface"
import {
	PageParams,
	fineuploadParams,
	saveSceneParams,
	sceneListParams,
	serviceConfigParams
} from "@/interfaces/params.interface"
import { get, post, postJson, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//展厅列表
	hallList(params: sceneListParams & PageParams) {
		return get<baseRes<PageData<sceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getPageList`,
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
		return get<baseRes<styleItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sceneStyle/tree/list`
		})
	},
	pricelist() {
		return get<baseRes<pricelistItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/area/price/list`
		})
	},
	//展厅-模板-列表 查询有效的 展厅-模板-列表
	templateList(params?: { keywords: string }) {
		return get<baseRes<templateItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/getList`,
			params
		})
	},
	//来源 查询有效的 来源列表
	sceneFrom() {
		return get<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getSceneFromList`
		})
	},
	//查询展厅发布状态下位框值
	publishStatus() {
		return get<baseRes<platformsItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/publish/status`
		})
	},
	//查询展厅发布状态下位框值
	addedServices() {
		return get<baseRes<platformsItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/value/added/services`
		})
	},
	//添加展厅
	addHall(params: sceneListParams & PageParams) {
		return postJson<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/template/addInfo`,
			params
		})
	},
	//校验有效面积
	validArea(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/${params.id}/validate/valid/area`
		})
	},
	//校验有效面积
	validArea2(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/${params.id}/validate/valid/area`
		})
	},
	// 查看展厅信息
	getHallInfo(params: { tempId: string }) {
		return get<baseRes<hallTableInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getTemplateInfo`,
			params
		})
	},
	// 查询-修改展厅
	checkEditHall(params: { tempId: string }) {
		return get<baseRes<hallInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getUpdateInfo`,
			params
		})
	},
	// 修改展厅
	editHall(params: hallInfo) {
		return postJson<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/template/updateInfo`,
			params
		})
	},
	// 查看展厅信息
	checkHall(params: { tempId: string }) {
		return postJson<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getTemplateInfo`,
			params
		})
	},
	// 复制展厅
	cloneHall(params: { tempId: string; newTempName: string; newUserId: string }) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/copyInfo`,
			params
		})
	},
	// 发布展厅
	publishHall(params: { tempId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/${params.tempId}/publish`
		})
	},
	// 查询-展厅增值服务配置
	getSeviceConfig(params: { tempId: string }) {
		return get<baseRes<seviceConfigItem>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getServiceConfig`,
			params
		})
	},
	// 修改-展厅增值服务配置
	setSeviceConfig(params: serviceConfigParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/updateServiceConfig`,
			params
		})
	},
	// 删除展厅
	deleteHall(params: { tempId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/deleteById`,
			params
		})
	},
	// 重渲展厅
	rerenderHall(params: { tempId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/${params.tempId}/rerender`,
			params
		})
	},
	// 更新临界点
	closestHall(params: { tempId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/${params.tempId}/update/adjacent`,
			params
		})
	},
	//组合展厅列表
	zuheHallList(params: sceneListParams & PageParams) {
		return get<baseRes<PageData<sceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/group/getPageList`,
			params
		})
	},
	// 删除组合展厅
	deleteZuheHall(params: { groupId: string }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/group/delete`,
			params
		})
	},
	//添加组合展厅
	addZuheHall(params: {
		groupName: string
		buttonName: string
		describe: string
		tempGroupListStr: string
		coverUrl: string
		phoneCoverUrl: string
	}) {
		return post<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/template/group/addInfo`,
			params
		})
	},
	//关联组合展厅列表
	getZuheTempList(params: { userKeywords: string; tempKeywords: string }) {
		return get<baseRes<zuheSceneListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/template/group/getTempList`,
			params
		})
	},
	//组合展厅回显
	getUpdateInfo(params: { groupId: string }) {
		return get<baseRes<PageData<zuheSceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/group/getUpdateInfo`,
			params
		})
	},
	//编辑组合展厅
	updateInfo(params: {
		groupId: string
		groupName: string
		buttonName: string
		describe: string
		tempGroupListStr: string
		coverUrl: string
		phoneCoverUrl: string
	}) {
		return post<baseRes<PageData<zuheSceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/group/updateInfo`,
			params
		})
	},
	//上传
	getfile(params: any) {
		return postJson<baseRes<PageData<zuheSceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/file`,
			params
		})
	},
	//展厅二维码
	generateQRCode(params: { url: string }) {
		return get<baseRes<PageData<zuheSceneListItem>>>({
			url: `${urlFunc.requestHost()}/scene-portal/generateQRCode`,
			params
		})
	},
	//展厅二维码
	getGroupTempId(params: { groupId: string }) {
		return get<baseRes<PageData<zuheSceneListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/group/getGroupTempId`,
			params
		})
	}
}
