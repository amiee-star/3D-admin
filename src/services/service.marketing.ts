import { baseRes, PageData, PageParams, orderListItem, formTypeItem, platformsItem, salePerson, couponInfo, couponOrderInfo } from "@/interfaces/api.interface"
import { orderListParams, rechargeListParams, addSale, couponList, addDiscount } from "@/interfaces/params.interface"
import { get, postJson, put, del } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//消费记录列表
	orderList(params: orderListParams & PageParams) {
		return get<baseRes<PageData<orderListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/orders`,
			params
		})
	},
	//消费记录列表
	getOrderById(params: { id: number }) {
		return get<baseRes<orderListItem>>({
			url: `${urlFunc.requestHost()}/v1/m/orders/${params.id}`,
			params
		})
	},
	//消费记录服务类型
	getServiceType() {
		return get<baseRes<formTypeItem>>({
			url: `${urlFunc.requestHost()}/v1/m/orders/service/type`
		})
	},
	//充值记录
	rechargeList(params: rechargeListParams & PageParams) {
		return get<baseRes<PageData<orderListItem>>>({
			url: `${urlFunc.requestHost()}/v1/m/recharges`,
			params
		})
	},
	//消费平台
	platforms() {
		return get<baseRes<platformsItem>>({
			url: `${urlFunc.requestHost()}/v1/m/recharges/consume/type`
		})
	},
	//订单状态
	orderStatus() {
		return get<baseRes<platformsItem>>({
			url: `${urlFunc.requestHost()}/v1/m/recharges/status`
		})
	},
	//优惠券列表
  salesmanList(params: {pageNum: number, pageSize: number,name: string }) {
		return get<baseRes<PageData<salePerson>>>({
			url: `${urlFunc.requestHost()}/v1/m/salesman/`,
      params
		})
	},
	//优惠券列表
  addSalesman(params: addSale) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/salesman/`,
      params: params
		})
	},
	//销售人员详情
  salesmanDetail(id: string) {
		return get<baseRes<salePerson>>({
			url: `${urlFunc.requestHost()}/v1/m/salesman/${id}`
		})
	},
	//修改销售人员信息
  salesmanUpdate(params: addSale) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/salesman`,
      params
		})
	},
	//优惠券类型列表
  couponType() {
		return get<baseRes<platformsItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/coupons/types`
		})
	},
	//优惠券列表
  couponsList(params: couponList & PageParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/coupons`,
      params
		})
	},
	//创建优惠券信息
  addCoupon(params: addDiscount) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/coupons`,
      params
		})
	},
	//创建优惠券信息
  updateCoupon(params: addDiscount) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/coupons`,
      params
		})
	},
	//查询优惠券详情
  couponInfo(id: string) {
		return get<baseRes<couponInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/coupons/${id}`
		})
	},
	//删除优惠券信息
  delCoupon(id: string) {
		return del<baseRes<couponInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/coupons/${id}`
		})
	},
	//获取订单详情
  orderDetail(id: string) {
		return get<baseRes<couponOrderInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/coupons/${id}/order/detail`
		})
	}
}
