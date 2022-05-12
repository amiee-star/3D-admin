import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, Radio, Select } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalRef } from "./modal.context"
import moment from "moment"
import eventBus from "@/utils/event.bus"
import { userListItem } from "@/interfaces/api.interface"
import serviceScene from "@/services/service.devloper"
const cardStyle = { width: 600 }

const Option = Select

let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", id: string, callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceScene.getDevUserList({ devUserId: id, keywords: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

interface Props {
	id: string
	userId: string
}
const EditHallDeveloperModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, userId, id } = props
	const [isLockYChecked, setIsLockYChecked] = useState(false)
	const [isCheckValue, setIsCheckValue] = useState(1)
	const [searchValue, setSearchValue] = useState("")
	const [userOptions, setUserOptions] = useState<userListItem[]>([])
	const [loading, setLoading] = useState(false)
	const [form] = Form.useForm()
	const { TextArea } = Input

	useEffect(() => {
		serviceScene.getUpdateDevUserTemp(id).then(rslt => {
			form.setFieldsValue({
				name: rslt.data.tempName,
				userName: rslt.data.userName,
				lockY: rslt.data.lockY || false,
				lockYAngle: rslt.data.lockYAngle || "",
				lockZoom: rslt.data.lockZoom || false,
				checkNote: rslt.data.checkNote || "",
				check: rslt.data.check,
				durationEndTs: rslt.data.durationEndTs ? moment(new Date(rslt.data.durationEndTs)) : ""
			})
			setIsLockYChecked(rslt.data.lockY)
			setIsCheckValue(rslt.data.check)
			setSearchValue(rslt.data.userId)
		})
	}, [])
	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, userId, (data: userListItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}
	// select change事件
	const handleChange = (value: string) => {
		setSearchValue(value)
	}
	//  提交
	const onFinish = useCallback(
		data => {
			const { name, durationEndTs, lockYAngle, lockZoom, checkNote, check, lockY } = data
			setLoading(true)
			serviceScene
				.updateDevUserTemp({
					tempId: props.id,
					tempName: name,
					userId: searchValue,
					durationEndTsStr: durationEndTs ? Date.parse(durationEndTs) : "",
					lockY,
					lockYAngle,
					lockZoom,
					check,
					checkNote
				})
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doSceneTemplate")
						modalRef.current.destroy()
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[searchValue]
	)
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const changeForm = (e: any) => {
		if ("lockY" in e) {
			setIsLockYChecked(e.lockY)
		}
		if ("check" in e) {
			setIsCheckValue(e.check)
		}
	}
	return (
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
				labelCol={{ span: 4 }}
				layout="horizontal"
				form={form}
				preserve={false}
				onFinish={onFinish}
				onValuesChange={changeForm}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item label="展厅名称" name="name" rules={[{ required: true, message: "请输入展厅名称" }]}>
						<Input placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item>
					<Form.Item
						label="所属用户"
						required
						rules={[{ required: true, message: "请输入手机号/用户名" }]}
						name="userName"
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
									<Option key={d.id} value={d.id}>
										{d.username}
									</Option>
								))}
						</Select>
					</Form.Item>
					<Form.Item label="到期时间" name="durationEndTs">
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
					<Form.Item label="访问控制" name="check">
						<Radio.Group>
							<Radio value={1}>正常访问</Radio>
							<Radio value={2}>禁止访问</Radio>
						</Radio.Group>
					</Form.Item>
					<Form.Item
						label=""
						name="checkNote"
						wrapperCol={{ offset: 4 }}
						rules={[
							{ required: isCheckValue != 1, message: "请输入禁止访问原因" },
							{ message: "请输入1-20个文字", max: 50 }
						]}
					>
						<TextArea
							autoSize={{ minRows: 2, maxRows: 6 }}
							disabled={isCheckValue == 1}
							placeholder="请输入禁止访问原因"
						/>
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
}

export default EditHallDeveloperModal
