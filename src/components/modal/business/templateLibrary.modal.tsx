import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Row, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import FormUploads from "../../form/form.uploads"
import serviceBusiness from "@/services/service.business"
import { templateItem } from "@/interfaces/api.interface"
import serviceHall from "@/services/service.hall"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import checkImage from "@/utils/checkImage.func"
import FormCheck from "@/utils/formCheck.func"

const cardStyle = { width: 500 }

interface Props {
	companyId: string
	id: string
}

let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", type: string, callback: Function) {
	if (timeout && currentValue == type) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		switch (type) {
			case "temp":
				serviceBusiness.selectTempKeyword({ keyword: value }).then(rslt => {
					if (currentValue === value) {
						callback(rslt.data)
					}
				})
				break
		}
	}
	timeout = setTimeout(fake, 300)
}

const TemplateLibraryModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, companyId, id } = props
	const [form] = Form.useForm()
	const [done, setDone] = React.useState(false)
	const [templateList, setTemplateList] = useState([])
	const [effectiveArea, setEffectiveArea] = useState("")
	const [tempId, setTempId] = useState("")
	const [tempName, setTempName] = useState("")
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (id) {
			serviceBusiness.tempSelectById({ id: id }).then(res => {
				if (res.code == 200) {
					form.setFieldsValue({
						tempId: res.data.tempId,
						createType: res.data.createType
					})
					setTempName(res.data.tempName)
					setTempId(res.data.tempId)
					setEffectiveArea(res.data.validSz)
					setDone(true)
				}
			})
		} else {
			setDone(true)
		}
	}, [])

	const handleSearchTep = (value: string) => {
		if (value) {
			fetch(value, "temp", (data: templateItem[]) => setTemplateList(data))
		} else {
			setTemplateList([])
		}
	}

	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		const params = {
			...data,
			companyId: companyId,
			id: !!id ? id : undefined
		}
		setLoading(true)
		serviceBusiness[!!id ? "companyTempEdit" : "companyTempAdd"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("getTemplateLibrary")
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
			title={id ? "修改模版展厅" : "新增模版展厅"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!done && (
				<Form
					labelCol={{ span: 6 }}
					layout="horizontal"
					form={form}
					preserve={false}
					onFinish={onFinish}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item
							label="来源展厅"
							name="tempId"
							required
							rules={[{ required: true, validator: FormCheck.checkScene }]}
						>
							{!id ? (
								<Select
									showSearch
									placeholder="请选择来源展厅"
									optionFilterProp="children"
									onSearch={handleSearchTep}
									showArrow={false}
									notFoundContent={null}
									filterOption={false}
								>
									{templateList &&
										templateList.map(item => {
											return (
												<Select.Option key={item.id} value={item.id}>
													{item.tempName}
												</Select.Option>
											)
										})}
								</Select>
							) : (
								<div>
									<span style={{ display: "block" }}>{tempName}</span>
									<span style={{ display: "block" }}>{tempId}</span>
								</div>
							)}
						</Form.Item>
						{effectiveArea && (
							<Form.Item label="有效面积">
								<span>{effectiveArea + "m²"}</span>
							</Form.Item>
						)}
						{/* <Form.Item label="模板名称" name="name" required rules={[{ required: true, message: "请输入模板名称" }]}>
						<Input placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item> */}
						<Form.Item
							label="创建属性"
							name="createType"
							required
							rules={[{ required: true, message: "请选择创建属性" }]}
						>
							<Select>
								<Select.Option value={1}>空白模板</Select.Option>
								<Select.Option value={2}>复制模板</Select.Option>
							</Select>
						</Form.Item>
					</div>
					<div className="globalFooter">
						<Form.Item>
							<Row justify="end">
								<Button className="cancel-btn" onClick={closeModal}>
									取消
								</Button>
								<Button type="primary" htmlType="submit" style={{ marginLeft: "10px" }} loading={loading}>
									保存
								</Button>
							</Row>
						</Form.Item>
					</div>
				</Form>
			)}
		</Card>
	)
}

export default TemplateLibraryModal
