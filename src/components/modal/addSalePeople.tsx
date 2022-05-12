import React, { useCallback, useMemo, useState } from "react"
import { Button, Card, Form, Input, Radio, message } from "antd"
import { ModalRef } from "./modal.context"
import { CloseOutlined } from "@ant-design/icons"
import serviceMarketing from "@/services/service.marketing"
import { regxSPhone } from "@/utils/regexp.func"
import eventBus from "@/utils/event.bus"
interface Props {
	id?: string
}
const addSalePeople = (props: Props & ModalRef) => {
	const { modalRef, id } = props
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const closeModal = () => {
		modalRef.current.destroy()
	}
	const onFinish = useCallback(data => {
		setLoading(true)
		if (id) {
			serviceMarketing
				.salesmanUpdate({
					id,
					...data
				})
				.then(res => {
					if (res.code === 200) {
						message.success("修改成功")
						closeModal()
						eventBus.emit("doSalePeople")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		} else {
			serviceMarketing
				.addSalesman(data)
				.then(res => {
					if (res.code === 200) {
						message.success("新增成功")
						closeModal()
						eventBus.emit("doSalePeople")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [])
	useMemo(() => {
		if (id) {
			serviceMarketing.salesmanDetail(id).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
				}
			})
		}
	}, [id])
	return (
		<Card
			style={{ width: 530 }}
			title={id ? "修改销售员" : "新增销售员"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 5 }}
				form={form}
				preserve={false}
				initialValues={{ active: true }}
				onFinish={onFinish}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						label="销售员姓名："
						name="name"
						rules={[
							{ required: true, message: "请输入销售员姓名" },
							{ message: "请输入1-8个文字", max: 8 }
						]}
					>
						<Input placeholder="请输入销售员姓名（最多8个字符）" />
					</Form.Item>
					<Form.Item
						label="联系方式"
						name="telephone"
						rules={[{ required: true, pattern: regxSPhone, message: "请输入正确的手机号" }]}
					>
						<Input max={11} min={1} placeholder="请输入联系方式" />
					</Form.Item>
					<Form.Item label="状态" name="active">
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
	)
}
export default addSalePeople
