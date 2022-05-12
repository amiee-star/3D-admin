import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Radio, Row, Select, Upload } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import "./operation.banner.modal.less"
import serviceOperate from "@/services/service.operate"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"

const cardStyle = { width: 500 }

interface Props {
	id: number
}

const OperationSortModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (id) {
			serviceOperate.getSortById({ id: id }).then(res => {
				if (res.code === 200) {
					let description = JSON.parse(res.data.description)
					form.setFieldsValue({
						...res.data,
						description: description
					})
				}
			})
		} else {
			form.setFieldsValue({
				description: [""]
			})
		}
	}, [])

	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		setLoading(true)
		const params = {
			...data,
			description: JSON.stringify(data.description),
			id: !!id ? id : undefined
		}
		serviceOperate[!!id ? "updatehSort" : "addSortList"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doSortList")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	return (
		<Card
			className="banner-modal"
			style={cardStyle}
			title={id ? "修改行业分类" : "新增行业分类"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				name="dynamic_form_item"
				layout="horizontal"
				form={form}
				preserve={false}
				onFinish={onFinish}
				labelCol={{ span: 6 }}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						label="行业名称："
						name="name"
						rules={[
							{ required: true, message: "请输入行业名称" },
							{ message: "请输入1-20个文字", max: 20 }
						]}
					>
						<Input placeholder="请输入行业名称（最多20个字符）" />
					</Form.Item>
					<Form.Item label="解决方案链接：" name="moreLink" rules={[{ required: true, message: "请输入解决方案链接" }]}>
						<Input placeholder="请输入解决方案链接" />
					</Form.Item>
					<Form.Item label="排序" name="sort" rules={[{ required: true, message: "请输入1-9999之间的整数进行排序" }]}>
						<InputNumber
							max={9999}
							min={1}
							step={1}
							formatter={limitNumber}
							parser={limitNumber}
							placeholder="请输入1-9999之间的整数"
						/>
					</Form.Item>
					<Form.List name="description">
						{(fields, { add, remove }, { errors }) => (
							<Form.Item label="描述：" required>
								{fields &&
									fields.map((field, index) => (
										<Form.Item key={field.key}>
											<Form.Item
												{...field}
												validateTrigger={["onChange", "onBlur"]}
												name={index}
												rules={[{ required: true, message: "请输入描述信息" }]}
												noStyle
											>
												<Input placeholder="请输入描述信息" style={{ width: "90%" }} max={20} />
											</Form.Item>
											{fields.length > 0 ? (
												<MinusCircleOutlined
													className="dynamic-delete-button"
													onClick={() => (index !== 0 ? remove(field.name) : {})}
												/>
											) : null}
										</Form.Item>
									))}
								{fields && fields.length < 5 && (
									<Form.Item>
										<Button type="dashed" onClick={() => add()} style={{ width: "100%" }} icon={<PlusOutlined />}>
											添加描述信息
										</Button>
										<Form.ErrorList errors={errors} />
									</Form.Item>
								)}
							</Form.Item>
						)}
					</Form.List>
				</div>
				<div className="globalFooter">
					<Form.Item wrapperCol={{ span: 18, offset: 6 }}>
						<Row justify="end">
							<Button className="cancel-btn" onClick={closeModal}>
								取消
							</Button>
							<Button type="primary" htmlType="submit" loading={loading}>
								保存
							</Button>
						</Row>
					</Form.Item>
				</div>
			</Form>
		</Card>
	)
}

export default OperationSortModal
