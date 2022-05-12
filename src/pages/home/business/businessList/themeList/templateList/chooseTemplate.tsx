import React, { useCallback, useEffect, useState } from "react"
import { Button, Col, Row, Tabs } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceSystem from "@/services/service.business"
import { ColumnType } from "antd/es/table/interface"
import { CheckCircleOutlined } from "@ant-design/icons"
import { addTheme } from "@/interfaces/params.interface"
import { PageProps } from "@/interfaces/app.interface"
import { bestTemp } from "@/interfaces/api.interface"

interface loca {
	topicId: string
	companyId: string
}

const businessTempList = (props: PageProps) => {
	const { topicId, companyId } = props.location.state as loca
	const [params, setParams] = useState({ companyId })
	const [chooseList, setChooseList] = useState([])
	const [disList, setDisList] = useState([])
	const [keyList, setKeyList] = useState([])
	const [tabKey, setTabKey] = useState(1)
	const { TabPane } = Tabs
	useEffect(() => {
		serviceSystem.topicTempList({ pageNum: 1, pageSize: 100, topicId }).then(res => {
			if (res.code === 200) {
				const arr: string[] = []
				res.data.list.forEach(item => {
					arr.push(item.tempId)
				})
				setKeyList(arr)
				setDisList(arr)
			}
		})
	}, [])
	const cancelChoose = (item: addTheme) => () => {
		const arr: [] = JSON.parse(JSON.stringify(chooseList))
		const arr1: [] = JSON.parse(JSON.stringify(keyList))
		const index = arr.findIndex((val: addTheme) => {
			return val.id === item.id
		})
		const index1 = arr1.findIndex((val: string) => {
			return val === item.id
		})
		arr.splice(index, 1)
		arr1.splice(index1, 1)
		setChooseList(arr)
		setKeyList(arr1)
	}
	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			fixed: "right",
			width: 60,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
							{/*<CloseCircleOutlined />*/}
							<CheckCircleOutlined onClick={cancelChoose(item)} />
						</a>
					</>
				)
			}
		}
	]

	const tabChange = useCallback(
		index => {
			setTabKey(index)
		},
		[tabKey]
	)

	const sure = () => {
		serviceSystem
			.tempAdd({
				topicId,
				topicTempList: chooseList
			})
			.then(res => {
				if (res.code === 200) {
					history.back()
				}
			})
	}
	const cancel = () => {
		history.back()
	}

	const onSelectAll = useCallback(
		(selected, selectedRows) => {
			if (selected) {
				let ids: string[] = []
				let items: any[] = []
				selectedRows.map((item: any) => {
					if (item?.id && !disList.includes(item.id)) {
						items.push(item)
					}
					if (item?.id) {
						ids.push(item.id)
					}
				})
				setChooseList(items)
				setKeyList(ids)
			} else {
				setChooseList([])
				setKeyList(disList)
			}
		},
		[chooseList, keyList, disList]
	)

	const selectchange = useCallback(
		row => {
			const arr = JSON.parse(JSON.stringify(chooseList))
			const arr1 = JSON.parse(JSON.stringify(keyList))
			if (!arr1.includes(row.id)) {
				arr1.push(row.id)
				arr.push(row)
				setChooseList(arr)
				setKeyList(arr1)
			} else {
				cancelChoose(row)()
			}
		},
		[chooseList, keyList]
	)

	const rowSelection = {
		onSelect: selectchange,
		onSelectAll: onSelectAll,
		selectedRowKeys: keyList,
		getCheckboxProps: (record: bestTemp) => ({
			disabled: disList.some(item => {
				return item === record.id
			})
		})
	}

	return (
		<Row className="data-form full">
			<Col span={11} className="form-result">
				<Tabs defaultActiveKey="1" onChange={tabChange}>
					<TabPane tab="平台精品模板库" key="1"></TabPane>
					<TabPane tab="企业专属模板库" key="2"></TabPane>
				</Tabs>
				<Col className="form-search" span={24}>
					<FormSearch
						fields={returnSearchFiels(tabKey == 1 ? ["keyword", "typeId", "styleId", "area"] : ["keyword", "area"])}
						defaultParams={{ companyId }}
						toSearch={setParams}
					/>
				</Col>
				<ListTable
					rowSelection={{ type: "selectionType", ...rowSelection }}
					searchParams={params}
					columns={returnColumnFields(["hallThumbnail", "hallName", "validSz"])}
					apiService={serviceSystem[tabKey == 1 ? "selectBoutiqueList" : "selectCompanyTempList"]}
					pagination={false}
				/>
			</Col>
			<Col span={1} />
			<Col span={11} className="form-result">
				<p>已添加{chooseList.length}个模板</p>
				<ListTable
					showHeader={false}
					columns={returnColumnFields(["hallThumbnail", "tempName", "validSz"]).concat(columns)}
					testData={chooseList}
					pagination={false}
				/>
				<Col className="flex-end" style={{ marginTop: "15px" }}>
					<Button style={{ marginRight: "10px" }} onClick={cancel}>
						取消
					</Button>
					<Button type="primary" onClick={sure}>
						保存
					</Button>
				</Col>
			</Col>
		</Row>
	)
}

businessTempList.title = "添加模板"
businessTempList.menu = false
export default businessTempList
