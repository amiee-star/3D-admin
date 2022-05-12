import serviceSystem from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Select, Radio } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import eventBus from "@/utils/event.bus"
import { ModalRef } from "../modal.context"
import { userListItem } from "@/interfaces/api.interface"
import service4Dtemplate from "@/services/service.4Dtemplate"
// import serviceScene from "@/services/service.scene"

interface Props {
	hallId: string
	copyName: string
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
		service4Dtemplate.searchUsers({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data.list)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}
const CopyHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, hallId, copyName } = props
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [userOptions, setUserOptions] = useState([])
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	useEffect(() => {
		fetch("", "", (data: userListItem[]) => setUserOptions(data))
	}, [])
	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, hallId, (data: userListItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}

	const onFinish = useCallback(data => {
		setLoading(true)
		service4Dtemplate
			.cloneHall({
				tempId: hallId,
				newTempName: data.hallName,
				userId: data.userId,
				check: data.check
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doHall")
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
					<Form.Item label="源展厅ID" name="">
						<div>{hallId}</div>
					</Form.Item>
					{/* 						<div>{copyName}</div> */}
					<Form.Item label="源展厅名称" name="">
						<div>{copyName}</div>
					</Form.Item>
					<Form.Item label="展厅名称：" name="hallName" rules={[{ required: true, message: "请输入展厅名称" }]}>
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
					<Form.Item label="访问控制" name="check">
						<Radio.Group>
							<Radio value={1}>正常访问</Radio>
							<Radio value={2}>禁止访问</Radio>
						</Radio.Group>
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

export default CopyHallModal
