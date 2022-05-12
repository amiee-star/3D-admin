import serviceSystem from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import eventBus from "@/utils/event.bus"
import { ModalRef } from "./modal.context"
import { userListItem } from "@/interfaces/api.interface"
// import serviceScene from "@/services/service.scene"

interface Props {
	tempId: string
	copyName: string
	userId: string
}

let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", devUserId: string, callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceSystem.getDevUserList({ devUserId, keywords: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}
const CopySceneModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, tempId, copyName, userId } = props
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [userOptions, setUserOptions] = useState([])
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, userId, (data: userListItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}

	const onFinish = useCallback(data => {
		setLoading(true)
		serviceSystem
			.copyDevUserTemp({
				tempId,
				tempName: data.tempName,
				userId: data.userId
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doSceneTemplate")
					closeModal()
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	return (
		<Card
			style={{ width: 530 }}
			title="复制展厅"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 6 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
				initialValues={{
					active: true
				}}
			>
				<div className="globalScroll">
					<Form.Item label="" name="telephone">
						<div>{copyName}</div>
						<div>{tempId}</div>
					</Form.Item>
					<Form.Item label="展厅名称：" name="tempName" rules={[{ required: true, message: "请输入展厅名称" }]}>
						<Input type="text" placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item>
					<Form.Item label="所属用户：" name="userId" rules={[{ required: true, message: "请选择所属用户" }]}>
						<Select
							showSearch
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							onSearch={handleSearch}
							// onChange={handleChange}
							notFoundContent={null}
						>
							{userOptions &&
								userOptions.map(d => (
									<Select.Option key={d.id} value={d.id}>
										{d.username}
									</Select.Option>
								))}
						</Select>
					</Form.Item>
				</div>
				<div className="globalFooter">
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit" loading={loading}>
							保存
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Card>
	)
}

export default CopySceneModal
