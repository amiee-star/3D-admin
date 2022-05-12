import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Col, Form, Input, message, Select } from "antd"
import React, { useCallback, useState, useEffect } from "react"
import { ModalRef } from "../modal.context"
import serviceBusiness from "@/services/service.business"
import { businessListItem } from "@/interfaces/api.interface"
import serviceHall from "@/services/service.hall"
import eventBus from "@/utils/event.bus"
import "./addHall.modal.less"

const cardStyle = { width: 600 }
const { Option } = Select

let timeout: NodeJS.Timeout
let currentValue: string

function fetch(params: { value: string; topicId?: string }, callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = params.value

	function fake() {
		serviceBusiness.getTopicUserList({ keywords: params.value, topicId: params.topicId }).then(rslt => {
			if (currentValue === params.value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

interface Props {
	id: string
	name: string
}
const EditHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [searchValue, setSearchValue] = useState("")
	const [userOptions, setUserOptions] = useState([])
	const [companyId, setCompanyId] = useState("")
	const [topicId, setTopicId] = useState("")
	const [notContent, setNotContent] = useState("")
	const [companyList, setCompanyList] = useState<businessListItem[]>()
	const [topicList, setTopicList] = useState<businessListItem[]>()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		//企业列表
		serviceBusiness.getCompanyList().then(res => {
			if (res.code == 200) {
				setCompanyList(res.data)
			}
		})
	}, [])

	//  提交
	const onFinish = useCallback(data => {
		setLoading(true)
		serviceBusiness
			.cloneHall({
				...data,
				tempId: props.id
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
	}, [])
	//  select搜索事件
	const handleSearch = (value: string) => {
		if (value && topicId) {
			let params = {
				value: value,
				topicId: topicId
			}
			fetch(params, (data: any) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}
	// select change事件
	const handleChange = (value: string) => {
		setSearchValue(value)
	}
	// 关闭弹窗
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const changeHandle = (value: string) => {
		setCompanyId(value)
	}

	const changeTopic = (value: string) => {
		setTopicId(value)
	}

	const focusHandle = useCallback(() => {
		if (companyId) {
			//主题列表
			serviceBusiness.getTopicList({ companyId: companyId }).then(res => {
				if (res.code == 200) {
					if (res.data.length > 0) {
						setTopicList(res.data)
					} else {
						setNotContent("暂无数据")
					}
				}
			})
		} else {
			setNotContent("请先选择企业")
		}
	}, [companyId])

	return (
		<Card
			id="businessCloneHall"
			style={cardStyle}
			title="复制展厅"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 5 }} layout="horizontal" preserve={false} onFinish={onFinish} autoComplete="off">
				<div className="globalScroll">
					<Form.Item label="来源展厅名称">
						<span>{props.name}</span>
					</Form.Item>
					<Form.Item label="来源展厅ID">
						<span>{props.id}</span>
					</Form.Item>
					<Form.Item label="展厅名称" name="tempName" rules={[{ required: true, message: "请输入展厅名称" }]}>
						<Input placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item>
					<Form.Item label="所属用户" required className="group">
						<Input.Group compact>
							<Form.Item name="companyId" noStyle rules={[{ required: true, message: "请选择所属企业" }]}>
								<Select placeholder="企业" onChange={changeHandle}>
									{companyList &&
										companyList.map(item => {
											return (
												<Option value={item.id} key={item.id}>
													{item.name}
												</Option>
											)
										})}
								</Select>
							</Form.Item>
							<Form.Item name="topicId" noStyle rules={[{ required: true, message: "请选择所属主题" }]}>
								<Select placeholder="主题" onFocus={focusHandle} notFoundContent={notContent} onChange={changeTopic}>
									{topicList &&
										topicList.map(item => {
											return (
												<Option value={item.id} key={item.id}>
													{item.name}
												</Option>
											)
										})}
								</Select>
							</Form.Item>
							<Form.Item label="所属用户" name="userId" noStyle rules={[{ required: true, message: "请选择所属用户" }]}>
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
						</Input.Group>
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

export default EditHallModal
