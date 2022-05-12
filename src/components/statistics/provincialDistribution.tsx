import React, { useState, useMemo, useEffect } from "react"
import { Row, Col, Button, Table } from "antd"
import moment from "moment"
import { InfoCircleOutlined } from "@ant-design/icons"
import EchartsLine from "@/components/echarts/echartsLine"
import echarts from "echarts"
import { EChartOption } from "echarts"
import chinaMap from "@/constant/mapData/china.map"
import { seriesListItem, countProvinceItem, countCountryItem } from "@/interfaces/api.interface"
import ReactEcharts from "@/components/ReactEcharts/react.echarts"
import { ColumnsType } from "antd/es/table"
import CountUp from "react-countup"
import "./provincialDistribution.less"
echarts.registerMap("china", chinaMap)

interface citydataItem {
	name: string
	value: number
	ratio: number
}

interface props {
	provinceData: countProvinceItem[]
	citydata: citydataItem[]
	exportProvincialHandle: () => void
	exportCountryHandle: () => void
	countryData: countCountryItem[]
}

const columns: ColumnsType = [
	{
		title: "省份",
		dataIndex: "province",
		key: "province",
		align: "left"
	},
	{
		title: "访客数(UV)",
		dataIndex: "countId",
		key: "countId",
		align: "center"
	},
	{
		title: "占比",
		dataIndex: "ratio",
		key: "ratio",
		align: "center",
		render: text => <span>{text + "%"}</span>
	}
]

const columns2: ColumnsType = [
	{
		title: "国家",
		dataIndex: "country",
		key: "country",
		align: "left"
	},
	{
		title: "访客数(UV)",
		dataIndex: "countId",
		key: "countId2",
		align: "center"
	},
	{
		title: "占比",
		dataIndex: "ratio",
		key: "ratio2",
		align: "center",
		render: text => <span>{text + "%"}</span>
	}
]

