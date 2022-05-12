import serviceSystem from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Select, Radio } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import eventBus from "@/utils/event.bus"
import { ModalRef } from "./modal.context"
import { templateItem } from "@/interfaces/api.interface"

interface Props {
	userId: string
	id?: string
}

const { Option } = Select
let timeout: NodeJS.Timeout
let currentValue: string

function fetch(value: string = "", activeValue: number, callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceSystem.devgetTempList({ keyword: value, type: activeValue }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

const AddTemplateHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [activeValue, setActiveValue] = useState(1)
	const [hallOptions, setHallOptions] = useState([])
	const [validSz, setValidSz] = useState(null)
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(
		data => {
			setLoading(true)
			if (!props.id) {
				serviceSystem
					.devAddTemp({
						tempType: activeValue,
						businessId: data.businessId,
						tempName: data.tempName,
						userId: props.userId,
						createType: data.createType
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
					.devTempUpdate({
						devId: props.id,
						tempName: data.tempName,
						createType: data.createType
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
		},
		[activeValue]
	)
	useEffect(() => {
		if (props.id) {
			serviceSystem.devTempInfo({ id: props.id }).then(res => {
				if (res.code === 200) {
					setValidSz(res.data.validSz)
					form.setFieldsValue({
						...res.data
					})
				}
			})
		}
	}, [props.id])

	const onActiveValue = useCallback(
		e => {
			setActiveValue(e.target.value)
		},
		[activeValue]
	)

	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, activeValue, (data: templateItem[]) => setHallOptions(data))
		} else {
			setHallOptions([])
		}
	}
	const handleChange = (e: string) => {
		const active = hallOptions.filter(i => i.id == e)
		setValidSz(active[0].validSz)
		// setBusinessId(e)
	}
	return (
		<Card
			style={{ width: 530 }}
			title={props.id ? "新增模版展厅" : "修改模版展厅"}
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
				onFinish={onFinish}
				autoComplete="off"
				initialValues={{
					activeValue: 1
				}}
			>
				<div className="globalScroll">
					{!props.id && (
						<Form.Item name="active" wrapperCol={{ offset: 6 }} valuePropName="checked">
							<Radio.Group onChange={onActiveValue} value={activeValue}>
								<Radio value={1}>原始模板创建</Radio>
								<Radio value={2}>展厅复制创建</Radio>
							</Radio.Group>
						</Form.Item>
					)}
					{!props.id && (
						<Form.Item label="选择展厅：" name="businessId" rules={[{ required: true, message: "请选择展厅!" }]}>
							<Select
								placeholder="请输入展厅名称/ID"
								showSearch
								defaultActiveFirstOption={false}
								showArrow={false}
								filterOption={false}
								onChange={handleChange}
								onSearch={handleSearch}
								notFoundContent={null}
								optionFilterProp="children"
							>
								{hallOptions &&
									hallOptions.map(d => {
										return (
											<Select.Option key={d.id} value={d.id}>
												{d.name}
											</Select.Option>
										)
									})}
							</Select>
						</Form.Item>
					)}
					<Form.Item label="有效面积：" name="validSz">
						<span style={{ color: "#F56C6C" }}>
							{!validSz ? "当前展厅或模板无有效面积，请在对应原始模板中填写 后再进行配置" : validSz}
						</span>
					</Form.Item>
					<Form.Item label="展厅模板名称：" name="tempName" required>
						<Input placeholder="请输入要创建的展厅模板名称" />
					</Form.Item>
					<Form.Item label="创建属性：" name="createType" required>
						<Select placeholder="请选择创建属性">
							<Option value={1}>空白模板</Option>
							<Option value={2}>复制模板</Option>
						</Select>
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

export default AddTemplateHallModal
