import React, { useState } from "react"
import { Row, Col, Table } from "antd"
import echarts from "echarts"
import chinaMap from "@/constant/mapData/china.map"
import { countDeviceItem } from "@/interfaces/api.interface"
import { ColumnsType } from "antd/es/table"
import EchartsPie from "@/components/echarts/echartsPie"
import "./terminalDistribution.less"
echarts.registerMap("china", chinaMap)

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

interface props {
	deviceChartData: deviceChartDataItem[]
	deviceData: countDeviceItem[]
}

const columns: ColumnsType = [
	{
		title: "终端",
		dataIndex: "deviceOS",
		key: "deviceOS",
		align: "left"
	},
	{
		title: "访客数(UV)",
		dataIndex: "countId",
		key: "countId3",
		align: "center"
	},
	{
		title: "占比",
		dataIndex: "ratio",
		key: "ratio3",
		align: "center",
		render: text => <span>{text + "%"}</span>
	}
]

const TerminalDistribution = (props: props) => {
	const { deviceChartData, deviceData } = props

	return (
		<div className="terminalCharts">
			<h4 className="title">终端分布</h4>
			<Row style={{ width: "100%", height: "100%" }}>
				<Col span={5}>
					<EchartsPie
						deviceChartData={deviceChartData}
						isLegend={true}
						center={"40%"}
						name={"访客数(UV)"}
						radius={["50%", "66%"]}
					/>
				</Col>
				<Col span={18} offset={1}>
					{deviceData && (
						<Table
							dataSource={deviceData}
							columns={columns}
							pagination={false}
							rowKey={(row: countDeviceItem) => row.countId}
						/>
					)}
				</Col>
			</Row>
		</div>
	)
}
TerminalDistribution.title = "访问统计"
export default TerminalDistribution
