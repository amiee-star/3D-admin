import React, { useEffect, useState, useMemo, useCallback, useRef } from "react"
import ReactEcharts from "@/components/ReactEcharts/react.echarts"
import { EChartOption } from "echarts"
import echarts from "echarts"

interface propsItem {
	xaxisData: any
	publishSeriesData: any
	allSeriesData: any
}

interface deviceChartDataItem {
	name: string
	value: number
	count: number
}

const EchartsBar = (props: propsItem) => {
	const { xaxisData, publishSeriesData, allSeriesData } = props
	const getOption = useMemo<EChartOption<EChartOption.SeriesBar>>(
		() => ({
			grid: {
				top: "10%",
				left: "0",
				bottom: "0",
				right: "0",
				containLabel: true
			},
			tooltip: {
				trigger: "axis",
				axisPointer: {
					// 坐标轴指示器，坐标轴触发有效
					type: "shadow" // 默认为直线，可选为：'line' | 'shadow'
				},
				formatter: function (params: { data: deviceChartDataItem }) {
					return (
						"展厅数为" + params[0]?.name + "的用户：" + params[0]?.data + "<br/>" + "占比：" + params[1]?.data + "%"
					)
				}
			},
			xAxis: [
				{
					type: "category",
					data: xaxisData,
					axisTick: {
						show: false,
						alignWithLabel: true
					},
					nameTextStyle: {
						color: "#8F8F8F"
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#8F8F8F"
						}
					},
					axisLabel: {
						textStyle: {
							color: "#8F8F8F"
						}
					}
				}
			],
			yAxis: [
				{
					show: true,
					type: "value",
					axisLabel: {
						show: true,
						textStyle: {
							color: "#8F8F8F"
						}
					},
					splitLine: {
						show: true,
						lineStyle: {
							color: "rgba(255,255,255,0.3)"
						}
					},
					axisLine: {
						show: true,
						lineStyle: {
							color: "#8F8F8F"
						}
					}
				}
			],
			series: [
				{
					name: "展厅数量",
					type: "bar",
					barWidth: 40,
					barGap: "-100%",
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: "#06dbf3"
								},
								{
									offset: 1,
									color: "#00d387"
								}
							]),
							barBorderRadius: 0
						}
					},
					data: publishSeriesData
				},
				{
					name: "占比",
					type: "bar",
					barWidth: 40,
					itemStyle: {
						normal: {
							color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
								{
									offset: 0,
									color: "rgba(0,0,0,0)"
								},
								{
									offset: 1,
									color: "rgba(0,0,0,0)"
								}
							]),
							barBorderRadius: 0
						}
					},
					data: allSeriesData
				}
			]
		}),
		[xaxisData, publishSeriesData, allSeriesData]
	)

	return (
		<>
			{xaxisData && publishSeriesData && allSeriesData && (
				<ReactEcharts
					option={getOption}
					style={{ background: "#fff", height: "300px" }}
					notMerge={true}
					lazyUpdate={true}
				/>
			)}
		</>
	)
}

export default EchartsBar
