import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceHelp from "@/services/service.help"
import { styleParams } from "@/interfaces/params.interface"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import FormUploads from "../form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import checkVideo from "@/utils/checkVideo.func"

interface Props {
	id: string
}
const AddHelpVideo: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [hasData, setHasData] = useState(false)
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback((data: styleParams) => {
		setLoading(true)
		data.categoryUrl = data.categoryUrl[0]["fileSaveUrl"]
		if (props.id == "") {
			serviceHelp
				.addType(data)
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doStyle")
						closeModal()
						message.success("保存成功！")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		} else {
			serviceHelp
				.updateFile({ ...data, id: props.id })
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doStyle")
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
			serviceHelp.getStyleById({ id: props.id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data.docCategory,
						categoryUrl: [
							{
								filePreviewUrl: `${res.data.fileHost}${res.data.docCategory.categoryUrl}`,
								fileSaveUrl: res.data.docCategory.categoryUrl,
								fileSize: 2
							}
						]
					})
				}
				setHasData(true)
			})
		} else {
			setHasData(true)
		}
	}, [props.id])
	return (
		!!hasData && (
			<Card
				style={{ width: 530 }}
				title={props.id == "" ? "新增文档标题" : "编辑文档标题"}
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
						<Form.Item
							label="文档标题："
							name="categoryName"
							rules={[
								{ required: true, message: "请输入文档标题" },
								{ message: "请输入1-10个文字", max: 10 }
							]}
						>
							<Input placeholder="请输入文档标题（最多10个字符）" />
						</Form.Item>
						<Form.Item
							label="上传图片："
							name="categoryUrl"
							extra="支持2M以内的JPG，建议尺寸406*230px"
							rules={[{ required: true, message: "请上传图片" }]}
						>
							<FormUploads
								accept=".png, .jpg"
								checkType="hotImage"
								customCheck={checkImage(2)}
								size={1}
								extParams={{ businessType: 5 }}
							/>
						</Form.Item>
						<Form.Item label="排序" name="categorySort">
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
	)
}

export default AddHelpVideo
