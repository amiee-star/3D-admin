import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, Row, Col, Switch, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import serviceSystem from "@/services/service.system"
import { ModalRef } from "./modal.context"
import eventBus from "@/utils/event.bus"

interface Props {
	id: string
}
const AddRoleModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const { TextArea } = Input
	const [form] = Form.useForm()
	const [enable, setEnable] = useState(true)
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onChange = useCallback(checked => {
		setEnable(checked)
	}, [])
	const onFinish = useCallback(
		data => {
			setLoading(true)
			if (props.id == "") {
				serviceSystem
					.permission({
						permissionName: data.permissionName,
						description: data.description,
						enabled: enable
					})
					.then(res => {
						if (res.code === 200) {
							eventBus.emit("doSceneTemplate")
							closeModal()
							message.success("保存成功！")
							setLoading(false)
						}
					})
					.finally(() => {
						setLoading(false)
					})
			} else {
				serviceSystem
					.changePermission({
						permissionName: data.permissionName,
						description: data.description,
						enabled: enable,
						id: props.id
					})
					.then(res => {
						if (res.code === 200) {
							eventBus.emit("doSceneTemplate")
							closeModal()
							message.success("保存成功！")
							setLoading(false)
						}
					})
					.finally(() => {
						setLoading(false)
					})
			}
		},
		[enable]
	)
	useEffect(() => {
		serviceSystem.permissionInfo(props.id).then(res => {
			if (res.code === 200) {
				setEnable(res.data.enabled)
				form.setFieldsValue({
					...res.data
				})
			}
		})
	}, [props.id])
	return (
		<Card
			style={{ width: 530 }}
			title={props.id == "" ? "新增权限" : "编辑权限"}
			extra={
				<Button type="text" onClick={closeModal}>
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
						label="权限名称："
						name="permissionName"
						rules={[
							{ required: true, message: "请输入权限名称" },
							{ message: "请输入1-20个文字", max: 20 }
						]}
					>
						<Input placeholder="请输入权限名称（最多8个字符）" />
					</Form.Item>
					{/* <Form.Item label="启用状态：" name="enabled">
					<Switch checkedChildren="开启" unCheckedChildren="关闭" checked={enable} onChange={onChange} />
				</Form.Item> */}
					<Form.Item label="描述：" name="description">
						<TextArea rows={4} />
					</Form.Item>
					{/* <Form.Item label="权限集：" name="remember" valuePropName="checked">
					<Checkbox.Group>
						<Row>
							<Col span={8}>
								<Checkbox value="1">模板管理</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox value="2">展厅管理</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox value="3">分类管理</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox value="4">通用管理</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox value="5">营销管理</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox value="6">运营管理</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox value="7">系统管理</Checkbox>
							</Col>
							<Col span={8}>
								<Checkbox value="8">统计分析</Checkbox>
							</Col>
						</Row>
					</Checkbox.Group>
				</Form.Item> */}
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

export default AddRoleModal
