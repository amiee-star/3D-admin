import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button, Card, Form, Input, InputNumber, Radio } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import serviceBusiness from "@/services/service.business"
import { ModalRef } from "@/components/modal/modal.context"
import eventBus from "@/utils/event.bus"
import checkCss from "@/utils/checkCss.func"
import limitNumber from "@/utils/checkNum.func"
import FormUploads from "@/components/form/form.uploads"
import { regxOnlyNumEn } from "@/utils/regexp.func"
import checkImage from "@/utils/checkImage.func"
import proxy from "../../../../config/proxy"

interface props {
	id?: string
}

const AddLoginManage = (props: ModalRef & props) => {
	const [form] = Form.useForm()
	const { modalRef, id } = props
	const [done, setDone] = useState(false)
	const [loading, setLoading] = useState(false)
	const onFinish = useCallback(data => {
		setLoading(true)
		let params = {
			...data,
			id,
			thumb: data.thumb[0].fileSaveUrl,
			styleFile: data.styleFile[0].fileSaveUrl
		}
		serviceBusiness[id ? "editLoginStyle" : "addLoginStyle"](params)
			.then(res => {
				if (res.code === 200) {
					closeModal()
					eventBus.emit("getLoginList")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const closeModal = () => {
		modalRef.current.destroy()
	}
	useEffect(() => {
		if (id) {
			serviceBusiness.viewLoginStyle(id).then(res => {
				if (res.code === 200) {
					const { thumb, styleFile } = res.data
					form.setFieldsValue({
						...res.data,
						thumb: thumb
							? [
									{
										filePreviewUrl: `${proxy.templateObsUrl[API_ENV]}/${thumb}`,
										fileSaveUrl: thumb,
										fileSize: 0
									}
							  ]
							: "",
						styleFile: styleFile
							? [
									{
										filePreviewUrl: `${proxy.templateObsUrl[API_ENV]}/${styleFile}`,
										fileSaveUrl: styleFile,
										fileSize: 0
									}
							  ]
							: ""
					})
					setDone(true)
				}
			})
		} else {
			setDone(true)
		}
	}, [id])

	return (
		<Card
			id="account-config"
			style={{ width: 605 }}
			title={id ? "编辑登录模版" : "创建登录模版"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!done && (
				<Form
					layout="horizontal"
					labelCol={{ span: 4 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
					initialValues={{ companyStatus: true, rackStatus: false }}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item
							label="模板名称"
							name="name"
							rules={[
								{ required: true, message: "请输入模板名称" },
								{ message: "请输入2-15个文字", min: 2 }
							]}
						>
							<Input maxLength={15} placeholder="2-15个文字" />
						</Form.Item>
						<Form.Item
							label="模板文件"
							extra="5M以下的css文件"
							name="styleFile"
							rules={[{ required: true, message: "请上传登录模板文件" }]}
						>
							<FormUploads
								accept=".css"
								checkType="css"
								size={1}
								customCheck={checkCss(5)}
								extParams={{ businessType: 16 }}
							/>
						</Form.Item>
						<Form.Item
							label="模板封面"
							extra="5M以下的JPG"
							name="thumb"
							rules={[{ required: true, message: "请上传登录模板封面" }]}
						>
							<FormUploads
								accept=".jpg, .jpeg"
								checkType="hotImage"
								size={1}
								customCheck={checkImage(5)}
								extParams={{ businessType: 16 }}
							/>
						</Form.Item>
						<Form.Item label="排序" name="sort">
							<InputNumber
								max={9999}
								min={1}
								step={1}
								formatter={limitNumber}
								parser={limitNumber}
								placeholder="请输入1-9999之间的整数"
							/>
						</Form.Item>
						<Form.Item label="状态" name="rackStatus">
							<Radio.Group>
								<Radio value={false}>未上架</Radio>
								<Radio value={true}>上架</Radio>
							</Radio.Group>
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
			)}
		</Card>
	)
}
export default AddLoginManage
