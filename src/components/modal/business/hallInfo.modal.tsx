import { hallTableInfo } from "@/interfaces/api.interface"
import serviceBusiness from "@/services/service.business"
import serviceHall from "@/services/service.hall"
import serviceDev from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Descriptions, Space } from "antd"
import moment from "moment"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"

const cardStyle = { width: 600, minHeight: 714 }
interface Props {
	id: string
	dev?: boolean
}

const HallInfoModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [infoobj, setInfoobj] = useState<hallTableInfo>()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		if (props.dev) {
			serviceDev.getDevUserTempInfo(props.id).then(rslt => {
				if (rslt.code === 200) {
					setInfoobj(rslt.data)
				}
			})
		} else {
			serviceBusiness.getHallInfo({ tempId: props.id }).then(rslt => {
				if (rslt.code === 200) {
					setInfoobj(rslt.data)
				}
			})
		}
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
						<Descriptions.Item label="展厅名称" span={3} labelStyle={{ width: "100px" }}>
							{infoobj.tempName}
							{infoobj.tempId ? "（" + infoobj.tempId + "）" : ""}
						</Descriptions.Item>
						<Descriptions.Item label="有效面积" span={3} labelStyle={{ width: "100px" }}>
							{infoobj.validSz ? infoobj.validSz + "m²" : "0m²"}
						</Descriptions.Item>
						{infoobj.areaRemark && (
							<Descriptions.Item label="使用面积" span={3} labelStyle={{ width: "100px" }}>
								{infoobj.areaRemark}
							</Descriptions.Item>
						)}
						<Descriptions.Item span={3} label="创建时间" labelStyle={{ width: "100px" }}>
							{infoobj.createTs ? moment(new Date(infoobj.createTs)).format("YYYY-MM-DD HH:mm") : ""}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="到期时间" labelStyle={{ width: "100px" }}>
							{infoobj.durationEndTs ? moment(new Date(infoobj.durationEndTs)).format("YYYY-MM-DD HH:mm") : ""}
						</Descriptions.Item>
						<Descriptions.Item label="所属用户" span={3} labelStyle={{ width: "100px" }}>
							{infoobj.userName}
							{infoobj.userPhone ? "（" + infoobj.userPhone + "）" : ""}
						</Descriptions.Item>
						<Descriptions.Item label="展厅来源" span={3} labelStyle={{ width: "100px" }}>
							{infoobj.sceneFromVal}
						</Descriptions.Item>
						<Descriptions.Item label="精品状态" span={3} labelStyle={{ width: "100px" }}>
							{infoobj.boutique ? "精品" : "非精品"}
						</Descriptions.Item>
						<Descriptions.Item label="发布状态" span={3} labelStyle={{ width: "100px" }}>
							{infoobj.aliStatic == 0
								? "未发布"
								: infoobj.aliStatic == 1
								? "发布中"
								: infoobj.aliStatic == 2
								? infoobj.publishAfterStatus == 1
									? "已发布(有修改)"
									: "已发布"
								: "发布失败"}
						</Descriptions.Item>
						<Descriptions.Item label="快速布展" span={3} labelStyle={{ width: "100px" }}>
							{infoobj.fastLayout ? "已开启" : "未开启"}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="渲染状态" labelStyle={{ width: "100px" }}>
							{infoobj.renderOver ? "已渲染" : "未渲染"}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="渲染进度" labelStyle={{ width: "100px" }}>
							{infoobj.renderFlowStatus == 1
								? "未渲染"
								: infoobj.renderFlowStatus == 2
								? "排队中"
								: infoobj.renderFlowStatus == 3
								? "渲染中"
								: infoobj.renderFlowStatus == 4
								? "渲染失败"
								: infoobj.renderFlowStatus == 5
								? "上传成功"
								: infoobj.renderFlowStatus == 6
								? "上传失败"
								: infoobj.renderFlowStatus == 7
								? "渲染完成"
								: ""}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="来源展厅" labelStyle={{ width: "100px" }}>
							{infoobj.parentName}
							{infoobj.parentId ? "（" + infoobj.parentId + "）" : ""}
						</Descriptions.Item>
						<Descriptions.Item span={3} label="来源模板" labelStyle={{ width: "100px" }}>
							{infoobj.sceneName}
							{infoobj.sceneId ? "（" + infoobj.sceneId + "）" : ""}
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
