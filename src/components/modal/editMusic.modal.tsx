import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import "./editMusic.modal.less"
import FormUploads from "../form/form.uploads"
import serviceGeneral from "@/services/service.general"
import eventBus from "@/utils/event.bus"
import { musicTypeItem } from "@/interfaces/api.interface"
import checkAudio from "@/utils/checkAudio.func"
import serviceScene from "@/services/service.scene"

const cardStyle = { width: 500 }

const Option = Select.Option

interface Props {
	id: string
}

const EditMusicModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [typeList, setTypeList] = useState<musicTypeItem[]>()
	const [done, setDone] = React.useState(false)
	const [loading, setLoading] = useState(false)

	const onFinish = useCallback(data => {
		setLoading(true)
		serviceGeneral[!!props.id ? "editMusic" : "addMusic"]({
			url: (!props.id && data.musicFile[0].fileSaveUrl) || "",
			fileSize: (!props.id && data.musicFile[0].fileSize) || "",
			id: (!!props.id && props.id) || "",
			name: data.musicName,
			musicTypeId: data.musicType
		})
			.then(res => {
				if (res.code === 200) {
					closeModal()
					eventBus.emit("doMusic")
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		if (props.id) {
			serviceGeneral.getMusicById({ id: props.id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data,
						musicFile: [
							{
								filePreviewUrl: res.data.musicFile,
								fileSaveUrl: res.data.musicFile,
								fileSize: 0
							}
						]
					})
					setDone(true)
				}
			})
		} else {
			setDone(true)
		}
	}, [props.id])

	useEffect(() => {
		serviceGeneral.getMusicType().then(res => {
			if (res.code === 200) {
				setTypeList(res.data)
			}
		})
	}, [])

	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onValuesChange = useCallback(data => {
		if ("musicFile" in data) {
			if (data.musicFile[0]) {
				let fileSaveUrl = data.musicFile[0]?.fileSaveUrl
				let start = fileSaveUrl.indexOf("/")
				let end = fileSaveUrl.indexOf(".")
				let fileName = fileSaveUrl.substring(start + 1, end)
				form.setFieldsValue({
					musicName: fileName
				})
			}
		}
	}, [])
	const onRemove = useCallback((uuid?: string) => {
		if (uuid) {
			serviceScene.fileCancel({ uuid })
		}
	}, [])
	return (
		<Card
			style={cardStyle}
			title={props.id ? "音乐编辑" : "上传音乐"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!done && (
				<Form
					labelCol={{ span: 5 }}
					layout="horizontal"
					form={form}
					onValuesChange={onValuesChange}
					preserve={false}
					onFinish={onFinish}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item label="文件地址：" name="musicFile" extra="5M以下，MP3格式">
							<FormUploads
								accept="audio/*"
								size={1}
								withChunk
								chunkSize={1}
								extParams={{ businessType: 7 }}
								customCheck={checkAudio(5)}
								checkType="audio"
								onRemove={onRemove}
							/>
						</Form.Item>
						<Form.Item
							label="音乐名称："
							name="musicName"
							rules={[
								{ required: true, message: "请输入音乐名称" },
								{ message: "请输入1-20个文字", max: 50, type: "string" }
							]}
						>
							<Input placeholder="请输入音乐名称（最多50个字符）" />
						</Form.Item>
						<Form.Item label="音乐类型：" name="musicType" required rules={[{ required: true, message: "请选择分类" }]}>
							<Select placeholder="请选择音乐类型">
								{typeList &&
									typeList.map(item => {
										return (
											<Option key={item.musicTypeId} value={item.musicTypeId}>
												{item.name}
											</Option>
										)
									})}
							</Select>
						</Form.Item>
					</div>
					<div className="globalFooter">
						<Form.Item>
							<Button block type="primary" htmlType="submit" loading={loading}>
								保存
							</Button>
						</Form.Item>
					</div>
				</Form>
			)}
		</Card>
	)
}

export default EditMusicModal
