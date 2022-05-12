import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const StatisticsLayout = (props: PageProps) => {
	return <>{props.children}</>
}
StatisticsLayout.title = "统计分析"
StatisticsLayout.icon = "tongjifenxi1"
export default StatisticsLayout
