import React, { Suspense, useCallback, useEffect, useState } from "react"
import { Row, Col, Input, Select, DatePicker, Button, Form, InputNumber, Cascader, TreeSelect } from "antd"
import { Store } from "antd/lib/form/interface"
import moment from "moment"
import { isArray } from "lodash"
import "./form.search.less"
import { CascaderOptionType } from "antd/lib/cascader"
export interface OptionItem {
	value: any
	txt: string
	children?: any
}

export interface FieldItem {
	name: string
	type: "select" | "treeSelect" | "text" | "date" | "number" | "rangeDate" | "array" | "dateTime" | "cascader"
	title?: string
	data?: OptionItem[] | (() => Promise<OptionItem[]>)
	value?: any
	width?: number
	items?: FieldItem[]
	noStyle?: boolean
	showTime?: boolean
}

interface Props {
	fields: FieldItem[]
	toSearch: (values: Store) => void
	defaultParams?: any
}

const FormSearch: React.FC<Props> = props => {
	const { fields, toSearch, defaultParams = {} } = props
	const [fieldsData, setFieldsData] = useState<FieldItem[]>([])
	const [searchFrom] = Form.useForm()
	const onFinish = useCallback(
		params => {
			const searchParams = { ...defaultParams }
			Object.keys(params)
				.filter(key => !!params[key] || params[key] === 0 || params[key] === false)
				.forEach(key => {
					searchParams[key] = moment.isMoment(params[key]) ? params[key].unix() * 1000 : params[key]
				})
			toSearch && toSearch(searchParams)
		},
		[toSearch]
	)
	const getParamsStr = useCallback((params: any) => {
		const result = {}
		for (const key in params) {
			if (isArray(params[key]) && !moment.isMoment(params[key])) {
				result[key] = ["array"].concat(params[key].map((m: any) => getParamsStr(m))).join(",")
			} else if (moment.isMoment(params[key])) {
				result[key] = moment(params[key]).toISOString()
			} else {
				result[key] = params[key]
			}
		}
		return result
	}, [])

	const mapTree = (list: any[]): any[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.txt, value: m.value }
		})
	}

	const renderFileItem = useCallback((field: FieldItem) => {
		switch (field.type) {
			case "rangeDate":
				const { RangePicker } = DatePicker
				return (
					<Form.Item name={field.name} label={field.title} noStyle={field.noStyle}>
						<RangePicker showTime={field.showTime} />
					</Form.Item>
				)
			case "date":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle}>
						<DatePicker placeholder={field.title} showTime={field.showTime} />
					</Form.Item>
				)
			case "dateTime":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle}>
						<DatePicker placeholder={field.title} showTime={{ defaultValue: moment("00:00:00", "HH:mm:ss") }} />
					</Form.Item>
				)
			case "select":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle} initialValue={field.value}>
						<Select dropdownMatchSelectWidth={false} placeholder={field.title}>
							{(field.data! as OptionItem[]).map(item => (
								<Select.Option key={`${field.name}-${item.value}`} value={item.value}>
									{item.txt}
								</Select.Option>
							))}
						</Select>
					</Form.Item>
				)
			case "treeSelect":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle} initialValue={field.value}>
						<TreeSelect
							showSearch
							treeData={mapTree(field.data! as OptionItem[])}
							dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
							placeholder={field.title}
							allowClear
							treeDefaultExpandAll
						></TreeSelect>
					</Form.Item>
				)
			case "cascader":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle} initialValue={field.value}>
						<Cascader
							options={field.data as CascaderOptionType[]}
							fieldNames={{ label: "txt", value: "value", children: "children" }}
							placeholder={field.title}
						/>
					</Form.Item>
				)
			case "text":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle}>
						<Input placeholder={field.title} style={{ width: field.noStyle ? "50%" : "auto" }} />
					</Form.Item>
				)
			case "number":
				return (
					<Form.Item name={field.name} noStyle={field.noStyle}>
						<InputNumber placeholder={field.title} />
					</Form.Item>
				)
			case "array":
				return (
					<Input.Group compact>
						{field.items?.map(item => (
							<React.Fragment key={item.name}>{renderFileItem({ ...item, noStyle: true })}</React.Fragment>
						))}
					</Input.Group>
				)
		}
	}, [])

	const getData = useCallback((): Promise<FieldItem[]> => {
		return new Promise(async resolve => {
			const transformFields = [...fields]
			for (const key in transformFields) {
				if (transformFields[key].data && typeof transformFields[key].data === "function") {
					const progress = transformFields[key].data as () => Promise<OptionItem[]>
					transformFields[key].data = await progress()
				}
			}
			resolve(transformFields)
		})
	}, [fields])

	const resetSearchFrom = useCallback(() => {
		searchFrom.resetFields()
		const searchParams = { ...defaultParams }
		toSearch && toSearch(searchParams)
	}, [])
	useEffect(() => {
		getData().then(res => {
			setFieldsData(res)
		})
	}, [fields])
	return (
		<Suspense fallback={<>loading...</>}>
			<Form id="FormSearch" form={searchFrom} onFinish={onFinish} autoComplete="off">
				<Row gutter={[10, 3]}>
					{fieldsData.map(field => (
						<Col key={field.name} span={field.width}>
							{renderFileItem(field)}
						</Col>
					))}
					<Col>
						<Form.Item>
							<Button type="primary" htmlType="submit">
								搜索
							</Button>
						</Form.Item>
					</Col>
					<Col>
						<Form.Item>
							<Button type="default" htmlType="reset" onClick={resetSearchFrom}>
								重置
							</Button>
						</Form.Item>
					</Col>
				</Row>
			</Form>
		</Suspense>
	)
}
export default FormSearch
