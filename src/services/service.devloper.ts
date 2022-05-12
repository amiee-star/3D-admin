import {
	baseRes,
  mealInfo,
  mealList,
  tempParams,
  devInfo,
  devAddtemp,
  tempInfo,
  resoureInfo,
  UserTemp,
  hallTableInfo,
  hallInfo
} from "@/interfaces/api.interface"
import {
  developersParams,
  updateDevParams,
  updateSourceParams
} from "@/interfaces/params.interface"
import { get, post, postJson, patch, put, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"
import { DataNode } from "antd/lib/tree"

export default {
	//开发者列表
  developersList(params: developersParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers`,
      params
		})
	},
	//修改开发者信息
  updateDevelopers(params: updateDevParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/`,
      params
		})
	},
	//开发者信息
  developersInfo(id: string) {
		return get<baseRes<devInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${id}`
		})
	},
	//调整资源配置
  developersPackage(params: updateSourceParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/package`,
      params
		})
	},
	//查询开发者增购详情
  mealInfo(devId: string) {
		return get<baseRes<mealInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${devId}/extra`
		})
	},
	//查询套餐列表
  packagesList(id: string) {
		return get<baseRes<mealList>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${id}/packages`,
		})
	},
	//套餐绑定功能
  bindMeal(params: {packageId: string, devId: string}) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/bind/package`,
      params
		})
	},
	//套餐绑定功能
  devTemList(params: tempParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getPageList`,
      params
		})
	},
	//新增开发者展厅
  devAddTemp(params: devAddtemp) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/addInfo`,
      params
		})
	},
	//拉取展厅列表
  devgetTempList(params: {keyword: string, type: number}) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getTempList`,
      params
		})
	},
	//删除开发者展厅
  devTempDelete(params: {devId: string}) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/delete`,
      params
		})
	},
	//开发者展厅配置信息
  devTempInfo(params: {id: string}) {
		return get<baseRes<tempInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getUpdate`,
      params
		})
	},
	//开发者修改 名称 创建属性
  devTempUpdate(params: {devId: string,tempName: string,createType: number,}) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/update`,
      params
		})
	},
	//开发者资源信息
  devResources(id: string) {
		return get<baseRes<resoureInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${id}/resources`
		})
	},
	//开发者资源信息
  getUserTempPageList(params: UserTemp) {
		return get<baseRes<resoureInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getUserTempPageList`,
      params
		})
	},
	//复制开发者展厅
  copyDevUserTemp(params: {tempId: string, tempName: string, userId: string}) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/copyDevUserTemp`,
      params
		})
	},
	//开发者用户 - 列表
  getDevUserList(params: {devUserId: string, keywords: string}) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getDevUserList`,
      params
		})
	},
	//开发者用户 - 删除展厅
  deleteDevUserTemp(params:{tempId: string,devUserId: string}) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/deleteDevUserTemp`,
      params
		})
	},
	//开发者用户 - 发布展厅
  publishDevUserTemp(params:{tempId: string,devUserId: string}) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/publishDevUserTemp`,
      params
		})
	},
	//开发者用户 - 查看
  getDevUserTempInfo(tempId: string) {
		return get<baseRes<hallTableInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getDevUserTempInfo?tempId=${tempId}`,
		})
	},
	//开发者用户 -修改展厅-查询
  getUpdateDevUserTemp(tempId: string) {
		return get<baseRes<hallInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getUpdateDevUserTemp?tempId=${tempId}`,
		})
	},
	//开发者用户 -修改展厅
  updateDevUserTemp(params: {}) {
		return post<baseRes<hallInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/updateDevUserTemp`,
      params
		})
	}
}
