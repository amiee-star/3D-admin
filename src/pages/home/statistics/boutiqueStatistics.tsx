import React, { useEffect, useState, useRef } from "react"
import { Row, Col, DatePicker, Table, Select, Tooltip } from "antd"
import EchartsLine from "@/components/echarts/echartsLine"
import EchartsPie from "@/components/echarts/echartsPie"
import ListTable from "@/components/utils/list.table"
import serviceStatistics from "@/services/service.statistics"
import { returnColumnFields } from "@/utils/column.fields"
import { InfoCircleOutlined } from "@ant-design/icons"
import { ColumnType } from "antd/es/table/interface"
import { ColumnsType } from "antd/es/table"
import proxy from "../../../../config/proxy"
import moment, { Moment } from "moment"
import "./boutiqueStatistics.less"
import { seriesListItem, rankingListItem } from "@/interfaces/api.interface"

interface deviceChartDataItem {
	name: string
	value: number
	value2: number
	count: number
	count2: number
}

const BoutiqueStatistics = () => {
	const { RangePicker } = DatePicker
	const [year, setYear] = useState(moment().format("YYYY"))
	const [month, setMonth] = useState("全部")
	const [params, setParams] = useState({ year: moment().format("YYYY") })
	const [seriesName, setSeriesName] = useState("当日")
	const [active, setActive] = useState(2)
	const [dates, setDates] = useState([])
	const [typeRatio, setTypeRatio] = useState(3)
	const [hackValue, setHackValue] = useState<any>([])
	const [value, setValue] = useState<any>()
	const [selectDate, setSelectDate] = useState<string[]>([])
	const [xaxisData, setXaxisData] = useState<string[]>([])
	const [seriesData, setSeriesData] = useState<seriesListItem[]>()
	const [deviceChartData, setDeviceChartData] = useState<deviceChartDataItem[]>([])
	const [interval, setInterval] = useState(0)
	const withParams = useRef<any>()
	const yearList: string[] = [moment().format("YYYY")]
	for (var i = 1; i <= 20; i++) {
		if (moment().subtract(i, "years").valueOf() >= moment().subtract(4, "years").valueOf()) {
			yearList.push(moment().subtract(i, "years").format("YYYY"))
		}
	}
	const monthList: string[] = ["全部", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"]
	const [columns] = useState<ColumnsType>([
		{
			title: () => {
				return (
					<Select defaultValue={3} onChange={handleChange}>
						<Option value={3}>面积</Option>
						<Option value={1}>行业</Option>
						<Option value={2}>风格</Option>
					</Select>
				)
			},
			dataIndex: "name",
			key: "name",
			align: "center",
			fixed: "left",
			width: 120
		},
		{
			title: "精品模板数量",
			dataIndex: "count2",
			key: "count2",
			align: "center",
			width: 120
		},
		{
			title: "占比",
			dataIndex: "value2",
			key: "value2",
			align: "center",
			width: 80,
			render: (ratio: string) => <span>{ratio + "%"}</span>
		},
		{
			title: "展厅数量",
			dataIndex: "count",
			key: "count",
			align: "center",
			width: 100
		},
		{
			title: "占比",
			dataIndex: "value",
			key: "value",
			align: "center",
			width: 80,
			render: (ratio: string) => <span>{ratio + "%"}</span>
		}
	])
	const { Option } = Select

	const timeData = [
		{
			label: "近一周",
			value: 2
		},
		{
			label: "近一月",
			value: 3
		},
		{
			label: "近一年",
			value: 5
		},
		{
			label: "累计",
			value: 6
		}
	]

	const handleChange = (val: number) => {
		setTypeRatio(val)
	}

	useEffect(() => {
		ratioHandle()
	}, [typeRatio])

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		if (active !== 4) {
			getBoutiqueAdds()
		}
	}, [active])

	useEffect(() => {
		if (selectDate[0] && selectDate[1] && active == 4) {
			getBoutiqueAdds()
		}
	}, [active, selectDate])

	useEffect(() => {
		if (xaxisData && xaxisData.length == 24) {
			setInterval(1)
		} else if (xaxisData && xaxisData.length > 7) {
			setInterval(parseInt(xaxisData && xaxisData.length / 10))
		} else {
			setInterval(0)
		}
	}, [xaxisData])

	const disabledDate = (current: any) => {
		if (!dates || (dates && dates.length === 0)) {
			current > moment().endOf("day")
		}
		if (dates) {
			const tooLate = dates[0] && current.diff(dates[0], "days") > 60
			const tooEarly = dates[1] && dates[1].diff(current, "days") > 60
			return tooEarly || tooLate || current > moment().endOf("day")
		}
	}

	//选择日历
	const calendarHandle = (val: React.SetStateAction<[Moment, Moment]>, dates: React.SetStateAction<string[]>) => {
		if (dates[0] && dates[1]) {
			setActive(4)
		} else {
			setActive(2)
		}
		setSelectDate(dates)
		setDates(val)
		setSeriesName("当日")
		setValue(val)
	}

	const onOpenChange = (open: Boolean) => {
		if (open) {
			setHackValue([])
			setDates([])
		} else {
			setHackValue(undefined)
		}
	}

	const selectTimeHandle = (val: number) => {
		if (val == 1) {
			setSeriesName("时段")
		} else if (val == 2 || val == 3) {
			setSeriesName("当日")
		} else if (val == 4 || val == 5 || val == 6) {
			setSeriesName("当月")
		}
		setActive(val)
		setSelectDate(["", ""])
		setHackValue([])
		setDates([])
	}

	const yearChange = (value: string) => {
		setYear(value)
		let params = {
			year: value,
			month: month == "全部" ? null : month
		}
		setParams(params)
	}

	const monthChange = (value: string) => {
		setMonth(value)
		let params = {
			year: year,
			month: value == "全部" ? null : value
		}
		setParams(params)
	}

	//获取精品模板新增趋势
	const getBoutiqueAdds = () => {
		let params = {
			queryType: active,
			startTimeStr: selectDate[0] || "",
			endTimeStr: selectDate[1] || ""
		}
		serviceStatistics.getBoutiqueAdds(params).then(res => {
			setSeriesData(res.data?.seriesList)
			setXaxisData(res.data?.xaxisData)
		})
	}

	//获取饼状图数据
	const ratioHandle = () => {
		serviceStatistics.getBoutiqueRatioData({ typeRatio: typeRatio }).then(res => {
			let data: deviceChartDataItem[] = []
			res.data.map(item => {
				data.push({
					name: item.name,
					value: item.ratio,
					value2: item.ratioTwo,
					count: item.count,
					count2: item.countTwo
				})
			})
			setDeviceChartData(data)
		})
	}

	//单击行
	const rowClick = (record: rankingListItem) => {
		window.open(`${proxy.templateUrl[API_ENV]}/sceneFront/index.html?G_TEMP_ID=${record.id}`)
	}

	const boutiqueNameColumns: ColumnType<any>[] = [
		{
			title: "精品模板名称&ID",
			dataIndex: "name",
			key: "name",
			fixed: "left",
			width: 200,
			align: "center",
			render: (v, item) => {
				return (
					<div onClick={rowClick.bind(this, item)}>
						<p>{v}</p>
						<p>{item.id}</p>
					</div>
				)
			}
		}
	]

	const countColumns: ColumnType<any>[] = [
		{
			title: "创建展厅数(个)",
			dataIndex: "count",
			key: "count",
			width: 110,
			align: "center",
			ellipsis: true
		}
	]

	return (
		<div className="boutiqueStatistics">
			<Row className="center" gutter={10}>
				<Col>
					<div className="left">
						<div className="header">
							<h4 className="title">
								精品模板榜单
								<Tooltip title="创建展厅数前十的精品模板">
									<InfoCircleOutlined />
								</Tooltip>
							</h4>
							<div className="date">
								<Select defaultValue={moment().format("YYYY")} style={{ width: 120 }} onChange={yearChange}>
									{yearList.map(item => {
										return (
											<Option key={item} value={item}>
												{item}
											</Option>
										)
									})}
								</Select>
								<Select defaultValue="全部" style={{ width: 120 }} onChange={monthChange}>
									{monthList.map(item => {
										return (
											<Option key={item} value={item}>
												{item == "全部" ? item : item + "月"}
											</Option>
										)
									})}
								</Select>
							</div>
						</div>
						<ListTable
							id="boutique-table"
							searchParams={params}
							columns={returnColumnFields(["sort", "hallThumbnail"]).concat(boutiqueNameColumns).concat(countColumns)}
							apiService={serviceStatistics.getRankingList}
							pagination={false}
							scroll={{ y: 896 }}
							rowKey={item => item.id}
							// onRow={(record, e) => {
							// 	return {
							// 		onClick: rowClick.bind(this, record, e)
							// 	}
							// }}
						/>
					</div>
				</Col>
				<Col>
					<div className="right">
						<div className="r-t">
							<div className="header">
								<h4 className="title">新增趋势</h4>
								<div className="date">
									<ul>
										{timeData.map(item => {
											return (
												<li
													key={item.value}
													onClick={() => selectTimeHandle(item.value)}
													className={item.value == active ? "active" : ""}
												>
													{item.label}
												</li>
											)
										})}
									</ul>
									<RangePicker
										size="small"
										value={hackValue || value}
										disabledDate={disabledDate}
										onChange={calendarHandle}
										onOpenChange={onOpenChange}
										format="YYYY-MM-DD"
									/>
								</div>
							</div>
							<EchartsLine
								xaxisData={xaxisData}
								seriesData={seriesData}
								interval={interval}
								seriesName={seriesName}
								seriesAllName="新增精品展厅"
							/>
						</div>
						<div className="r-b">
							<h4 className="title">类型占比</h4>
							<div className="terminal-box">
								<div className="echarts">
									<EchartsPie deviceChartData={deviceChartData} isLegend={false} center={"50%"} name={"展厅数量"} />
								</div>
								<div className="table">
									{deviceChartData && (
										<Table
											dataSource={deviceChartData}
											columns={columns}
											pagination={false}
											rowKey={(item: deviceChartDataItem) => item.value}
											scroll={{ y: 220 }}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	)
}

BoutiqueStatistics.title = "精品模板统计"
export default BoutiqueStatistics
