import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input, message, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "../modal.context"
import { templateItem, businessListItem } from "@/interfaces/api.interface"
import serviceBusiness from "@/services/service.business"
import eventBus from "@/utils/event.bus"
import "./addHall.modal.less"

const cardStyle = { width: 600 }
const { Option } = Select

let timeout: NodeJS.Timeout
let currentValue: string

function fetch(params: { value: string; topicId?: string }, type: string, callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = params.value

	function fake() {
		switch (type) {
			case "user":
				serviceBusiness.getTopicUserList({ keywords: params.value, topicId: params.topicId }).then(rslt => {
					if (currentValue === params.value) {
						callback(rslt.data)
					}
				})
				break
			case "temp":
				serviceBusiness.getTopicTempList({ keywords: params.value, topicId: params.topicId }).then(rslt => {
					if (currentValue === params.value) {
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
	name: string
}
const AddHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [searchValue, setSearchValue] = useState("")
	const [userOptions, setUserOptions] = useState([])
	const [templateList, setTemplateList] = useState([])
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

	const handleSearchTep = (value: string) => {
		if (value && topicId) {
			let params = {
				value: value,
				topicId: topicId
			}
			fetch(params, "temp", (data: templateItem[]) => setTemplateList(data))
		} else {
			setTemplateList([])
		}
	}

	//  select搜索事件
	const handleSearch = (value: string) => {
		if (value && topicId) {
			let params = {
				value: value,
				topicId: topicId
			}
			fetch(params, "user", (data: any) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}

	//  提交
	const onFinish = useCallback(
		data => {
			setLoading(true)
			serviceBusiness
				.addBusinessHall({
					...data
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
		[loading]
	)

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
			id="businessAddHall"
			style={cardStyle}
			title="创建展厅"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form labelCol={{ span: 6 }} layout="horizontal" preserve={false} onFinish={onFinish} autoComplete="off">
				<div className="globalScroll">
					<Form.Item label="所属企业&主题" required className="group">
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
						</Input.Group>
					</Form.Item>
					<Form.Item label="选择模板" name="tempId" required rules={[{ required: true, message: "请选择模板" }]}>
						<Select
							showSearch
							placeholder="请选择模板"
							optionFilterProp="children"
							onSearch={handleSearchTep}
							showArrow={false}
							notFoundContent={null}
							filterOption={false}
						>
							{templateList &&
								templateList.map(item => {
									return (
										<Option key={item.tempId} value={item.tempId}>
											{item.tempName}
										</Option>
									)
								})}
						</Select>
					</Form.Item>
					<Form.Item label="展厅名称" name="tempName" rules={[{ required: true, message: "请输入展厅名称" }]}>
						<Input placeholder="请输入1-30个文字" maxLength={30} />
					</Form.Item>
					<Form.Item label="所属用户" name="userId" rules={[{ required: true, message: "请选择所属用户" }]}>
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

export default AddHallModal
