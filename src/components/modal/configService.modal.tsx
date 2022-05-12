import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, Row, Switch, Space } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceEditHall from "@/services/service.hall"
import eventBus from "@/utils/event.bus"
const cardStyle = { width: 630 }

interface Props {
	id: string
}
const EditHallModal: React.FC<Props & ModalRef> = props => {
	const [loading, setLoading] = useState(false)
	const { modalRef } = props
	const [form] = Form.useForm()

	useEffect(() => {
		serviceEditHall.getSeviceConfig({ tempId: props.id }).then(rslt => {
			const { myBrowseService, hideLogo, varLook, imageMore, statSwitch } = rslt.data
			form.setFieldsValue({
				statSwitch: statSwitch,
				// myCustService: myCustService == 2 ? true : false,
				myBrowseService: myBrowseService == 2 ? true : false,
				// liveService: liveService == 2 ? true : false,
				hideLogo: hideLogo,
				varLook: varLook == 2 ? true : false,
				imageMore: imageMore
			})
		})
	}, [])
	//  提交
	const onFinish = useCallback(data => {
		setLoading(true)
		serviceEditHall
			.setSeviceConfig({
				tempId: props.id,
				// liveService: data.liveService ? 2 : 1,
				statSwitch: data.statSwitch,
				hideLogo: data.hideLogo,
				myBrowseService: data.myBrowseService ? 2 : 0,
				// myCustService: data.myCustService ? 2 : 1,
				varLook: data.varLook ? 2 : 0,
				imageMore: data.imageMore
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doHallTemplate")
					modalRef.current.destroy()
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	return (
		<Card
			style={cardStyle}
			title="增值服务配置"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 4 }}
				form={form}
				layout="horizontal"
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item label="展厅统计">
						<Space>
							<Form.Item name="statSwitch" valuePropName="checked" noStyle>
								<Switch />
							</Form.Item>
							<span style={{ fontSize: "13px" }}>
								(开启后官网个人中心展厅列表将显示【统计】按钮，可进入展厅统计页面)
							</span>
						</Space>
					</Form.Item>
					<Form.Item label="访客统计">
						<Space>
							<Form.Item name="myBrowseService" valuePropName="checked" noStyle>
								<Switch />
							</Form.Item>
							<span style={{ fontSize: "13px" }}>(开启后移动端访问展厅时将提示微信授权)</span>
						</Space>
					</Form.Item>
					<Form.Item label="去水印">
						<Space>
							<Form.Item name="hideLogo" valuePropName="checked" noStyle>
								<Switch />
							</Form.Item>
							<span style={{ fontSize: "13px" }}>(开启后浏览展厅时无云展水印)</span>
						</Space>
					</Form.Item>
					<Form.Item label="VR带看">
						<Space>
							<Form.Item name="varLook" valuePropName="checked" noStyle>
								<Switch />
							</Form.Item>
							<span style={{ fontSize: "13px" }}>(开启后可配置“VR带看”，使用带看功能)</span>
						</Space>
					</Form.Item>
					<Form.Item label="多条导览路径">
						<Space>
							<Form.Item name="imageMore" valuePropName="checked" noStyle>
								<Switch />
							</Form.Item>
							<span style={{ fontSize: "13px" }}>(开启后可在布展工具中配置多条导览路径)</span>
						</Space>
					</Form.Item>
					<Row style={{ marginBottom: "10px", color: "#F56C6C" }}>
						<Col span={24} className="t-cn">
							开启对应权限后，前端用户无需付费将具备此功能
						</Col>
					</Row>
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

export default EditHallModal
