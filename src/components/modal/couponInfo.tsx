import React, { useMemo, useState } from "react"
import { Button, Card, Descriptions } from "antd"
import moment from "moment"
import { CloseOutlined } from "@ant-design/icons"
import serviceMarketing from "@/services/service.marketing"
import { couponOrderInfo } from "@/interfaces/api.interface"
import { ModalRef } from "./modal.context"
interface Props {
	id: string
}
const couponInfo = (props: Props & ModalRef) => {
	const { id, modalRef } = props
	const [infoobj, setInfoobj] = useState({} as couponOrderInfo)
	useMemo(() => {
		if (id) {
			serviceMarketing.orderDetail(id).then(res => {
				if (res.code === 200) {
					setInfoobj(res.data)
				}
			})
		}
	}, [id])
	const closeModal = () => {
		modalRef.current.destroy()
	}
	return (
		<Card
			style={{ width: 400 }}
			title="展厅信息"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="globalScroll">
				{infoobj && (
					<Descriptions>
						<Descriptions.Item label="订单编号" span={24} labelStyle={{ width: "100px" }}>
							{infoobj.outTradeNo}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="服务类型" labelStyle={{ width: "100px" }}>
							{infoobj.serverType}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="展厅名称" labelStyle={{ width: "100px" }}>
							{infoobj.sceneTemplateName}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="展厅ID" labelStyle={{ width: "100px" }}>
							{infoobj.sceneTemplateId}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="建展面积" labelStyle={{ width: "100px" }}>
							{infoobj.validSz}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="消费平台" labelStyle={{ width: "100px" }}>
							{infoobj.transactionType}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="优惠券类型" labelStyle={{ width: "100px" }}>
							{infoobj.couponType}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="折扣" labelStyle={{ width: "100px" }}>
							{infoobj.discountAmount}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="销售员" labelStyle={{ width: "100px" }}>
							{infoobj.salesmanName}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="实付金额" labelStyle={{ width: "100px" }}>
							{infoobj.fee}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="订单时间" labelStyle={{ width: "100px" }}>
							{infoobj.createTs ? moment(new Date(infoobj.createTs)).format("YYYY-MM-DD HH:mm") : ""}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="订单状态" labelStyle={{ width: "100px" }}>
							{infoobj.status}
						</Descriptions.Item>
					</Descriptions>
				)}
			</div>
			<div className="globalFooter">
				<Button type="primary" block onClick={closeModal}>
					关闭
				</Button>
			</div>
		</Card>
	)
}
export default couponInfo
