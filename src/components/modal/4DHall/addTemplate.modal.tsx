import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Select, Space, Typography, Upload } from "antd"
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react"
import service4Dtemplate from "@/services/service.4Dtemplate"
import { ModalRef } from "../modal.context"

import { userListItem } from "@/interfaces/api.interface"

import FormUploads from "@/components/form/form.uploads"

import serviceScene from "@/services/service.scene"

import eventBus from "@/utils/event.bus"
const cardStyle = { width: 600 }

interface Props {}
let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		service4Dtemplate.searchUsers({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

const AddTemplateModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	//!!!
	const Option = Select
	const [searchValue, setSearchValue] = useState("")

	const [userOptions, setUserOptions] = useState([])

	const [loading, setLoading] = useState(false)

	const [form] = Form.useForm()
	useEffect(() => {
		fetch("", (data: userListItem[]) => setUserOptions(data.list))
	}, [])

	//  提交
	const onFinish = useCallback(data => {
		setLoading(true)
		data.resourceUrl = data.resourceUrl[0]["fileSaveUrl"]
		service4Dtemplate
			.addTemplates({
				...data
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doTemplate")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	//  select搜索事件
	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, (data: userListItem[]) => setUserOptions(data.list))
		} else {
			setUserOptions([])
		}
	}
	// select change事件
	const handleChange = (value: string) => {
		setSearchValue(value)
	}

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onRemove = useCallback((uid: string) => {
		serviceScene.fileCancel({ uuid: uid })
	}, [])

	return (
		<Card
			className="addHall"
			style={cardStyle}
			title="模板信息页"
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
					<Form.Item
						className="hallName"
						label="模板名称"
						name="name"
						rules={[
							{ required: true, message: "请输入模板名称" },
							{ message: "请输入1-30个文字", max: 30 }
						]}
					>
						<Input></Input>
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
					<Form.Item label="有效面积" name="validSz" rules={[{ required: true, message: "请填写有效面积" }]}>
						<InputNumber min={0} max={10000000} />
					</Form.Item>
				</div>
				<Form.Item
					label={`选择文件`}
					name="resourceUrl"
					required
					rules={[{ required: true, message: "请选择本地ZIP包" }]}
				>
					<FormUploads
						accept=".zip"
						withChunk
						chunkSize={3}
						size={1}
						// customCheck={checkZip("Obj")}
						onRemove={onRemove}
					/>
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

export default AddTemplateModal
