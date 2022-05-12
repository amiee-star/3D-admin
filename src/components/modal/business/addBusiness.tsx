import React, { useCallback, useMemo, useState } from "react"
import { Button, Card, Form, Input, Radio, Cascader, Row, Col } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import city from "@/constant/mapData/city"
import serviceSystem from "@/services/service.business"
import { regxSPhone, regxCall2, regxOnlyNumEn, checkEmail } from "@/utils/regexp.func"
import { ModalRef } from "@/components/modal/modal.context"
import FormUploads from "@/components/form/form.uploads"
import checkImage from "@/utils/checkImage.func"
import proxy from "../../../../config/proxy"
import eventBus from "@/utils/event.bus"
import CryptoJS from "crypto-js"

interface props {
	id?: string
	isShowRealm?: boolean
}

const addBusiness = (props: ModalRef & props) => {
	const [loading, setLoading] = useState(false)
	const [done, setDone] = useState(false)
	const [form] = Form.useForm()
	const { modalRef, id, isShowRealm } = props
	const onFinish = useCallback(data => {
		setLoading(true)
		let params = {
			...data,
			companyAddress: JSON.stringify(data.companyAddress),
			id,
			password: CryptoJS.MD5(data.password).toString(),
			repassword: CryptoJS.MD5(data.repassword).toString(),
			domainName: proxy.accessName[API_ENV].split("//")[1] + data.simpleName,
			logo: data.logo?.length > 0 ? data.logo[0].fileSaveUrl : "",
			avatar: data.avatar?.length > 0 ? data.avatar[0].fileSaveUrl : ""
		}
		if (id) {
			serviceSystem
				.businessEdit(params)
				.then(res => {
					if (res.code === 200) {
						closeModal()
						eventBus.emit("getBusinessList")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		} else {
			serviceSystem
				.businessAdd(params)
				.then(res => {
					if (res.code === 200) {
						closeModal()
						eventBus.emit("getBusinessList")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}, [])

	const closeModal = () => {
		modalRef.current.destroy()
	}
	useMemo(() => {
		if (id) {
			serviceSystem.businessInfo({ id }).then(res => {
				if (res.code === 200) {
					const { logo, avatar } = res.data
					form.setFieldsValue({
						...res.data,
						companyAddress: JSON.parse(res.data.companyAddress),
						repassword: res.data.password,
						logo: logo
							? [
									{
										filePreviewUrl: `${proxy.templateObsUrl[API_ENV]}/${logo}`,
										fileSaveUrl: logo,
										fileSize: 0
									}
							  ]
							: "",
						avatar: avatar
							? [
									{
										filePreviewUrl: `${proxy.templateObsUrl[API_ENV]}/${avatar}`,
										fileSaveUrl: avatar,
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
			title={id ? "编辑企业信息" : "添加企业信息"}
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
					colon={false}
					onFinish={onFinish}
					initialValues={{ companyStatus: true }}
					autoComplete="off"
					style={{ padding: "-24px" }}
				>
					<div className="globalScroll">
						<Form.Item label="企业账号"></Form.Item>
						<Form.Item
							label="企业名称："
							name="name"
							rules={[
								{ required: true, message: "请输入企业名称" },
								{ message: "请输入2-30个文字", min: 2 }
							]}
						>
							<Input disabled={id ? true : false} maxLength={30} placeholder="请输入企业名称" />
						</Form.Item>
						<Form.Item label="登录账号：" name="username" rules={[{ required: true, message: "请输入登录账号" }]}>
							<Input disabled={id ? true : false} maxLength={15} placeholder="请输入2-15个数字或者字母" />
						</Form.Item>
						{!id && (
							<>
								<Form.Item
									label="登录密码："
									name="password"
									rules={[
										{ required: true, pattern: regxOnlyNumEn, message: "请输入登录密码" },
										{ message: "请输入8-16数字或者字母", min: 8 }
									]}
								>
									<Input.Password maxLength={16} placeholder="请输入8-16数字或者字母" />
								</Form.Item>
								<Form.Item
									label="确认密码："
									name="repassword"
									rules={[
										{ required: true, message: "请再次输入密码" },
										({ getFieldValue }) => ({
											validator(_, value) {
												if (!value || getFieldValue("password") === value) {
													return Promise.resolve()
												}
												return Promise.reject("你两次输入的密码不一致")
											}
										})
									]}
								>
									<Input.Password maxLength={16} placeholder="请再次输入密码" />
								</Form.Item>
							</>
						)}

						<Form.Item
							label="访问域名："
							name="simpleName"
							rules={[
								{ required: true, message: "请输入访问域名" },
								{ min: 2, message: "请输入2-10个字母或数字", pattern: regxOnlyNumEn }
							]}
						>
							<Input
								disabled={isShowRealm}
								addonBefore={proxy.accessName[API_ENV]}
								placeholder="访问域名"
								maxLength={10}
							/>
						</Form.Item>
						<Form.Item label="企业logo：" extra="支持2M以内的.jpg、.png格式，上传后将用于企业宣传页顶部栏" name="logo">
							<FormUploads
								accept=".png, .jpg, .jpeg"
								checkType="hotImage"
								size={1}
								customCheck={checkImage(2)}
								extParams={{ businessType: 19 }}
							/>
						</Form.Item>
						<Form.Item
							label="企业头像："
							extra="支持2M以内的.jpg、.png格式，上传后将替换展厅浏览左上角头像"
							name="avatar"
						>
							<FormUploads
								accept=".png, .jpg, .jpeg"
								checkType="hotImage"
								size={1}
								customCheck={checkImage(2)}
								extParams={{ businessType: 19 }}
							/>
						</Form.Item>
						<Form.Item label="联系方式"></Form.Item>
						<Form.Item label="联系人：" name="contact" rules={[{ min: 2, message: "请输入2-10个文字" }]}>
							<Input maxLength={10} placeholder="2-10个文字" />
						</Form.Item>
						<Form.Item
							label="手机号："
							name="phone"
							rules={[
								{
									pattern: regxSPhone,
									message: "请输入正确的手机号"
								},
								{ required: true, message: "请填写手机号" }
							]}
						>
							<Input maxLength={11} />
						</Form.Item>
						<Form.Item
							label="邮箱："
							name="emailBox"
							rules={[
								{
									pattern: checkEmail,
									message: "请输入正确的邮箱"
								}
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item
							label="公司电话："
							name="companyPhone"
							rules={[
								{
									pattern: regxCall2,
									message: "请输入正确的号码"
								}
							]}
						>
							<Input />
						</Form.Item>
						<Form.Item label="公司地址：">
							<Row gutter={8}>
								<Col span={12}>
									<Form.Item name="companyAddress">
										<Cascader options={city} placeholder="请选择公司地址" />
									</Form.Item>
								</Col>
								<Col span={12}>
									<Form.Item name="address">
										<Input maxLength={15} />
									</Form.Item>
								</Col>
							</Row>
						</Form.Item>

						<Form.Item label="账号状态：" name="companyStatus">
							<Radio.Group>
								<Radio value={true}>启用</Radio>
								<Radio value={false}>禁用</Radio>
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
export default addBusiness
