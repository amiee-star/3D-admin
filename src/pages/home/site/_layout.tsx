import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const SiteLayout = (props: PageProps) => {
	return <>{props.children}</>
}
SiteLayout.title = "系统管理"
SiteLayout.icon = "xitongguanli"
export default SiteLayout
