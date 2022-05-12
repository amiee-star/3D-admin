import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, InputNumber, message, Select } from "antd"
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react"
import service4Dtemplate from "@/services/service.4Dtemplate"
import { ModalRef } from "../modal.context"
import eventBus from "@/utils/event.bus"
import { templateItem, userListItem } from "@/interfaces/api.interface"
import FormUploads from "@/components/form/form.uploads"
import FormUploads4D from "@/components/form/form.uploads4D"
import checkImage from "@/utils/checkImage.func"
import serviceScene from "@/services/service.scene"
import urlFunc from "@/utils/url.func"
import { has } from "lodash"
const cardStyle = { width: 600 }

interface Props {
	id: string
	hasZip?: boolean
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
		service4Dtemplate.searchUsers({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

const EditTemplateModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id, hasZip } = props
	//!!!
	const Option = Select
	const [done, setDone] = useState(false)
	const [searchValue, setSearchValue] = useState("")

	const [userOptions, setUserOptions] = useState([])

	const [loading, setLoading] = useState(false)

	const [form] = Form.useForm()
	useEffect(() => {
		fetch("", (data: userListItem[]) => setUserOptions(data.list))
		service4Dtemplate.getTemplateInfo(props.id).then(res => {
			if (res.code == 200) {
				form.setFieldsValue({
					name: res.data.name,
					validSz: res.data.validSz,
					userId: res.data.userId,
					resourceUrl: [
						{
							filePreviewUrl: !!res.data.resourceUrl
								? `${urlFunc.replaceUrl(res.data.resourceUrl, "templateObsUrl")}`
								: "",
							fileSaveUrl: !!res.data.resourceUrl ? res.data.resourceUrl : "",
							fileSize: 2
						}
					],
					thumbnail: !!res.data.thumbnail
						? [
								{
									filePreviewUrl: !!res.data.thumbnail
										? `${urlFunc.replaceUrl(res.data.thumbnail, "templateObsUrl")}`
										: "",
									fileSaveUrl: !!res.data.thumbnail ? res.data.thumbnail : "",
									fileSize: 2
								}
						  ]
						: []
				})
				setDone(true)
			}
		})
	}, [])

	//  提交
	const onFinish = useCallback(data => {
		setLoading(true)
		if (!!hasZip) {
			data.resourceUrl = data?.resourceUrl[0]["fileSaveUrl"]
		}

		if (!!hasZip) {
			service4Dtemplate
				.updateChangeTemplate({
					id: props.id,
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
		} else {
			if (data?.thumbnail.length !== 0) {
				data.thumbnail = data?.thumbnail[0]["fileSaveUrl"]
			} else {
				data.thumbnail = ""
			}
			service4Dtemplate
				.updateTemplate({
					id: props.id,
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
		}
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
			title={!!hasZip ? "更新模板" : "模板信息页"}
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
					initialValues={{ boutiqueStatus: 0 }}
					form={form}
					autoComplete="off"
				>
					<div className="globalScroll">
						{!hasZip && (
							<>
								<Form.Item
									className="hallName"
									label="模板名称"
									name="name"
									required
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
							</>
						)}
					</div>
					{!!hasZip && (
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
					)}
					{/* extra="支持2M以内的JPG，建议尺寸406*230px" */}
					{!hasZip && (
						<Form.Item label="上传图片：" name="thumbnail">
							<FormUploads4D
								accept=".png, .jpg"
								checkType="hotImage"
								customCheck={checkImage(2)}
								size={1}
								extParams={{ businessType: 1000, businessId: id }}
							/>
						</Form.Item>
					)}

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

export default EditTemplateModal
