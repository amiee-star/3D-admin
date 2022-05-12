import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, TreeSelect, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import serviceSystem from "@/services/service.system"
import { ModalRef } from "./modal.context"
import eventBus from "@/utils/event.bus"
import "./addMenus.model.less"
import { treeItem } from "@/interfaces/api.interface"
import { FontKey } from "@/components/utils/font.icon"
import serviceCatgory from "@/services/service.catgory"

const fonts = Object.values(FontKey)

interface Props {
	parentId?: string
	id?: string
	level?: number
}
const AddStyleModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, parentId, id } = props
	const [treeData, setTreeData] = useState<treeItem[]>()
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		setLoading(true)
		serviceCatgory[!!id ? "updateStyle" : "addStyle"]({
			...data,
			id
		})
			.then(res => {
				if (res.code === 200) {
					closeModal()
					eventBus.emit("doStyles")
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	useEffect(() => {
		if (id) {
			serviceCatgory.getStyleById({ id: id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
				}
			})
		} else {
			form.setFieldsValue({
				parentId: parentId
			})
		}
	}, [id])

	useEffect(() => {
		serviceCatgory.stylesTree().then(res => {
			if (res.code === 200) {
				setTreeData(res.data)
			}
		})
	}, [])

	const mapTree = (list: treeItem[]): treeItem[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.name, value: m.id }
		})
	}

	return (
		<Card
			id="addMenu"
			style={{ width: 530 }}
			title={!props.id ? "新增行业" : "编辑行业"}
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
				initialValues={{
					type: 2
				}}
			>
				<div className="globalScroll">
					<Form.Item label="上级行业：" name="parentId" rules={[{ required: true, message: "请选择上级行业" }]}>
						<TreeSelect
							disabled={!!props.id}
							style={{ width: "100%" }}
							dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
							treeData={treeData && mapTree(treeData)}
							placeholder="请选择上级行业"
							treeDefaultExpandAll
						/>
					</Form.Item>
					<Form.Item
						label="行业名称："
						name="name"
						rules={[
							{ required: true, message: "请输入行业名称" },
							{ message: "请输入1-20个文字", max: 20 }
						]}
					>
						<Input placeholder="请输入行业名称（最多20个字符）" />
					</Form.Item>
					<Form.Item label="排序：" name="sort">
						<Input type="number" />
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

export default AddStyleModel
