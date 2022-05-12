import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message, Radio, Row, Modal } from "antd"
import React, { useCallback, useEffect, useState, useMemo } from "react"
import { ModalRef } from "@/components/modal/modal.context"
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons"
import serviceOperate from "@/services/service.operate"
import eventBus from "@/utils/event.bus"
import FormUploads from "@/components/form/form.uploads"
import { regxUrl } from "@/utils/regexp.func"
import checkImage from "@/utils/checkImage.func"
import { PageProps } from "@/interfaces/app.interface"
import { history } from "umi"
import "./operateIterativeInfo.less"

interface loca {
	id: string
	userId: string
}

const operateIterativeInfo = (props: PageProps) => {
	const { id } = props.location.state as loca
	const [form] = Form.useForm()
	const { TextArea } = Input

	useEffect(() => {
		if (id) {
			serviceOperate.upgradeGetEditInfo({ id: id }).then(res => {
				if (res.code === 200) {
					let info = res.data.info
					let detailsList = res.data.detailsList
					detailsList.map(item => {
						item.fileUrl = [
							{
								filePreviewUrl: item.fileUrl,
								fileSaveUrl: item.fileUrl,
								fileSize: 0
							}
						]
					})
					form.setFieldsValue({
						title: info.title,
						status: info.status,
						detailsList: detailsList
					})
				}
			})
		} else {
			form.setFieldsValue({
				detailsList: [""]
			})
		}
	}, [])

	// 关闭弹窗
	const closeModal = useCallback(() => {
		history.push({
			pathname: "/home/operate/operateIterative.html",
			state: { id }
		})
	}, [])

	const onFinish = useCallback(data => {
		let info = {
			title: data.title,
			status: data.status,
			id: !!id ? id : ""
		}
		data.detailsList.map((item: { fileUrl: { filePreviewUrl: any }[] }) => {
			item.fileUrl = item.fileUrl[0].filePreviewUrl
		})
		const params = {
			info: info,
			detailsList: data.detailsList
		}
		serviceOperate[!!id ? "upgradeEditInfo" : "upgradeAddInfo"](params).then(res => {
			if (res.code === 200) {
				eventBus.emit("doUpgradeList")
				closeModal()
				message.success("保存成功！")
			}
		})
	}, [])

	return (
		<div className="iterative-modal">
			<Form
				name="dynamic_form_item"
				layout="horizontal"
				form={form}
				preserve={false}
				onFinish={onFinish}
				initialValues={{ status: 0 }}
				autoComplete="off"
			>
				<Form.Item>
					<Row justify="end">
						<Button className="cancel-btn" onClick={closeModal}>
							取消
						</Button>
						<Button type="primary" htmlType="submit">
							保存
						</Button>
					</Row>
				</Form.Item>
				<div className="formContent">
					<Form.Item className="title" label="标题：" name="title" rules={[{ required: true, message: "请输入标题" }]}>
						<Input placeholder="请输入1-10个文字" maxLength={10} />
					</Form.Item>
					<Form.List name="detailsList">
						{(fields, { add, remove }, {}) => (
							<>
								{fields.map((field, index) => (
									<Form.Item className="content" key={index}>
										<Form.Item
											label="功能："
											name={[field.name, "name"]}
											fieldKey={[field.fieldKey, "name"]}
											rules={[{ required: true, message: "请输入功能" }]}
										>
											<Input placeholder="请输入1-20个文字" maxLength={20} />
										</Form.Item>
										<Form.Item
											label="简介："
											name={[field.name, "describe"]}
											fieldKey={[field.fieldKey, "describe"]}
											rules={[{ required: true, message: "请输入简介" }]}
										>
											<TextArea placeholder="请输入1-100个文字" showCount maxLength={100} />
										</Form.Item>
										<Form.Item
											label="链接："
											name={[field.name, "linkUrl"]}
											fieldKey={[field.fieldKey, "linkUrl"]}
											rules={[{ required: true, pattern: regxUrl, message: "请输入链接" }]}
										>
											<Input placeholder="请输入链接" />
										</Form.Item>
										<Form.Item
											className="upload"
											label="上传图片："
											name={[field.name, "fileUrl"]}
											fieldKey={[field.fieldKey, "fileUrl"]}
											extra="支持5M以内的JPG或GIF"
											rules={[{ required: true, message: "请上传图片" }]}
										>
											<FormUploads
												accept=".jpg, .jpeg, .gif"
												checkType="updateImage"
												size={1}
												customCheck={checkImage(5)}
												extParams={{ businessType: 14 }}
											/>
										</Form.Item>
										{index > 0 && (
											<MinusCircleOutlined
												onClick={() => {
													Modal.confirm({
														title: "删除",
														content: "是否删除？",
														closable: true,
														onOk: () => {
															remove(field.name)
														}
													})
												}}
											/>
										)}
									</Form.Item>
								))}
								{fields.length < 10 && (
									<Form.Item>
										<Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
											添加
										</Button>
									</Form.Item>
								)}
							</>
						)}
					</Form.List>
					<Form.Item label="状态" name="status">
						<Radio.Group>
							<Radio value={0}>未上架</Radio>
							<Radio value={1}>上架</Radio>
						</Radio.Group>
					</Form.Item>
				</div>
			</Form>
		</div>
	)
}
operateIterativeInfo.title = "迭代更新管理"
operateIterativeInfo.menu = false
export default operateIterativeInfo
