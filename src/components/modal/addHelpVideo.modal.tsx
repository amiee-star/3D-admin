import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"

import { helpVideoParams } from "@/interfaces/params.interface"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import FormUploads from "../form/form.uploads"
import checkVideo from "@/utils/checkVideo.func"
import checkImage from "@/utils/checkImage.func"
import serviceHelp from "@/services/service.help"
import urlFunc from "@/utils/url.func"
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
	const onFinish = useCallback(data => {
		setLoading(true)
		const params = {
			id: props.id,
			videoName: data.videoName,
			coverUrl: data.coverUrl[0].fileSaveUrl,
			videoUrl: data.videoUrl[0].fileSaveUrl,
			videoSort: data.videoSort
		}
		if (props.id == "") {
			serviceHelp
				.addHelpVideo(params)
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doHelpVideo")
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
				.updateHelpVideo(params)
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doHelpVideo")
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
			serviceHelp.getHelpVideoInfo({ id: props.id }).then(res => {
				if (res.code === 200) {
					const apiUrl = res.data.fileHost
					form.setFieldsValue({
						...res.data.helpVideo,
						videoUrl: [
							{
								filePreviewUrl: `${apiUrl}${res.data.helpVideo.videoUrl}`,
								fileSaveUrl: res.data.helpVideo.videoUrl,
								fileSize: 2
							}
						],
						coverUrl: [
							{
								filePreviewUrl: `${apiUrl}${res.data.helpVideo.coverUrl}`,
								fileSaveUrl: res.data.helpVideo.coverUrl,
								fileSize: 2
							}
						]
					})
					setHasData(true)
				}
			})
		} else {
			setHasData(true)
		}
	}, [props.id])
	return (
		!!hasData && (
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
							name="videoName"
							rules={[
								{ required: true, message: "请输入视频名称" },
								{ message: "请输入1-10个文字", max: 10 }
							]}
						>
							<Input placeholder="请输入视频名称（最多10个字符）" />
						</Form.Item>
						<Form.Item
							label="上传视频:"
							name="videoUrl"
							extra="支持500M以内的MP4文件"
							rules={[{ required: true, message: "请上传视频" }]}
						>
							<FormUploads
								accept="video/*"
								withChunk
								chunkSize={3}
								customCheck={checkVideo("video", 500)}
								checkType={"video"}
							/>
						</Form.Item>
						<Form.Item
							label="上传图片："
							name="coverUrl"
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
						<Form.Item label="排序" name="videoSort">
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
