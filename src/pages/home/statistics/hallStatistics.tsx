import React, { useEffect, useState } from "react"
import { Row, Col, DatePicker, Table, Tooltip } from "antd"
import serviceStatistics from "@/services/service.statistics"
import EchartsLine from "@/components/echarts/echartsLine"
import EchartsPie from "@/components/echarts/echartsPie"
import { InfoCircleOutlined } from "@ant-design/icons"
import { ColumnsType } from "antd/es/table"
import { seriesListItem } from "@/interfaces/api.interface"
import moment, { Moment } from "moment"
import CountUp from "react-countup"
import "./hallStatistics.less"

interface visitLisItem {
	title: string
	num: number
	tooltip: string
}

interface typeListItem {
	label: string
	value: number
}

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

const HallStatistics = () => {
	const { RangePicker } = DatePicker
	const [dates, setDates] = useState([])
	const [hackValue, setHackValue] = useState<any>([])
	const [active, setActive] = useState(2)
	const [typeRatio, setTypeRatio] = useState(4)
	const [columns, setColumns] = useState<ColumnsType>([
		{
			title: "面积",
			dataIndex: "name",
			key: "name",
			align: "left"
		},
		{
			title: "访客数(UV)",
			dataIndex: "count",
			key: "count",
			align: "center"
		},
		{
			title: "占比",
			dataIndex: "value",
			key: "value",
			align: "center",
			render: (text: string) => <span>{text + "%"}</span>
		}
	])
	const [value, setValue] = useState<any>()
	const [overview, setOverview] = useState<visitLisItem[]>()
	const [xaxisData, setXaxisData] = useState<string[]>([])
	const [xaxisData2, setXaxisData2] = useState<string[]>([])
	const [seriesData, setSeriesData] = useState<seriesListItem[]>()
	const [seriesData2, setSeriesData2] = useState<seriesListItem[]>()
	const [interval, setInterval] = useState(0)
	const [interval2, setInterval2] = useState(0)
	const [selectDate, setSelectDate] = useState<string[]>([])
	const [seriesName, setSeriesName] = useState("当日")
	const [deviceChartData, setDeviceChartData] = useState<deviceChartDataItem[]>([])
	const allParams = {
		queryType: active,
		startTimeStr: selectDate[0] || "",
		endTimeStr: selectDate[1] || ""
	}
	const timeData: typeListItem[] = [
		{
			label: "昨日",
			value: 1
		},
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

	const typeList: typeListItem[] = [
		{
			label: "面积",
			value: 4
		},
		{
			label: "来源",
			value: 3
		},
		{
			label: "类型",
			value: 5
		}
		// {
		// 	label: "行业",
		// 	value: 1
		// },
		// {
		// 	label: "风格",
		// 	value: 2
		// }
	]

	useEffect(() => {
		getOverview()
		getTrendlData()
	}, [])

	useEffect(() => {
		ratioHandle()
	}, [typeRatio])

	//获取展厅统计接口
	const getOverview = () => {
		serviceStatistics.getOverviewData().then(res => {
			let visitLis: visitLisItem[] = [
				{
					title: "总展厅数",
					num: res.data.tempCount,
					tooltip: ""
				},
				{
					title: "已发布展厅数",
					num: res.data.publishCount,
					tooltip: "统计“已发布”和“有修改”的展厅"
				},
				{
					title: "未发布展厅数",
					num: res.data.notPublishCount,
					tooltip: "统计“从未发布”和“发布中”的展厅"
				},
				{
					title: "精品模板数",
					num: res.data.boutiqueCount,
					tooltip: ""
				}
			]
			setOverview(visitLis)
		})
	}

	//获取饼状图数据
	const ratioHandle = () => {
		serviceStatistics.getRatioData({ typeRatio: typeRatio }).then(res => {
			let data: deviceChartDataItem[] = []
			res.data.map(item => {
				data.push({
					name: item.name,
					value: item.ratio,
					count: item.count
				})
			})
			setDeviceChartData(data)
		})
	}

	//切换类型
	const selectTypeHandle = (val: number, label: string) => () => {
		setTypeRatio(val)
		let arr: ColumnsType = [
			{
				title: label,
				dataIndex: "name",
				key: "name",
				align: "left"
			},
			{
				title: "展厅数",
				dataIndex: "count",
				key: "count",
				align: "center"
			},
			{
				title: "占比",
				dataIndex: "value",
				key: "value",
				align: "center",
				render: text => <span>{text + "%"}</span>
			}
		]
		setColumns(arr)
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

	//获取展厅新增趋势
	const getTrendlData = () => {
		serviceStatistics.getTrendlData(allParams).then(res => {
			setXaxisData(res.data?.xaxisData)
			setSeriesData(res.data?.seriesList)
		})
	}

	//获取展厅发布趋势
	const getPublishlData = () => {
		serviceStatistics.getPublishlData(allParams).then(res => {
			setXaxisData2(res.data?.xaxisData)
			setSeriesData2(res.data?.seriesList)
		})
	}

	useEffect(() => {
		if (active !== 4) {
			getTrendlData()
			getPublishlData()
		}
	}, [active])

	useEffect(() => {
		if (selectDate[0] && selectDate[1] && active == 4) {
			getTrendlData()
			getPublishlData()
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

	useEffect(() => {
		if (xaxisData2 && xaxisData2.length == 24) {
			setInterval2(1)
		} else if (xaxisData2 && xaxisData2.length > 7) {
			setInterval2(parseInt(xaxisData2 && xaxisData2.length / 10))
		} else {
			setInterval2(0)
		}
	}, [xaxisData2])

	return (
		<div className="hallStatistics">
			<Row className="content" gutter={10}>
				<Col className="left-box">
					<div className="left">
						<div className="visit">
							<h4 className="title">展厅总览</h4>
							<p className="update">
								<InfoCircleOutlined />
								数据更新至{moment().format("YYYY-MM-DD HH:mm:ss")}
							</p>
							<Row gutter={20}>
								{overview &&
									overview.map((item, index) => {
										return (
											<Col span={6} key={item.title}>
												<div className="box">
													<p>
														{item.title}
														{(index == 1 || index == 2) && (
															<Tooltip title={item.tooltip}>
																<InfoCircleOutlined />
															</Tooltip>
														)}
													</p>
													<CountUp className="num" start={0} end={item.num} duration={2} redraw={true} separator="," />
												</div>
											</Col>
										)
									})}
							</Row>
						</div>
						<div className="bar">
							<h4 className="title">类型占比</h4>
							<ul>
								{typeList.map(item => {
									return (
										<li
											key={item.label}
											onClick={selectTypeHandle(item.value, item.label)}
											className={typeRatio == item.value ? "active" : ""}
										>
											{item.label}
										</li>
									)
								})}
							</ul>
							<div className="terminal-box">
								<div className="echarts">
									<EchartsPie deviceChartData={deviceChartData} isLegend={false} center={"50%"} name={"展厅数"} />
								</div>
								<div className="table">
									{deviceChartData && (
										<Table
											dataSource={deviceChartData}
											columns={columns}
											pagination={false}
											rowKey={(row: deviceChartDataItem) => row.name}
											scroll={{ y: 220 }}
										/>
									)}
								</div>
							</div>
						</div>
					</div>
				</Col>
				<Col className="right-box">
					<div className="right">
						<div className="header">
							<ul>
								{timeData.map(item => {
									return (
										<li
											key={item.label}
											onClick={() => selectTimeHandle(item.value)}
											className={item.value == active ? "active" : ""}
										>
											{item.label}
										</li>
									)
								})}
							</ul>
							<RangePicker
								value={hackValue || value}
								disabledDate={disabledDate}
								onChange={calendarHandle}
								onOpenChange={onOpenChange}
								format="YYYY-MM-DD"
							/>
						</div>
						<div className="adds">
							<h4 className="title">新增趋势</h4>
							<EchartsLine
								xaxisData={xaxisData}
								seriesData={seriesData}
								interval={interval}
								seriesName={seriesName}
								seriesAllName="新增展厅"
							/>
						</div>
						<div className="adds publish">
							<h4 className="title">发布趋势</h4>
							<EchartsLine
								xaxisData={xaxisData2}
								seriesData={seriesData2}
								interval={interval2}
								seriesName={seriesName}
								seriesAllName="发布展厅"
							/>
						</div>
					</div>
				</Col>
			</Row>
		</div>
	)
}

HallStatistics.title = "展厅统计"
export default HallStatistics
