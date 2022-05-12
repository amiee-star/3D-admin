import { ModalRef } from "@/components/modal/modal.context"
import { templateItem, userListItem } from "@/interfaces/api.interface"
import FormCheck from "@/utils/formCheck.func"
import serviceHall from "@/services/service.hall"
import serviceScene from "@/services/service.scene"
import eventBus from "@/utils/event.bus"
import { Input, Button, Form, Modal, Select, DatePicker, message } from "antd"

import React, { useCallback, useEffect, useState } from "react"

const Option = Select

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
				serviceScene.searchUsers({ keyword: value }).then(rslt => {
					if (currentValue === value) {
						callback(rslt.data.list)
					}
				})
				break
			case "temp":
				serviceHall.templateList({ keywords: value }).then(rslt => {
					if (currentValue === value) {
						callback(rslt.data)
					}
				})
				break
		}
	}

	timeout = setTimeout(fake, 300)
}

const newHallForm: React.FC<ModalRef> = props => {
	const { modalRef } = props
	// const [styleList, setStyleList] = useState([])
	// const [typeList, setTypeList] = useState([])
	const [templateList, setTemplateList] = useState([])
	const [searchValue, setSearchValue] = useState("")
	const [userOptions, setUserOptions] = useState<userListItem[]>([])
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	useEffect(() => {
		// serviceHall.typeList().then(rslt => setTypeList(rslt.data))
		// serviceHall.styleList().then(rslt => setStyleList(rslt.data))
		fetch("", "user", (data: userListItem[]) => setUserOptions(data))
		fetch("", "temp", (data: templateItem[]) => setTemplateList(data))
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
			fetch(value, "temp", (data: templateItem[]) => setTemplateList(data))
		} else {
			setTemplateList([])
		}
	}
	// select change事件
	const handleChange = (value: string) => {
		setSearchValue(value)
	}
	// const checkStyle = (rule: any, value: string | any[], callback: (arg0?: string) => void) => {
	// 	let newArr
	// 	if (value?.length) {
	// 		if (value.length > 5) {
	// 			newArr = [].concat(value.slice(0, 4), value.slice(-1))
	// 			form.setFieldsValue({
	// 				styleIdList: newArr
	// 			})
	// 			callback("最多可选择5项")
	// 		} else {
	// 			newArr = value
	// 			callback()
	// 		}
	// 	} else {
	// 		callback("请选择行业")
	// 	}
	// }
	// const checkType = (rule: any, value: string | any[], callback: (arg0?: string) => void) => {
	// 	let newArr
	// 	if (value?.length) {
	// 		if (value.length > 5) {
	// 			newArr = [].concat(value.slice(0, 4), value.slice(-1))
	// 			form.setFieldsValue({
	// 				typeIdList: newArr
	// 			})
	// 			callback("最多可选5项")
	// 		} else {
	// 			newArr = value
	// 			callback()
	// 		}
	// 	} else {
	// 		callback("请选择分类")
	// 	}
	// }

	const onFinish = useCallback(data => {
		setLoading(true)
		const { endTime } = data
		// const { typeIdList } = data
		// const { styleIdList } = data
		serviceHall
			.addHall({
				...data,
				// typeIdList: typeIdList,
				// styleIdList: styleIdList,
				endTime: Date.parse(endTime)
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doHallTemplate")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	return (
		<Form
			labelCol={{ span: 5 }}
			layout="horizontal"
			preserve={false}
			onFinish={onFinish}
			form={form}
			autoComplete="off"
		>
			<div className="globalScroll">
				<Form.Item
					label="选择模板"
					name="sceneId"
					required
					rules={[{ required: true, validator: FormCheck.checkTemplate }]}
				>
					<Select
						showSearch
						placeholder="请选择模板"
						optionFilterProp="children"
						onSearch={handleSearchTep}
						showArrow={false}
						notFoundContent={null}
						filterOption={false}
					>
						{templateList &&
							templateList.map(item => {
								return (
									<Select.Option key={item.id} value={item.id}>
										{item.sceneName}
									</Select.Option>
								)
							})}
					</Select>
				</Form.Item>

				<Form.Item label="展厅名称" name="tempName" required rules={[{ required: true, message: "请输入展厅名称" }]}>
					<Input placeholder="请输入1-30个文字" maxLength={30} />
				</Form.Item>
				<Form.Item
					label="所属用户"
					name="ownedUserId"
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
				{/* <Form.Item
					label="分类"
					name="typeIdList"
					required
					rules={[{ required: true, message: "请选择分类", validator: checkType }]}
				>
					<Select mode="multiple">
						{typeList?.length &&
							typeList.map(item => {
								return (
									<Select.Option key={item.typeId} value={item.typeId}>
										{item.name}
									</Select.Option>
								)
							})}
					</Select>
				</Form.Item> */}
				{/* <Form.Item
					label="行业"
					name="styleIdList"
					required
					rules={[{ required: true, message: "请选择行业", validator: checkStyle }]}
				>
					<Select mode="multiple">
						{styleList?.length &&
							styleList.map(item => {
								return (
									<Select.Option key={item.styleId} value={item.styleId}>
										{item.name}
									</Select.Option>
								)
							})}
					</Select>
				</Form.Item> */}
				<Form.Item label="访问截至时间" name="endTime">
					<DatePicker />
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
	)
}
export default newHallForm
