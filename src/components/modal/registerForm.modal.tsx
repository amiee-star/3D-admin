import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row } from "antd"
import Countdown from "antd/lib/statistic/Countdown"
import React, { useCallback, useState } from "react"
import { regxSPhone } from "@/utils/regexp.func"
import CryptoJS from "crypto-js"
import serviceScene from "@/services/service.scene"

import { ModalRef } from "./modal.context"
interface Props {}
const RegisterFormModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		const { telephone, verificationCode, password, rePassword } = data
		serviceScene
			.register({
				verificationCode,
				telephone,
				password: CryptoJS.MD5(password).toString(),
				rePassword: CryptoJS.MD5(rePassword).toString()
			})
			.then(res => {
				if (res.code === 200) {
					closeModal()
				}
			})
	}, [])
	const [isTime, setIsTime] = useState(0)
	const deadline = Date.now() + 1000 * 60
	const getCode = useCallback(() => {
		setIsTime(60)
		if (isTime == 0) {
			serviceScene.phoneCode(form.getFieldValue("telephone"))
		}
	}, [])
	const getTime = useCallback(() => {
		setIsTime(0)
	}, [])
	return (
		<Card
			title="欢迎注册"
			id="RegisterFormModal"
			style={{
				width: 450
			}}
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
						name="telephone"
						validateTrigger="onBlur"
						required
						rules={[{ required: true, pattern: regxSPhone, message: "请输入正确的手机号" }]}
					>
						<Input placeholder="请输入手机号" />
					</Form.Item>
					<Form.Item
						name="password"
						validateTrigger="onBlur"
						rules={[
							{ required: true, message: "请输入密码" },
							{ min: 6, max: 10, message: "密码长度6-10位数" }
						]}
					>
						<Input type="password" placeholder="密码长度6-10位数，必须包含一位字母" />
					</Form.Item>
					<Form.Item
						name="rePassword"
						required
						validateTrigger="onBlur"
						rules={[
							{ required: true, message: "请输入密码" },
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
						<Input type="password" placeholder="请重新输入密码" />
					</Form.Item>
					<Row justify="space-between" gutter={[10, 0]}>
						<Col span={16}>
							<Form.Item name="verificationCode" required validateTrigger="onBlur">
								<Input placeholder="请输入验证码" />
							</Form.Item>
						</Col>
						<Col span={8}>
							<Button block onClick={getCode}>
								{isTime == 60 ? <Countdown onFinish={getTime} value={deadline} format="s 秒" /> : "获取验证码"}
							</Button>
						</Col>
					</Row>
				</div>
				<div className="globalFooter">
					<Form.Item style={{ textAlign: "right" }}>
						<Button type="primary" htmlType="submit">
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

export default RegisterFormModal
