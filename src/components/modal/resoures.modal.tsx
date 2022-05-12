import serviceScene from "@/services/service.scene"
import eventBus from "@/utils/event.bus"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message } from "antd"
import React, { useCallback, useState } from "react"
import FormUploads from "../form/form.uploads"
import { ModalRef } from "./modal.context"
import checkZip from "@/utils/checkZip.func"
const cardStyle = { width: 600 }
interface Props {
	title: string
	id: string
	resourceFunc: Function
	keyName: Array<string>
}
const AddHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const checkType = props.keyName[2].toString()
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		setLoading(true)
		const { zip } = data
		let requestData = {
			sid: props.id
		}
		requestData[props.keyName[0]] = zip[0].fileSaveUrl
		requestData[props.keyName[1]] = zip[0].fileSize

		props
			.resourceFunc(requestData)
			.then((res: any) => {
				if (res.code === 200) {
					eventBus.emit("doSceneTemplate")
					modalRef.current.destroy()
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const onRemove = useCallback((uid: string) => {
		serviceScene.fileCancel({ uuid: uid })
	}, [])

	return (
		<Card
			style={cardStyle}
			title={props.title}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 6 }} layout="horizontal" preserve={false} onFinish={onFinish} autoComplete="off">
				<div className="globalScroll">
					<Form.Item
						label={`选择${props.title.substring(2)}ZIP包`}
						name="zip"
						required
						rules={[{ required: true, message: "请选择本地ZIP包" }]}
					>
						<FormUploads
							accept=".zip"
							withChunk
							chunkSize={3}
							size={1}
							customCheck={checkZip(checkType)}
							onRemove={onRemove}
						/>
					</Form.Item>
				</div>
				<div className="globalFooter">
					<Form.Item>
						<Button block type="primary" htmlType="submit" loading={loading}>
							上传
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Card>
	)
}

export default AddHallModal
