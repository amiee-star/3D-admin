import { getResourceInfoItem } from "@/interfaces/api.interface"
import serviceBusiness from "@/services/service.business"
import serviceDev from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Descriptions, Space } from "antd"
import moment, { Moment } from "moment"
import DateDiff from "@/utils/dateDiff.func"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import "./resourceInfo.modal.less"

const cardStyle = { width: 600, minHeight: 714 }
interface Props {
	id: string
}

const ResourceInfo: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [resourceInfo, setResourceInfo] = useState<getResourceInfoItem>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	useEffect(() => {
		serviceBusiness.getResourceInfo({ resourceId: props.id }).then(rslt => {
			if (rslt.code === 200) {
				setResourceInfo(rslt.data)
			}
		})
	}, [])

	return (
		<Card
			id="orderInfo"
			style={cardStyle}
			title="订单信息"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="globalScroll">
				{resourceInfo && (
					<Descriptions>
						<Descriptions.Item label="服务类型" span={3} labelStyle={{ width: "100px" }}>
							{resourceInfo.resourceType === 0 ? "创建套餐" : "升级套餐"}
						</Descriptions.Item>
						<Descriptions.Item label="资源数量" span={3} labelStyle={{ width: "100px" }}>
							{resourceInfo.resourceCount + "个"}
						</Descriptions.Item>
						{resourceInfo.addCountSum > 0 && (
							<Descriptions.Item className="title" label="" span={3} labelStyle={{ width: "100px" }}>
								可发布展厅数
							</Descriptions.Item>
						)}
						{resourceInfo.areaList &&
							resourceInfo.areaList.map(item => {
								return (
									item.addCount > 0 && (
										<Descriptions.Item key={item.areaId} label={item.remark} span={3} labelStyle={{ width: "100px" }}>
											{(item.addCount || 0) + "个"}
										</Descriptions.Item>
									)
								)
							})}
						{resourceInfo.addCountSum > 0 && (
							<Descriptions.Item label="总计" span={3} labelStyle={{ width: "100px" }}>
								{resourceInfo.addCountSum + "个"}
							</Descriptions.Item>
						)}

						<Descriptions.Item className="title" label="" span={3} labelStyle={{ width: "100px" }}>
							增值服务
						</Descriptions.Item>
						{resourceInfo.addVrCount > 0 && (
							<Descriptions.Item span={3} label="VR带看" labelStyle={{ width: "100px" }}>
								{resourceInfo.addVrCount + "个"}
							</Descriptions.Item>
						)}
						<Descriptions.Item span={3} label="有效时间" labelStyle={{ width: "100px" }}>
							{resourceInfo.expireDate && resourceInfo.createTs
								? DateDiff(resourceInfo.createTs, resourceInfo.expireDate)
								: ""}
						</Descriptions.Item>
						<Descriptions.Item label="服务时间" span={3} labelStyle={{ width: "100px" }}>
							{resourceInfo.expireDate && resourceInfo.createTs
								? moment(resourceInfo.createTs).format("YYYY年MM月DD日") +
								  "-" +
								  moment(resourceInfo.expireDate).format("YYYY年MM月DD日")
								: ""}
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

export default ResourceInfo
