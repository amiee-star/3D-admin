import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Switch, Form, Row, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalRef } from "../modal.context"
import serviceBusiness from "@/services/service.business"
import moment from "moment"
import eventBus from "@/utils/event.bus"
import { userListItem, businessListItem, templateItem } from "@/interfaces/api.interface"
import serviceScene from "@/services/service.scene"
import "../editHall.less"
// import limitNumber1 from "@/utils/checkNumber.func "
const cardStyle = { width: 500 }

interface Props {
	id: string
}

const ValueAddedServiceModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [varLook, setVarLook] = useState(0)
	const [varLookCount, setVarLookCount] = useState(0)
	const [expireFlag, setExporeFlag] = useState(false)
	const [loading, setLoading] = useState(false)
	const formItemLayout = {
		wrapperCol: {
			offset: 1
		}
	}
	useEffect(() => {
		serviceBusiness.getServiceConfig({ tempId: props.id }).then(res => {
			if (res.code == 200) {
				form.setFieldsValue({
					varLook: res.data.varLook !== 2 ? false : true,
					myBrowseService: res.data.myBrowseService !== 2 ? false : true
				})
				setVarLook(res.data.varLook)
				setVarLookCount(res.data.varLookInfo.remainCount)
				setExporeFlag(res.data.varLookInfo.expireFlag)
				setDone(true)
			}
		})
	}, [])

	//  提交
	const onFinish = useCallback(
		data => {
			setLoading(true)
			let params = {
				tempId: props.id,
				varLook: data.varLook ? 2 : 0,
				myBrowseService: data.myBrowseService ? 2 : 0
			}
			serviceBusiness
				.updateServiceConfig(params)
				.then(res => {
					if (res.code == 200) {
						modalRef.current.destroy()
						eventBus.emit("doBusinessHallList")
						message.success("保存成功！")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[varLookCount]
	)
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	return (
		!!done && (
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
					labelCol={{ span: 5 }}
					layout="horizontal"
					form={form}
					preserve={false}
					onFinish={onFinish}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item label="VR带看">
							{varLook === 2 ? (
								<span>已开通</span>
							) : (
								<Row>
									<Form.Item name="varLook" valuePropName="checked" noStyle>
										<Switch disabled={varLookCount > 0 && !expireFlag ? false : true} />
									</Form.Item>
									<span
										style={{ position: "relative", left: "20px" }}
										className={varLookCount > 0 && !expireFlag ? "" : "tips red"}
									>
										{expireFlag ? "（资源已到期）" : varLookCount > 0 ? `（剩余${varLookCount}个）` : "（资源已用完）"}
									</span>
								</Row>
							)}
						</Form.Item>
						<Form.Item label="访客统计">
							<Row>
								<Form.Item name="myBrowseService" valuePropName="checked" noStyle>
									<Switch />
								</Form.Item>
								<span style={{ position: "relative", left: "20px" }}>（开启后移动端访问展厅时将提示微信授权）</span>
							</Row>
						</Form.Item>
						<Form.Item label="" {...formItemLayout}>
							<div className="flex-center">
								<span className="red">
									{expireFlag ? "资源套餐已到期" : "确定开启后将消耗对应资源且不退还，请谨慎操作。"}
								</span>
							</div>
						</Form.Item>
					</div>
					<div className="globalFooter">
						<Form.Item style={{ textAlign: "right" }}>
							{varLookCount > 0 && !expireFlag && (
								<Button type="primary" htmlType="submit" loading={loading}>
									保存
								</Button>
							)}
							<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
								取消
							</Button>
						</Form.Item>
					</div>
				</Form>
			</Card>
		)
	)
}

export default ValueAddedServiceModal
