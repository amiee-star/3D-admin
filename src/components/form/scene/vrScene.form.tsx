import { ModalRef } from "@/components/modal/modal.context"
import serviceScene from "@/services/service.scene"
import eventBus from "@/utils/event.bus"
import { Input, Button, Form, Modal, message, Alert } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import FormUploads from "../form.uploads"
import checkZip from "@/utils/checkZip.func"
import "@/components/modal/errorAlert.modal.less"

const VrSceneForm: React.FC<ModalRef> = props => {
	const { modalRef } = props

	const onFinish = useCallback(data => {
		const { camera, pcObj, sceneName } = data

		serviceScene
			.saveScene({
				objInfo: pcObj[0],
				panoramaInfo: camera[0],
				sceneName,
				mark: "SCENE_UPLOAD"
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doSceneTemplate")
					message.success("保存成功！")
				}
			})
			.finally(() => {
				modalRef.current.destroy()
			})
	}, [])
	const onRemove = useCallback((uid: string) => {
		serviceScene.fileCancel({ uuid: uid })
	}, [])

	return (
		<>
			<Form
				layout="vertical"
				id="VrSceneForm"
				labelCol={{ span: 5 }}
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						className="sceneName"
						label="模板名称："
						name="sceneName"
						required
						rules={[{ required: true, message: "请输入展厅名称" }]}
					>
						<Input placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item>
					<Form.Item className="flex">
						<Form.Item
							label="全景图压缩包："
							name="camera"
							required
							rules={[{ required: true, message: "上传全景图压缩包" }]}
						>
							<FormUploads
								onRemove={onRemove}
								accept=".zip"
								withChunk
								chunkSize={3}
								size={1}
								customCheck={checkZip("Sky")}
							/>
						</Form.Item>
						<Form.Item
							label="展馆模型压缩包："
							name="pcObj"
							required
							rules={[{ required: true, message: "上传展馆模型压缩包" }]}
						>
							<FormUploads
								onRemove={onRemove}
								accept=".zip"
								withChunk
								chunkSize={3}
								size={1}
								customCheck={checkZip("Obj")}
							/>
						</Form.Item>
					</Form.Item>
				</div>
				<div className="globalFooter">
					<Form.Item>
						<Button block type="primary" htmlType="submit">
							保存
						</Button>
					</Form.Item>
				</div>
			</Form>
		</>
	)
}
export default VrSceneForm
