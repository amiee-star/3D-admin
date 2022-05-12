import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceHelp from "@/services/service.help"
import { addProblemParams } from "@/interfaces/params.interface"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
const { TextArea } = Input
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
	const onFinish = useCallback((data: addProblemParams) => {
		setLoading(true)
		if (props.id == "") {
			serviceHelp
				.addProblem(data)
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
				.updateProblem({ ...data, id: props.id })
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
			serviceHelp.getProblemInfo({ id: props.id }).then(res => {
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
			title={props.id == "" ? "新增常见问题" : "编辑常见问题"}
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
						label="问题："
						name="issueName"
						rules={[
							{ required: true, message: "请输入问题名称" },
							{ message: "请输入1-50个文字", max: 50 }
						]}
					>
						<Input placeholder="请输入问题名称（最多50个字符）" />
					</Form.Item>
					<Form.Item
						label="答案"
						name="answer"
						rules={[
							{ required: true, message: "请输入答案" },
							{ message: "请输入1-500个文字", max: 500 }
						]}
					>
						<TextArea allowClear placeholder="请输入答案（最多500个字符）" />
					</Form.Item>
					<Form.Item label="排序" name="issueSort">
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
