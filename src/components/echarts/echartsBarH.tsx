import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import ReactEcharts from "@/components/ReactEcharts/react.echarts"
import { EChartOption } from "echarts"
import echarts from "echarts"
import imgClickActive from "@/lib/wangEditor/text/event-hooks/img-click-active"
import proxy from "../../../config/proxy"

interface propsItem {
	xaxisData: any
}

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

const EchartsBarH = (props: propsItem) => {
	const { xaxisData } = props
	const salvProName = xaxisData.xaxisData
  const salvProValue = xaxisData.seriesList && xaxisData.seriesList[0]?.seriesData
  const bizIdData = xaxisData.seriesList && xaxisData.seriesList[0]?.bizIdData
	var salvProMax: number[] = [] //背景按最大值
	for (let i = 0; i < salvProValue?.length; i++) {
		salvProMax.push(salvProValue[0])
	}
	const getOption = useMemo<EChartOption<EChartOption.SeriesBar>>(
		() => ({
			grid: {
				left: 0,
				right: 0,
				bottom: 0,
				top: 0,
				containLabel: true
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					type: "none"
				},
				formatter: function (params) {
					return params[0].name + " : " + params[0].value
				}
			},
			xAxis: {
				show: false,
				type: "value"
			},
			yAxis: [
				{
					type: "category",
					inverse: true,
					axisLabel: {
						show: true,
						textStyle: {
							color: "#666"
						}
					},
					splitLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLine: {
						show: false
					},
					data: salvProName
				},
				{
					type: "category",
					inverse: true,
					axisTick: "none",
					axisLine: "none",
					show: true,
					axisLabel: {
						textStyle: {
							color: "#666",
							fontSize: "12"
						}
					},
					data: salvProValue
				}
			],
			series: [
				{
					name: "值",
					type: "bar",
					zlevel: 1,
					itemStyle: {
						normal: {
							barBorderRadius: 14,
							color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
								{
									offset: 0,
									color: "rgba(35, 181, 250, 1)"
								},
								{
									offset: 1,
									color: "rgb(46,200,207,1)"
								}
							])
						}
					},
					barWidth: 14,
					data: salvProValue
				},
				{
					name: "背景",
					type: "bar",
					barWidth: 14,
					barGap: "-100%",
					data: salvProMax,
					itemStyle: {
						normal: {
							color: "rgba(240, 242, 245, 1)",
							barBorderRadius: 14
						},
						emphasis: {
							color: "rgba(236, 238, 241, 1)",
							barBorderRadius: 14
						}
					}
				}
			]
		}),
		[salvProName, salvProValue]
	)

	const clickEchartsBar = (e: any) => {
		if (e.componentType == "series") {
      window.open(`${proxy.templateObsUrl[API_ENV]
											}/sceneFront/index.html?G_TEMP_ID=${bizIdData[e.dataIndex]}`, "_blank")
		}
	}

	const onClick = {
		click: clickEchartsBar
	}

	return (
		<>
			{salvProName && salvProValue && (
				<ReactEcharts
					option={getOption}
					style={{ background: "#fff", height: "400px" }}
					notMerge={true}
					lazyUpdate={true}
					onEvents={onClick}
				/>
			)}
		</>
	)
}

export default EchartsBarH
