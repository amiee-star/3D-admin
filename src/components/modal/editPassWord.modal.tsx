import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, message, Row } from "antd"
import Countdown from "antd/lib/statistic/Countdown"
import React, { useCallback, useContext, useEffect, useState } from "react"
import CryptoJS from "crypto-js"
import serviceSystem from "@/services/service.system"
import { userContext } from "@/components/provider/user.context"

import { ModalRef } from "./modal.context"
interface Props {
	userId: string
}
const EditPassWordModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, userId } = props
	const [form] = Form.useForm()
	const { state } = useContext(userContext)
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(data => {
		const { oldPassword, newPassword, rePassword } = data
		setLoading(true)
		if (oldPassword != newPassword && newPassword == rePassword) {
			serviceSystem
				.saveEditPassWord({
					id: userId,
					oldPassword: CryptoJS.MD5(oldPassword).toString(),
					newPassword: CryptoJS.MD5(newPassword).toString(),
					rePassword: CryptoJS.MD5(rePassword).toString()
				})
				.then(res => {
					if (res.code === 200) {
						closeModal()
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		} else if (oldPassword == newPassword) {
			message.warning("新旧密码一致！")
			setLoading(false)
		} else if (newPassword != rePassword) {
			message.warning("两次密码不一致！")
			setLoading(false)
		}
	}, [])

	return (
		<Card
			title="修改密码"
			id="EditPassWordModal"
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
				labelCol={{ span: 6 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						label="旧密码："
						name="oldPassword"
						validateTrigger="onBlur"
						rules={[{ required: true, message: "请输入旧密码" }]}
					>
						<Input type="password" placeholder="请输入旧密码" />
					</Form.Item>
					<Form.Item
						label="新密码："
						name="newPassword"
						validateTrigger="onBlur"
						rules={[
							{ required: true, message: "请输入新密码" },
							{ min: 8, max: 16, message: "密码长度8-16位数" }
						]}
					>
						<Input type="password" placeholder="密码长度8-16位数，必须包含一位字母" />
					</Form.Item>
					<Form.Item
						label="新密码确认："
						name="rePassword"
						required
						validateTrigger="onBlur"
						rules={[
							{ required: true, message: "请再次输入新密码" },
							({ getFieldValue }) => ({
								validator(_, value) {
									if (!value || getFieldValue("newPassword") === value) {
										return Promise.resolve()
									}
									return Promise.reject("你两次输入的密码不一致")
								}
							})
						]}
					>
						<Input type="password" placeholder="请再次输入新密码" />
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

export default EditPassWordModal
