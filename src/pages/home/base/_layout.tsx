import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const BaseLayout = (props: PageProps) => {
	return <>{props.children}</>
}
BaseLayout.title = "基础数据配置"
BaseLayout.icon = "guanwangguanli"
export default BaseLayout
