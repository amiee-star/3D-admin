import React, { useCallback, useEffect, useState } from "react"
import { DatePicker, Row, Col, Select, Button, Table, Tooltip, message } from "antd"
import serviceStatistics from "@/services/service.statistics"
import serviceBusiness from "@/services/service.business"
import EchartsLine from "@/components/echarts/echartsLine"
import { InfoCircleOutlined } from "@ant-design/icons"
import EchartsBarH from "@/components/echarts/echartsBarH"
import moment, { Moment } from "moment"
import CountUp from "react-countup"
import "./statistics.less"
import {
	seriesListItem,
	tempListItem,
	userListItem,
	countProvinceItem,
	countCountryItem,
	countDeviceItem
} from "@/interfaces/api.interface"
import { SelectValue } from "antd/lib/select"
import serviceScene from "@/services/service.scene"
import VisitData from "@/components/statistics/visitData"
import ProvincialDistribution from "@/components/statistics/provincialDistribution"
import TerminalDistribution from "@/components/statistics/terminalDistribution"
import { ColumnType } from "antd/es/table/interface"
import { ColumnsType } from "antd/es/table"
import { PageProps } from "@/interfaces/app.interface"
import proxy from "../../../../../config/proxy"
import qs from "qs"

interface loca {
	id: string
}

interface visitLisItem {
	title: string
	num: number
}

interface citydataItem {
	name: string
	value: number
	ratio: number
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

const headerData: typeListItem[] = [
	{
		label: "用户统计",
		value: 1
	},
	{
		label: "访问统计",
		value: 2
	},
	{
		label: "展厅统计",
		value: 3
	}
]

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

const columns4: ColumnsType = [
	{
		title: "展厅名称",
		dataIndex: "tempName",
		key: "tempName"
	},
	{
		title: "展厅ID",
		dataIndex: "tempId",
		key: "tempId"
	},
	{
		title: "所属用户",
		dataIndex: "nickname",
		key: "nickname"
	},
	{
		title: "访客数（PV）",
		dataIndex: "count",
		key: "count",
		align: "center"
	}
]

const tooltipHandle = () => {
	return (
		<Tooltip title="访客浏览某一页面时所花费的平均时长，页面的停留时长=关闭当前页面的时间-进入本页面的时间。">
			<span style={{ marginRight: "5px" }}>平均访问时长</span>
			<InfoCircleOutlined />
		</Tooltip>
	)
}

let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: { companyId?: string; keyword: string }, callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value.keyword

