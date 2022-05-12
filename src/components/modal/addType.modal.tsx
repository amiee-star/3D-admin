import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, TreeSelect, InputNumber, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceCatgory from "@/services/service.catgory"
import { typeParams } from "@/interfaces/params.interface"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import { typeListItem } from "@/interfaces/api.interface"

interface Props {
	id?: string
	parentId?: string
}
const AddTypeModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id, parentId } = props
	const [loading, setLoading] = useState(false)
	const [treeData, setTreeData] = useState<typeListItem[]>()
	const [form] = Form.useForm()

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback((data: typeParams) => {
		setLoading(true)
		serviceCatgory[!!id ? "updateType" : "addType"]({ ...data, id })
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
	}, [])

	useEffect(() => {
		if (id) {
			serviceCatgory.getTypeById({ id: id }).then(res => {
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
		serviceCatgory.typeTree().then(res => {
			if (res.code === 200) {
				setTreeData(res.data)
			}
		})
	}, [])

	const mapTree = (list: typeListItem[]): typeListItem[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.name, value: m.id }
		})
	}

	return (
		<Card
			style={{ width: 530 }}
			title={props.id == "" ? "新增分类" : "修改分类"}
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
					<Form.Item label="上级分类：" name="parentId" rules={[{ required: true, message: "请选择上级分类" }]}>
						<TreeSelect
							disabled={!!id}
							style={{ width: "100%" }}
							dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
							treeData={treeData && mapTree(treeData)}
							placeholder="请选择上级分类"
							treeDefaultExpandAll
						/>
					</Form.Item>
					<Form.Item
						label="分类名称："
						name="name"
						rules={[
							{ required: true, message: "请输入分类名称" },
							{ message: "请输入1-8个文字", max: 8 }
						]}
					>
						<Input placeholder="请输入分类名称（最多8个字符）" />
					</Form.Item>
					<Form.Item label="排序" name="order">
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

export default AddTypeModal
