import React, { useEffect, useState, useMemo } from "react"
import { Row, Col, Button, DatePicker, Table, Select, Tooltip } from "antd"
import moment, { Moment } from "moment"
import "./accessStatistics.less"
import { InfoCircleOutlined } from "@ant-design/icons"
import { ColumnType } from "antd/es/table/interface"
import EchartsBarH from "@/components/echarts/echartsBarH"
import echarts from "echarts"
import chinaMap from "@/constant/mapData/china.map"
import { ColumnsType } from "antd/es/table"
import serviceStatistics from "@/services/service.statistics"
import serviceScene from "@/services/service.scene"
import VisitData from "@/components/statistics/visitData"
import ProvincialDistribution from "@/components/statistics/provincialDistribution"
import TerminalDistribution from "@/components/statistics/terminalDistribution"
import proxy from "../../../../config/proxy"
import {
	countProvinceItem,
	countCountryItem,
	countDeviceItem,
	userListItem,
	tempListItem,
	seriesListItem
} from "@/interfaces/api.interface"
import { SelectValue } from "antd/lib/select"
import qs from "qs"
echarts.registerMap("china", chinaMap)

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

interface citydataItem {
	name: string
	value: number
	ratio: number
}
let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceScene.searchUsers({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data.list)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

let timeout2: NodeJS.Timeout
let currentValue2: string

function fetch2(value: { userId?: string; keyword: string }, callback: Function) {
	if (timeout2) {
		clearTimeout(timeout2)
		timeout2 = null
	}
	currentValue2 = value.keyword

	function fake() {
		serviceStatistics.getTempList({ userId: value?.userId || "", keyword: value.keyword }).then(rslt => {
			if (currentValue2 === value.keyword) {
				callback(rslt.data)
			}
		})
	}

	timeout2 = setTimeout(fake, 300)
}

const AccessStatistics = () => {
	const timeData = [
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
			title: "访客量(PV)",
			dataIndex: "count",
			key: "count",
			align: "center"
		}
	]

	const { RangePicker } = DatePicker
	const [tempId, setTempId] = useState<any>()
	const [userId, setUserId] = useState<any>()
	const [dates, setDates] = useState([])
	const [hackValue, setHackValue] = useState<any>([])
	const [value, setValue] = useState<any>()
	const [selectDate, setSelectDate] = useState<string[]>([])
	const [active, setActive] = useState(2)
	const [todayCount, setTodayCount] = useState(0)
	const [allCount, setAllCount] = useState(0)
	const [xaxisData, setXaxisData] = useState<string[]>([])
	const [seriesData, setSeriesData] = useState<seriesListItem[]>()
	const [provinceData, setProvinceData] = useState<countProvinceItem[]>([])
	const [countryData, setCountryData] = useState<countCountryItem[]>([])
	const [deviceData, setDeviceData] = useState<countDeviceItem[]>([])
	const [accessTime, setAccessTime] = useState<countDeviceItem[]>([])
	const [deviceChartData, setDeviceChartData] = useState<deviceChartDataItem[]>([])
	const [userOptions, setUserOptions] = useState<userListItem[]>([])
	const [hallOptions, setHallOptions] = useState<tempListItem[]>([])
	const [citydata, setCityData] = useState<citydataItem[]>([])
	const [interval, setInterval] = useState(0)
	const [flag, setFlag] = useState(false)
	const [seriesName, setSeriesName] = useState("当日")
	const [salvProData, setSalvProData] = useState([])
	// var salvProValue = [239, 181, 154, 144, 135, 117, 74, 72, 67, 55]
	// var salvProMax: number[] = [] //背景按最大值
	// for (let i = 0; i < salvProValue.length; i++) {
	// 	salvProMax.push(salvProValue[0])
	// }
	const allParams = {
		obj: tempId,
		queryType: active,
		startTimeStr: selectDate[0] || "",
		endTimeStr: selectDate[1] || "",
		userId: userId
	}

	let max = 100
	if (citydata[0]?.value) {
		max = citydata[0]?.value
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

	const updateData = () => {
		getCallData()
		getCallDataBrokenLine()
		getCountProvince()
		getCountCountry()
		getCountDevice()
		getAccessRanking()
		getAccessTime()
	}

	useEffect(() => {
		if (active !== 4 && !flag) {
			updateData()
		}
	}, [active])

	useEffect(() => {
		if (selectDate[0] && selectDate[1] && active == 4 && !flag) {
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

	//获取访问数据
	const getCallData = () => {
		serviceStatistics.getCallData({ obj: allParams.obj, userId: allParams.userId }).then(res => {
			setTodayCount(res.data?.todayCount)
			setAllCount(res.data?.allCount)
		})
	}

	//获取展厅访问趋势
	const getCallDataBrokenLine = () => {
		serviceStatistics.getCallDataBrokenLine(allParams).then(res => {
			setSeriesData(res.data?.seriesList)
			setXaxisData(res.data?.xaxisData)
		})
	}

	//获取省级分布数据
	const getCountProvince = () => {
		serviceStatistics.getCountProvince(allParams).then(res => {
			setProvinceData(res.data)
		})
	}

	//获取国家分布数据
	const getCountCountry = () => {
		serviceStatistics.getCountCountry(allParams).then(res => {
			setCountryData(res.data)
		})
	}

	//获取终端分布数据
	const getCountDevice = () => {
		serviceStatistics.getCountDevice(allParams).then(res => {
			setDeviceData(res.data)
		})
	}

	//获取展厅访问榜单
	const getAccessRanking = () => {
		serviceStatistics.getAccessRanking(allParams).then(res => {
			setSalvProData(res.data)
		})
	}

	//获取展厅访问榜单
	const getAccessTime = () => {
		serviceStatistics.getAccessTime(allParams).then(res => {
			setAccessTime(res.data)
		})
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

	//输入用户名称
	const userNameChange = (val: SelectValue) => {
		setUserId(val)
	}

	const tempIdChange = (val: SelectValue) => {
		setTempId(val)
	}

	//搜索事件
	const searchHandle = () => {
		updateData()
	}
	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, (data: userListItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}

	const handleSearch2 = (value: string) => {
		if (value) {
			let obj = {
				userId: userId,
				keyword: value
			}
			fetch2(obj, (data: tempListItem[]) => {
				setHallOptions(data)
			})
		} else {
			setHallOptions([])
		}
	}
	//重置事件
	const reactHandle = () => {
		setActive(2)
		setSelectDate(["", ""])
		setHackValue([])
		setDates([])
		setUserId(undefined)
		setTempId(undefined)
		setFlag(true)
	}
	useEffect(() => {
		if (flag) {
			updateData()
			setFlag(false)
		}
	}, [userId, tempId, flag])

	const tooltipHandle = () => {
		return (
			<Tooltip title="访客浏览某一页面时所花费的平均时长，页面的停留时长=关闭当前页面的时间-进入本页面的时间。">
				<span style={{ marginRight: "5px" }}>平均访问时长</span>
				<InfoCircleOutlined />
			</Tooltip>
		)
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

	const Moment = (v: number) => {
		var d = moment.duration(v, "milliseconds")
		var hours = Math.floor(d.asHours())
		var mins = Math.floor(d.asMinutes()) - hours * 60
		var seconds = Math.floor(d.asSeconds()) - hours * 60 * 60 - mins * 60
		return (hours ? hours : "00") + ":" + (mins ? mins : "00") + ":" + (seconds ? seconds : "00")
	}

	const exportProvincialHandle = () => {
		let params = {
			obj: tempId,
			queryType: active,
			startTimeStr: selectDate[0],
			endTimeStr: selectDate[1],
			userId: userId
		}
		window.open(`${proxy.api[API_ENV]}/v1/m/template/tbl/event/getCountProvinceExport?${qs.stringify(params)}`)
	}

	const exportCountryHandle = () => {
		let params = {
			obj: tempId,
			queryType: active,
			startTimeStr: selectDate[0],
			endTimeStr: selectDate[1],
			userId: userId
		}
		window.open(`${proxy.api[API_ENV]}/v1/m/template/tbl/event/getCountCountryExport?${qs.stringify(params)}`)
	}

	return (
		<div className="access">
			<Row className="header">
				<Col>
					<Select
						showSearch
						defaultActiveFirstOption={false}
						showArrow={false}
						filterOption={false}
						onSearch={handleSearch}
						onChange={userNameChange}
						notFoundContent={null}
						allowClear={true}
						value={userId}
						placeholder="请输入用户名称"
					>
						{userOptions &&
							userOptions.map(d => (
								<Select.Option key={d.id} value={d.id}>
									{d.username}
								</Select.Option>
							))}
					</Select>
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
					<Button type="primary" onClick={searchHandle}>
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
				<VisitData
					todayCount={todayCount}
					allCount={allCount}
					xaxisData={xaxisData}
					seriesData={seriesData}
					interval={interval}
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
							rowKey={(row: countDeviceItem) => {
								return row.countId
							}}
						/>
					</div>
				</div>
			</div>
		</div>
	)
}
AccessStatistics.title = "访问统计"
export default AccessStatistics
