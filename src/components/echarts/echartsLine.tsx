import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import ReactEcharts from "@/components/ReactEcharts/react.echarts"
import { EChartOption } from "echarts"
import echarts from "echarts"
import { seriesListItem } from "@/interfaces/api.interface"

interface propsItem {
	seriesData: seriesListItem[]
	xaxisData: string[]
	interval: number
	seriesName: string
	seriesAllName: string
	height?: number
}

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

const EchartsLine = (props: propsItem) => {
	const [series, setSeries] = useState([])
	const { seriesData, xaxisData, interval, seriesName, seriesAllName, height } = props
	const colorList = ["#23B8FF", "", "", "", "", "", "", "#FFBC6D"]

	const colorArea = [
		new echarts.graphic.LinearGradient(0, 1, 0, 0, [
			{
				offset: 0,
				color: "rgba(35, 184, 255, 0)"
			},
			{
				offset: 1,
				color: "rgba(35, 184, 255, 0.35)"
			}
		])
	]

	useEffect(() => {
		let seriesArr: any[] = []
		seriesData &&
			seriesData.map((item, index) => {
				let obj = {
					name: index == 0 ? seriesName + seriesAllName : item.seriesName,
					type: "line",
					symbolSize: 0, // symbol的大小设置为0
					smooth: true,
					showSymbol: false, // 不显示symbol
					yAxisIndex: 1,
					itemStyle: {
						normal: {
							color: colorList[index] ? colorList[index] : "rgba(0,0,0,0)",
							lineStyle: {
								color: colorList[index] ? colorList[index] : "rgba(0,0,0,0)",
								width: index == 0 ? 1 : 0
							},
							areaStyle: {
								color: colorArea[index]
									? colorArea[index]
									: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
											{
												offset: 0,
												color: "rgba(0, 0, 0, 0)"
											},
											{
												offset: 1,
												color: "rgba(0, 0, 0, 0)"
											}
									  ])
							}
						}
					},
					lineStyle: {
						width: index == 0 ? 1 : 0,
						color: colorList[index] ? colorList[index] : "rgba(0,0,0,0)"
					},
					data: [] as number[]
				}

				if (index == 0) {
					delete obj.symbolSize
					delete obj.showSymbol
					delete obj.yAxisIndex
				}
				obj.data = item.seriesData
				seriesArr.push(obj)
			})
		setSeries(seriesArr)
	}, [seriesData, seriesName])

	const getOption = useMemo<EChartOption<EChartOption.SeriesLine>>(
		() => ({
			tooltip: {
				trigger: "axis",
				position: function (point, params, dom, rect, size: { contentSize: string[] }) {
					var x = 0 // x坐标位置
					var y = 0 // y坐标位置 // 当前鼠标位置
					var pointX = point[0]
					var pointY = point[1]
					var boxWidth = size.contentSize[0]
					var boxHeight = size.contentSize[1]
					var echartsW = document.getElementById("line-echarts")?.clientWidth
					if (boxWidth > pointX) {
						x = 50
					} else if (echartsW < Number(pointX) + Number(boxWidth)) {
						x = Number(pointX) - 130
					} else {
						x = Number(pointX) + 20
					}
					if (boxHeight > pointY) {
						y = 5
					} else {
						y = Number(pointY) - Number(boxHeight)
					}
					return [x, y]
				}
			},
			grid: {
				top: 20,
				left: "20px",
				right: "30px",
				bottom: "0",
				containLabel: true
			},
			xAxis: {
				type: "category",
				show: true,
				boundaryGap: false, //坐标轴两边留白
				data: xaxisData,
				axisLabel: {
					//坐标轴刻度标签的相关设置。
					interval: interval, //设置为 1，表示『隔一个标签显示一个标签』
					//	margin:15,
					textStyle: {
						color: "#666",
						fontStyle: "normal",
						fontFamily: "微软雅黑",
						fontSize: 12
					},
					formatter: function (params: string) {
						var newParamsName = ""
						var paramsNameNumber = params.length
						var provideNumber = 10 //一行显示几个字
						var rowNumber = Math.ceil(paramsNameNumber / provideNumber)
						if (paramsNameNumber > provideNumber) {
							for (var p = 0; p < rowNumber; p++) {
								var tempStr = ""
								var start = p * provideNumber
								var end = start + provideNumber
								if (p == rowNumber - 1) {
									tempStr = params.substring(start, paramsNameNumber)
								} else {
									tempStr = params.substring(start, end) + "\n"
								}
								newParamsName += tempStr
							}
						} else {
							newParamsName = params
						}
						return newParamsName
					}
					//rotate:50,
				},
				axisTick: {
					//坐标轴刻度相关设置。
					show: false
				},
				axisLine: {
					//坐标轴轴线相关设置
					lineStyle: {
						color: "#E5E9ED"
						// opacity:0.2
					}
				},
				splitLine: {
					//坐标轴在 grid 区域中的分隔线。
					show: false,
					lineStyle: {
						color: "#E5E9ED"
						// 	opacity:0.1
					}
				}
			},
			yAxis: [
				{
					type: "value",
					minInterval: 1,
					splitNumber: 5,
					axisLabel: {
						textStyle: {
							color: "#666",
							fontStyle: "normal",
							fontFamily: "微软雅黑",
							fontSize: 12
						}
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: "#E5E9ED"
							// 	opacity:0.1
						}
					}
				},
				{
					type: "value",
					minInterval: 1,
					splitNumber: 5,
					axisLabel: {
						formatter: function () {
							return ""
						}
					},
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					splitLine: {
						show: false
					}
				}
			],
			series: series
		}),
		[series, interval]
	)

	return (
		<div id="line-echarts">
			{xaxisData && series && (
				<ReactEcharts
					option={getOption}
					style={{ background: "#fff", height: height || 300 }}
					notMerge={true}
					lazyUpdate={true}
				/>
			)}
		</div>
	)
}

export default EchartsLine
