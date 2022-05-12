import { baseRes, PageData, commentListItem } from "@/interfaces/api.interface"
import { commentListParams, PageParams } from "@/interfaces/params.interface"
import { get } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//评论列表
	commemtList(params: commentListParams & PageParams) {
		return get<baseRes<PageData<commentListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/template/getPageList`,
			params
		})
	},
	// 删除评论
	deleteComment(params: { tempId: string }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/template/deleteById`,
			params
		})
	}
}
