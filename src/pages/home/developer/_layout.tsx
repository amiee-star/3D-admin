import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const DeveloperLayout = (props: PageProps) => {
	return <>{props.children}</>
}
DeveloperLayout.title = "开发者管理"
DeveloperLayout.icon = "xitongguanli"
export default DeveloperLayout
