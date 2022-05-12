import { ColumnType } from "antd/es/table/interface"
import { Badge, Button, Image, message, Popover, Tooltip, Space } from "antd"
import moment from "moment"
import React from "react"
import copy from "copy-to-clipboard"
import serviceHall from "@/services/service.hall"
import { getRandomCode } from "@/lib/wangEditor/utils/util"
import proxy from "../../config/proxy"

const handleCopy = (e: string) => () => {
	copy(e)
	message.info("复制成功！")
}

const getCode = () => () => {}

const columnFields: Record<string, ColumnType<any>> = {
	thumbnail: {
		title: "模版缩略图",
		dataIndex: "thumbnail",
		key: "thumbnail",
		fixed: "left",
		width: 100,
		align: "center",
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={v ? `${proxy.templateObsUrl[API_ENV]}${v.split("?")[0]}` : ""}
							alt=""
						/>
					</div>
				</>
			)
		}
	},
	sceneId: {
		title: "模版Id",
		dataIndex: "id",
		key: "sceneId",
		fixed: "left",
		width: 250,
		align: "center"
	},
	sceneName: {
		title: "模版名称",
		dataIndex: "sceneName",
		key: "sceneName",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	topicName: {
		title: "主题名称",
		dataIndex: "name",
		key: "name",
		width: 100,
		fixed: "left",
		align: "center"
	},
	subject: {
		title: "所属主题",
		dataIndex: "topicName",
		key: "topicName",
		width: 100,
		align: "center"
	},
	companyName: {
		title: "企业名称",
		dataIndex: "name",
		key: "name",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	WcompanyName: {
		title: "企业名称",
		dataIndex: "companyName",
		key: "companyName",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	domainName: {
		title: "企业域名",
		dataIndex: "domainName",
		key: "domainName",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<a href={"https://" + v} target="_blank">
					{"https://" + v}
				</a>
			)
		}
	},
	TdomainName: {
		title: "主题域名",
		dataIndex: "domainName",
		key: "domainName",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<a href={"https://" + v} target="_blank">
					{"https://" + v}
				</a>
			)
		}
	},
	account: {
		title: "帐号",
		dataIndex: "username",
		key: "username",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	describe: {
		title: "描述",
		dataIndex: "description",
		key: "description",
		width: 100,
		align: "center",
		ellipsis: true
	},
	Zdescribe: {
		title: "描述",
		dataIndex: "describe",
		key: "describe",
		width: 100,
		align: "center",
		ellipsis: true
	},
	Wdescribe: {
		title: "简介",
		dataIndex: "describe",
		key: "describe",
		width: 100,
		align: "center",
		ellipsis: true
	},
	srcType: {
		title: "模版类型",
		dataIndex: "srcType",
		key: "srcType",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	roleCode: {
		title: "角色编码",
		dataIndex: "roleCode",
		key: "roleCode",
		width: 100,
		align: "center",
		ellipsis: true
	},
	srcSubType: {
		title: "来源",
		dataIndex: "srcSubType",
		key: "srcSubType",
		width: 100,
		align: "center",
		ellipsis: true
	},
	user_name: {
		title: "用户名",
		dataIndex: "user_name",
		key: "user_name",
		width: 80,
		align: "center"
	},
	wid: {
		title: "排队编号",
		dataIndex: "id",
		key: "id",
		width: 260,
		align: "center"
	},
	hallThumbnail: {
		title: "展厅封面",
		dataIndex: "thumb",
		key: "thumb",
		fixed: "left",
		width: 116,
		align: "center",
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={v ? `${proxy.templateObsUrl[API_ENV]}${v.split("?")[0]}` : ""}
							alt=""
						/>
					</div>
				</>
			)
		}
	},
	hallName: {
		title: "展厅名称&ID",
		dataIndex: "tempName",
		key: "tempName",
		fixed: "left",
		width: 260,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.id}</p>
				</>
			)
		}
	},
	WhallName: {
		title: "展厅名称&ID",
		dataIndex: "tempName",
		key: "tempName",
		fixed: "left",
		width: 260,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.tempId}</p>
				</>
			)
		}
	},
	Wcount: {
		title: "创建展厅数(个)",
		dataIndex: "count",
		key: "count",
		width: 110,
		align: "center",
		ellipsis: true
	},
	WboutiqueName: {
		title: "精品模板名称&ID",
		dataIndex: "name",
		key: "name",
		fixed: "left",
		width: 200,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.id}</p>
				</>
			)
		},
		onCellClick: record => {
			window.open(`${proxy.templateUrl[API_ENV]}/sceneFront/index.html?G_TEMP_ID=${record.id}`)
		}
	},
	boutiqueName: {
		title: "展厅名称&ID",
		dataIndex: "tempName",
		key: "tempName",
		fixed: "left",
		width: 260,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.tempId}</p>
				</>
			)
		}
	},
	tempName: {
		title: "模板名称&ID",
		dataIndex: "name",
		key: "name",
		fixed: "left",
		width: 260,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.tempId}</p>
				</>
			)
		}
	},
	sz: {
		title: "面积",
		dataIndex: "sz",
		key: "sz",
		width: 100,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return <>{v ? v + "m²" : ""}</>
		}
	},
	Wsz: {
		title: "面积",
		dataIndex: "areaRemark",
		key: "areaRemark",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return <>{v ? v : ""}</>
		}
	},
	areaRemark: {
		title: "可发布的面积区间",
		dataIndex: "areaRemark",
		key: "areaRemark",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return <>{v ? v : ""}</>
		}
	},

	validSz: {
		title: "有效面积",
		dataIndex: "validSz",
		key: "validSz",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return <>{v ? v + "m²" : ""}</>
		}
	},
	hallType: {
		title: "分类",
		dataIndex: "typeName",
		key: "typeName",
		width: 150,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			const types: any[] = []
			item.typeList
				? item.typeList.forEach((item1: any) => {
						types.push(item1.typeName)
				  })
				: null
			return (
				<>
					<p>{types[0]}</p>
				</>
			)
		}
	},

	roleList: {
		title: "角色",
		dataIndex: "roleList",
		key: "roleList",
		width: 140,
		align: "center",
		ellipsis: true,
		render: v => {
			let roleList: string = ""
			v
				? v.map((item1: { roleName: string }, index: number) => {
						if (index < v.length - 1) {
							roleList = roleList + item1.roleName + "，"
						} else {
							roleList = roleList + item1.roleName
						}
				  })
				: null

			return (
				<>
					{v && v.length > 1 ? (
						<Tooltip placement="topLeft" title={roleList}>
							{roleList}
						</Tooltip>
					) : (
						<span>{roleList}</span>
					)}
				</>
			)
		}
	},

	creatTs: {
		title: "创建时间",
		dataIndex: "createTs",
		key: "createTs",
		width: 116,
		align: "center",
		// ellipsis: true,
		render: (v, item) => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	publishCount: {
		title: "已发布/已布展/展厅总数",
		dataIndex: "publishCount",
		key: "publishCount",
		width: 130,
		align: "center",
		// ellipsis: true,
		render: (v, item) => {
			return <>{v + "/" + item.hasUsedCount + "/" + item.sceneTotalCount}</>
		}
	},
	createName: {
		title: "创建人",
		dataIndex: "createName",
		key: "createName",
		width: 120,
		align: "center",
		ellipsis: true
	},
	enterprise: {
		title: "所属企业",
		dataIndex: "companyName",
		key: "companyName",
		width: 150,
		align: "center",
		ellipsis: true
	},
	createdName: {
		title: "创建人",
		dataIndex: "createdName",
		key: "createdName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	WcreateUsername: {
		title: "创建人",
		dataIndex: "createUsername",
		key: "createUsername",
		width: 80,
		align: "center",
		ellipsis: true
	},
	ZjurisdictionName: {
		title: "权限名称",
		dataIndex: "permissionName",
		key: "permissionName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	belonger: {
		title: "所属人",
		dataIndex: "belonger",
		key: "belonger",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.belongerTelephone}</p>
				</>
			)
		}
	},
	// belongerTelephone: {
	// 	title: "所属人联系方式",
	// 	dataIndex: "belongerTelephone",
	// 	key: "belongerTelephone",
	// 	width: 80,
	// 	align: "center",
	// 	ellipsis: true
	// },
	user: {
		title: "所属用户",
		dataIndex: "userName",
		key: "userName",
		width: 120,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.userPhone}</p>
				</>
			)
		}
	},
	Wusername: {
		title: "所属用户",
		dataIndex: "username",
		key: "username",
		width: 120,
		align: "center",
		ellipsis: true
	},
	telephone: {
		title: "手机号",
		dataIndex: "telephone",
		key: "telephone",
		width: 80,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	consultSetting: {
		title: "咨询信息",
		dataIndex: "remark",
		key: "remark",
		width: 80,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	owner: {
		title: "所属用户",
		dataIndex: "owner",
		key: "owner",
		width: 120,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	renderFlowStatus: {
		title: "渲染进度",
		dataIndex: "renderFlowStatus",
		key: "renderFlowStatus",
		width: 120,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return (
				<>
					{v === 1 && <span>未渲染</span>}
					{/* {v === 2 && <span>{`排队中${item.renderQueueSort ? "(" + item.renderQueueSort + ")" : ""}`}</span>} */}
					{v === 2 && <span>排队中</span>}
					{v === 3 && <span>渲染中</span>}
					{v === 4 && <span>渲染失败</span>}
					{v === 5 && <span>上传成功</span>}
					{v === 6 && <span>上传失败</span>}
					{v === 7 && <span>渲染完成</span>}
				</>
			)
		}
	},
	fastLayout: {
		title: "快速布展",
		dataIndex: "fastLayout",
		key: "fastLayout",
		width: 120,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return (
				<>
					{v && <span>已开启</span>}
					{!v && <span>未开启</span>}
				</>
			)
		}
	},
	Wnickname: {
		title: "昵称",
		dataIndex: "nickname",
		key: "nickname",
		width: 80,
		align: "center",
		ellipsis: true
	},
	WrenderStatus: {
		title: "渲染状态",
		dataIndex: "renderStatusDict",
		key: "renderStatusDict",
		width: 80,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return (
				<span style={item.renderStatus == 1 ? { color: "red" } : item.renderStatus == 2 ? { color: "orange" } : {}}>
					{v}
				</span>
			)
		}
	},
	WrealName: {
		title: "姓名",
		dataIndex: "realName",
		key: "realName",
		width: 80,
		fixed: "left",
		align: "center",
		ellipsis: true
	},
	sceneFrom: {
		title: "来源",
		dataIndex: "sceneFrom",
		key: "sceneFrom",
		width: 60,
		align: "center",
		ellipsis: true
	},
	releaseNum: {
		title: "每日发布次数",
		dataIndex: "releases",
		key: "releases",
		width: 80,
		align: "center",
		ellipsis: true
	},
	hallNum: {
		title: "展厅数",
		dataIndex: "sceneTotalCount",
		key: "sceneTotalCount",
		width: 60,
		align: "center",
		ellipsis: true
	},
	sceneFromVal: {
		title: "来源",
		dataIndex: "sceneFromVal",
		key: "sceneFromVal",
		width: 100,
		align: "center",
		ellipsis: true
	},
	boutique: {
		title: "精品状态",
		dataIndex: "boutique",
		key: "boutique",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return <>{v ? "精品" : "非精品"}</>
		}
	},
	aliStatic: {
		title: "发布状态",
		dataIndex: "aliStatic",
		key: "aliStatic",
		width: 150,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			let value = ""
			if (v == 0) {
				value = "未发布"
			} else if (v == 1) {
				value = "发布中"
			} else if (v == 2) {
				if (item.publishAfterStatus == 1) {
					value = "已发布(有修改)"
				} else {
					value = "已发布"
				}
			} else if (v == 3) {
				value = "发布失败"
			}
			return <>{value}</>
		}
	},
	isCheck: {
		title: "访问状态",
		dataIndex: "isCheck",
		key: "isCheck",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<>
					{v == 1 ? v == 2 ? <Badge status="error" /> : <Badge status="success" /> : <Badge status="warning" />}
					{v == 1 ? "正常" : v == 2 ? "禁止" : "到期"}
				</>
			)
		}
	},
	hasTemplateCount: {
		title: "关联展厅",
		dataIndex: "hasTemplateCount",
		key: "hasTemplateCount",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return <>{v ? "已关联" : "未关联"}</>
		}
	},
	boutiqueStatus: {
		title: "上下架状态",
		dataIndex: "boutiqueStatus",
		key: "boutiqueStatus",
		width: 100,
		align: "center",
		ellipsis: true,
		render: v => {
			return <>{v == 0 ? "未上架" : "已上架"}</>
		}
	},
	WcaseStatus: {
		title: "上下架状态",
		dataIndex: "caseStatus",
		key: "caseStatus",
		width: 100,
		align: "center",
		ellipsis: true,
		render: v => {
			return <>{v == 0 ? "未上架" : "已上架"}</>
		}
	},

	createType: {
		title: "创建属性",
		dataIndex: "createType",
		key: "createType",
		width: 100,
		align: "center",
		ellipsis: true,
		render: v => {
			return <>{v == 1 ? "空白模板" : "复制模板"}</>
		}
	},
	sort: {
		title: "序号",
		dataIndex: "id",
		key: "id",
		width: 60,
		fixed: "left",
		align: "center",
		ellipsis: true,
		render: (v, item, index) => {
			return <>{index + 1}</>
		}
	},
	boutiqueSort: {
		title: "排序",
		dataIndex: "boutiqueSort",
		key: "boutiqueSort",
		width: 100,
		align: "center",
		ellipsis: true,
		render: (v, item, index) => {
			return <>{v}</>
		}
	},
	subType: {
		title: "来源方式",
		dataIndex: "subType",
		key: "subType",
		width: 80,
		align: "center",
		ellipsis: true
	},
	srcUrl: {
		title: "爬取源地址",
		dataIndex: "srcUrl",
		key: "srcUrl",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<Popover placement="topLeft" content={<span>{v}</span>} trigger="hover">
					<span onClick={handleCopy(v)}>{v}</span>
				</Popover>
			)
		}
	},
	objUrl: {
		title: "模型地址",
		dataIndex: "objUrl",
		key: "objUrl",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<Popover placement="topLeft" content={<span>{v}</span>} trigger="hover">
					<span onClick={handleCopy(v)}>{v}</span>
				</Popover>
			)
		}
	},
	panoUrl: {
		title: "全景图地址",
		dataIndex: "panoUrl",
		key: "panoUrl",
		width: 100,
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<Popover placement="topLeft" content={<span>{v}</span>} trigger="hover">
					<span onClick={handleCopy(v)}>{v}</span>
				</Popover>
			)
		}
	},
	roleName: {
		title: "角色名称",
		dataIndex: "roleName",
		key: "roleName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	visionDone: {
		title: "状态",
		dataIndex: "visionDone",
		key: "visionDone",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<>
					{v == "处理中" ? <Badge status="warning" /> : <Badge status="success" />}
					{v}
				</>
			)
		}
	},
	orderNumber: {
		title: "订单号",
		dataIndex: "outTradeNo",
		key: "outTradeNo",
		width: 100,
		align: "center",
		ellipsis: true,
		render: outTradeNo => (
			<Tooltip placement="topLeft" title={outTradeNo}>
				{outTradeNo}
			</Tooltip>
		)
	},
	serverType: {
		title: "服务类型",
		dataIndex: "serverType",
		key: "serverType",
		width: 80,
		align: "center",
		ellipsis: true
	},
	WserverType: {
		title: "服务类型",
		dataIndex: "type",
		key: "type",
		width: 80,
		align: "center",
		ellipsis: true
	},
	hallName2: {
		title: "展厅名称",
		dataIndex: "sceneTemplateName",
		key: "sceneTemplateName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	hallId: {
		title: "展厅ID",
		dataIndex: "sceneTemplateId",
		key: "sceneTemplateId",
		width: 250,
		align: "center"
	},
	accountNo: {
		title: "所属帐号",
		dataIndex: "belonger",
		key: "belonger",
		width: 100,
		align: "center",
		ellipsis: true
	},
	WaccountNo: {
		title: "所属帐号",
		dataIndex: "username",
		key: "username",
		width: 100,
		align: "center",
		ellipsis: true
	},
	consumption: {
		title: "消费平台",
		dataIndex: "transactionType",
		key: "transactionType",
		width: 80,
		align: "center",
		ellipsis: true
	},
	Wconsumption: {
		title: "消费平台",
		dataIndex: "platform",
		key: "platform",
		width: 80,
		align: "center",
		ellipsis: true
	},
	money: {
		title: "金额",
		dataIndex: "fee",
		key: "fee",
		width: 80,
		align: "center",
		ellipsis: true,
		className: "price",
		render: fee => <>{"-" + fee}</>
	},
	Wmoney: {
		title: "金额",
		dataIndex: "fee",
		key: "fee",
		width: 80,
		align: "center",
		ellipsis: true,
		className: "price",
		render: fee => <>{"+" + fee}</>
	},
	orderDate: {
		title: "订单日期",
		dataIndex: "createTs",
		key: "createTs",
		width: 150,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			return <>{moment(new Date(v)).format("YYYY-MM-DD HH:mm")}</>
		}
	},
	orderStatus: {
		title: "订单状态",
		dataIndex: "status",
		key: "status",
		width: 80,
		align: "center",
		ellipsis: true,
		render: v => {
			return (
				<>
					{v == "已完成" ? (
						<Badge status="success" />
					) : v == "已取消" ? (
						<Badge status="default" />
					) : (
						<Badge status="warning" />
					)}
					{v}
				</>
			)
		}
	},
	name: {
		title: "姓名",
		dataIndex: "name",
		key: "name",
		width: 100,
		align: "center",
		ellipsis: true
	},
	commentContent: {
		title: "评论内容",
		dataIndex: "commentContent",
		key: "commentContent",
		width: 100,
		align: "center",
		ellipsis: true
	},
	createDate: {
		title: "创建日期",
		dataIndex: "createDate",
		key: "createDate",
		width: 100,
		align: "center",
		ellipsis: true
	},
	ZmenuName: {
		title: "菜单名称",
		dataIndex: "menuName",
		key: "menuName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	ZmenuSort: {
		title: "序号",
		dataIndex: "sort",
		key: "sort",
		width: 80,
		align: "center",
		ellipsis: true
	},
	ZmenuLevel: {
		title: "级别",
		dataIndex: "level",
		key: "level",
		width: 80,
		align: "center",
		ellipsis: true
	},
	origin: {
		title: "来源",
		dataIndex: "origin",
		key: "origin",
		width: 150,
		align: "center",
		ellipsis: true,
		render: (v, item) => <span>{v + (item.tag ? "-" + item.tag : "")}</span>
	},
	WmusicName: {
		title: "名称",
		dataIndex: "name",
		key: "name",
		width: 80,
		align: "center",
		ellipsis: true
	},
	Zname: {
		title: "名称",
		dataIndex: "groupName",
		key: "groupName",
		width: 80,
		align: "center",
		ellipsis: true
	},
	WfileAddress: {
		title: "文件地址",
		dataIndex: "musicFile",
		key: "musicFile",
		width: 100,
		align: "center",
		ellipsis: true,
		render: musicFile => (
			<Tooltip placement="topLeft" title={musicFile}>
				{musicFile}
			</Tooltip>
		)
	},
	WmusicType: {
		title: "音乐类型",
		dataIndex: "musicType",
		key: "musicType",
		width: 100,
		align: "center",
		ellipsis: true
	},
	WstyleName: {
		title: "行业名称",
		dataIndex: "name",
		key: "name",
		width: 100,
		align: "center",
		ellipsis: true
	},
	WtypeName: {
		title: "分类名称",
		dataIndex: "name",
		key: "name",
		width: 100,
		align: "center",
		ellipsis: true
	},
	WstyleName2: {
		title: "行业名称",
		dataIndex: "styleList",
		key: "styleList",
		width: 100,
		align: "center",
		ellipsis: true,
		render: (v, item) => {
			const styles: any[] = []
			item.styleList
				? item.styleList.forEach((item2: any) => {
						styles.push(item2.styleName)
				  })
				: null

			return (
				<>
					<div>{styles[0]}</div>
				</>
			)
		}
	},
	Wstyle: {
		title: "排序",
		dataIndex: "sort",
		key: "sort",
		width: 100,
		align: "center",
		ellipsis: true
	},
	Worder: {
		title: "排序",
		dataIndex: "order",
		key: "order",
		width: 100,
		align: "center",
		ellipsis: true
	},
	WcustomType: {
		title: "定制类型",
		dataIndex: "type",
		key: "type",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: type => (
			<Tooltip placement="topLeft" title={type}>
				{type}
			</Tooltip>
		)
	},
	WapplicationTime: {
		title: "申请时间",
		dataIndex: "createTs",
		key: "createTs",
		width: 100,
		align: "center",
		// ellipsis: {
		// 	showTitle: false
		// },
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	WapplyTime: {
		title: "申请时间",
		dataIndex: "applyTime",
		key: "applyTime",
		width: 100,
		align: "center",
		// ellipsis: {
		// 	showTitle: false
		// },
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	WexpireTime: {
		title: "到期时间",
		dataIndex: "expireTime",
		key: "expireTime",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	Whandler: {
		title: "处理人",
		dataIndex: "handler",
		key: "handler",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: handler => (
			<Tooltip placement="topLeft" title={handler}>
				{handler}
			</Tooltip>
		)
	},
	WprocessTime: {
		title: "处理时间",
		dataIndex: "handTime",
		key: "handTime",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	WcorporateName: {
		title: "公司名称",
		dataIndex: "enterpriseName",
		key: "enterpriseName",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: enterpriseName => (
			<Tooltip placement="topLeft" title={enterpriseName}>
				{enterpriseName}
			</Tooltip>
		)
	},
	Wdescription: {
		title: "需求描述",
		dataIndex: "requirementDesc",
		key: "requirementDesc",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: requirementDesc => (
			<Tooltip placement="topLeft" title={requirementDesc}>
				{requirementDesc}
			</Tooltip>
		)
	},
	Wcover: {
		title: "封面图",
		dataIndex: "image",
		key: "image",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={v}
							alt=""
						/>
					</div>
				</>
			)
		}
	},
	HelpVideoCover: {
		title: "视频封面",
		dataIndex: "coverUrl",
		key: "coverUrl",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={`${proxy.templateObsUrl[API_ENV]}${v}`}
							alt=""
						/>
					</div>
				</>
			)
		}
	},
	WcoverBanner: {
		title: "封面图",
		dataIndex: "imgUrl",
		key: "imgUrl",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={v}
							alt=""
						/>
					</div>
				</>
			)
		}
	},
	Wname: {
		title: "名称",
		dataIndex: "name",
		key: "name",
		width: 120,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: name => (
			<Tooltip placement="topLeft" title={name}>
				{name}
			</Tooltip>
		)
	},
	Wbannername: {
		title: "名称",
		dataIndex: "title",
		key: "title",
		width: 150,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: title => (
			<Tooltip placement="topLeft" title={title}>
				{title}
			</Tooltip>
		)
	},
	WbannerType: {
		title: "所属页面",
		dataIndex: "type",
		key: "type",
		width: 150,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: type => (
			<Tooltip placement="topLeft" title={type}>
				{type}
			</Tooltip>
		)
	},
	WbannerShowType: {
		title: "所属终端",
		dataIndex: "showType",
		key: "showType",
		width: 150,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: showType => (
			<Tooltip placement="topLeft" title={showType}>
				{showType}
			</Tooltip>
		)
	},
	Wlink: {
		title: "跳转链接",
		dataIndex: "url",
		key: "url",
		width: 250,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: url => (
			<Tooltip placement="topLeft" title={url}>
				{url}
			</Tooltip>
		)
	},
	Wbannerlink: {
		title: "跳转链接",
		dataIndex: "contentUrl",
		key: "contentUrl",
		width: 250,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: contentUrl => (
			<Tooltip placement="topLeft" title={contentUrl}>
				{contentUrl}
			</Tooltip>
		)
	},
	WmoreLink: {
		title: "跳转链接",
		dataIndex: "moreLink",
		key: "moreLink",
		width: 250,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: moreLink => (
			<Tooltip placement="topLeft" title={moreLink}>
				{moreLink}
			</Tooltip>
		)
	},
	Wsort: {
		title: "排序",
		dataIndex: "sort",
		key: "sort",
		width: 100,
		align: "center"
	},
	WindustryName: {
		title: "行业名称",
		dataIndex: "indexTradeName",
		key: "indexTradeName",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: title => (
			<Tooltip placement="topLeft" title={title}>
				{title}
			</Tooltip>
		)
	},
	WcaseSort: {
		title: "排序",
		dataIndex: "caseSort",
		key: "caseSort",
		width: 100,
		align: "center"
	},
	WschemeLink: {
		title: "方案链接",
		dataIndex: "schemeLink",
		key: "schemeLink",
		width: 250,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: schemeLink => (
			<Tooltip placement="topLeft" title={schemeLink}>
				{schemeLink}
			</Tooltip>
		)
	},
	WappId: {
		title: "APPID",
		dataIndex: "appId",
		key: "appId",
		width: 100,
		align: "center"
	},
	Wkey: {
		title: "KEY",
		dataIndex: "appSecret",
		key: "appSecret",
		width: 100,
		align: "center"
	},
	Wlabel: {
		title: "标签",
		dataIndex: "tag",
		key: "tag",
		width: 100,
		align: "center"
	},
	Zcode: {
		title: "二维码",
		dataIndex: ["id", "tempId"],
		key: "id",
		width: 100,
		align: "center",
		render: (v, w) => {
			return (
				<div>
					<img
						style={{ width: "70px", height: "70px" }}
						src={`${proxy.api[API_ENV]}/scene-portal/generateQRCode?url=${proxy.templateUrl[API_ENV]}/sceneFront/index.html?groupId=${w.id}&G_TEMP_ID=${w.tempId}`}
						alt=""
					/>
				</div>
			)
		}
	},
	ZUrl: {
		title: "链接地址",
		dataIndex: ["id", "tempId"],
		key: "id",
		width: 100,
		align: "center",
		ellipsis: true,
		render: (v, w) => {
			return (
				<div onClick={handleCopy(`${proxy.templateObsUrl[API_ENV]}/sceneFront/index.html?groupId=${w.id}`)}>
					<Tooltip placement="top" title={`${proxy.templateObsUrl[API_ENV]}/sceneFront/index.html?groupId=${w.id}`}>
						<p>{`${proxy.templateObsUrl[API_ENV]}/sceneFront/index.html?groupId=${w.id}`}</p>
					</Tooltip>
				</div>
			)
		}
	},
	// Wstate: {
	// 	title: "状态",
	// 	dataIndex: "active",
	// 	key: "active",
	// 	width: 100,
	// 	align: "center",
	//
	// },
	WOperation: {
		title: "操作",
		dataIndex: "operation",
		key: "operation",
		width: 100,
		align: "center"
	},
	WOperationTime: {
		title: "时间",
		dataIndex: "time",
		key: "time",
		width: 100,
		align: "center"
	},
	WOperationUser: {
		title: "操作人",
		dataIndex: "user",
		key: "user",
		width: 100,
		align: "center"
	},
	ZCombinedHall: {
		title: "组合展厅封面图",
		dataIndex: "coverUrl",
		key: "coverUrl",
		width: 100,
		align: "center",
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={v ? `${proxy.templateObsUrl[API_ENV]}${v.split("?")[0]}` : ""}
							alt=""
						/>
					</div>
				</>
			)
		}
	},
	packageExpire: {
		title: "套餐到期时间",
		dataIndex: "packageExpire",
		key: "packageExpire",
		width: 100,
		align: "center",
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	Wactive: {
		title: "帐号状态",
		dataIndex: "active",
		key: "active",
		width: 100,
		align: "center",
		render: v => {
			return <>{v == true ? "启用" : "禁用"}</>
		}
	},
	expireFlag: {
		title: "套餐状态",
		dataIndex: "expireFlag",
		key: "expireFlag",
		width: 100,
		align: "center",
		render: v => {
			return (
				<>
					{v == true ? <Badge status="default" /> : <Badge status="success" />}
					{v == true ? "到期" : "正常"}
				</>
			)
		}
	},
	packageStatus: {
		title: "套餐状态",
		dataIndex: "packageStatus",
		key: "packageStatus",
		width: 100,
		align: "center",
		render: v => {
			return (
				<>
					{v == 1 ? <Badge status="default" /> : v == 2 ? <Badge status="success" /> : <Badge status="error" />}
					{v == 1 ? "未创建" : v == 2 ? "服务中" : "已到期"}
				</>
			)
		}
	},
	companyStatus: {
		title: "账号状态",
		dataIndex: "companyStatus",
		key: "companyStatus",
		width: 100,
		align: "center",
		render: v => {
			return (
				<>
					{v == true ? <Badge status="success" /> : <Badge status="error" />}
					{v == true ? "启用" : "禁用"}
				</>
			)
		}
	},
	packageName: {
		title: "套餐",
		dataIndex: "packageName",
		key: "packageName",
		width: 100,
		align: "center"
	},
	durationEndTs: {
		title: "到期时间",
		dataIndex: "durationEndTs",
		key: "durationEndTs",
		width: 100,
		align: "center",
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	devHallName: {
		title: "展厅名称&ID",
		dataIndex: "tempName",
		key: "tempName",
		fixed: "left",
		width: 200,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.tempId}</p>
				</>
			)
		}
	},
	WdevHallName: {
		title: "模版名称&ID",
		dataIndex: "name",
		key: "name",
		fixed: "left",
		width: 260,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<p>{v}</p>
					<p>{item.id}</p>
				</>
			)
		}
	},
	deverver: {
		title: "增值服务",
		dataIndex: "liveService",
		key: "liveService",
		width: 180,
		align: "center",
		render: (v, item) => {
			return (
				<>
					{item.myCustService === 2 && (
						<Tooltip placement="top" title="在线客服">
							<span className="circle">客</span>
						</Tooltip>
					)}
					{item.liveService === 2 && (
						<Tooltip placement="top" title="直播">
							<span className="circle">直</span>
						</Tooltip>
					)}
					{item.myBrowseService === 2 && (
						<Tooltip placement="top" title="访客信息">
							<span className="circle">访</span>
						</Tooltip>
					)}
					{item.varLook === 2 && (
						<Tooltip placement="top" title="VR带看">
							<span className="circle">VR</span>
						</Tooltip>
					)}
					{item.varLook !== 2 && item.myCustService !== 2 && item.liveService !== 2 && item.myBrowseService !== 2 && (
						<span>未开通</span>
					)}
				</>
			)
		}
	},
	syncStatic: {
		title: "离线状态",
		dataIndex: "syncStatic",
		key: "syncStatic",
		width: 100,
		align: "center",
		render: v => {
			// return <>{v == 1 ? "未同步" : v == 2 ? "已同步" : v == 3 ? "同步中" : v == 4 ? "同步失败" : ""}</>

			return (
				<>
					{/* {v == 2 ? v == 3 ? <Badge status="warning" /> : <Badge status="success" /> : <Badge status="error" />} */}
					{v == 1 ? "未同步" : v == 2 ? "已同步" : v == 3 ? "同步中" : v == 4 ? "同步失败" : ""}
				</>
			)
		}
	},
	// HelpVideoCover: {
	// 	title: "视频封面",
	// 	dataIndex: "coverUrl",
	// 	key: "coverUrl",
	// 	fixed: "left",
	// 	width: 116,
	// 	align: "center",
	// 	render: v => {
	// 		console.log(v)
	// 		return (
	// 			<>
	// 				<div>
	// 					<Image style={{ maxWidth: "80px", maxHeight: "120px", cursor: "pointer" }} src={v} alt="" />
	// 				</div>
	// 			</>
	// 		)
	// 	}
	// },
	HelpVideoName: {
		title: "视频名称",
		dataIndex: "videoName",
		key: "videoName",
		fixed: "left",
		width: 116,
		align: "center"
	},
	helpVideoSort: {
		title: "排序",
		dataIndex: "videoSort",
		key: "videoSort",
		fixed: "left",
		width: 116,
		align: "center"
	},
	createUser: {
		title: "创建人",
		dataIndex: "createUser",
		key: "createUser",
		width: 120,
		align: "center"
	},
	createTs: {
		title: "创建时间",
		dataIndex: "createTs",
		key: "createTs",
		width: 116,
		align: "center",
		render: (v, item) => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	docSort: {
		title: "排序",
		dataIndex: "docSort",
		key: "docSort",
		width: 100,
		align: "center",
		fixed: "left"
	},
	categorySort: {
		title: "排序",
		dataIndex: "categorySort",
		key: "categorySort",
		width: 100,
		align: "center"
	},
	categoryName: {
		title: "文档标题",
		dataIndex: "categoryName",
		key: "categoryName",
		width: 100,
		align: "center",
		fixed: "left"
	},
	subtitle: {
		title: "副标题",
		dataIndex: "titleName",
		key: "titleName",
		width: 100,
		align: "center",
		fixed: "left"
	},
	issueName: {
		title: "问题",
		dataIndex: "issueName",
		key: "issueName",
		width: 100,
		align: "left",
		ellipsis: true
	},
	answer: {
		title: "解答",
		dataIndex: "answer",
		key: "answer",
		width: 100,
		align: "left",
		ellipsis: true
	},
	issueSort: {
		title: "排序",
		dataIndex: "issueSort",
		key: "issueSort",
		width: 40,
		align: "center"
	},
	Pcover: {
		title: "封面图",
		dataIndex: "imgUrl",
		key: "imgUrl",
		width: 100,
		fixed: "left",
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={v}
							alt=""
						/>
					</div>
				</>
			)
		}
	},

	HallName: {
		title: "展厅名称",
		dataIndex: "title",
		key: "title",
		width: 100,
		align: "center"
	},
	HallIntroduce: {
		title: "展厅简介",
		dataIndex: "remark",
		key: "remark",
		width: 100,
		align: "center",
		ellipsis: {
			showTitle: false
		},
		render: v => (
			<Tooltip placement="topLeft" title={v}>
				{v}
			</Tooltip>
		)
	},
	HallLink: {
		title: "展厅链接",
		dataIndex: "contentUrl",
		key: "contentUrl",
		width: 100,
		align: "center"
	},
	salespersonName: {
		title: "销售员名称",
		dataIndex: "name",
		key: "name",
		width: 100,
		align: "center"
	},
	salespersonPhone: {
		title: "联系方式",
		dataIndex: "telephone",
		key: "telephone",
		width: 100,
		align: "center"
	},
	couponCount: {
		title: "使用情况（未用/总数）",
		dataIndex: "unusedCoupons",
		key: "unusedCoupons",
		width: 100,
		align: "center",
		render: (v, item) => {
			return (
				<>
					{v}/{item.coupons}
				</>
			)
		}
	},
	couponActive: {
		title: "状态",
		dataIndex: "active",
		key: "active",
		width: 100,
		align: "center",
		render: v => {
			return <>{v ? "启用" : "禁用"}</>
		}
	},
	discount: {
		title: "优惠码",
		dataIndex: "code",
		key: "code",
		width: 100,
		align: "center"
	},
	typeDic: {
		title: "类型",
		dataIndex: "typeDic",
		key: "typeDic",
		width: 100,
		align: "center"
	},
	discountName: {
		title: "优惠券名称",
		dataIndex: "name",
		key: "name",
		width: 100,
		align: "center"
	},
	validStartTime: {
		title: "开始时间",
		dataIndex: "validStartTime",
		key: "validStartTime",
		width: 100,
		align: "center",
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	validEndTime: {
		title: "结束时间",
		dataIndex: "validEndTime",
		key: "validEndTime",
		width: 100,
		align: "center",
		render: v => {
			return <>{v ? moment(new Date(v)).format("YYYY-MM-DD HH:mm") : ""}</>
		}
	},
	discountStatus: {
		title: "状态",
		dataIndex: "status",
		key: "status",
		width: 100,
		align: "center",
		render: v => {
			return <>{v === 0 ? "未使用" : v === 1 ? "已使用" : "已过期"}</>
		}
	},
	discountDesc: {
		title: "备注",
		dataIndex: "desc",
		key: "desc",
		width: 100,
		align: "center"
	},
	logDesc: {
		title: "操作",
		dataIndex: "logDesc",
		key: "logDesc",
		width: 100,
		align: "center"
	},
	creator: {
		title: "操作人",
		dataIndex: "creator",
		key: "creator",
		width: 160,
		align: "center",
		render: (v, item) => {
			return <>{item.nickname ? item.nickname + "（" + v + "）" : v}</>
		}
	},
	businessDesc: {
		title: "所属模块",
		dataIndex: "businessDesc",
		key: "businessDesc",
		width: 100,
		align: "center"
	},
	Wstatus: {
		title: "状态",
		dataIndex: "status",
		key: "status",
		width: 100,
		align: "center",
		render: v => {
			return <>{v == 1 ? "已上架" : "未上架"}</>
		}
	},
	businessId: {
		title: "业务ID",
		dataIndex: "businessId",
		key: "businessId",
		width: 200,
		align: "center",
		render: (v, item) => {
			return <>{item.businessTitle ? item.businessTitle + "（" + v + "）" : v}</>
		}
	},
	sweeps: {
		title: "漫游点位",
		dataIndex: "sweeps",
		key: "sweeps",
		width: 100,
		align: "center",
		render: v => {
			return <>{v}个</>
		}
	},
	topicCount: {
		title: "主题数量",
		width: 80,
		dataIndex: "topicCount",
		key: "topicCount",
		align: "center"
	},
	tempCount: {
		title: "模板数量",
		width: 100,
		dataIndex: "tempCount",
		key: "tempCount",
		align: "center"
	},
	WtempCount: {
		title: "专属模板数量",
		width: 100,
		dataIndex: "tempCount",
		key: "tempCount",
		align: "center"
	},
	childCount: {
		title: "子账号数量",
		width: 100,
		dataIndex: "childCount",
		key: "childCount",
		align: "center"
	},
	userCount: {
		title: "用户数",
		width: 80,
		dataIndex: "userCount",
		key: "userCount",
		align: "center"
	},
	sceneCount: {
		title: "展厅数",
		width: 80,
		dataIndex: "sceneCount",
		key: "sceneCount",
		align: "center"
	},
	publicAttr: {
		title: "公开属性",
		width: 80,
		dataIndex: "publicAttr",
		key: "publicAttr",
		align: "center",
		render: v => {
			return <>{v ? "公开" : "私有"}</>
		}
	},
	roamCount: {
		title: "漫游点位",
		width: 80,
		dataIndex: "roamCount",
		key: "roamCount",
		align: "center"
	},
	industry: {
		title: "行业",
		width: 80,
		dataIndex: "industry",
		key: "industry",
		align: "center"
	},
	productDemand: {
		title: "产品需求",
		width: 80,
		dataIndex: "productDemand",
		key: "productDemand",
		align: "center"
	},
	city: {
		title: "城市",
		width: 80,
		dataIndex: "city",
		key: "city",
		align: "center"
	},
	loginTemName: {
		title: "登录模板名称",
		width: 100,
		dataIndex: "name",
		key: "name",
		align: "center"
	},
	loginTemThumb: {
		title: "登录页模板封面图",
		width: 80,
		dataIndex: "thumb",
		key: "thumb",
		align: "center",
		render: v => {
			return (
				<>
					<div>
						<Image
							style={{ maxWidth: "100%", maxHeight: "60px", objectFit: "cover", cursor: "pointer" }}
							src={v ? `${proxy.templateObsUrl[API_ENV]}/${v.split("?")[0]}` : ""}
							alt=""
						/>
					</div>
				</>
			)
		}
	},
	relatedTopic: {
		title: "关联主题",
		width: 80,
		dataIndex: "relatedTopic",
		key: "relatedTopic",
		align: "center",
		render: v => {
			return <>{v ? "是" : "否"}</>
		}
	},
	rackStatus: {
		title: "上架状态",
		width: 80,
		dataIndex: "rackStatus",
		key: "rackStatus",
		align: "center",
		render: v => {
			return <>{v ? "已上架" : "未上架"}</>
		}
	},
	caseType: {
		title: "形式",
		width: 100,
		dataIndex: "caseType",
		key: "caseType",
		align: "center",
		render: v => {
			return <>{v === 1 ? "展厅" : "展台"}</>
		}
	}
}
export default columnFields

export function returnColumnFields(keys: string[]) {
	// const columnKey = new Set(["id"].concat(keys))
	return keys.map(key => {
		if (!columnFields[key]) {
			throw new Error(`无${key}字段配置`)
		}
		return columnFields[key]
	})
}
