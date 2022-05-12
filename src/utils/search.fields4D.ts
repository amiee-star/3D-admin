import { FieldItem, OptionItem } from "@/components/form/form.search"
import serviceHall from "@/services/service.hall"
import serviceScene from "@/services/service.scene"
import serviceSystem from "@/services/service.system"
import serviceBusiness from "@/services/service.business"
import { baseRes, PageData, styleListItem } from "@/interfaces/api.interface"
import serviceGeneral from "@/services/service.general"
import serviceOperate from "@/services/service.operate"
import serviceMarketing from "@/services/service.marketing"
import serviceHelp from "@/services/service.help"
const asyncData = (apiService?: () => Promise<baseRes<any>>, keyArr: string[] = ["txt", "value"]) => async (): Promise<
	OptionItem[]
> => {
	let optionList = await apiService()
	const newData = optionList.data.map((item: any) => {
		return mapTree(item, keyArr)
	})
	newData.unshift({ txt: "全部", value: "" })
	return newData
}
const mapTree = (item: any, keyArr: string[]) => {
	const haveChildren = item.children && item.children.length > 0
	return {
		value: item[keyArr[0]],
		txt: item[keyArr[1]],
		children: haveChildren ? item.children.map((i: any) => mapTree(i, keyArr)) : null
	}
}

