import { renderInfo } from "@/interfaces/api.interface"
import serviceScene from "@/services/service.scene"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Descriptions } from "antd"
import moment from "moment"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"

const cardStyle = { width: 600 }
interface Props {
	id: string
	dev?: boolean
}

const RenderInfoModel: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [infoobj, setInfoobj] = useState<renderInfo>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		serviceScene.viewRenderInfo(props.id).then(res => {
			if (res.code === 200) {
				setInfoobj(res.data)
			}
		})
	}, [])
	return (
		<Card
			style={cardStyle}
			title="渲染失败"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="globalScroll">
				{infoobj && (
					<Descriptions>
						<Descriptions.Item span={3} label="展厅名称" labelStyle={{ width: "100px" }}>
							{infoobj.tempName}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="展厅ID" labelStyle={{ width: "100px" }}>
							{infoobj.tempId}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="所属用户" labelStyle={{ width: "100px" }}>
							{infoobj.nickname}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="渲染开始" labelStyle={{ width: "100px" }}>
							{infoobj.renderStartTime ? moment(new Date(infoobj.renderStartTime)).format("YYYY-MM-DD HH:mm") : ""}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="渲染结束" labelStyle={{ width: "100px" }}>
							{infoobj.renderEndTime ? moment(new Date(infoobj.renderEndTime)).format("YYYY-MM-DD HH:mm") : ""}
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

export default RenderInfoModel
