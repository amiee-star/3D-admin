import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const MarketingLayout = (props: PageProps) => {
	return <>{props.children}</>
}
MarketingLayout.title = "营销管理"
MarketingLayout.icon = "yingxiaoguanli"
export default MarketingLayout
