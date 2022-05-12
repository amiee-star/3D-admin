import React, { useEffect, useState } from "react"
import { DatePicker, Row, Tooltip, Spin } from "antd"
import serviceStatistics from "@/services/service.statistics"
import EchartsLine from "@/components/echarts/echartsLine"
import EchartsPie from "@/components/echarts/echartsPie"
import EchartsBar from "@/components/echarts/echartsBar"
import { InfoCircleOutlined } from "@ant-design/icons"
import moment, { Moment } from "moment"
import CountUp from "react-countup"
import "./userStatistics.less"
import { seriesListItem } from "@/interfaces/api.interface"

interface visitLisItem {
	title: string
	num: number
	tooltip?: string
}

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

interface typeListItem {
	label: string
	value: number
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

const tempType: typeListItem[] = [
	{
		label: "全部展厅",
		value: 1
	},
	{
		label: "已发布展厅",
		value: 2
	}
]

const UserStatistics = () => {
	const { RangePicker } = DatePicker
	const [overview, setOverview] = useState<visitLisItem[]>()
	const [userOverview, setUserOverview] = useState<visitLisItem[]>()
	const [seriesName, setSeriesName] = useState("当日")
	const [active, setActive] = useState(2)
	const [active2, setActive2] = useState(1)
	const [dates, setDates] = useState([])
	const [value, setValue] = useState<any>()
	const [hackValue, setHackValue] = useState<any>([])
	const [selectDate, setSelectDate] = useState<string[]>([])
	const [xaxisData, setXaxisData] = useState<string[]>([])
	const [xaxisData2, setXaxisData2] = useState<string[]>([])
	const [seriesData, setSeriesData] = useState<seriesListItem[]>()
	const [publishSeriesData2, setPublishSeriesData2] = useState<number[]>([])
	const [allSeriesData2, setAllSeriesData2] = useState<number[]>([])
	const [interval, setInterval] = useState(0)
	const [loading, setLoading] = useState(false)
	const [deviceChartData, setDeviceChartData] = useState<deviceChartDataItem[]>([])
	const allParams = {
		queryType: active,
		startTimeStr: selectDate[0] || "",
		endTimeStr: selectDate[1] || ""
	}

	useEffect(() => {
		if (active !== 4) {
			getUserTrendlData()
			getOverview()
			ratioHandle()
			getUserTemp()
		}
	}, [active])

	useEffect(() => {
		getUserTemp()
	}, [active2])

	useEffect(() => {
		if (selectDate[0] && selectDate[1] && active == 4) {
			getUserTrendlData()
			getOverview()
			ratioHandle()
			getUserTemp()
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

	//获取展厅新增趋势
	const getUserTrendlData = () => {
		serviceStatistics.getUserTrendlData(allParams).then(res => {
			setSeriesData(res.data.seriesList)
			setXaxisData(res.data?.xaxisData)
		})
	}

	//获取用户展厅数量分布
	const getUserTemp = () => {
		serviceStatistics.getUserTemp(Object.assign(allParams, { tempType: active2 })).then(res => {
			if (res.data?.xaxisData) setXaxisData2(res.data?.xaxisData)
			if (res.data?.seriesList) setPublishSeriesData2(res.data?.seriesList[0].seriesData)
			if (res.data?.seriesList) setAllSeriesData2(res.data?.seriesList[1].seriesDataBig)
		})
	}

	const getOverview = async () => {
		setLoading(true)
		let res = await serviceStatistics.getUser(allParams)
		let res2 = await serviceStatistics.getUser2(allParams)
		let visitLis: visitLisItem[] = [
			{
				title: "注册率",
				num: res2.data.registerRate,
				tooltip: "注册率=注册用户数÷平台访问UV"
			},
			{
				title: "建展率",
				num: res.data.userTempRate,
				tooltip: "建展率=已创建展厅的用户数÷注册用户数"
			},
			{
				title: "布展率",
				num: res.data.userExtRate,
				tooltip: "布展率=已创建展厅并布展的用户数÷已创建展厅的用户数"
			},
			{
				title: "发布率",
				num: res.data.userPublishRate,
				tooltip: "建展用户发布率=已发布展厅的用户数÷已创建展厅的用户数"
			}
		]
		setOverview(visitLis)
		let visitLis2: visitLisItem[] = [
			{
				title: "平台访客数(UV)",
				num: res2.data.visitorCount,
				tooltip: "百度统计实时数据"
			},
			{
				title: "总用户数",
				num: res.data.userCount,
				tooltip: "平台所有用户"
			},
			{
				title: "建展用户数",
				num: res.data.userTempCount,
				tooltip: "平台所有创建展厅的用户数"
			},
			{
				title: "布展用户数",
				num: res.data.userExtCount,
				tooltip: "展厅中布置超过1个素材的用户"
			},
			{
				title: "发布用户数",
				num: res.data.userPublishCount,
				tooltip: "已发布展厅的用户"
			}
		]
		setUserOverview(visitLis2)
		setLoading(false)
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

	const selectTimeHandle2 = (val: number) => {
		setActive2(val)
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

	//获取饼状图数据
	const ratioHandle = () => {
		serviceStatistics.getUserRatio(allParams).then(res => {
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

	return (
		<div className="userStatistics">
			<Spin spinning={loading}>
				<Row className="header">
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
						value={hackValue || value}
						disabledDate={disabledDate}
						onChange={calendarHandle}
						onOpenChange={onOpenChange}
						format="YYYY-MM-DD"
					/>
				</Row>
				<div className="main">
					<div className="content userContent">
						<h4 className="title">用户总览</h4>
						<ul className="userOverview">
							{userOverview &&
								userOverview.map((item, index) => {
									return (
										<li key={index}>
											<p>
												{item.title}
												<Tooltip title={item.tooltip}>
													<InfoCircleOutlined />
												</Tooltip>
											</p>
											<CountUp className="num" start={0} end={item.num} duration={2} redraw={true} separator="," />
										</li>
									)
								})}
						</ul>
					</div>
					<div className="content">
						<div className="left">
							<h4 className="title">用户转化指标</h4>
							<p className="update">
								<InfoCircleOutlined />
								数据更新至{moment().format("YYYY-MM-DD HH:mm:ss")}
							</p>
							<div className="userIndicators">
								{overview &&
									overview.map(item => {
										return (
											<div className="box" key={item.title}>
												<p>
													{item.title}
													<Tooltip title={item.tooltip}>
														<InfoCircleOutlined />
													</Tooltip>
												</p>
												<CountUp
													className="num"
													start={0}
													end={item.num}
													duration={2}
													useEasing={true}
													separator=","
													decimals={2}
													decimal="."
													suffix="%"
												/>
											</div>
										)
									})}
							</div>
						</div>
						<div className="right">
							<h4 className="title">用户新增趋势</h4>
							<EchartsLine
								seriesData={seriesData}
								xaxisData={xaxisData}
								interval={interval}
								seriesName={seriesName}
								seriesAllName="新增用户"
							/>
						</div>
					</div>
					<div className="content" style={{ marginBottom: 0 }}>
						<div className="left">
							<h4 className="title">用户类型占比</h4>
							<div className="echarts">
								<EchartsPie
									deviceChartData={deviceChartData}
									isLegend={true}
									center={"32%"}
									radius={["40%", "53%"]}
									name={"用户数量"}
								/>
							</div>
						</div>
						<div className="right">
							<div className="sm-header">
								<h4 className="title">用户展厅数量分布</h4>
								<ul>
									{tempType.map(item => {
										return (
											<li
												key={item.label}
												onClick={() => selectTimeHandle2(item.value)}
												className={item.value == active2 ? "active" : ""}
											>
												{item.label}
											</li>
										)
									})}
								</ul>
							</div>
							<EchartsBar
								xaxisData={xaxisData2}
								publishSeriesData={publishSeriesData2}
								allSeriesData={allSeriesData2}
							/>
						</div>
					</div>
				</div>
			</Spin>
		</div>
	)
}
UserStatistics.title = "用户统计"
export default UserStatistics
