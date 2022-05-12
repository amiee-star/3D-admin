import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, Row, Col, message } from "antd"
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
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		setLoading(true)
		if (!props.id) {
			serviceSystem
				.role({
					roleName: data.roleName,
					roleCode: data.roleCode,
					description: data.description
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
				.changeRole({
					roleName: data.roleName,
					roleCode: data.roleCode,
					description: data.description,
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
	}, [])
	useEffect(() => {
		serviceSystem.roleInfo(props.id).then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					...res.data
				})
			}
		})
	}, [props.id])
	return (
		<Card
			style={{ width: 530 }}
			title={props.id == "" ? "新增角色" : "编辑角色"}
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
						label="角色名称："
						name="roleName"
						rules={[
							{ required: true, message: "请输入角色名称" },
							{ message: "请输入1-20个文字", max: 20 }
						]}
					>
						<Input placeholder="请输入角色名称（最多20个字符）" />
					</Form.Item>
					<Form.Item label="角色编码：" name="roleCode" rules={[{ required: true, message: "请输入角色编码" }]}>
						<Input />
					</Form.Item>
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
