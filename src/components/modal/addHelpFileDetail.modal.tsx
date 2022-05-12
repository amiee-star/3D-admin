import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceCatgory from "@/services/service.catgory"
import { styleParams } from "@/interfaces/params.interface"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import FormUploads from "../form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"

interface Props {
	id: string
}
const AddHelpVideo: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback((data: styleParams) => {
		setLoading(true)
		if (props.id == "") {
			serviceCatgory
				.addStyle(data)
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
			serviceCatgory
				.updateStyle({ ...data, id: props.id })
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
			serviceCatgory.getStyleById({ id: props.id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
				}
			})
		}
	}, [props.id])
	return (
		<Card
			style={{ width: 530 }}
			title={props.id == "" ? "新增视频" : "编辑视频"}
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
						label="视频名称："
						name="name"
						rules={[
							{ required: true, message: "请输入视频名称" },
							{ message: "请输入1-10个文字", max: 10 }
						]}
					>
						<Input placeholder="请输入视频名称（最多10个字符）" />
					</Form.Item>
					<Form.Item label="上传视频" name="video" extra="支持500M以内的MP4文件">
						<FormUploads accept="video/*" withChunk chunkSize={3} customCheck={checkVideo("video", 500)} />
					</Form.Item>
					<Form.Item label="排序" name="sort">
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
}

export default AddHelpVideo
