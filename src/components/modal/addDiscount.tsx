import React, { useCallback, useMemo, useState } from "react"
import { Button, Card, DatePicker, Form, Input, message, InputNumber, Select } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import serviceMarketing from "@/services/service.marketing"
import { ModalRef } from "./modal.context"
import moment from "moment"
import eventBus from "@/utils/event.bus"
interface Props {
	couponId?: string
	salesmanId: string
}
const addDiscount = (props: Props & ModalRef) => {
	const { couponId, salesmanId, modalRef } = props
	const [form] = Form.useForm()
	const [type, setType] = useState([])
	const [loading, setLoading] = useState(false)
	useMemo(() => {
		serviceMarketing.couponType().then(res => {
			if (res.code === 200) {
				setType(res.data)
			}
		})
	}, [])
	useMemo(() => {
		if (couponId) {
			serviceMarketing.couponInfo(couponId).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data,
						validStartTime: moment(new Date(res.data.validStartTime)),
						validEndTime: moment(new Date(res.data.validEndTime))
					})
				}
			})
		}
	}, [couponId])
	const closeModal = () => {
		modalRef.current.destroy()
	}
	const onFinish = useCallback(data => {
		setLoading(true)
		if (couponId) {
			serviceMarketing
				.updateCoupon({
					...data,
					salesmanId,
					id: couponId,
					validEndTime: Date.parse(data.validEndTime),
					validStartTime: Date.parse(data.validStartTime)
				})
				.then(res => {
					if (res.code === 200) {
						message.success("修改成功")
						eventBus.emit("doCoupon")
						closeModal()
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		} else {
			serviceMarketing
				.addCoupon({
					...data,
					salesmanId,
					validEndTime: Date.parse(data.validEndTime),
					validStartTime: Date.parse(data.validStartTime)
				})
				.then(res => {
					if (res.code === 200) {
						message.success("新增成功")
						eventBus.emit("doCoupon")
						closeModal()
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [])

	return (
		<Card
			style={{ width: 530 }}
			title={couponId ? "修改折扣券" : "新增折扣券"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 6 }}
				form={form}
				preserve={false}
				initialValues={{ active: true }}
				onFinish={onFinish}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item label="优惠券类型：" name="type" rules={[{ required: true, message: "请选择折扣类型" }]}>
						<Select
							showSearch
							placeholder="请选择折扣类型"
							optionFilterProp="children"
							showArrow={false}
							notFoundContent={null}
							filterOption={false}
						>
							{type &&
								type.map(item => {
									return (
										<Select.Option key={item.key} value={item.key}>
											{item.value}
										</Select.Option>
									)
								})}
						</Select>
					</Form.Item>
					<Form.Item
						label="优惠券名称："
						name="name"
						rules={[
							{ required: true, message: "请输入优惠券名称" },
							{ message: "请输入1-8个文字", max: 8 }
						]}
					>
						<Input placeholder="请输入优惠券名称" />
					</Form.Item>
					<Form.Item label="折扣：" name="discountAmount" rules={[{ required: true, message: "请输入折扣" }]}>
						<InputNumber max={1} placeholder="请输入折扣" step={0.1} />
					</Form.Item>
					<Form.Item label="最高抵扣金额：" name="highestDeductionAmount">
						<InputNumber placeholder="请输入数字" />
					</Form.Item>
					<Form.Item label="开始时间：" name="validStartTime" rules={[{ required: true, message: "请选择开始时间!" }]}>
						<DatePicker showTime />
					</Form.Item>
					<Form.Item label="结束时间：" name="validEndTime" rules={[{ required: true, message: "请选择开始时间!" }]}>
						<DatePicker showTime />
					</Form.Item>
					{!couponId && (
						<Form.Item label="数量：" name="amount" rules={[{ required: true, message: "请选择开始时间!" }]}>
							<InputNumber min={0} max={100} />
						</Form.Item>
					)}
					<Form.Item label="备注：" name="desc">
						<Input placeholder="请输入备注" />
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
export default addDiscount
