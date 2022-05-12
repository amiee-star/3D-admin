import React, { useState } from "react"
import { Row } from "antd"
import moment from "moment"
import { InfoCircleOutlined } from "@ant-design/icons"
import EchartsLine from "@/components/echarts/echartsLine"
import echarts from "echarts"
import { EChartOption } from "echarts"
import chinaMap from "@/constant/mapData/china.map"
import { seriesListItem } from "@/interfaces/api.interface"
import CountUp from "react-countup"
import "./visitData.less"
echarts.registerMap("china", chinaMap)

interface props {
	todayCount: number
	allCount: number
	xaxisData: string[]
	seriesData: seriesListItem[]
	interval: number
	seriesName: string
}

const VisitData = (props: props) => {
	const { todayCount, allCount, xaxisData, seriesData, interval, seriesName } = props

	return (
		<Row className="visitCharts">
			<div className="left">
				<h4 className="title">访问量(PV)</h4>
				<p>
					<InfoCircleOutlined />
					数据更新至{moment().format("YYYY-MM-DD HH:mm:ss")}
				</p>
				<div className="box">
					<p>当日访问次数</p>
					<CountUp className="num" start={0} end={todayCount} duration={2} redraw={true} separator="," />
				</div>
				<div className="box">
					<p>累计访问次数</p>
					<CountUp className="num" start={0} end={allCount} duration={2} redraw={true} separator="," />
				</div>
			</div>
			<div className="right">
				<h4 className="title">展厅访问趋势</h4>
				<EchartsLine
					xaxisData={xaxisData}
					seriesData={seriesData}
					interval={interval}
					seriesName={seriesName}
					seriesAllName="访问次数"
				/>
			</div>
		</Row>
	)
}
VisitData.title = "访问统计"
export default VisitData
