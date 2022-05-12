import serviceSystem from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Select, Radio, DatePicker, Row, Col, Tooltip } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import eventBus from "@/utils/event.bus"
import { ModalRef } from "./modal.context"
import "./accountConfig.modal.less"
import { regxOnlyNum } from "@/utils/regexp.func"

interface Props {
	id: string
}

const DeveloperNature: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [activeValue, setActiveValue] = useState(true)
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		setLoading(true)
		serviceSystem
			.updateDevelopers({
				id: props.id,
				tag: data.tag,
				publishCount: data.publishCount,
				active: data.active
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
	useEffect(() => {
		serviceSystem.developersInfo(props.id).then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					...res.data
				})
			}
		})
	}, [props.id])

	const onActiveValue = useCallback(
		e => {
			setActiveValue(e.target.value)
		},
		[activeValue]
	)

	return (
		<Card
			id="account-config"
			style={{ width: 605 }}
			title="帐号属性配置"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 7 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item label="用户标签：" name="tag">
						<Input />
					</Form.Item>
					<Form.Item
						label="子帐号单展厅发布次数："
						name="publishCount"
						rules={[{ pattern: regxOnlyNum, message: "请输入数字" }]}
					>
						<Input suffix="次/日" />
					</Form.Item>
					<Form.Item label="启用状态：" name="active">
						<Radio.Group onChange={onActiveValue} value={activeValue}>
							<Radio value={true}>启用</Radio>
							<Radio value={false}>禁用</Radio>
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

export default DeveloperNature
