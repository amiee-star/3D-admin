import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const SprogramLayout = (props: PageProps) => {
	return <>{props.children}</>
}
SprogramLayout.title = "小程序管理"
SprogramLayout.icon = "guanwangguanli"
export default SprogramLayout
