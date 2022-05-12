import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, message, Row, Select } from "antd"
import React, { useCallback, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceScene from "@/services/service.scene"

import { userListItem } from "@/interfaces/api.interface"
import serviceHall from "@/services/service.hall"
import eventBus from "@/utils/event.bus"

const cardStyle = { width: 600 }
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
	name: string
}
const EditHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [searchValue, setSearchValue] = useState("")
	const [userOptions, setUserOptions] = useState([])
	const [loading, setLoading] = useState(false)
	//  提交
	const onFinish = useCallback(data => {
		const { newTempName, newUserId } = data
		setLoading(true)
		serviceHall
			.cloneHall({
				tempId: props.id,
				newTempName,
				newUserId
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doHallTemplate")
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
			fetch(value, (data: any) => setUserOptions(data))
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
			title="复制展厅"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 5 }} layout="horizontal" preserve={false} onFinish={onFinish} autoComplete="off">
				<div className="globalScroll">
					<Form.Item label="来源展厅名称">
						<span>{props.name}</span>
					</Form.Item>
					<Form.Item label="来源展厅ID">
						<span>{props.id}</span>
					</Form.Item>
					<Form.Item label="展厅名称" name="newTempName" rules={[{ required: true, message: "请输入展厅名称" }]}>
						<Input placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item>
					<Form.Item label="所属用户" name="newUserId" rules={[{ required: true, message: "请选择所属用户" }]}>
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
