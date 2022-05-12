import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import ReactEcharts from "@/components/ReactEcharts/react.echarts"
import { EChartOption } from "echarts"

interface propsItem {
	deviceChartData: deviceChartDataItem[]
	isLegend: boolean
	center?: string
	name?: string
	radius?: string[]
}

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

const colorList: string[] = [
	"#36CBCB",
	"#23B8FF",
	"#e75fc3",
	"#f87be2",
	"#f2719a",
	"#fca4bb",
	"#f59a8f",
	"#fdb301",
	"#57e7ec",
	"#cf9ef1",
	"#57e7ec",
	"#cf9ef1",
	"#FFBC6D",
	"#006DFB"
]

const EchartsPie = (props: propsItem) => {
	const { deviceChartData, isLegend, center, name, radius } = props
	const terminalOption = useMemo<EChartOption<EChartOption.SeriesPie>>(
		() => ({
			color: colorList,
			legend: isLegend
				? {
						show: true,
						icon: "circle",
						itemWidth: 8,
						itemHeight: 8,
						itemGap: 28,
						textStyle: {
							fontSize: 14,
							color: "#666"
						},
						bottom: 50,
						left: "center",
						data: deviceChartData.map((item: { name: string }) => {
							return item.name
						})
				  }
				: { show: false },
			tooltip: {
				trigger: "item",
				formatter: function (params: { data: deviceChartDataItem }) {
					return (
						params.data.name + "<br/>" + `${name}: ` + params.data.count + "<br/>" + "占比: " + params.data.value + "%"
					)
				}
			},
			series: [
				{
					type: "pie",
					radius: radius ? radius : ["60%", "83%"],
					center: ["50%", center],
					hoverAnimation: true,
					bottom: 0,
					label: {
						normal: {
							show: false
						}
					},
					labelLine: {
						normal: {
							show: false
						}
					},
					data: deviceChartData
				}
			]
		}),
		[deviceChartData, radius]
	)

	return <>{deviceChartData && <ReactEcharts option={terminalOption} notMerge={true} lazyUpdate={true} />}</>
}

export default EchartsPie
