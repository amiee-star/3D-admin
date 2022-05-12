import { ModalRef } from "@/components/modal/modal.context"
import { Input, Button, Form } from "antd"

import React, { useCallback } from "react"

const MaxSceneForm: React.FC<ModalRef> = props => {
	const { modalRef } = props
	const onFinish = useCallback(() => {}, [])
	return (
		<Form layout="horizontal" labelCol={{ span: 7 }} preserve={false} onFinish={onFinish} autoComplete="off">
			<div className="globalScroll">
				<Form.Item
					label="模板名称"
					name="name"
					required
					rules={[{ required: true, message: "请输入1-20个文字", max: 20 }]}
				>
					<Input />
				</Form.Item>
				<Form.Item label="百度网盘网址" name="baidu" required>
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
export default MaxSceneForm
