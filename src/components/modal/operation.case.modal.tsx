import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Row, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import FormUploads from "../form/form.uploads"
import serviceOperate from "@/services/service.operate"
import { sortTypeItem } from "@/interfaces/api.interface"
import "./operation.banner.modal.less"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import checkImage from "@/utils/checkImage.func"

const cardStyle = { width: 500 }

const Option = Select.Option

interface Props {
	id: number
}

const OperationBannerModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [typeList, setTypeList] = useState<sortTypeItem[]>([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (id) {
			Promise.all([serviceOperate.getHCaseListById({ id: id }), serviceOperate.getIndustryList({ keyword: "" })]).then(
				([getHCaseListById, getIndustryList]) => {
					if (getHCaseListById.code === 200) {
						form.setFieldsValue({
							...getHCaseListById.data,
							image: [
								{
									filePreviewUrl: getHCaseListById.data.image,
									fileSaveUrl: getHCaseListById.data.image,
									fileSize: 0
								}
							]
						})
						setTypeList(getIndustryList.data)
						setDone(true)
					}
				}
			)
		} else {
			serviceOperate.getIndustryList({ keyword: "" }).then(res => {
				if (res.code === 200) {
					setTypeList(res.data)
					form.resetFields()
					setDone(true)
				}
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
			image: data.image[0].filePreviewUrl,
			id: !!id ? id : undefined
		}
		serviceOperate[!!id ? "updatehCase" : "addCaseList"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doCaseList")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const onValuesChange = useCallback(data => {
		if ("image" in data) {
			if (data.image[0]) {
				let fileSaveUrl = data.image[0]?.fileSaveUrl
				let start = fileSaveUrl.indexOf("/")
				let end = fileSaveUrl.indexOf(".")
				let fileName = fileSaveUrl.substring(start + 1, end)
				form.setFieldsValue({
					name: fileName
				})
			}
		}
	}, [])

	return (
		<Card
			className="banner-modal"
			style={cardStyle}
			title={id ? "修改行业案例" : "新增行业案例"}
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
					onValuesChange={onValuesChange}
					preserve={false}
					onFinish={onFinish}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item
							className="upload"
							label="上传封面图："
							name="image"
							extra={"请上传342x214px jpg图片"}
							rules={[{ required: true, message: "请上传封面图" }]}
						>
							<FormUploads accept=".png, .jpg, .jpeg" checkType="hotImage" size={1} extParams={{ businessType: 5 }} />
						</Form.Item>
						<Form.Item
							label="名称："
							name="name"
							rules={[
								{ required: true, message: "请输入名称" },
								{ message: "请输入1-20个文字", max: 20 }
							]}
						>
							<Input placeholder="请输入名称（最多20个字符）" />
						</Form.Item>
						<Form.Item label="跳转链接：" name="url">
							<Input placeholder="请输入跳转链接" />
						</Form.Item>
						<Form.Item label="行业选择：" name="indexTradeId" rules={[{ required: true, message: "请选择行业" }]}>
							<Select placeholder="请选择行业">
								{typeList &&
									typeList.map(item => {
										return (
											<Option key={item.id} value={Number(item.id)}>
												{item.name}
											</Option>
										)
									})}
							</Select>
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
					</div>
					<div className="globalFooter">
						<Form.Item>
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
			)}
		</Card>
	)
}

export default OperationBannerModal
