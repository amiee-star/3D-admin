import React, { useCallback, useEffect, useRef, useState, useContext } from "react"
import { Form, Input, Select, Tooltip, Button, Space, DatePicker } from "antd"
import { businessListItem, platformsItem, baseRes } from "@/interfaces/api.interface"
import { FieldItem, OptionItem } from "@/components/form/form.search"
import { Store } from "antd/lib/form/interface"
import serviceBusiness from "@/services/service.business"
import serviceHall from "@/services/service.hall"
import moment from "moment"
import "./tableSearch.less"

const { Option } = Select

interface Props {
	toSearch: (values: Store) => void
}

const tableSearch: React.FC<Props> = props => {
	const { toSearch } = props
	const [tableForm] = Form.useForm()
	const [companyList, setCompanyList] = useState<businessListItem[]>()
	const [topicList, setTopicList] = useState<businessListItem[]>()
	const [companyId, setCompanyId] = useState("")
	const [notContent, setNotContent] = useState("")
	const [aliStatic, setAliStatic] = useState<platformsItem[]>()
	// const [addedServices, setAddedServices] = useState<platformsItem[]>()

	const resetSearchFrom = useCallback(() => {
		tableForm.resetFields()
		toSearch && toSearch({})
	}, [])

	useEffect(() => {
		//企业列表
		serviceBusiness.getCompanyList().then(res => {
			if (res.code == 200) {
				setCompanyList(res.data)
			}
		})
		//发布状态
		serviceHall.publishStatus().then(res => {
			if (res.code == 200) {
				res.data.unshift({ key: "", value: "全部" })
				setAliStatic(res.data)
			}
		})

		//增值服务
		// serviceHall.addedServices().then(res => {
		// 	if (res.code == 200) {
		// 		setAddedServices(res.data)
		// 	}
		// })
	}, [])

	const changeHandle = (value: string) => {
		setCompanyId(value)
		tableForm.setFieldsValue({ topicId: "" })
		setTopicList([])
		//主题列表
		serviceBusiness.getTopicList({ companyId: value }).then(res => {
			if (res.code == 200) {
				setTopicList(res.data)
			}
		})
	}

	const focusHandle = useCallback(() => {
		if (companyId) {
			if (topicList.length <= 0) {
				setNotContent("暂无数据")
			}
		} else {
			setNotContent("请先选择企业")
		}
	}, [companyId, topicList])

	const onFinish = useCallback(data => {
		const searchParams = {}
		Object.keys(data)
			.filter(key => !!data[key] || data[key] === 0 || data[key] === false)
			.forEach(key => (searchParams[key] = moment.isMoment(data[key]) ? data[key].unix() * 1000 : data[key]))
		toSearch && toSearch(searchParams)
	}, [])

	return (
		<div className="tableSearch">
			<Form name="table-form" form={tableForm} onFinish={onFinish} autoComplete="off">
				<Form.Item>
					<Input.Group>
						<Form.Item name="companyId">
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
						<Form.Item name="topicId">
							<Select placeholder="主题" onFocus={focusHandle} notFoundContent={notContent}>
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
						<Form.Item name="tempName">
							<Input placeholder="展厅名称" />
						</Form.Item>
						<Form.Item name="tempId">
							<Input placeholder="展厅ID" />
						</Form.Item>
						<Form.Item name="phoneOrName">
							<Input placeholder="请输入手机号或名称" />
						</Form.Item>
						<Form.Item name="aliStatic">
							<Select placeholder="发布状态">
								{aliStatic &&
									aliStatic.map(item => {
										return (
											<Option value={item.key} key={item.key}>
												{item.value}
											</Option>
										)
									})}
							</Select>
						</Form.Item>
						<Form.Item name="isCheck">
							<Select placeholder="访问状态">
								<Option value="">全部</Option>
								<Option value={1}>正常</Option>
								<Option value={2}>禁止</Option>
							</Select>
						</Form.Item>
						<Form.Item name="valueAddedService">
							<Select placeholder="增值服务">
								<Option value="">全部</Option>
								<Option value={4}>VR带看</Option>
							</Select>
						</Form.Item>
						<Form.Item name="startTime">
							<DatePicker placeholder="开始时间" />
						</Form.Item>
						<Form.Item name="endTime">
							<DatePicker placeholder="结束时间" />
						</Form.Item>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								搜索
							</Button>
						</Form.Item>
						<Form.Item>
							<Button type="default" htmlType="reset" onClick={resetSearchFrom}>
								重置
							</Button>
						</Form.Item>
					</Input.Group>
				</Form.Item>
			</Form>
		</div>
	)
}

export default tableSearch
