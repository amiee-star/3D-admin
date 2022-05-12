import React, { useCallback, useEffect, useMemo, useState } from "react"
import { Button, Card, Form, Input, Col, Row, Modal, message } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import serviceBusiness from "@/services/service.business"
import { ModalRef } from "@/components/modal/modal.context"
import eventBus from "@/utils/event.bus"
import { regxOnlyNum } from "@/utils/regexp.func"

interface props {
	id?: string
	companyId?: string
	topicId?: string
}

const allocateResource = (props: ModalRef & props) => {
	const [form] = Form.useForm()
	const { modalRef, id, companyId, topicId } = props
	const [areaList, setAreaList] = useState([])
	const [done, setDone] = useState(false)
	const [loading, setLoading] = useState(false)
	const onFinish = useCallback(data => {
		setLoading(true)
		const arr: object[] = []
		data.areaList.forEach((item: { count: number }) => {
			if (!!item.count && item.count !== 0) {
				arr.push(item)
			}
		})
		if (arr.length === 0) {
			closeModal()
			return
		}
		serviceBusiness
			.userResources({
				areaList: arr,
				id
			})
			.then(res => {
				if (res.code === 200) {
					message.success("保存成功")
					closeModal()
					eventBus.emit("getuserList")
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
		serviceBusiness.areasList(id).then(res => {
			const arr: object[] = []
			res.data.forEach(item => {
				arr.push({
					areaId: item.areaId,
					areaRemark: item.remark,
					userRemainCount: item.userRemainCount,
					remainCount: item.remainCount,
					count: 0
				})
			})
			setAreaList(arr)
			setDone(true)
			form.setFieldsValue({
				areaList: arr
			})
		})
	}, [id])

	const recoverHandle = () => {
		Modal.confirm({
			title: "回收资源",
			content: "是否回收该用户下所有资源？",
			closable: true,
			onOk: () => {
				serviceBusiness
					.recycle({
						userId: id
					})
					.then(res => {
						if (res.code == 200) {
							message.success("资源回收成功")
							closeModal()
							eventBus.emit("getuserList")
						}
					})
			}
		})
	}

	return (
		<Card
			id="account-config"
			style={{ width: 605 }}
			title="资源分配"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!done && (
				<Form
					layout="horizontal"
					labelCol={{ span: 7 }}
					form={form}
					preserve={false}
					colon={false}
					onFinish={onFinish}
					initialValues={{ companyStatus: true, releases: 10 }}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item label="" name="areaList">
							<Row style={{ marginBottom: "10px" }} justify="center">
								<Col span={9}>展厅面积区间</Col>
								<Col span={8}>数量(个)</Col>
								<Col span={7}>企业剩余（个）</Col>
							</Row>
							<Form.List name="areaList">
								{fields =>
									fields.map((field, index) => (
										<Row key={field.key} justify="center">
											<Form.Item
												labelCol={{ span: 12 }}
												wrapperCol={{ span: 12 }}
												label={areaList[index].areaRemark}
												labelAlign="left"
												name={[field.name, "count"]}
												rules={[{ pattern: regxOnlyNum, message: "请输入数字" }]}
											>
												<Input addonBefore={<span>{areaList[index].userRemainCount}</span>} min={0} />
											</Form.Item>
											<Col span={10} style={{ textAlign: "center" }}>
												{areaList[index].remainCount}
											</Col>
										</Row>
									))
								}
							</Form.List>
						</Form.Item>
					</div>
					<div className="globalFooter">
						<Form.Item style={{ textAlign: "right" }}>
							<Button type="primary" onClick={recoverHandle}>
								回收资源
							</Button>
							<Button style={{ marginLeft: 10 }} type="primary" htmlType="submit" loading={loading}>
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
export default allocateResource