const searchFiels: Record<string, FieldItem> = {
	//!!!!!!
	templateId: {
		name: "id",
		title: "模板ID",
		type: "text"
	},
	templateName: {
		name: "name",
		title: "模板名称",
		type: "text"
	},
	createUsername: {
		name: "createUsername",
		title: "创建人",
		type: "text"
	},

	visionDone: {
		name: "status",
		title: "处理状态",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 0,
				txt: "未处理"
			},
			{
				value: 1,
				txt: "处理中"
			},
			,
			{
				value: 2,
				txt: "已完成"
			}
		]
	},
	area: {
		name: "code",
		title: "面积",
		type: "select",
		data: asyncData(serviceHall.pricelist, ["id", "name"])
	},
	startTime: {
		name: "startTime",
		title: "开始时间",
		type: "date"
	},
	endTime: {
		name: "endTime",
		title: "结束时间",
		type: "date"
	},
	hallName: {
		name: "name",
		title: "展厅名称",
		type: "text"
	},
	hallId: {
		name: "id",
		title: "展厅ID",
		type: "text"
	},
	username: {
		name: "createUsername",
		title: "所属人",
		type: "text"
	},
	isCheck: {
		name: "check",
		title: "访问状态",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "正常访问"
			},
			{
				value: 2,
				txt: "禁止访问"
			}
		]
	},
	aliStatic: {
		name: "aliStatic",
		title: "发布状态",
		type: "select",
		data: asyncData(serviceHall.publishStatus, ["key", "value"])
	},
	//!!!!
	id: {
		name: "id",
		title: "ID",
		type: "text"
	},
	keyword: {
		name: "keyword",
		title: "请输入关键词",
		type: "text"
	},
	Zkeyword: {
		name: "keywords",
		title: "请输入关键词",
		type: "text"
	},
	Wname: {
		name: "name",
		title: "请输入关键词",
		type: "text"
	},

	userSource: {
		name: "params",
		title: "用户来源",
		type: "cascader",
		data: asyncData(serviceSystem.userForm, ["key", "value"])
	},
	userSceneType: {
		name: "userSceneType",
		title: "用户类型",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "已建展"
			},
			{
				value: 2,
				txt: "已布展"
			},
			{
				value: 3,
				txt: "已发布"
			}
		]
	},
	name: {
		name: "name",
		title: "计划名称",
		type: "text"
	},
	tempId: {
		name: "tempId",
		title: "展厅ID",
		type: "text"
	},
	WtempId: {
		name: "tempId",
		title: "模版ID",
		type: "text"
	},
	tempName: {
		name: "tempName",
		title: "展厅名称",
		type: "text"
	},

	startTime2: {
		name: "startTime",
		title: "开始时间",
		type: "dateTime"
	},

	endTime2: {
		name: "endTime",
		title: "结束时间",
		type: "dateTime"
	},
	sceneId: {
		name: "sceneNameOrId",
		title: "模板",
		type: "text"
	},
	WstyleName: {
		name: "name",
		title: "请输入行业名称",
		type: "text"
	},
	WtypeName: {
		name: "name",
		title: "请输入分类名称",
		type: "text"
	},
	phoneOrName: {
		name: "phoneOrName",
		title: "手机号或名称",
		type: "text"
	},
	typeId: {
		name: "typeId",
		title: "分类",
		type: "select",
		data: asyncData(serviceHall.typeList, ["code", "name"])
	},

	// typeIdList: {
	// 	name: "typeIdList",
	// 	title: "分类",
	// 	type: "select",
	// 	data: asyncData(serviceHall.typeList, ["typeIdList", "name"])
	// },
	// styleIdList: {
	// 	name: "styleIdList",
	// 	title: "行业",
	// 	type: "select",
	// 	data: asyncData(serviceHall.styleList, ["styleIdList", "name"])
	// },
	styleId: {
		name: "styleId",
		title: "行业",
		type: "select",
		data: asyncData(serviceHall.styleList, ["code", "name"])
	},

	templateSceneFrom: {
		// 模板来源
		name: "srcSubType",
		title: "来源",
		type: "select",
		data: asyncData(serviceScene.sceneFrom, ["key", "value"])
	},
	HallSceneFrom: {
		// 展厅来源
		name: "sceneFromVal",
		title: "来源",
		type: "select",
		data: asyncData(serviceHall.sceneFrom, ["key", "value"])
	},

	renderFlowStatus: {
		name: "renderFlowStatus",
		title: "渲染进度",
		type: "select",
		data: asyncData(serviceScene.renderFlowStatus, ["key", "value"])
	},
	createType: {
		name: "createType",
		title: "创建属性",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "空白模板"
			},
			{
				value: 2,
				txt: "复制模板"
			}
		]
	},
	WsynchState: {
		name: "synchState",
		title: "同步状态",
		type: "select",
		data: [
			{
				value: 1,
				txt: "未同步"
			},
			{
				value: 2,
				txt: "已同步"
			},
			{
				value: 3,
				txt: "同步失败"
			},
			{
				value: 4,
				txt: "同步中"
			}
		]
	},
	Wstate: {
		name: "state",
		title: "审核状态",
		type: "select",
		data: [
			{
				value: 0,
				txt: "全部"
			},
			{
				value: 1,
				txt: "未审核"
			},
			{
				value: 2,
				txt: "通过"
			},
			{
				value: 3,
				txt: "未通过"
			}
		]
	},
	Wua: {
		name: "ua",
		title: "来源",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: "wxapp",
				txt: "小程序"
			},
			{
				value: API_ENV == "pro" ? "art-core" : "art-core-mo",
				txt: "官网"
			}
		]
	},
	DsynchState: {
		name: "syncStatic",
		title: "同步状态",
		type: "select",
		data: [
			{
				value: 1,
				txt: "未同步"
			},
			{
				value: 2,
				txt: "已同步"
			},
			{
				value: 3,
				txt: "同步失败"
			},
			{
				value: 4,
				txt: "同步中"
			}
		]
	},
	WaddServices: {
		name: "serverType",
		title: "增值服务",
		type: "select",
		data: [
			{
				value: 1,
				txt: "在线客服"
			},
			{
				value: 2,
				txt: "直播"
			},
			{
				value: 3,
				txt: "访客信息"
			},
			{
				value: 4,
				txt: "在线表单"
			},
			{
				value: 5,
				txt: "VR带看"
			}
		]
	},
	WdateTime: {
		name: "dateTime",
		title: "",
		type: "rangeDate"
	},
	boutique: {
		name: "boutique",
		title: "是否精品",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 0,
				txt: "非精品"
			},
			{
				value: 1,
				txt: "精品"
			}
		]
	},
	varSetting: {
		name: "varSetting",
		title: "VR状态",
		type: "select",
		data: [
			{
				value: null,
				txt: "全部"
			},
			{
				value: 0,
				txt: "未开启"
			},
			{
				value: 1,
				txt: "开启"
			}
		]
	},
	// hideLogo: {
	// 	name: "hideLogo",
	// 	title: "水印状态",
	// 	type: "select",
	// 	data: [
	// 		{
	// 			value: null,
	// 			txt: "全部"
	// 		},
	// 		{
	// 			value: true,
	// 			txt: "已去掉"
	// 		},
	// 		{
	// 			value: false,
	// 			txt: "未去掉"
	// 		}
	// 	]
	// },
	type: {
		name: "type",
		title: "异步",
		type: "select",
		data: []
	},
	isAdded: {
		name: "boutiqueStatus",
		title: "上下架",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "已上架"
			},
			{
				value: 0,
				txt: "未上架"
			}
		]
	},
	platform: {
		name: "platform",
		title: "消费平台",
		type: "select",
		data: asyncData(serviceMarketing.platforms, ["key", "value"])
	},
	orderStatus: {
		name: "status",
		title: "订单状态",
		type: "select",
		data: asyncData(serviceMarketing.orderStatus, ["key", "value"])
	},
	WisAdded: {
		name: "caseStatus",
		title: "上下架",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "已上架"
			},
			{
				value: 0,
				txt: "未上架"
			}
		]
	},
	packageStatus: {
		name: "packageStatus",
		title: "套餐状态",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "未创建"
			},
			{
				value: 2,
				txt: "服务中"
			},
			{
				value: 3,
				txt: "已到期"
			}
		]
	},
	WRackStatus: {
		name: "rackStatus",
		title: "上下架",
		type: "select",
		data: asyncData(serviceBusiness.rackStatus, ["key", "value"])
	},
	serverType: {
		name: "serverType",
		title: "服务类型",
		type: "select",
		data: asyncData(serviceMarketing.getServiceType, ["key", "value"])
	},
	commentFrom: {
		// 评论来源
		name: "commentFrom",
		title: "来源",
		type: "select",
		width: 100,
		data: asyncData(serviceHall.sceneFrom, ["key", "value"])
	},
	WmusicType: {
		name: "musicTypeId",
		title: "音乐类型",
		type: "select",
		data: asyncData(serviceGeneral.getMusicType, ["musicTypeId", "name"])
	},
	WStatus: {
		name: "status",
		title: "处理状态",
		type: "select",
		width: 100,
		data: asyncData(serviceOperate.getFormStatus, ["key", "value"])
	},
	Woperation: {
		name: "type",
		title: "所属页面",
		type: "select",
		width: 100,
		data: asyncData(serviceOperate.getBannerType, ["key", "value"])
	},
	WshowType: {
		name: "showType",
		title: "所属终端",
		type: "select",
		width: 100,
		data: asyncData(serviceOperate.bannnerShowType, ["key", "value"])
	},
	WType: {
		name: "type",
		title: "所属页面",
		type: "select",
		width: 100,
		data: asyncData(serviceOperate.getFormType, ["key", "value"])
	},
	Waccount: {
		name: "username",
		title: "帐号",
		type: "text"
	},
	Wlabel: {
		name: "tag",
		title: "标签",
		type: "text"
	},
	WuserName: {
		name: "phoneOrName",
		title: "手机号或名称查询",
		type: "text"
	},
	WisCheck: {
		name: "isCheck",
		title: "状态",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "正常"
			},
			{
				value: 2,
				txt: "到期"
			},
			{
				value: 3,
				txt: "禁止"
			}
		]
	},
	WcustomType: {
		name: "type",
		title: "定制类型",
		type: "select",
		data: asyncData(serviceOperate.getFormTypeHall, ["key", "value"])
	},
	Dusername: {
		name: "name",
		title: "用户名",
		type: "text"
	},
	Dactive: {
		name: "active",
		title: "帐号状态",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: true,
				txt: "正常"
			},
			{
				value: false,
				txt: "禁用"
			}
		]
	},
	Wactive: {
		name: "active",
		title: "状态",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: true,
				txt: "启用"
			},
			{
				value: false,
				txt: "禁用"
			}
		]
	},
	Xkeyword: {
		name: "keyword",
		title: "请输入关键字",
		type: "text"
	},
	categoryName: {
		name: "categoryName",
		title: "请输入文档标题",
		type: "text"
	},
	titleName: {
		name: "titleName",
		title: "请输入文档详情",
		type: "text"
	},
	Wurl: {
		name: "url",
		title: "请输入展厅id",
		type: "text"
	},
	documentSort: {
		name: "categoryId",
		title: "文档分类",
		type: "select",
		data: asyncData(serviceHelp.getSortList, ["id", "name"])
	},
	videoName: {
		name: "videoName",
		title: "请输入视频名称",
		type: "text"
	},
	fastLayout: {
		name: "fastLayout",
		title: "快速布展",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: true,
				txt: "开启"
			},
			{
				value: false,
				txt: "未开启"
			}
		]
	},
	recomType: {
		name: "recomType",
		title: "所属页面",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "首页推荐"
			}
		]
	},
	valueAddedService: {
		name: "valueAddedService",
		title: "增值服务",
		type: "select",
		data: asyncData(serviceHall.addedServices, ["key", "value"])
	},
	couponStatus: {
		name: "status",
		title: "优惠券状态",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 0,
				txt: "未使用"
			},
			{
				value: 1,
				txt: "已使用"
			},
			{
				value: 2,
				txt: "已过期"
			}
		]
	},
	publicAttr: {
		name: "publicAttr",
		title: "公开属性",
		type: "select",
		data: [
			{
				value: "",
				txt: "全部"
			},
			{
				value: 1,
				txt: "公开"
			},
			{
				value: 0,
				txt: "私有"
			}
		]
	},
	couponType: {
		name: "type",
		title: "优惠券类型",
		type: "select",
		data: asyncData(serviceMarketing.couponType, ["key", "value"])
	},
	couponName: {
		name: "couponName",
		title: "优惠券名称",
		type: "text"
	},
	creator: {
		name: "creator",
		title: "手机号或名称",
		type: "text"
	},
	businessType: {
		name: "businessType",
		title: "所属模块",
		type: "select",
		data: asyncData(serviceSystem.getBusinessTypes, ["key", "value"])
	},
	areaId: {
		name: "areaId",
		title: "可发布展厅的面积区间",
		type: "select",
		data: asyncData(serviceBusiness.areaSelect, ["areaId", "remark"])
	},
	tempIdOrName: {
		name: "tempIdOrName",
		title: "展厅ID或名称",
		type: "text"
	},
	telephoneOrName: {
		name: "telephoneOrName",
		title: "手机号或名称",
		type: "text"
	}
}

export default searchFiels
export function returnSearchFiels4D(keys: string[]) {
	return keys.map(key => {
		if (!searchFiels[key]) {
			throw new Error(`无${key}字段配置`)
		}
		return searchFiels[key]
	})
}
