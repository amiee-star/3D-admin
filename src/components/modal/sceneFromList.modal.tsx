import { returnColumnFields } from "@/utils/column.fields"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import ListTable from "../utils/list.table"
import { ModalRef } from "./modal.context"
import serviceScene from "@/services/service.scene"
const cardStyle = { width: 600 }
interface Props {
	id: string
}
const SceneFromListModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const withParams = useRef<any>({ id: props.id })

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={cardStyle}
			title="模板来源历史"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="globalScroll">
				<ListTable
					columns={returnColumnFields(["subType", "srcUrl", "objUrl", "panoUrl", "creatTs"])}
					pagination={false}
					searchParams={withParams.current}
					apiService={serviceScene.getSceneFromList}
				/>
			</div>
		</Card>
	)
}

export default SceneFromListModal
