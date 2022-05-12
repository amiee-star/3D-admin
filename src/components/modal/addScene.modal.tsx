import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Alert } from "antd"
import React, { useCallback, useState, useEffect } from "react"
import MaxSceneForm from "../form/scene/maxScene.form"
import SiteSceneForm from "../form/scene/siteScene.form"
import VrSceneForm from "../form/scene/vrScene.form"
import { ModalRef } from "./modal.context"
import eventBus from "@/utils/event.bus"

interface Props {}
const AddSceneModal: React.FC<Props & ModalRef> = props => {
	const [key, setKey] = useState("vr")
	const { modalRef } = props
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
		eventBus.emit("showAlert", "")
	}, [])
	const onTabChange = useCallback((key: string) => setKey(key), [])

	return (
		<>
			<Card
				style={{ marginTop: "60px" }}
				title="创建模版"
				extra={
					<Button size="small" type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				}
				tabList={[
					{
						key: "vr",
						tab: "上传全景数据"
					},
					{
						key: "site",
						tab: "导入网站数据"
					},
					{
						key: "3d",
						tab: "上传3DMAX工程"
					}
				]}
				onTabChange={onTabChange}
				activeTabKey={key}
			>
				{key === "vr" && <VrSceneForm modalRef={modalRef} />}
				{key === "site" && <SiteSceneForm modalRef={modalRef} />}
				{key === "3d" && <MaxSceneForm modalRef={modalRef} />}
			</Card>
		</>
	)
}

export default AddSceneModal