	function fake() {
		serviceBusiness.searchTopic({ companyId: value?.companyId, keyword: value.keyword }).then(rslt => {
			if (currentValue === value.keyword) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

let timeout2: NodeJS.Timeout
let currentValue2: string

function fetch2(value: { topicId?: string; keyword: string; companyId?: string }, callback: Function) {
	if (timeout2) {
		clearTimeout(timeout2)
		timeout2 = null
	}
	currentValue2 = value.keyword

	function fake() {
		serviceBusiness.getTempList2({ topicId: value?.topicId || "", keyword: value.keyword }).then(rslt => {
			if (currentValue2 === value.keyword) {
				callback(rslt.data)
			}
		})
	}

	timeout2 = setTimeout(fake, 300)
}

const Statistics = (props: PageProps) => {
	const { id: companyId } = props.location.state as loca
	const { RangePicker } = DatePicker
	const [overview, setOverview] = useState<visitLisItem[]>()
	const [overview2, setOverview2] = useState<visitLisItem[]>()
	const [seriesName, setSeriesName] = useState("当日")
	const [active, setActive] = useState(2)
	const [active2, setActive2] = useState(1)
	const [dates, setDates] = useState([])
	const [value, setValue] = useState<any>()
	const [hackValue, setHackValue] = useState<any>([])
	const [selectDate, setSelectDate] = useState<string[]>([])
	const [xaxisData, setXaxisData] = useState<string[]>([])
	const [xaxisData2, setXaxisData2] = useState<string[]>([])
	const [xaxisData3, setXaxisData3] = useState<string[]>([])
	const [seriesData, setSeriesData] = useState<seriesListItem[]>()
	const [seriesData2, setSeriesData2] = useState<seriesListItem[]>()
	const [seriesData3, setSeriesData3] = useState<seriesListItem[]>()
	const [interval, setInterval] = useState(0)
	const [interval2, setInterval2] = useState(0)
	const [interval3, setInterval3] = useState(0)
	const [hallOptions, setHallOptions] = useState<tempListItem[]>([])
	const [topicId, setTopicId] = useState<any>()
	const [userOptions, setUserOptions] = useState<userListItem[]>([])
	const [tempId, setTempId] = useState<any>()
	const [todayCount, setTodayCount] = useState(0)
	const [allCount, setAllCount] = useState(0)
	const [provinceData, setProvinceData] = useState<countProvinceItem[]>([])
	const [citydata, setCityData] = useState<citydataItem[]>([])
	const [countryData, setCountryData] = useState<countCountryItem[]>([])
	const [deviceChartData, setDeviceChartData] = useState<deviceChartDataItem[]>([])
	const [deviceData, setDeviceData] = useState<countDeviceItem[]>([])
	const [salvProData, setSalvProData] = useState([])
	const [accessTime, setAccessTime] = useState<countDeviceItem[]>([])
	const [disabled, setDisabled] = useState(false)
	const [flag, setFlag] = useState(false)

	const allParams = {
		companyId,
		obj: tempId,
		queryType: active,
		startTimeStr: selectDate[0] || "",
		endTimeStr: selectDate[1] || "",
		topicId
	}

	const Moment = (v: number) => {
		var d = moment.duration(v, "milliseconds")
		var hours = Math.floor(d.asHours())
		var mins = Math.floor(d.asMinutes()) - hours * 60
		var seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - mins * 60
		return (hours ? hours : "00") + ":" + (mins ? mins : "00") + ":" + (seconds ? seconds : "00")
	}

	const columnsAvg: ColumnType<any>[] = [
		{
			title: tooltipHandle(),
			dataIndex: "avgTime",
			key: "avgTime",
			fixed: "right",
			align: "center",
			render: v => {
				return <>{Moment(v * 1000)}</>
			}
		}
	]

	const updateData = () => {
		if (active2 === 1) {
			getOverview()
			getUserTrendlData()
		} else if (active2 === 2) {
			getCallData()
			getUserTrendlData3()
			getCountProvince()
			getCountCountry()
			getCountDevice()
			getAccessRanking()
			getAccessTime()
		} else if (active2 === 3) {
			getOverview2()
			getUserTrendlData2()
		}
	}

	useEffect(() => {
		if (flag) {
			updateData()
			setFlag(false)
		}
	}, [topicId, tempId, flag])

	useEffect(() => {
		if (active !== 4) {
			updateData()
		}
	}, [active, active2])

	useEffect(() => {
		if (selectDate[0] && selectDate[1] && active == 4) {
			updateData()
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

	useEffect(() => {
		if (xaxisData3 && xaxisData3.length == 24) {
			setInterval3(1)
		} else if (xaxisData3 && xaxisData3.length > 7) {
			setInterval3(parseInt(xaxisData3 && xaxisData3.length / 10))
		} else {
			setInterval3(0)
		}
	}, [xaxisData3])

	useEffect(() => {
		let data: citydataItem[] = []
		provinceData.map(item => {
			data.push({
				name: item.province,
				value: item.countId,
				ratio: item.ratio
			})
		})
		setCityData(data)
	}, [provinceData])

	useEffect(() => {
		let names: string[] = []
		let values: number[] = []
		let data: deviceChartDataItem[] = []
		deviceData.map(item => {
			names.push(item.deviceOS)
			values.push(item.ratio)
			data.push({
				name: item.deviceOS,
				value: item.ratio,
				count: item.countId
			})
		})
		setDeviceChartData(data)
	}, [deviceData])

	//获取访问数据
	const getCallData = () => {
		serviceBusiness.getCallData({ companyId, obj: allParams.obj, topicId: allParams.topicId }).then(res => {
			setTodayCount(res.data?.todayCount)
			setAllCount(res.data?.allCount)
		})
	}

	//获取用户新增趋势
	const getUserTrendlData = () => {
		serviceBusiness.getUserTrendlData(allParams).then(res => {
			setSeriesData(res.data.seriesList)
			setXaxisData(res.data?.xaxisData)
		})
	}
	//获取展厅新增/发布趋势
	const getUserTrendlData2 = () => {
		serviceBusiness.getUserTrendlData2(allParams).then(res => {
			setSeriesData2(res.data.seriesList)
			setXaxisData2(res.data?.xaxisData)
		})
	}

	//获取展厅新增/发布趋势
	const getUserTrendlData3 = () => {
		serviceBusiness.getUserTrendlData3(allParams).then(res => {
			setSeriesData3(res.data.seriesList)
			setXaxisData3(res.data?.xaxisData)
		})
	}

	//获取省级分布数据
	const getCountProvince = () => {
		serviceBusiness.getCountProvince(allParams).then(res => {
			setProvinceData(res.data)
		})
	}

	//获取国家分布数据
	const getCountCountry = () => {
		serviceBusiness.getCountCountry(allParams).then(res => {
			setCountryData(res.data)
		})
	}

	//获取终端分布数据
	const getCountDevice = () => {
		serviceBusiness.getCountDevice(allParams).then(res => {
			setDeviceData(res.data)
		})
	}

	//获取展厅访问榜单
	const getAccessRanking = () => {
		serviceBusiness.getAccessRanking(allParams).then(res => {
			setSalvProData(res.data)
		})
	}

	//获取展厅访问时长
	const getAccessTime = () => {
		serviceBusiness.getAccessTime(allParams).then(res => {
			setAccessTime(res.data)
		})
	}

	const exportProvincialHandle = () => {
		let params = {
			obj: tempId,
			queryType: active,
			startTimeStr: selectDate[0],
			endTimeStr: selectDate[1],
			topicId,
			companyId
		}
		window.open(`${proxy.api[API_ENV]}/v1/m/statistics/export/getCountProvinceExport?${qs.stringify(params)}`)
	}

	const exportCountryHandle = () => {
		let params = {
			obj: tempId,
			queryType: active,
			startTimeStr: selectDate[0],
			endTimeStr: selectDate[1],
			topicId,
			companyId
		}
		window.open(`${proxy.api[API_ENV]}/v1/m/statistics/export/getCountCountryExport?${qs.stringify(params)}`)
	}

	const getOverview = () => {
		serviceBusiness.getUser({ companyId, topicId: allParams.topicId }).then(res => {
			let visitLis: visitLisItem[] = [
				{
					title: "近一周新增用户",
					num: res.data.userCount
				},
				{
					title: "总用户数",
					num: res.data.allUserCount
				}
			]
			setOverview(visitLis)
		})
	}

	const getOverview2 = () => {
		serviceBusiness.getUser2({ companyId, topicId: allParams.topicId }).then(res => {
			let visitLis: visitLisItem[] = [
				{
					title: "已发布展厅数",
					num: res.data.publishCount
				},
				{
					title: "总展厅数",
					num: res.data.tempCount
				}
			]
			setOverview2(visitLis)
		})
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

	const handleSearch = (value: string) => {
		if (value) {
			let obj = {
				companyId,
				keyword: value
			}
			fetch(obj, (data: userListItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}

	const handleSearch2 = (value: string) => {
		if (value) {
			let obj = {
				keyword: value,
				companyId,
				topicId
			}
			if (obj.topicId) {
				fetch2(obj, (data: tempListItem[]) => {
					setHallOptions(data)
					setDisabled(false)
				})
			} else {
				setDisabled(true)
			}
		} else {
			setHallOptions([])
			setDisabled(false)
		}
	}

	//输入用户名称
	const userNameChange = (val: SelectValue) => {
		setTopicId(val)
	}

	const tempIdChange = (val: SelectValue) => {
		setTempId(val)
	}

	//搜索事件
	const searchHandle = () => {
		updateData()
	}

	//重置事件
	const reactHandle = () => {
		setActive(2)
		setSelectDate(["", ""])
		setHackValue([])
		setDates([])
		setUserOptions([])
		setHallOptions([])
		setTopicId(undefined)
		setTempId(undefined)
		setFlag(true)
	}

	return (
		<div className="userStatistics">
			<Row className="header">
				<Col>
					<ul>
						{headerData.map(item => {
							return (
								<li
									key={item.value}
									onClick={() => selectTimeHandle2(item.value)}
									className={item.value == active2 ? "active" : ""}
								>
									{item.label}
								</li>
							)
						})}
					</ul>
				</Col>
			</Row>
			<Row className="searchBox">
				<Col>
					<div className="topic">
						<Select
							showSearch
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							onSearch={handleSearch}
							onChange={userNameChange}
							notFoundContent={null}
							allowClear={true}
							value={topicId}
							placeholder="请输入主题名称"
						>
							{userOptions &&
								userOptions.map(d => (
									<Select.Option key={d.id} value={d.id}>
										{d.name}
									</Select.Option>
								))}
						</Select>
						{active2 === 2 && disabled && <p className="red">请输入主题名称</p>}
					</div>

					{active2 === 2 && (
						<Select
							className="tempIdName"
							showSearch
							defaultActiveFirstOption={false}
							showArrow={false}
							filterOption={false}
							onSearch={handleSearch2}
							onChange={tempIdChange}
							notFoundContent={null}
							allowClear={true}
							value={tempId}
							placeholder="请输入展厅id或名称"
						>
							{hallOptions &&
								hallOptions.map(d => (
									<Select.Option key={d.id} value={d.id}>
										{d.tempName}
									</Select.Option>
								))}
						</Select>
					)}
					<Button type="primary" onClick={searchHandle} disabled={disabled}>
						搜 索
					</Button>
					<Button onClick={reactHandle}>重 置</Button>
				</Col>
				<Col>
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
				</Col>
			</Row>
			<div className="main">
				{active2 === 1 && (
					<div className="content content1">
						<div className="left">
							<h4 className="title">用户总览</h4>
							<p className="update">
								<InfoCircleOutlined />
								数据更新至{moment().format("YYYY-MM-DD HH:mm:ss")}
							</p>
							{overview &&
								overview.map(item => {
									return (
										<div className="box" key={item.title}>
											<p>{item.title}</p>
											<CountUp className="num" start={0} end={item.num} duration={2} redraw={true} separator="," />
										</div>
									)
								})}
						</div>
						<div className="right">
							<div className="header">
								<h4 className="title">用户新增趋势</h4>
							</div>
							<EchartsLine
								seriesData={seriesData}
								xaxisData={xaxisData}
								interval={interval}
								seriesName={seriesName}
								seriesAllName="新增用户"
								height={430}
							/>
						</div>
					</div>
				)}

				{active2 === 2 && (
					<>
						<VisitData
							todayCount={todayCount}
							allCount={allCount}
							xaxisData={xaxisData3}
							seriesData={seriesData3}
							interval={interval3}
							seriesName={seriesName}
						/>
						<ProvincialDistribution
							provinceData={provinceData}
							citydata={citydata}
							exportProvincialHandle={exportProvincialHandle}
							exportCountryHandle={exportCountryHandle}
							countryData={countryData}
						/>
						<TerminalDistribution deviceChartData={deviceChartData} deviceData={deviceData} />
						<div className="list-box">
							<h4 className="title">
								展厅访问榜单
								<InfoCircleOutlined />
								<span>最多显示访问量前十的展厅</span>
							</h4>
							<div className="echarts">
								<EchartsBarH xaxisData={salvProData} />
							</div>
						</div>
						<div className="visit-length">
							<h4 className="title">展厅访问时长</h4>
							<div className="echarts">
								<Table
									dataSource={accessTime}
									columns={columns4.concat(columnsAvg)}
									pagination={false}
									scroll={{ y: 400 }}
									rowKey={(row: countDeviceItem) => row.countId}
								/>
							</div>
						</div>
					</>
				)}

				{active2 === 3 && (
					<div className="content content2">
						<div className="left">
							<h4 className="title">展厅总览</h4>
							<p className="update">
								<InfoCircleOutlined />
								数据更新至{moment().format("YYYY-MM-DD HH:mm:ss")}
							</p>
							{overview2 &&
								overview2.map(item => {
									return (
										<div className="box" key={item.title}>
											<p>{item.title}</p>
											<CountUp className="num" start={0} end={item.num} duration={2} redraw={true} separator="," />
										</div>
									)
								})}
						</div>
						<div className="right">
							<div className="header">
								<h4 className="title">展厅新增/发布趋势</h4>
							</div>
							<EchartsLine
								seriesData={seriesData2}
								xaxisData={xaxisData2}
								interval={interval2}
								seriesName={seriesName}
								seriesAllName="新增/发布展厅"
								height={430}
							/>
						</div>
					</div>
				)}
			</div>
		</div>
	)
}
Statistics.title = "统计报表"
Statistics.menu = false
export default Statistics
