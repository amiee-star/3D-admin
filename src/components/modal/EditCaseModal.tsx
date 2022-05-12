import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, message, Radio, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import serviceBoutique from "@/services/service.boutique"
import FormUploads from "../form/form.uploads"
import { ModalRef } from "./modal.context"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import { templateItem } from "@/interfaces/api.interface"
import serviceOperate from "@/services/service.operate"
const cardStyle = { width: 600 }

interface Props {
	id: number
}
let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceBoutique.templateList({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

const EditCaseModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [userOptions, setUserOptions] = useState([])
	const [validSz, setValidSz] = useState("")
	const [form] = Form.useForm()
	const [loading, setLoading] = useState(false)
	const [done, setDone] = React.useState(false)
	const [boutiqueStatusVal, setBoutiqueStatusVal] = useState<number>(0)

	useEffect(() => {
		serviceOperate
			.getPolymerizationInfo({
				id: props.id
			})
			.then(res => {
				const { imgUrl } = res.data
				if (res.code == 200) {
					form.setFieldsValue({
						...res.data,
						imgUrl: [
							{
								filePreviewUrl: imgUrl,
								fileSaveUrl: imgUrl,
								fileSize: 0
							}
						]
					})
					setDone(true)
				}
			})
	}, [])

	//  提交
	const onFinish = useCallback(data => {
		let editParams = {
			...data,
			id: props.id,
			imgUrl: data.imgUrl[0].filePreviewUrl
		}
		setLoading(true)
		serviceOperate
			.editPolymerization(editParams)
			.then(res => {
				if (res.code == 200) {
					eventBus.emit("doStyle")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
		// const { imgUrl, title, remark, contentUrl, sort } = data
		// let params = {
		// 	title: title,
		// 	remark: remark,
		// 	imgUrl: imgUrl[0].filePreviewUrl,
		// 	contentUrl: contentUrl,
		// 	sort: sort
		// }
		// console.log(params, "==params")
		// serviceOperate.addPolymerization(params).then(res => {
		// 	console.log(res, "===res")
		// 	if (res.code == 200) {
		// 		eventBus.emit("doStyle")
		// 		modalRef.current.destroy()
		// 		message.success("保存成功！")
		// 	}
		// })
	}, [])

	const changeHall = (value: string) => {
		const active = userOptions.filter(i => i.id == value)
		setValidSz(active[0].validSz)
	}

	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, (data: templateItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const changeHandle = useCallback(
		e => {
			setBoutiqueStatusVal(e.target.value)
		},
		[boutiqueStatusVal]
	)
	return (
		<Card
			style={cardStyle}
			title="新增"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!done && (
				<Form
					labelCol={{ span: 5 }}
					layout="horizontal"
					preserve={false}
					onFinish={onFinish}
					form={form}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item label="标题" name="title" rules={[{ required: true, message: "请输入展厅名称" }]}>
							<Input placeholder="请输入1-30个文字" maxLength={30} />
						</Form.Item>
						<Form.Item
							className="upload"
							label="上传图片："
							name="imgUrl"
							extra="支持2M以内的JPG,建议尺寸675x379px；"
							rules={[{ required: true, message: "请上传图片" }]}
						>
							<FormUploads
								accept=".png, .jpg, .jpeg"
								checkType="hotImage"
								size={1}
								extParams={{ businessType: 13 }}
								// onChange={onlo}
							/>
						</Form.Item>
						<Form.Item name="remark" label="展厅描述" rules={[{ required: true, message: "请输入展厅描述" }]}>
							<Input.TextArea maxLength={500} placeholder={"请输入展厅描述,最多500个字符"} />
						</Form.Item>
						<Form.Item label="展厅链接" name="contentUrl" rules={[{ required: true, message: "请输入展厅链接" }]}>
							<Input placeholder="请输入展厅链接"></Input>
						</Form.Item>
						<Form.Item label="排序" name="sort" rules={[{ required: true, message: "请输入1-9999之间的整数进行排序" }]}>
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
						<Form.Item>
							<Button block type="primary" htmlType="submit" loading={loading}>
								保存
							</Button>
						</Form.Item>
					</div>
				</Form>
			)}
		</Card>
	)
}

export default EditCaseModal
