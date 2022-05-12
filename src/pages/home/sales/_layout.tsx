import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const SalesLayout = (props: PageProps) => {
	return <>{props.children}</>
}
SalesLayout.title = "销售管理"
SalesLayout.icon = "guanwangguanli"
export default SalesLayout
