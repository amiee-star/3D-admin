import { CloseOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message, Radio, Select, Space, TreeSelect, Typography, Upload } from "antd"
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react"
import service4Dtemplate from "@/services/service.4Dtemplate"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"

import FormCheck4D from "@/utils/formCheck.func4D"
import serviceHall from "@/services/service.hall"
import { templateListItem, userListItem } from "@/interfaces/4Dapi.interface"
import { treeItem } from "@/interfaces/api.interface"

const cardStyle = { width: 600 }

interface Props {}
let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", type: string, callback: Function) {
	if (timeout && currentValue == type) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		switch (type) {
			case "user":
				service4Dtemplate.searchUsers({ keyword: value }).then(rslt => {
					if (currentValue === value) {
						callback(rslt.data.list)
					}
				})
				break
			case "temp":
				service4Dtemplate.templateList2({ keyword: value }).then(rslt => {
					if (currentValue === value) {
						callback(rslt.data)
					}
				})
				break
		}
	}

	timeout = setTimeout(fake, 300)
}
const AddHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [styleList, setStyleList] = useState([])
	const [typeList, setTypeList] = useState([])
	const [templateList, setTemplateList] = useState([])
	const [searchValue, setSearchValue] = useState("")
	const [userOptions, setUserOptions] = useState<userListItem[]>([])
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	useEffect(() => {
		serviceHall.typeList().then(rslt => setTypeList(rslt.data))
		serviceHall.styleList().then(rslt => setStyleList(rslt.data))
		fetch("", "user", (data: userListItem[]) => setUserOptions(data))
		fetch("", "temp", (data: templateListItem[]) => setTemplateList(data))
	}, [])
	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, "user", (data: userListItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}
	const handleSearchTep = (value: string) => {
		if (value) {
			fetch(value, "temp", (data: templateListItem[]) => setTemplateList(data))
		} else {
			setTemplateList([])
		}
	}
	// select change事件
	const handleChange = (value: string) => {
		setSearchValue(value)
	}
	const checkStyle = (rule: any, value: string | any[], callback: (arg0?: string) => void) => {
		let newArr
		if (value?.length) {
			if (value.length > 5) {
				newArr = [].concat(value.slice(0, 4), value.slice(-1))
				form.setFieldsValue({
					styleIdList: newArr
				})
				callback("最多可选择5项")
			} else {
				newArr = value
				callback()
			}
		} else {
			callback("请选择行业")
		}
	}
	const checkType = (rule: any, value: string | any[]) => {
		return new Promise(async (resolve, reject) => {
			let newArr
			if (!!value) {
				if (value.length > 5) {
					newArr = [].concat(value.slice(0, 4), value.slice(-1))
					form.setFieldsValue({
						typeIdList: newArr
					})
					reject(new Error("最多可选择5项!"))
				} else {
					newArr = value
					resolve()
				}
			} else {
				reject(new Error("请选择分类"))
			}
		})
	}
	const onFinish = useCallback(data => {
		setLoading(true)
		const { typeIdList } = data
		const { styleIdList } = data
		service4Dtemplate
			.addHall({
				...data,
				typeIdList: typeIdList,
				styleIdList: styleIdList
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doHall")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const [templateSize, setTemplateSize] = useState("")
	const handleChangeTemp = useCallback(
		(val, option) => {
			let item1 = []
			item1 = templateList.filter(item => item.id == val)
			setTemplateSize(item1[0]?.validSz)
		},
		[templateList]
	)
	const mapTree = (list: treeItem[]): treeItem[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.name, value: m.id }
		})
	}
	return (
		<Card
			className="addHall"
			style={cardStyle}
			title="展厅信息页"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 5 }}
				layout="horizontal"
				preserve={false}
				onFinish={onFinish}
				initialValues={{ boutiqueStatus: 0 }}
				form={form}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item label="展厅名称" name="name" required rules={[{ required: true, message: "请输入展厅名称" }]}>
						<Input placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item>
					<Form.Item
						label="选择模板"
						name="sceneId"
						required
						rules={[{ required: true, validator: FormCheck4D.checkTemplate }]}
					>
						<Select
							showSearch
							placeholder="请选择模板"
							optionFilterProp="children"
							onSearch={handleSearchTep}
							showArrow={false}
							notFoundContent={null}
							filterOption={false}
							onChange={handleChangeTemp}
						>
							{templateList &&
								templateList.map(item => {
									return (
										<Select.Option key={item.id} value={item.id}>
											{item.name}
										</Select.Option>
									)
								})}
						</Select>
					</Form.Item>

					<Form.Item
						label="归属用户"
						name="userId"
						required
						rules={[{ required: true, message: "请输入手机号/用户名" }]}
					>
						<Select
							showSearch
							value={searchValue}
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							onSearch={handleSearch}
							onChange={handleChange}
							notFoundContent={null}
						>
							{userOptions &&
								userOptions.map(d => (
									<Select.Option key={d.id} value={d.id}>
										{d.username}
									</Select.Option>
								))}
						</Select>
					</Form.Item>

					<Form.Item label="有效面积">
						<Input value={templateSize} disabled />
					</Form.Item>
					<Form.Item
						label="分类"
						name="typeIdList"
						required
						rules={[{ required: true, message: "请选择分类", validator: checkType }]}
					>
						{/* <Select mode="multiple">
							{typeList?.length &&
								typeList.map(item => {
									return (
										<Select.Option key={item.typeId} value={item.typeId}>
											{item.name}
										</Select.Option>
									)
								})}
						</Select> */}
						<TreeSelect
							treeData={typeList?.length > 0 && mapTree(typeList)}
							// treeCheckable={true}
							// showCheckedStrategy="SHOW_CHILD"
							placeholder="请选择分类"
							treeDefaultExpandAll
							multiple
						></TreeSelect>
					</Form.Item>
					<Form.Item
						label="行业"
						name="styleIdList"
						required
						rules={[{ required: true, message: "请选择行业", validator: checkStyle }]}
					>
						{/* <Select mode="multiple">
							{styleList?.length &&
								styleList.map(item => {
									return (
										<Select.Option key={item.styleId} value={item.styleId}>
											{item.name}
										</Select.Option>
									)
								})}
						</Select> */}
						<TreeSelect
							treeData={styleList?.length > 0 && mapTree(styleList)}
							// treeCheckable={true}
							// showCheckedStrategy="SHOW_CHILD"
							placeholder="请选择分类"
							treeDefaultExpandAll
							multiple
						></TreeSelect>
					</Form.Item>
					<Form.Item label="访问控制" name="check">
						<Radio.Group>
							<Radio value={1}>正常访问</Radio>
							<Radio value={2}>禁止访问</Radio>
						</Radio.Group>
					</Form.Item>
					{/* <Form.Item label="上传图片：" name="thumbnail" extra="支持2M以内的JPG，建议尺寸406*230px">
						<FormUploads
							accept=".png, .jpg"
							checkType="hotImage"
							customCheck={checkImage(2)}
							size={1}
							extParams={{ businessType: 5 }}
						/>
					</Form.Item> */}
				</div>
				<div className="globalFooter">
					<Form.Item>
						<Button block type="primary" htmlType="submit" loading={loading}>
							保存
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Card>
	)
}

export default AddHallModal
