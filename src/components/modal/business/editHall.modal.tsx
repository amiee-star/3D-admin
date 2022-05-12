import { CloseOutlined, ExclamationCircleOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, message, Radio, Select } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalRef } from "../modal.context"
import serviceEditHall from "@/services/service.hall"
import serviceBusiness from "@/services/service.business"
import moment from "moment"
import eventBus from "@/utils/event.bus"
import { userListItem, businessListItem, templateItem } from "@/interfaces/api.interface"
import serviceScene from "@/services/service.scene"
import serviceHall from "@/services/service.hall"
import limitNumber from "@/utils/checkNum.func"
import "../editHall.less"
// import limitNumber1 from "@/utils/checkNumber.func "
const cardStyle = { width: 600 }

const { Option } = Select

let timeout: NodeJS.Timeout
let currentValue: string
let currentType: string
function fetch(value: string = "", type: string, callback: Function) {
	if (timeout && currentValue == type) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value
	currentType = type

	function fake() {
		switch (type) {
			case "user":
				serviceScene.searchUsers({ keyword: value }).then(rslt => {
					if (currentValue === value) {
						callback(rslt.data.list)
					}
				})
				break
			case "temp":
				serviceHall.templateList({ keywords: value }).then(rslt => {
					if (currentValue === value) {
						callback(rslt.data)
					}
				})
				break
		}
	}

	timeout = setTimeout(fake, 300)
}

interface Props {
	id: string
}

const EditHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [templateList, setTemplateList] = useState([])
	const [isLockYChecked, setIsLockYChecked] = useState(false)
	const [sceneName, setSceneName] = useState("")
	const [form] = Form.useForm()
	const [done, setDone] = useState(false)
	const [loading, setLoading] = useState(false)
	const [sceneId, setSceneId] = useState("")
	const formItemLayout = {
		wrapperCol: {
			offset: 5
		}
	}
	useEffect(() => {
		serviceBusiness.editBusinessHall({ id: props.id }).then(rslt => {
			fetch("", "temp", (data: templateItem[]) => setTemplateList(data))
			form.setFieldsValue({
				sceneId: rslt.data.sceneId,
				tempName: rslt.data.tempName,
				belonger: rslt.data.belonger,
				lockY: rslt.data.lockY || false,
				lockYAngle: rslt.data.lockYAngle || "",
				lockZoom: rslt.data.lockZoom ? true : false,
				floorSetting: rslt.data.floorSetting ? true : false,
				checkNote: rslt.data.checkNote || "",
				check: rslt.data.check,
				varSetting: rslt.data.varSetting,
				fastLayout: rslt.data.fastLayout ? true : false,
				gifCount: rslt.data.gifCount,
				modelCount: rslt.data.modelCount,
				endTime: rslt.data.endTime ? moment(new Date(rslt.data.endTime)) : ""
			})
			setSceneName(rslt.data.sceneName)
			setSceneId(rslt.data.sceneId)
			setDone(true)
		})
	}, [])

	const handleSearchTep = (value: string) => {
		if (value) {
			fetch(value, "temp", (data: templateItem[]) => setTemplateList(data))
		} else {
			setTemplateList([])
		}
	}

	//  提交
	const onFinish = useCallback(
		data => {
			setLoading(true)
			serviceBusiness
				.saveEditHall({
					...data,
					id: props.id,
					sceneId,
					endTime: Date.parse(data.endTime)
				})
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doBusinessHallList")
						modalRef.current.destroy()
						message.success("保存成功！")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[sceneId]
	)
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const changeForm = (e: any) => {
		if ("lockY" in e) {
			setIsLockYChecked(e.lockY)
		}
	}

	const handleChange2 = (value: string) => {
		setSceneId(value)
	}

	return (
		!!done && (
			<Card
				style={cardStyle}
				title="修改展厅"
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
					onValuesChange={changeForm}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item
							label="选择模板"
							name="sceneId"
							rules={[{ required: true, message: "请选择模板" }]}
							style={{ marginBottom: 0 }}
						>
							<div>
								<Select
									defaultValue={sceneName}
									showSearch
									defaultActiveFirstOption={false}
									showArrow={false}
									filterOption={false}
									onSearch={handleSearchTep}
									onChange={handleChange2}
									notFoundContent={null}
								>
									{templateList &&
										templateList.map(item => {
											return (
												<Select.Option key={item.id} value={item.id}>
													{item.sceneName}
												</Select.Option>
											)
										})}
								</Select>
							</div>
						</Form.Item>
						<Form.Item {...formItemLayout} style={{ marginBottom: 0 }}>
							<div className="tips red">
								<ExclamationCircleOutlined />
								更新模版后需重新渲染或发布展厅
							</div>
						</Form.Item>
						<Form.Item label="展厅名称" name="tempName" rules={[{ required: true, message: "请输入展厅名称" }]}>
							<Input placeholder="请输入1-30个文字" maxLength={30} />
						</Form.Item>
						<Form.Item label="可拖入的模型数" name="modelCount">
							<InputNumber max={99999999} min={0} step={1} formatter={limitNumber} parser={limitNumber} />
						</Form.Item>
						<Form.Item label="可拖入的动图数" name="gifCount">
							<InputNumber max={99999999} min={0} step={1} formatter={limitNumber} parser={limitNumber} />
						</Form.Item>
						<Form.Item label="访问截至时间" name="endTime">
							<DatePicker />
						</Form.Item>
						<Form.Item label="漫游控制" name="lockY" valuePropName="checked">
							<Checkbox value="1">锁定Y轴</Checkbox>
						</Form.Item>
						<Form.Item label="Y轴旋转角度" name="lockYAngle">
							<InputNumber
								max={80}
								min={0}
								step={1}
								disabled={!isLockYChecked}
								style={{ width: "auto" }}
								placeholder="输入0-80的整数"
							/>
						</Form.Item>
						<Form.Item label="缩放控制" name="lockZoom" valuePropName="checked">
							<Checkbox>禁用缩放</Checkbox>
						</Form.Item>
						<Form.Item label="展厅按钮" name="floorSetting" valuePropName="checked">
							<Checkbox>楼层</Checkbox>
						</Form.Item>
						<Form.Item label="展厅VR" name="varSetting">
							<Radio.Group>
								<Radio value={0}>未开启</Radio>
								<Radio value={1}>开启</Radio>
							</Radio.Group>
						</Form.Item>
						<Form.Item label="快速布展模式" name="fastLayout">
							<Radio.Group>
								<Radio value={false}>未开启</Radio>
								<Radio value={true}>开启</Radio>
							</Radio.Group>
						</Form.Item>
						<Form.Item label="访问控制" name="check">
							<Radio.Group>
								<Radio value={1}>正常访问</Radio>
								<Radio value={2}>禁止访问</Radio>
							</Radio.Group>
						</Form.Item>
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
	)
}

export default EditHallModal
