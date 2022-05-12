import React, { useCallback, useMemo, useState } from "react"
import { Button, Card, Form, Input, Select, Radio, message } from "antd"
import { CloseOutlined } from "@ant-design/icons"
import serviceSystem from "@/services/service.business"
import { ModalRef } from "@/components/modal/modal.context"
import eventBus from "@/utils/event.bus"
import { topicUserItem } from "@/interfaces/api.interface"
interface props {
	id?: string
	topicId?: string
}

const addUser = (props: ModalRef & props) => {
	const [form] = Form.useForm()
	const { modalRef, id, topicId } = props
	const [userOptions, setUserOptions] = useState([])
	const [userList, setUserList] = useState([])
	const [searchValue, setSearchValue] = useState([])
	const [ispublic, setIspublic] = useState(false)
	const [loading, setLoading] = useState(false)

	let timeout: NodeJS.Timeout
	let currentValue: string
	function fetch(value: string = "", callback: Function) {
		if (timeout) {
			clearTimeout(timeout)
			timeout = null
		}
		currentValue = value

		function fake() {
			serviceSystem.selectTopicUserList({ topicId, keyword: value }).then(rslt => {
				if (currentValue === value) {
					callback(rslt.data)
				}
			})
		}
		timeout = setTimeout(fake, 300)
	}

	const onFinish = useCallback(
		data => {
			setLoading(true)
			serviceSystem
				.TempEdit({
					...data,
					id,
					userList
				})
				.then(res => {
					if (res.code === 200) {
						closeModal()
						eventBus.emit("getTempList")
						message.success("编辑成功！")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[userList]
	)

	const closeModal = () => {
		modalRef.current.destroy()
	}
	useMemo(() => {
		if (id) {
			serviceSystem.tempInfo({ id }).then(res => {
				if (res.code === 200) {
					const userId: string[] = []
					const username: string[] = []
					res.data.userList.forEach(item => {
						userId.push(item.id)
						username.push(item.username)
					})
					form.setFieldsValue({
						...res.data,
						userList: userId
					})
					setUserOptions(res.data.userList)
					setSearchValue(username)
					setUserList(userId)
					setIspublic(res.data.publicAttr)
				}
			})
		}
	}, [id])
	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, (data: topicUserItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}
	const handleChange = (val: string[]) => {
		// const arr = JSON.parse(JSON.stringify(val))
		// arr.map((item: any, index: number) => {
		// 	userOptions.map(one => {
		// 		if (item === one.username) {
		// 			arr.splice(index, 1, one.id)
		// 		}
		// 	})
		// })
		setUserList(val)
	}
	const publicStatus = (val: any) => {
		setIspublic(val.target.value)
	}
	// const filteredOptions = userOptions.filter(o => !searchValue.includes(o.username))

	return (
		<Card
			id="account-config"
			style={{ width: 605 }}
			title="编辑模板展厅"
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
				colon={false}
				onFinish={onFinish}
				initialValues={{ companyStatus: true }}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						label="展厅名称："
						name="name"
						rules={[
							{ required: true, message: "请输入展厅名称" },
							{ message: "请输入2-30个汉字", min: 2 }
						]}
					>
						<Input maxLength={30} placeholder="请输入2-30个汉字" />
					</Form.Item>
					<Form.Item label="创建属性" name="createType">
						<Select>
							<Select.Option value={1}>空白模板</Select.Option>
							<Select.Option value={2}>复制模板</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="公开属性" name="publicAttr">
						<Radio.Group onChange={publicStatus}>
							<Radio value={true}>公开</Radio>
							<Radio value={false}>私有</Radio>
						</Radio.Group>
					</Form.Item>
					{!ispublic && (
						<Form.Item
							label="所属用户"
							name="userList"
							required
							rules={[{ required: true, message: "请输入手机号/用户名" }]}
						>
							<Select
								mode="multiple"
								showSearch
								defaultActiveFirstOption={false}
								filterOption={false}
								onSearch={handleSearch}
								onChange={handleChange}
								notFoundContent={null}
							>
								{userOptions &&
									userOptions.map(d => (
										<Select.Option key={d.username} value={d.id}>
											{d.username}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					)}
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
export default addUser
