import React, { useCallback, useMemo, useState } from "react"
import { Button, Card, Form, Input } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import serviceBusiness from "@/services/service.business"
import { ModalRef } from "@/components/modal/modal.context"
import eventBus from "@/utils/event.bus"
import checkImage from "@/utils/checkImage.func"
import FormUploads from "@/components/form/form.uploads"
import { regxOnlyNumEn } from "@/utils/regexp.func"
import proxy from "../../../../config/proxy"

interface props {
	id?: string
	companyId?: string
	domainName?: string
	isShowRealm?: boolean
}

const addTheme = (props: ModalRef & props) => {
	const [form] = Form.useForm()
	const { modalRef, id, companyId, domainName, isShowRealm } = props
	const [done, setDone] = useState(false)
	const [loading, setLoading] = useState(false)
	const onFinish = useCallback(data => {
		setLoading(true)
		let params = {
			...data,
			companyId,
			id,
			domainName: domainName + "/" + data.simpleName,
			logo: data.logo?.length > 0 ? data.logo[0].fileSaveUrl : ""
		}
		serviceBusiness[id ? "themeEdit" : "themeAdd"](params)
			.then(res => {
				if (res.code === 200) {
					closeModal()
					eventBus.emit("getthemeList")
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
	useMemo(() => {
		if (id) {
			serviceBusiness.themeInfo({ id }).then(res => {
				if (res.code === 200) {
					const { logo } = res.data
					form.setFieldsValue({
						...res.data,
						logo: logo
							? [
									{
										filePreviewUrl: `${proxy.templateObsUrl[API_ENV]}/${logo}`,
										fileSaveUrl: logo,
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
			title={id ? "编辑主题" : "新增主题"}
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!done && (
				<Form
					layout="horizontal"
					labelCol={{ span: 5 }}
					form={form}
					preserve={false}
					colon={false}
					onFinish={onFinish}
					initialValues={{ companyStatus: true }}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item
							label="主题名称："
							name="name"
							rules={[
								{ required: true, message: "请输入主题名称" },
								{ message: "请输入2-50个文字", min: 2 }
							]}
						>
							<Input disabled={isShowRealm} maxLength={50} placeholder="2-50个文字" />
						</Form.Item>
						<Form.Item
							label="主题域名："
							name="simpleName"
							rules={[
								{ required: true, message: "请输入主题域名" },
								{ min: 2, message: "请输入2-10个字母或数字", pattern: regxOnlyNumEn }
							]}
						>
							<Input
								disabled={isShowRealm}
								addonBefore={API_ENV === "pro" ? "https://" + domainName + "/" : "http://" + domainName + "/"}
								placeholder="访问域名"
								maxLength={10}
							/>
						</Form.Item>
						<Form.Item
							label="布展工具logo："
							extra="请上传30x30px的png，小于1MB，logo将显示在布展工具侧边栏"
							name="logo"
						>
							<FormUploads
								accept=".png"
								checkType="hotImage"
								size={1}
								customCheck={checkImage(1)}
								extParams={{ businessType: 17 }}
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
			)}
		</Card>
	)
}
export default addTheme
