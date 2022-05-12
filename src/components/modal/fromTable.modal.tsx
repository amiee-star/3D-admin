import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message, Modal, Radio } from "antd"
import React, { useCallback, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceOperate from "@/services/service.operate"
import "./editMusic.modal.less"
import eventBus from "@/utils/event.bus"

const cardStyle = { width: 500 }

interface Props {
	id: number
}

const FromTableModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [value, setValue] = React.useState(2)
	const [loading, setLoading] = useState(false)

	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onChange = useCallback(
		(e: any) => {
			setValue(e.target.value)
		},
		[value]
	)

	const onFinish = useCallback(
		data => {
			setLoading(true)
			const params = {
				id: props.id,
				status: value,
				remark: data.remark
			}
			serviceOperate.handleForm(params).then(res => {
				if (res.code === 200) {
					eventBus.emit("doFormList")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(true)
				}
			})
		},
		[value]
	)

	return (
		<Card
			style={cardStyle}
			title="表单处理"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 5 }}
				layout="horizontal"
				form={form}
				preserve={false}
				onFinish={onFinish}
				initialValues={{ status: 2 }}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item label="类型：" name="status" valuePropName="checked" required>
						<Radio.Group onChange={onChange} value={value}>
							<Radio value={2}>无效客户</Radio>
							<Radio value={3}>可跟进客户</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="备注" name="remark">
						<Input.TextArea placeholder="请输入用户处理备注（最多100字）" maxLength={100} />
					</Form.Item>
				</div>
				<div className="globalFooter">
					<Form.Item>
						<Button block type="primary" htmlType="submit" loading={loading}>
							保存
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Card>
	)
}

export default FromTableModal
