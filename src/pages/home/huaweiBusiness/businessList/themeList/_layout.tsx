import { PageProps } from "@/interfaces/app.interface"
import React from "react"
const ThemeListLayout = (props: PageProps) => {
	return <>{props.children}</>
}
ThemeListLayout.title = "主题管理"
ThemeListLayout.menu = false
ThemeListLayout.icon = "xitongguanli"
export default ThemeListLayout
