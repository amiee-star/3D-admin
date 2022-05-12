import { CloseOutlined } from "@ant-design/icons"
import { Button, Card } from "antd"
import React, { useCallback, useState } from "react"
import NewHallForm from "../form/hall/newHall.form"
import { ModalRef } from "./modal.context"
const cardStyle = { width: 600 }
interface Props {}
const AddHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={cardStyle}
			title="新增展厅"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<NewHallForm modalRef={modalRef} />
		</Card>
	)
}

export default AddHallModal
