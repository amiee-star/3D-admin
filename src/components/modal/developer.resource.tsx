import serviceSystem from "@/services/service.devloper"
import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, DatePicker } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import eventBus from "@/utils/event.bus"
import moment from "moment"
import { ModalRef } from "./modal.context"
import "./accountConfig.modal.less"

interface Props {
	id: string
}

const formItemLayout = {
	wrapperCol: {
		offset: 9
	}
}

interface info {
	devPackageId: string
	publishScenesExtra?: number
	sceneSyncs?: number
	visitorInfos?: number
	onlineServices?: number
	lives?: number
	version: number
	vrLooks?: number
}

const DeveloperRes: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const [infos, setInfos] = useState<info>({ version: 1, devPackageId: "" })
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(
		data => {
      setLoading(true)
			serviceSystem
				.developersPackage({
					devId: props.id,
					version: infos.version,
					devPackageId: infos.devPackageId,
					expire: Date.parse(data.expire),
					publishScenesExtra: Number(data.publishScenesExtra1),
					onlineServices: Number(data.onlineServices1),
					visitorInfos: Number(data.visitorInfos1),
					lives: Number(data.lives1),
					sceneSyncs: Number(data.sceneSyncs1),
					vrLooks: Number(data.vrLooks1)
				})
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doSceneTemplate")
						closeModal()
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[infos]
	)
	useEffect(() => {
		serviceSystem.mealInfo(props.id).then(res => {
			if (res.code === 200) {
				setInfos({ ...res.data })
				form.setFieldsValue({
					...res.data,
					expire: res.data.expire ? moment(new Date(res.data.expire)) : ""
				})
			}
		})
	}, [props.id])

	const prefixSelector = (val: number) => {
		return <div>{val}</div>
	}

	const disabledDate = (current: object) => {
		return current && current < moment().startOf("day")
	}

	return (
		<Card
			id="account-config"
			style={{ width: 590 }}
			title="帐号资源配置"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				layout="horizontal"
				labelCol={{ span: 7 }}
				form={form}
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
				initialValues={{
					publishScenesExtra1: 0,
					onlineServices1: 0,
					lives1: 0,
					visitorInfos1: 0,
					sceneSyncs1: 0,
					vrLooks1: 0
				}}
			>
				<div className="globalScroll">
					<Form.Item
						label="套餐有效期："
						name="expire"
						rules={[{ required: true, message: "请选择套餐有效期!" }]}
						style={{ marginBottom: 0 }}
					>
						<DatePicker disabledDate={disabledDate} />
					</Form.Item>
					<Form.Item {...formItemLayout} style={{ marginBottom: 0 }}>
						<div className="tips">
							<ExclamationCircleOutlined />
							帐号资源的有效时间将跟随套餐有效期失效
						</div>
					</Form.Item>
					<Form.Item label="增购展厅发布总数量：" name="publishScenesExtra1">
						<Input addonBefore={prefixSelector(infos.publishScenesExtra)} />
					</Form.Item>
					<Form.Item label="在线客服：" name="onlineServices1">
						<Input addonBefore={prefixSelector(infos.onlineServices)} />
					</Form.Item>
					<Form.Item label="直播：" name="lives1">
						<Input addonBefore={prefixSelector(infos.lives)} />
					</Form.Item>
					<Form.Item label="访客信息：" name="visitorInfos1">
						<Input addonBefore={prefixSelector(infos.visitorInfos)} />
					</Form.Item>
					<Form.Item label="展厅同步：" name="sceneSyncs1">
						<Input addonBefore={prefixSelector(infos.sceneSyncs)} />
					</Form.Item>
					<Form.Item label="VR带看：" name="vrLooks1">
						<Input addonBefore={prefixSelector(infos.vrLooks)} />
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
		</Card>
	)
}

export default DeveloperRes
