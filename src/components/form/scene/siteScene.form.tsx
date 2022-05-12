import { ModalRef } from "@/components/modal/modal.context"
import { InputNumber, Input, Button, Form, message } from "antd"
import serviceScene from "@/services/service.scene"
import eventBus from "@/utils/event.bus"
import { regxUrl } from "@/utils/regexp.func"

import React, { useCallback } from "react"

const SiteSceneForm: React.FC<ModalRef> = props => {
	const { modalRef } = props
	const onFinish = useCallback(data => {
		const params = {
			...data,
			type: 4
		}
		serviceScene
			.updateImport(params)
			.then(res => {
				if (res.code == 200) {
					eventBus.emit("doSceneTemplate")
					message.success("保存成功！")
				}
			})
			.finally(() => {
				modalRef.current.destroy()
			})
	}, [])
	return (
		<Form layout="horizontal" labelCol={{ span: 7 }} preserve={false} onFinish={onFinish} autoComplete="off">
			<div className="globalScroll">
				<Form.Item label="展厅名称：" name="name" rules={[{ required: true, message: "请输入展厅名称" }]}>
					<Input placeholder="请输入1-30个文字" maxLength={30} />
				</Form.Item>
				<Form.Item
					label="展厅链接："
					name="url"
					rules={[{ required: true, pattern: regxUrl, message: "请输入展馆url" }]}
				>
					<Input />
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
	)
}
export default SiteSceneForm
