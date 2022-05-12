import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, message, InputNumber } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceSystem from "@/services/service.system"
import { regxOnlyNum, checkPassword } from "@/utils/regexp.func"
import { createUserParams } from "@/interfaces/params.interface"
import CryptoJS from "crypto-js"
import eventBus from "@/utils/event.bus"

interface Props {
	id: string
}
const AddSceneModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [isdisabled, setisdisabled] = useState(false)
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback((data: createUserParams) => {
		setLoading(true)
		if (!props.id) {
			serviceSystem
				.createUser({
					...data,
					password: CryptoJS.MD5(data.password).toString(),
					rePassword: CryptoJS.MD5(data.rePassword).toString()
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
				.changWebInfo({
					...data,
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
		if (props.id) {
			serviceSystem.websitUserInfo(props.id).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
				}
			})
			setisdisabled(true)
		}
	}, [props.id])
	return (
		<Card
			style={{ width: 530 }}
			title={props.id == "" ? "新增用户" : "管理用户"}
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
					<Form.Item label="登录帐号：" name="username" rules={[{ required: true, message: "请输入登录帐号!" }]}>
						<Input disabled={isdisabled} />
					</Form.Item>
					{!props.id && (
						<>
							<Form.Item
								label="登录密码："
								name="password"
								rules={[
									{
										required: true,
										message: "请输入登录密码"
									},
									{
										pattern: checkPassword,
										message: "密码需要8-16位大小写字母、数字、特殊符号至少三种组合",
										min: 8,
										max: 16
									}
								]}
							>
								<Input.Password maxLength={16} placeholder="请输入登录密码" />
							</Form.Item>
							<Form.Item
								label="确认密码："
								name="rePassword"
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
								<Input.Password maxLength={16} placeholder="请再次输入密码" />
							</Form.Item>
						</>
					)}
					<Form.Item
						label="发布次数："
						name="releases"
						rules={[
							{ required: true, message: "请输入每日可发布次数" },
							{ pattern: regxOnlyNum, message: "请输入数字" }
						]}
					>
						<InputNumber min={1} max={100} />
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

export default AddSceneModal
