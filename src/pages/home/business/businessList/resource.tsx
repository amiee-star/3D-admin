import { Button, Form, Input, message, Row, Col, Table, DatePicker, InputNumber } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import serviceBusiness from "@/services/service.business"
import { ColumnsType } from "antd/lib/table/interface"
import { PageProps } from "@/interfaces/app.interface"
import { resourceListItem, areaListItem } from "@/interfaces/api.interface"
import { ModalCustom } from "@/components/modal/modal.context"
import ResourceInfoModal from "@/components/modal/business/resourceInfo.modal"
import { FormInstance } from "antd/es/form"
import DateDiff from "@/utils/dateDiff.func"
import moment from "moment"
import "./resource.less"

interface loca {
	id: string
	userId: string
}

const Resource = (props: PageProps) => {
	const formRef = React.createRef<FormInstance>()
	const { id } = props.location.state as loca
	const [form] = Form.useForm()
	const [isCreate, setIsCreate] = useState(false) //是否是创建或升级的页面
	const [hasOrder, setHasOrder] = useState(false) //是否有历史订单，没有历史订单说明是创建套餐
	const [orderList, setOrderList] = useState<resourceListItem[]>([])
	const [areaList, setAreaList] = useState<areaListItem[]>([])
	const [labelCol, setLabelCol] = useState(8)
	const [wrapperCol, setWrapperCol] = useState(16)
	const [vrCount, setVrCount] = useState(0)
	const [useVrCount, setUseVrCount] = useState(0)
	const [tempCount, setTempCount] = useState(0)
	const [useTempCount, setUseTempCount] = useState(0)
	const [resourceId, setResourceId] = useState("")
	const [expireDate, setExpireDate] = useState(0)
	const [total, setTotal] = useState(0)
	const [disabled, setDisabled] = useState(true)

	useEffect(() => {
		if (!isCreate) {
			Promise.all([
				serviceBusiness.resourceInfo({ companyId: id }),
				serviceBusiness.resourceList({ companyId: id })
			]).then(([res1, res2]) => {
				if (res1.code == 200 && res2.code == 200) {
					setAreaList(res1.data.areaList)
					setVrCount(res1.data.vrCount)
					setUseVrCount(res1.data.useVrCount)
					setTempCount(res1.data.tempCount)
					setUseTempCount(res1.data.useTempCount)
					setExpireDate(res1.data.expireDate)
					setResourceId(res1.data.id)
					if (res2.data.length > 0) {
						setHasOrder(true)
						setOrderList(res2.data)
					} else {
						setHasOrder(false)
					}
				}
			})
		}
	}, [isCreate])

	const onFinish = useCallback(
		data => {
			let arr = Object.keys(data)
			for (var i = 0; i < arr.length; i++) {
				for (var j = 0; j < areaList.length; j++) {
					if (arr[i] === areaList[j].remark) {
						if (!!hasOrder) {
							areaList[j].tempCount = Number(areaList[j].tempCount || 0)
							areaList[j].addCount = Number(data[arr[i]] || 0)
						} else {
							areaList[j].tempCount = Number(data[arr[i]] || 0)
						}
					}
				}
			}
			if (hasOrder) {
				let params = {
					companyId: id,
					resourceId: resourceId,
					vrCount: Number(data.vrCount),
					expireDate: data.expireDate ? Date.parse(data.expireDate) : expireDate,
					areaBindList: areaList
				}
				serviceBusiness.updateResource(params).then(res => {
					if (res.code == 200) {
						message.success("资源套餐升级成功！")
						setIsCreate(false)
					}
				})
			} else {
				let params = {
					companyId: id,
					vrCount: data.vrCount,
					expireDate: Date.parse(data.expireDate),
					areaBindList: areaList
				}
				serviceBusiness.createResource(params).then(res => {
					if (res.code == 200) {
						message.success("资源套餐创建成功！")
						setIsCreate(false)
					}
				})
			}
		},
		[areaList, hasOrder, resourceId, expireDate]
	)

	//创建套餐
	const createHandle = () => {
		if (hasOrder) {
			setLabelCol(5)
			setWrapperCol(19)
		}
		setDisabled(true)
		setIsCreate(true)
		setTotal(0)
	}

	//取消
	const cancelHandle = () => {
		setLabelCol(8)
		setWrapperCol(16)
		setIsCreate(false)
		setTotal(0)
	}
	const changeHandle = () => {
		let data = formRef.current.getFieldsValue()
		let expireDates = data?.expireDate
		setDisabled(true)
		if (data?.vrCount || data?.expireDate) {
			if (!!hasOrder) {
				if (expireDate - new Date().getTime() > 0) {
					//判断套餐是否过期
					if (data.vrCount > 0 || Date.parse(data?.expireDate) > 0) {
						setDisabled(false)
					}
				} else {
					if (Date.parse(data?.expireDate) > 0) {
						setDisabled(false)
					}
				}
			}

			delete data.vrCount
			delete data.expireDate
		}

		let values = Object.values(data)
		let totals: number = 0
		values.map((item: number) => {
			if (item && item > 0) {
				totals = totals + Number(item) //计算资源总数
				if (!!hasOrder) {
					if (expireDate - new Date().getTime() > 0) {
						setDisabled(false)
					}
				} else {
					if (Date.parse(expireDates) > 0) {
						setDisabled(false)
					}
				}
			}
		})
		setTotal(totals)
	}

	const getResourceInfo = (id: string) => () => {
		ModalCustom({
			content: ResourceInfoModal,
			params: {
				id
			}
		})
	}

	const columns: ColumnsType<resourceListItem> = [
		{
			title: "订购服务",
			dataIndex: "resourceType",
			key: "resourceType",
			align: "center",
			width: 100,
			render: v => {
				return <>{v === 0 ? "创建套餐" : "升级套餐"}</>
			}
		},
		{
			title: "资源数量（个）",
			dataIndex: "resourceCount",
			key: "resourceCount",
			align: "center",
			width: 130
		},
		{
			title: "有效时间",
			dataIndex: "expireDate",
			key: "expireDate",
			align: "center",
			width: 140,
			render: (v, item) => {
				return <>{v && item.createTs ? DateDiff(item.createTs, v) : ""}</>
			}
		},
		{
			title: "服务时间",
			dataIndex: "serviceTime",
			key: "serviceTime",
			align: "center",
			width: 250,
			render: (v, item) => {
				return (
					<>{moment(item.createTs).format("YYYY年MM月DD日") + "-" + moment(item.expireDate).format("YYYY年MM月DD日")}</>
				)
			}
		},
		{
			title: "操作",
			dataIndex: "sceneId",
			key: "sceneId",
			fixed: "right",
			width: 60,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<Button type="primary" onClick={getResourceInfo(item.id)}>
							查看详情
						</Button>
					</>
				)
			}
		}
	]

	const disabledDate = (current: object) => {
		if (!!hasOrder) {
			if (expireDate - new Date().getTime() > 0) {
				//套餐没有过期，只能选套餐以后的时间
				return current && current < moment(expireDate)
			} else {
				//套餐过期了，能选今天以后的时间
				return current && current < moment().endOf("day")
			}
		} else {
			return current && current < moment().endOf("day")
		}
	}

	return (
		<div className="rescource" id="rescource">
			<div className="content">
				<Row>
					<Col className={!hasOrder && !!isCreate ? "info paddingRight" : "info"}>
						<h5>企业资源信息</h5>
						<Form
							labelCol={{ span: labelCol }}
							wrapperCol={{ span: wrapperCol }}
							layout="horizontal"
							ref={formRef}
							form={form}
							preserve={false}
							onFinish={onFinish}
							autoComplete="off"
						>
							<Form.Item label="展厅面积区间" className="title">
								{!hasOrder && <span>可发布展厅数(个)</span>}
								{!!hasOrder && <span>已使用/总数(个)</span>}
								{!!hasOrder && !!isCreate && <span>增购数量(个)</span>}
							</Form.Item>
							{areaList &&
								areaList.map(item => {
									return !!isCreate ? (
										<Form.Item label={item.remark} key={item.areaId}>
											{!hasOrder && (
												<Form.Item name={item.remark}>
													<InputNumber placeholder="请输入数字" maxLength={3} max={9999} onChange={changeHandle} />
												</Form.Item>
											)}
											{!!hasOrder && (
												<Row className="input">
													<span>{(item.useTempCount ? item.useTempCount : "0") + "/" + item.tempCount}</span>
													<Form.Item name={item.remark}>
														<InputNumber placeholder="请输入数字" maxLength={3} max={9999} onChange={changeHandle} />
													</Form.Item>
												</Row>
											)}
										</Form.Item>
									) : (
										<div key={item.areaId}>
											{!hasOrder && (
												<Form.Item label={item.remark} key={item.areaId}>
													<span>0</span>
												</Form.Item>
											)}
											{!!hasOrder && (
												<Form.Item label={item.remark} key={item.areaId}>
													<span>{(item.useTempCount ? item.useTempCount : "0") + "/" + item.tempCount}</span>
												</Form.Item>
											)}
										</div>
									)
								})}
							<Form.Item label="总计">
								{!!hasOrder && !!isCreate && (
									<Row className="input">
										<span>{useTempCount + "/" + tempCount}</span>
										<span>{total}</span>
									</Row>
								)}
								{!!hasOrder && !isCreate && <span>{useTempCount + "/" + tempCount}</span>}
								{!hasOrder && !isCreate && <span>{tempCount}</span>}
								{!hasOrder && !!isCreate && <span>{total}</span>}
							</Form.Item>
							<Form.Item label="增值服务" className="title">
								{!hasOrder && <span>数量(个)</span>}
								{!!hasOrder && <span>已使用/总数(个)</span>}
								{!!hasOrder && !!isCreate && <span>增购数量(个)</span>}
							</Form.Item>
							{!!isCreate ? (
								<>
									{!hasOrder && (
										<Form.Item label="VR带看" name="vrCount">
											<InputNumber placeholder="请输入数字" maxLength={4} max={9999} onChange={changeHandle} />
										</Form.Item>
									)}
									{!!hasOrder && (
										<Form.Item label="VR带看">
											<Row className="input">
												<span>{(useVrCount ? useVrCount : "0") + "/" + vrCount}</span>
												<Form.Item name="vrCount">
													<InputNumber placeholder="请输入数字" maxLength={4} max={9999} onChange={changeHandle} />
												</Form.Item>
											</Row>
										</Form.Item>
									)}
								</>
							) : (
								<Form.Item label="VR带看">
									{!!hasOrder ? <span>{(useVrCount ? useVrCount : "0") + "/" + vrCount}</span> : <span>0</span>}
								</Form.Item>
							)}
							{!!hasOrder && !isCreate && (
								<>
									<Form.Item label="到期时间" className="date">
										<span className="orange">{moment(expireDate).format("YYYY年MM月DD日")}</span>
									</Form.Item>
									<Form.Item label="套餐状态">
										<span>{expireDate - new Date().getTime() > 0 ? "服务中" : "已到期"}</span>
									</Form.Item>
								</>
							)}
							{!hasOrder && !isCreate && (
								<Form.Item label="到期时间" className="date">
									<span>-</span>
								</Form.Item>
							)}
							{!hasOrder && !!isCreate && (
								<Form.Item label="到期时间" name="expireDate" className="date" required>
									<DatePicker disabledDate={disabledDate} placeholder="请选择到期时间" onChange={changeHandle} />
								</Form.Item>
							)}
							{!!hasOrder && !!isCreate && (
								<Form.Item label="到期时间" className="date2">
									<Row className="input">
										<span>{moment(expireDate).format("YYYY年MM月DD日")}</span>
										<Form.Item name="expireDate">
											<DatePicker disabledDate={disabledDate} placeholder="调整到期时间" onChange={changeHandle} />
										</Form.Item>
									</Row>
								</Form.Item>
							)}
							{!!hasOrder && !!isCreate && expireDate - new Date().getTime() <= 0 && (
								<Form.Item className="tips">
									<p>
										<span className="red">套餐已到期请进行延期操作</span>
									</p>
								</Form.Item>
							)}

							<Form.Item className="btn">
								<Row justify="start" style={{ paddingLeft: "25px", marginTop: "30px" }}>
									{!isCreate && !hasOrder && (
										<Button type="primary" onClick={createHandle}>
											创建套餐
										</Button>
									)}
									{!isCreate && !!hasOrder && (
										<Button type="primary" onClick={createHandle}>
											升级套餐
										</Button>
									)}
									{isCreate && (
										<>
											<Button type="primary" htmlType="submit" disabled={disabled}>
												确认创建
											</Button>
											<Button className="cancel" onClick={cancelHandle}>
												取消
											</Button>
										</>
									)}
								</Row>
							</Form.Item>
						</Form>
					</Col>
					<Col className="order">
						<h5>历史订单：</h5>
						<div className="noData" hidden={orderList.length > 0}>
							<span>暂无数据</span>
						</div>
						{orderList &&
							orderList.map(item => {
								return (
									<div className="orderInfo" key={item.id}>
										<div className="title">
											<p>
												<span>订单日期：</span>
												{moment(item.createTs).format("YYYY年MM月DD日")}
											</p>
											<p>
												<span>订单号：</span>
												{item.orderNumber}
											</p>
										</div>
										<Table
											dataSource={[item]}
											columns={columns}
											pagination={false}
											rowKey={columns => columns.id}
											key={item.id}
										/>
									</div>
								)
							})}
					</Col>
				</Row>
			</div>
		</div>
	)
}
Resource.title = "资源管理"
Resource.menu = false
export default Resource
