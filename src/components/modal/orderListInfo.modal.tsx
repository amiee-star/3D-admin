import { orderListItem } from "@/interfaces/api.interface"
import serviceOrderList from "@/services/service.marketing"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Descriptions } from "antd"
import moment from "moment"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import "./orderListInfo.modal.less"

const cardStyle = { width: 600 }
interface Props {
	id: number
}
const info: orderListItem = {
	createTs: 0,
	fee: 0,
	outTradeNo: "",
	sceneTemplateId: "",
	sceneTemplateName: "",
	status: "",
	transactionType: "",
	validSz: 0
}
const OrderListInfoModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [infoobj, setInfoobj] = useState<orderListItem>(info)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		serviceOrderList.getOrderById({ id: props.id }).then(res => {
			setInfoobj(res.data)
		})
	}, [])
	return (
		<Card
			id="orderInfo"
			style={cardStyle}
			title="订单详情"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="globalScroll">
				<Descriptions>
					<Descriptions.Item label="订单编号" span={3} labelStyle={{ width: "100px" }}>
						{infoobj.outTradeNo}
					</Descriptions.Item>
					<Descriptions.Item span={3} label="服务类型" labelStyle={{ width: "100px" }}>
						{infoobj.serverType}
					</Descriptions.Item>
					{infoobj.serverType == "增值服务" && (
						<Descriptions.Item span={3} label="服务内容" labelStyle={{ width: "100px" }}>
							{infoobj.product &&
								JSON.parse(infoobj.product).map((item: { id: number; name: string; price: number }) => {
									return (
										<p className="no-margin" key={item.id}>
											<span className="product-name">{item.name}</span>
											<span>({item.price}元/厅)</span>
										</p>
									)
								})}
						</Descriptions.Item>
					)}
					<Descriptions.Item span={3} label="展厅名称" labelStyle={{ width: "100px" }}>
						{infoobj.sceneTemplateName}
					</Descriptions.Item>
					<Descriptions.Item span={3} label="展厅ID" labelStyle={{ width: "100px" }}>
						{infoobj.sceneTemplateId}
					</Descriptions.Item>
					<Descriptions.Item span={3} label="建展面积" labelStyle={{ width: "100px" }}>
						{infoobj.validSz && infoobj.validSz + "㎡"}
					</Descriptions.Item>
					<Descriptions.Item span={3} label="消费平台" labelStyle={{ width: "100px" }}>
						{infoobj.transactionType}
					</Descriptions.Item>
					<Descriptions.Item span={3} label="金额" labelStyle={{ width: "100px" }}>
						{infoobj.fee}
					</Descriptions.Item>
					<Descriptions.Item span={3} label="订单时间" labelStyle={{ width: "100px" }}>
						{infoobj.createTs ? moment(new Date(infoobj.createTs)).format("YYYY-MM-DD HH:mm") : ""}
					</Descriptions.Item>
					<Descriptions.Item span={3} label="订单状态" labelStyle={{ width: "100px" }}>
						{infoobj.status}
					</Descriptions.Item>
				</Descriptions>
			</div>
			<div className="globalFooter">
				<Button type="primary" block onClick={closeModal}>
					关闭
				</Button>
			</div>
		</Card>
	)
}

export default OrderListInfoModal
