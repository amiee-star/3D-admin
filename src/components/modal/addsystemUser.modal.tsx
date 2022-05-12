import serviceSystem from "@/services/service.system"
import { checkPassword } from "@/utils/regexp.func"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, Select, Radio } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import eventBus from "@/utils/event.bus"
import { ModalRef } from "./modal.context"
import CryptoJS from "crypto-js"
import { comboItem, rolesListItem } from "@/interfaces/api.interface"

interface Props {
	id: string
}
interface StateData {
	combo: comboItem[]
}

const { Option } = Select
const addsystemUser: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [isdisabled, setisdisabled] = useState(false)
	const [roleData, setRoleData] = useState<StateData>()
	const [done, setDone] = useState(false)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (!props.id) {
			serviceSystem.combo({ keyword: "" }).then(combo => {
				if (combo.code === 200) {
					setRoleData({
						combo: combo.data ? combo.data : []
					})
					setDone(true)
				}
			})
		} else {
			Promise.all([serviceSystem.combo({ keyword: "" })]).then(([combo]) => {
				if (combo.code === 200) {
					setRoleData({
						combo: combo.data ? combo.data : []
					})
					setDone(true)
				}
			})
		}
	}, [])

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		setLoading(true)
		if (!props.id) {
			serviceSystem
				.addSysUser({
					...data,
					password: CryptoJS.MD5(data.password).toString(),
					rePassword: CryptoJS.MD5(data.rePassword).toString()
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
					realName: data.realName,
					roleId: data.roleId,
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
		if (props.id) {
			serviceSystem.sysUserInfo(props.id).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data,
						roleId: res.data?.roleList ? res.data?.roleList[0] : ""
					})
				}
			})
			setisdisabled(true)
		}
	}, [props.id])
	return (
		<>
			<Card
				style={{ width: 530 }}
				title={props.id == "" ? "新增用户" : "修改用户"}
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
					initialValues={{
						active: true
					}}
				>
					<div className="globalScroll">
						<Form.Item
							label="登录帐号："
							name="username"
							rules={[
								{ required: true, message: "请输入登录帐号" },
								{ min: 2, max: 15, message: "请输入2-15个文字" }
							]}
						>
							<Input disabled={isdisabled} maxLength={15} />
						</Form.Item>
						<Form.Item
							label="用户姓名："
							name="realName"
							rules={[
								{ required: true, message: "请输入用户姓名" },
								{ min: 2, max: 15, message: "请输入2-15个文字" }
							]}
						>
							<Input maxLength={15} />
						</Form.Item>
						{!props.id && (
							<Form.Item
								label="登录密码："
								name="password"
								validateTrigger="onBlur"
								rules={[
									{ required: true, message: "请输入新密码" },
									{
										min: 8,
										max: 16,
										message: "密码需要8-16位大小写字母、数字、特殊符号至少三种组合",
										pattern: checkPassword
									}
								]}
							>
								<Input type="password" placeholder="密码需要8-16位大小写字母、数字、特殊符号至少三种组合" />
							</Form.Item>
						)}

						{!props.id && (
							<Form.Item
								label="密码确认："
								name="rePassword"
								required
								validateTrigger="onBlur"
								rules={[
									{ required: true, message: "请再次输入密码" },
									({ getFieldValue }) => ({
										validator(_, value) {
											if (!value || getFieldValue("password") === value) {
												return Promise.resolve()
											}
											return Promise.reject("你两次输入的密码不一致")
										}
									})
								]}
							>
								<Input type="password" placeholder="请再次输入新密码" />
							</Form.Item>
						)}

						{/* <Form.Item label="用户角色：" name="roleId" valuePropName="checked" required>
					<Select
						showSearch
						mode="multiple"
						allowClear
						placeholder="请选择角色"
						filterOption={(input, option) => {
							if (option && option.props.title) {
								return option.title === input || option.title.indexOf(input) !== -1
							} else {
								return true
							}
						}}
					>
						{roleData?.combo &&
							roleData?.combo.map(item => {
								return (
									<Option value={item.id} key={item.id} title={item.name}>
										{item.name}
									</Option>
								)
							})}
					</Select>
				</Form.Item> */}
						<Form.Item label="用户角色：" name="roleId" rules={[{ required: true, message: "请选择用户角色" }]}>
							<Select placeholder="请选择角色">
								{roleData?.combo &&
									roleData?.combo.map(item => {
										return (
											<Option value={item.id} key={item.id} title={item.name}>
												{item.name}
											</Option>
										)
									})}
							</Select>
						</Form.Item>
						<Form.Item label="帐号状态：" name="active">
							<Radio.Group>
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
		</>
	)
}

export default addsystemUser
