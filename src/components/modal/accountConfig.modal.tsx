import serviceSystem from "@/services/service.system"
import { regxOnlyNum, regxSPhone } from "@/utils/regexp.func"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, Select, Radio, DatePicker, Row, Col, Tooltip } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import eventBus from "@/utils/event.bus"
import { ModalRef } from "./modal.context"
import "./accountConfig.modal.less"

interface Props {
	id: string
}
const { Option } = Select
const formItemLayout = {
	wrapperCol: {
		offset: 9
	}
}

const AccountConfigModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [activeValue, setActiveValue] = useState(0)
	const [cycleValue, setCycleValue] = useState(0)
	const [loading, setLoading] = useState(false)

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		setLoading(true)
		if (props.id == "") {
			serviceSystem
				.addSysUser({
					username: data.username,
					telephone: data.telephone,
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
		} else {
			serviceSystem
				.changUseInfo({
					username: data.username,
					telephone: data.telephone,
					active: data.active,
					id: props.id
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
		}
	}, [])
	useEffect(() => {
		serviceSystem.sysUserInfo(props.id).then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					...res.data
				})
			}
		})
	}, [props.id])

	const onChange = () => {}
	const onActiveValue = useCallback(
		e => {
			setActiveValue(e.target.value)
		},
		[activeValue]
	)

	const onCycleValue = useCallback(
		e => {
			setCycleValue(e.target.value)
		},
		[cycleValue]
	)

	return (
		<Card
			id="account-config"
			style={{ width: 530 }}
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
				initialValues={{
					active: 0,
					cycle: 0
				}}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item label="">
						<h3>基础配置</h3>
					</Form.Item>
					<Form.Item label="用户标签：" name="username" rules={[{ required: true, message: "请输入登录帐号!" }]}>
						<Input />
					</Form.Item>
					<Form.Item label="有效期：" name="phone" className="margin-bottom">
						<DatePicker onChange={onChange} />
					</Form.Item>
					<Form.Item label="" name="cycle" {...formItemLayout} valuePropName="checked">
						<Radio.Group onChange={onCycleValue} value={cycleValue}>
							<Tooltip placement="top" title="仅延长当期帐号有效期，套餐和增值服务已使用计数不变">
								<Radio value={0}>延续周期</Radio>
							</Tooltip>
							<Tooltip placement="top" title="开始新的服务周期，套餐和增值服务已使用计数清零，重新分配">
								<Radio value={1}>新周期</Radio>
							</Tooltip>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="套餐：" name="num" required>
						<Select placeholder="请选择套餐">
							<Option value="试用版">试用版</Option>
							<Option value="标准版">标准版</Option>
							<Option value="高级版">高级版</Option>
						</Select>
					</Form.Item>
					<Form.Item
						label="增购展厅发布总数量："
						name="username"
						rules={[{ required: true, message: "请输入增购展厅发布总数量!" }]}
					>
						<Input />
					</Form.Item>
					<Form.Item
						label="子帐号单展厅发布次数："
						name="username"
						rules={[
							{ required: true, message: "请输入子帐号单展厅发布次数!" },
							{ pattern: regxOnlyNum, message: "请输入数字" }
						]}
					>
						<Input suffix="/日" />
					</Form.Item>
					<Form.Item label="">
						<h3 className="border-top">增值服务配置</h3>
					</Form.Item>
					<Form.Item label="" noStyle>
						<Form.Item label="在线客服：" labelCol={{ span: 8 }} name="username" className="left-content">
							<Input />
						</Form.Item>
						<Form.Item label="直播：" labelCol={{ span: 8 }} name="username" className="right-content">
							<Input />
						</Form.Item>
					</Form.Item>
					<Form.Item label="" noStyle>
						<Form.Item label="访客信息：" labelCol={{ span: 8 }} name="username" className="left-content">
							<Input />
						</Form.Item>
						<Form.Item label="展厅同步：" labelCol={{ span: 8 }} name="username" className="right-content">
							<Input />
						</Form.Item>
					</Form.Item>
					<Form.Item label="启用状态：" name="active" labelCol={{ span: 4 }} valuePropName="checked">
						<Radio.Group onChange={onActiveValue} value={activeValue}>
							<Radio value={0}>启用</Radio>
							<Radio value={1}>禁用</Radio>
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

export default AccountConfigModal