const ProvincialDistribution = (props: props) => {
	const { provinceData, citydata, exportProvincialHandle, exportCountryHandle, countryData } = props

	let min = 0
	let max = 100
	const titledata: any[] = []
	const dataShadow: number[] = []
	const bartop10: any[] = []

	if (citydata[0]?.value) {
		max = citydata[0]?.value
	}
	if (citydata[citydata.length - 1]?.value) {
		min = citydata[citydata.length - 1]?.value
	}
	if (citydata.length === 1) {
		min = 0
	}

	const NumDescSort = (a: { value: number }, b: { value: number }) => {
		return b.value - a.value
	}

	const NumAsceSort = (a: { value: number }, b: { value: number }) => {
		return a.value - b.value
	}

	useEffect(() => {
		citydata.sort(NumDescSort)
		for (var i = 0; i < citydata.length; i++) {
			var top10 = {
				name: citydata[i].name,
				value: citydata[i].value
			}
			bartop10.push(top10)
			dataShadow.push(max)
		}

		bartop10.sort(NumAsceSort)
		for (var i = 0; i < bartop10.length; i++) {
			titledata.push(bartop10[i].name)
		}
	}, [citydata])

	const chartOption = useMemo<EChartOption<EChartOption.SeriesMap>>(
		() => ({
			tooltip: {
				trigger: "item",
				formatter: (p: { data: citydataItem; name: string }) => {
					let val = p.data?.value
					let ratio = p.data?.ratio
					let txtCon
					if (!val || !ratio) {
						val = 0
						ratio = 0
					}
					if (p.data) {
						txtCon = p.data?.name + "<br/>" + "访客数(UV): " + val + "<br/>" + "占比: " + ratio + "%"
					} else {
						txtCon = p.name + "<br/>" + "访客数(UV): " + val + "<br/>" + "占比: " + ratio + "%"
					}
					return txtCon
				}
			},
			legend: {
				show: false
			},
			grid: {
				// 仅仅控制条形图的位置
				show: false,
				width: 0
			},
			visualMap: [
				{
					show: false,
					type: "continuous",
					min: min,
					max: max,
					text: ["多", "少"],
					seriesIndex: [0, 2],
					dimension: 0,
					realtime: false,
					left: 0,
					bottom: 30,
					itemWidth: 18,
					itemHeight: 100,
					calculable: true,
					inRange: {
						color: ["#d1efd1", "#1aad19"],
						symbolSize: [100, 100]
					},
					outOfRange: {
						color: ["#eeeeee"],
						symbolSize: [100, 100]
					}
				}
			],
			toolbox: {
				show: false
			},

			xAxis: [
				{
					type: "value",
					position: "top",
					color: "rgba(0,0,0,0)",
					inside: false,
					axisLabel: {
						show: false
					},
					splitLine: {
						show: false
					},
					margin: 10
				}
			],
			yAxis: [
				{
					type: "category",
					color: "rgba(0,0,0,0)",
					boundaryGap: true,
					axisLine: {
						show: false
					},
					axisLabel: {
						align: "right",
						margin: 10,
						showMaxLabel: true
					},
					data: titledata
				}
			],

			series: [
				{
					name: "占比",
					type: "map",
					mapType: "china",
					top: "30",
					left: "0",
					width: "260",
					roam: "move",
					mapValueCalculation: "sum",
					zoom: 1,
					selectedMode: false,
					showLegendSymbol: false,
					label: {
						normal: {
							textStyle: {
								color: "#666"
							},
							formatter: (p: { name: string }) => {
								switch (p.name) {
									case "内蒙古自治区":
										p.name = "内蒙古"
										break
									case "西藏自治区":
										p.name = "西藏"
										break
									case "新疆维吾尔自治区":
										p.name = "新疆"
										break
									case "宁夏回族自治区":
										p.name = "宁夏"
										break
									case "广西壮族自治区":
										p.name = "广西"
										break
									case "香港特别行政区":
										p.name = "香港"
										break
									case "澳门特别行政区":
										p.name = "澳门"
										break
									default:
										break
								}
								return p.name
							}
						},
						emphasis: {
							show: false,
							textStyle: {
								color: "#234EA5"
							}
						}
					},
					itemStyle: {
						normal: {
							areaColor: "#EEEEEE",
							borderColor: "#FFFFFF"
						},
						emphasis: {
							areaColor: "#018000"
						}
					},
					data: citydata
				},
				{
					name: "背景",
					type: "bar",
					roam: false,
					visualMap: false,
					itemStyle: {
						color: "#eeeeee",
						opacity: 0.5
					},
					label: {
						show: false
					},
					emphasis: {
						itemStyle: {
							color: "#eeeeee",
							opacity: 0.5
						},
						label: {
							show: false
						}
					},
					silent: true,
					barWidth: 18,
					barGap: "-100%",
					data: dataShadow,
					animation: false
				},
				{
					name: "占比",
					type: "bar",
					roam: false,
					visualMap: false,
					// itemStyle: {
					//   color: "#60ACFC"
					// },
					barWidth: 18,
					label: {
						normal: {
							show: true,
							fontSize: 12,
							position: "insideLeft"
						},
						emphasis: {
							show: true
						}
					},
					data: bartop10
				}
			]
		}),
		[citydata]
	)

	return (
		<Row className="regionCharts">
			<Col span={14} className="provincial">
				<div className="header-tit">
					<h4 className="title">省级分布</h4>
					<Button type="primary" onClick={exportProvincialHandle}>
						导出
					</Button>
				</div>

				<Row style={{ height: "100%" }}>
					<Col span={10}>
						<ReactEcharts option={chartOption} notMerge={true} lazyUpdate={true} />
					</Col>
					<Col span={13} offset={1}>
						{provinceData && (
							<Table
								dataSource={provinceData}
								columns={columns}
								pagination={false}
								rowKey={(row: countProvinceItem) => row.countId}
								scroll={{ y: 240 }}
							/>
						)}
					</Col>
				</Row>
			</Col>
			<Col span={10} className="country">
				<div className="header-tit">
					<h4 className="title">国家分布</h4>
					<Button type="primary" onClick={exportCountryHandle}>
						导出
					</Button>
				</div>
				{countryData && (
					<Table
						dataSource={countryData}
						columns={columns2}
						pagination={false}
						rowKey={(row: countCountryItem) => row.countId}
						scroll={{ y: 240 }}
					/>
				)}
			</Col>
		</Row>
	)
}
ProvincialDistribution.title = "访问统计"
export default ProvincialDistribution
