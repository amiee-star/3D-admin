import { baseRes, PageData } from "@/interfaces/api.interface"
import { PageParams } from "@/interfaces/params.interface"
import { Table } from "antd"
import { TableProps } from "antd/lib/table"
import { ColumnsType, ColumnType } from "antd/lib/table/interface"
import { divide } from "lodash"
import React, { useCallback, useEffect, useState, useRef, useMemo } from "react"

interface apiParams extends PageParams {
	[key: string]: any
}

interface Props extends TableProps<any> {
	columns: ColumnsType<any>
	pageSize?: number
	apiService?: (params: apiParams) => Promise<baseRes<any>>
	searchParams?: any
	transformData?: (data?: any) => any[]
	exportData?: (data?: any) => void
	excludeCol?: string[]
	exportIndex?: (index?: number) => void
	testData?: any
	rowSelection?: any
	aipParam?: any
}
const ListTable: React.FC<Props> = props => {
	const [total, setTotal] = useState(0)
	const pageNum = useRef(1)
	const [loading, setLoading] = useState(false)
	const [data, setData] = useState<any[]>([])
	const {
		columns,
		pageSize = 20,
		apiService,
		searchParams,
		aipParam,
		transformData,
		exportData,
		excludeCol = [],
		exportIndex,
		testData,
		rowSelection,
		...tableProps
	} = props
	const renderColumns = useMemo(() => {
		return excludeCol.length
			? columns.filter((m: ColumnType<any>) => !(m.dataIndex && excludeCol.includes(m.dataIndex.toString())))
			: columns
	}, [columns])
	const pageChange = useCallback(
		(index: number) => {
			pageNum.current = index
			exportIndex && exportIndex(index)
			getData(index)
		},
		[searchParams]
	)
	const getData = useCallback(
		(index: number) => {
			setLoading(true)
			const { pageNum, ...params } = searchParams
			searchParams.pageNum = index
			// const limit = pageSize > 20 ? 20 : pageSize
			// const offset = (index - 1) * (pageSize > 20 ? 20 : pageSize)
			const apiParams = Object.assign(
				{},
				params,
				aipParam,
				tableProps?.pagination === false
					? {}
					: {
							pageNum: index,
							pageSize
					  }
			)
			if (!!apiService) {
				apiService(apiParams)
					.then((res: { code: number; data: { list: any; count: any } }) => {
						if (res.code === 200) {
							exportData && exportData(res.data.list || res.data)

							setData(transformData ? transformData(res.data.list || res.data) : res.data.list || res.data)
							setTotal(res.data.count || 0)
						}
					})
					.finally(() => setLoading(false))
			}
		},
		[searchParams, apiService]
	)
	useEffect(() => {
		if (!searchParams) return
		if ("pageNum" in searchParams) {
			pageNum.current = searchParams.pageNum || 1
		} else {
			pageNum.current = 1
		}
		getData(pageNum.current)
	}, [searchParams])
	useEffect(() => {
		if (!!apiService) getData(1)
	}, [apiService])
	return (
		<>
			{/* 行业管理、分类管理默认树结构展开，需判断table数据有值才能渲染， 否则defaultExpandAllRows不起作用 */}
			<Table
				sticky
				rowKey="id"
				loading={loading}
				size="small"
				columns={renderColumns}
				dataSource={testData || data || tableProps.dataSource}
				scroll={{
					x: "100%",
					y: 490,
					scrollToFirstRowOnChange: true
				}}
				pagination={{
					size: "default",
					position: ["bottomCenter"],
					showQuickJumper: true,
					onChange: pageChange,
					showTotal: v => {
						return <>共{v}条数据</>
					},
					total: total,
					pageSize,
					current: pageNum.current,
					showSizeChanger: false
				}}
				{...tableProps}
				rowSelection={rowSelection}
			/>
		</>
	)
}
export default ListTable
