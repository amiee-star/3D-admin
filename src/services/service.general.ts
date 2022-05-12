import {
	baseRes,
	PageData,
	systemPageItem,
	musicTypeItem,
	hotsPotItem,
	narratorImgItem
} from "@/interfaces/api.interface"
import {
	PageParams,
	addMusicParams,
	systemPageListParams,
	addIconParams,
	addNarratorImgParams
} from "@/interfaces/params.interface"
import { get, patch, post, postJson, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	systemPageList(params: systemPageListParams & PageParams) {
		return get<baseRes<PageData<systemPageItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/music/getSystemPageList`,
			params
		})
	},
	getMusicType() {
		return get<baseRes<musicTypeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/music/getMusicType`
		})
	},
	getMusicById(params: { id: string }) {
		return get<baseRes<systemPageItem>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/music/getById`,
			params
		})
	},
	addMusic(params: addMusicParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/music/addSystemMusic`,
			params
		})
	},
	editMusic(params: addMusicParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/music/editSystemMusic`,
			params
		})
	},
	deleteMusic(params: { musicId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/music/deleteMusic`,
			params
		})
	},
	getIconList() {
		return get<baseRes<hotsPotItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/picture/getIconList`
		})
	},
	getImgList() {
		return get<baseRes<narratorImgItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/scene/common/file/getCartoonList`
		})
	},
	addIcon(params: addIconParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/picture/addIcon`,
			params
		})
	},
	deleteHotPot(params: { picIds: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/picture/deleteIds`,
			params
		})
	},
	//删除解说人物
	deleteNarrator(params: { id: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/common/file/delete`,
			params
		})
	},
	//上传解说人物
	addNarratorImg(params: addNarratorImgParams) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/scene/common/file/addCartoon`,
			params
		})
	}
}
