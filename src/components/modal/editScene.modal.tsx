import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceScene from "@/services/service.scene"
const cardStyle = { width: 600 }

import { userListItem } from "@/interfaces/api.interface"
import eventBus from "@/utils/event.bus"
import serviceHall from "@/services/service.hall"
const Option = Select

let timeout: NodeJS.Timeout
let currentValue: string

function fetch(value: string = "", callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceScene.searchUsers({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data.list)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

interface Props {
	id: string
	userinfo: string
}
const EditHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [searchValue, setSearchValue] = useState("")
	const [userOptions, setUserOptions] = useState<userListItem[]>([])
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()

	useEffect(() => {
		fetch(props.userinfo, (data: userListItem[]) => setUserOptions(data))
		serviceScene.getSceneInfo({ id: props.id }).then(rslt => {
			form.setFieldsValue({
				name: rslt.data.name,
				validSz: rslt.data.validSz,
				userId: rslt.data.userId
			})
		})
	}, [])
	//  提交
	const onFinish = useCallback(data => {
		const { name, validSz, userId } = data
		setLoading(true)
		serviceScene
			.editScene({
				name,
				validSz,
				userId,
				id: props.id
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doSceneTemplate")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])
	//  select搜索事件
	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, (data: userListItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}
	// select change事件
	const handleChange = (value: string) => {
		setSearchValue(value)
	}
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={cardStyle}
			title="修改模板"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 4 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						label="模板名称"
						name="name"
						rules={[
							{ required: true, message: "请输入模板名称" },
							{ message: "请输入1-30个文字", max: 30 }
						]}
					>
						<Input />
					</Form.Item>
					<Form.Item label="有效面积" name="validSz">
						<InputNumber min={0} max={10000000} />
					</Form.Item>
					<Form.Item label="归属用户" name="userId" required>
						<Select
							showSearch
							value={searchValue}
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							onSearch={handleSearch}
							onChange={handleChange}
							notFoundContent={null}
						>
							{userOptions &&
								userOptions.map(d => (
									<Option key={d.id} value={d.id}>
										{d.username}
									</Option>
								))}
						</Select>
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

export default EditHallModal
