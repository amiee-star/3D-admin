import { hallTableInfo } from "@/interfaces/api.interface"
import serviceDev from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Descriptions } from "antd"
import moment from "moment"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"

const cardStyle = { width: 600 }
interface Props {
	id: string
}
const HallInfoModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [infoobj, setInfoobj] = useState<any>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		serviceDev.getDevUserTempInfo(id).then(rslt => {
			if (rslt.code === 200) {
				const { tempName, tempId, createTs, durationEndTs, renderOver, parentName, sceneName, sceneId } = rslt.data
				setInfoobj({ tempName, tempId, createTs, durationEndTs, renderOver, parentName, sceneName, sceneId })
			}
		})
	}, [])
	return (
		<Card
			style={cardStyle}
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
						<Descriptions.Item label="名称" span={24} labelStyle={{ width: "100px" }}>
							{infoobj.tempName}
							<br />
							{infoobj.tempId}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="创建时间" labelStyle={{ width: "100px" }}>
							{infoobj.createTs ? moment(new Date(infoobj.createTs)).format("YYYY-MM-DD HH:mm") : ""}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="到期时间" labelStyle={{ width: "100px" }}>
							{infoobj.durationEndTs ? moment(new Date(infoobj.durationEndTs)).format("YYYY-MM-DD HH:mm") : ""}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="渲染状态" labelStyle={{ width: "100px" }}>
							{infoobj.renderOver ? "已渲染" : "未渲染"}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="来源展厅" labelStyle={{ width: "100px" }}>
							{infoobj.parentName}
							<br />
							{infoobj.parentId}
						</Descriptions.Item>
						<Descriptions.Item span={24} label="来源模板" labelStyle={{ width: "100px" }}>
							{infoobj.sceneName}
							<br />
							{infoobj.sceneId}
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

export default HallInfoModal
