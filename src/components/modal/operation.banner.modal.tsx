import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Row, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import FormUploads from "../form/form.uploads"
import serviceOperate from "@/services/service.operate"
import { sortTypeItem } from "@/interfaces/api.interface"
import "./operation.banner.modal.less"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import checkImage from "@/utils/checkImage.func"

const cardStyle = { width: 500 }

const Option = Select.Option

interface Props {
	id: number
}

const OperationBannerModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [bannerType, setBannerType] = useState([])
	const [bannnerShowType, setBannnerShowType] = useState([])
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (id) {
			Promise.all([
				serviceOperate.getBannerById({ id: id }),
				serviceOperate.getBannerType(),
				serviceOperate.bannnerShowType()
			]).then(([getBannerById, getBannerType, bannnerShowType]) => {
				if (getBannerById.code === 200) {
					form.setFieldsValue({
						...getBannerById.data,
						imgUrl: [
							{
								filePreviewUrl: getBannerById.data.imgUrl,
								fileSaveUrl: getBannerById.data.imgUrl,
								fileSize: 0
							}
						]
					})
					setBannerType(getBannerType.data)
					setBannnerShowType(bannnerShowType.data)
					setDone(true)
				}
			})
		} else {
			setDone(true)
			Promise.all([serviceOperate.getBannerType(), serviceOperate.bannnerShowType()]).then(
				([getBannerType, bannnerShowType]) => {
					if (getBannerType.code === 200) {
						setBannerType(getBannerType.data)
						setBannnerShowType(bannnerShowType.data)
						form.resetFields()
					}
				}
			)
		}
	}, [])

	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = useCallback(data => {
		setLoading(true)
		const params = {
			...data,
			imgUrl: data.imgUrl[0].filePreviewUrl,
			id: !!id ? id : ""
		}
		serviceOperate[!!id ? "updateBanner" : "addBanner"](params)
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doBannerList")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const onValuesChange = useCallback(data => {
		if ("imgUrl" in data) {
			if (data.imgUrl[0]) {
				let fileSaveUrl = data.imgUrl[0]?.fileSaveUrl
				let start = fileSaveUrl.indexOf("/")
				let end = fileSaveUrl.indexOf(".")
				let fileName = fileSaveUrl.substring(start + 1, end)
				form.setFieldsValue({
					title: fileName
				})
			}
		}
	}, [])

	return (
		<Card
			className="banner-modal"
			style={cardStyle}
			title={id ? "修改banner" : "新增banner"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!done && (
				<Form
					labelCol={{ span: 6 }}
					layout="horizontal"
					form={form}
					onValuesChange={onValuesChange}
					preserve={false}
					onFinish={onFinish}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item
							className="upload"
							label="上传banner图："
							name="imgUrl"
							extra="请上传对应尺寸 jpg图片；PC端首页1920x740px；PC端建展页及案例页1920x200px；H5首页750x720px；"
							rules={[{ required: true, message: "请上传banner图" }]}
						>
							<FormUploads accept=".png, .jpg, .jpeg" checkType="hotImage" size={1} extParams={{ businessType: 5 }} />
						</Form.Item>
						<Form.Item
							label="名称："
							name="title"
							rules={[
								{ required: true, message: "请输入名称" },
								{ message: "请输入1-20个文字", max: 20 }
							]}
						>
							<Input placeholder="请输入名称（最多20个字符）" />
						</Form.Item>
						<Form.Item label="跳转链接：" name="contentUrl">
							<Input placeholder="请输入跳转链接" />
						</Form.Item>
						<Form.Item label="所属终端：" name="showType" rules={[{ required: true, message: "请选择展示位置" }]}>
							<Select placeholder="请选择展示位置">
								{bannnerShowType &&
									bannnerShowType.map(item => {
										return (
											<Option key={item.key} value={Number(item.key)}>
												{item.value}
											</Option>
										)
									})}
							</Select>
						</Form.Item>
						<Form.Item label="所属页面：" name="type" rules={[{ required: true, message: "请选择页面" }]}>
							<Select placeholder="请选择页面">
								{bannerType &&
									bannerType.map(item => {
										return (
											<Option key={item.key} value={Number(item.key)}>
												{item.value}
											</Option>
										)
									})}
							</Select>
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
							<Row justify="end">
								<Button className="cancel-btn" onClick={closeModal}>
									取消
								</Button>
								<Button type="primary" htmlType="submit" loading={loading}>
									保存
								</Button>
							</Row>
						</Form.Item>
					</div>
				</Form>
			)}
		</Card>
	)
}

export default OperationBannerModal
