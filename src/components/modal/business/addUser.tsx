import React, { useCallback, useMemo, useState } from "react"
import { Button, Card, Form, Input, InputNumber, message } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import serviceSystem from "@/services/service.business"
import { ModalRef } from "@/components/modal/modal.context"
import eventBus from "@/utils/event.bus"
import CryptoJS from "crypto-js"
import { regxOnlyNum, regxOnlyNumEn } from "@/utils/regexp.func"
interface props {
	id?: string
	companyId?: string
	topicId?: string
}

const addUser = (props: ModalRef & props) => {
	const [form] = Form.useForm()
	const { modalRef, id, companyId, topicId } = props
	const [loading, setLoading] = useState(false)
	const onFinish = useCallback(data => {
		setLoading(true)
		serviceSystem[id ? "topicUsersEdit" : "topicUsersAdd"](
			id
				? {
						...data,
						id,
						companyId,
						topicId
				  }
				: {
						...data,
						companyId,
						topicId,
						password: CryptoJS.MD5(data.password).toString(),
						rePassword: CryptoJS.MD5(data.rePassword).toString()
				  }
		)
			.then(res => {
				if (res.code === 200) {
					message.success("保存成功")
					closeModal()
					eventBus.emit("getuserList")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const closeModal = () => {
		modalRef.current.destroy()
	}
	useMemo(() => {
		if (id) {
			serviceSystem.topicUsersInfo(id).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
				}
			})
		}
	}, [])

	return (
		<Card
			id="account-config"
			style={{ width: 605 }}
			title="添加账号"
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
				colon={false}
				onFinish={onFinish}
				initialValues={{ companyStatus: true, releases: 10 }}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						label="登录账号："
						name="username"
						rules={[
							{ required: true, message: "请输入登录账号" },
							{ message: "请输入11位数字或者字母", min: 11, pattern: regxOnlyNumEn }
						]}
					>
						<Input disabled={id ? true : false} maxLength={11} placeholder="请输入11位数字或者字母" />
					</Form.Item>
					{!id && (
						<>
							<Form.Item
								label="登录密码："
								name="password"
								rules={[
									{ required: true, pattern: regxOnlyNumEn, message: "请输入登录密码" },
									{ message: "请输入8-16数字或者字母", min: 8 }
								]}
							>
								<Input.Password maxLength={16} placeholder="请输入8-16数字或者字母" />
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
						label="每日可发布次数："
						rules={[
							{ required: true, message: "请输入每日可发布次数" },
							{ pattern: regxOnlyNum, message: "请输入数字" }
						]}
						name="releases"
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
export default addUser
