import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Radio, TreeSelect, Select, Row, Space, Col, message } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import serviceSystem from "@/services/service.system"
import { ModalRef } from "./modal.context"
import eventBus from "@/utils/event.bus"
import FormUploads from "../form/form.uploads"
import "./addMenus.model.less"
import { menuTreeItem } from "@/interfaces/api.interface"
import FontIcon, { FontKey } from "@/components/utils/font.icon"

const fonts = Object.values(FontKey)

interface Props {
	parentId?: number
	id?: number
	level?: number
	leaf: boolean
}
const AddMenusModel: React.FC<Props & ModalRef> = props => {
	const { modalRef, parentId, level = 1, id, leaf } = props
	const { TextArea } = Input
	const [treeData, setTreeData] = useState<menuTreeItem[]>()
	const [selectValue, setSelectValue] = useState()
	const [selectIcon, setSelectIcon] = useState(String)
	const [activeIndex, setActiveIndex] = useState(-1)
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	//上传
	const onChange = (e: any) => {
		// console.log(e)
	}
	const onFinish = useCallback(data => {
		setLoading(true)
		serviceSystem[!!id ? "changeMenus" : "addMenu"]({
			parentId: data.parentId,
			menuName: data.menuName,
			url: data.url,
			menuPath: data.camera ? data.camera[0].filePreviewUrl : "",
			sort: data.sort,
			level: !!id ? level : level + 1,
			leaf: leaf,
			type: data.type,
			description: data.description,
			id,
			icon: data.icon
		})
			.then(res => {
				if (res.code === 200) {
					closeModal()
					eventBus.emit("doSceneTemplate")
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])
	useEffect(() => {
		if (props.id !== undefined) {
			serviceSystem.menusInfo(props.id).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
					setSelectIcon(res.data.icon)
					fonts.map((item, index) => {
						if (item == res.data.icon) {
							setActiveIndex(index)
						}
					})
				}
			})
		} else {
			form.setFieldsValue({
				parentId: parentId
			})
		}
	}, [props.id])

	useEffect(() => {
		serviceSystem.menuTree({ keyword: "" }).then(res => {
			if (res.code === 200) {
				setTreeData(res.data)
			}
		})
	}, [])

	const selectIconHandle = (icon: string, index: number) => () => {
		setActiveIndex(index)
		setSelectIcon(icon)
		form.setFieldsValue({
			icon: icon
		})
	}

	const mapTree = (list: menuTreeItem[]): menuTreeItem[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.menuName, value: m.id }
		})
	}

	return (
		<Card
			id="addMenu"
			style={{ width: 530 }}
			title={!props.id ? "新增菜单" : "编辑菜单"}
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
					<Form.Item label="上级菜单：" name="parentId" rules={[{ required: true, message: "请选择上级菜单" }]}>
						<TreeSelect
							style={{ width: "100%" }}
							dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
							treeData={treeData && mapTree(treeData)}
							placeholder="请选择上级菜单"
							treeDefaultExpandAll
						/>
					</Form.Item>
					<Form.Item
						label="菜单名称："
						name="menuName"
						rules={[
							{ required: true, message: "请输入菜单名称" },
							{ message: "请输入1-20个文字", max: 20 }
						]}
					>
						<Input placeholder="请输入菜单名称（最多20个字符）" />
					</Form.Item>
					<Form.Item label="菜单URL：" name="url">
						<Input />
					</Form.Item>
					<Form.Item label="菜单图标：">
						<Form.Item name="icon" noStyle>
							<Input className="selectIcons" value={selectIcon} />
						</Form.Item>
						<Form.Item>
							<Row className="menuIcons">
								{fonts &&
									fonts.map((item, index) => {
										return (
											<Col
												onClick={selectIconHandle(item, index)}
												key={index}
												className={activeIndex == index ? "active" : ""}
											>
												<FontIcon icon={FontKey[item]} />
											</Col>
										)
									})}
							</Row>
						</Form.Item>
						{/* <FormUploads accept="image/*" onChange={onChange} /> */}
					</Form.Item>
					<Form.Item label="菜单序号：" name="sort">
						<Input type="number" />
					</Form.Item>
					<Form.Item name="type" label="菜单类型：" rules={[{ required: true, message: "请输入菜单类型" }]}>
						<Radio.Group>
							<Radio value={1} disabled>
								WEB
							</Radio>
							<Radio value={2}>SYS</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item label="描述：" name="description">
						<TextArea rows={4} />
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

export default AddMenusModel
