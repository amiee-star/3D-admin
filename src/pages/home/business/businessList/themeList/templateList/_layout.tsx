import { PageProps } from "@/interfaces/app.interface"
import React from "react"
const TemplateListLayout = (props: PageProps) => {
	return <>{props.children}</>
}
TemplateListLayout.title = "模板管理"
TemplateListLayout.menu = false
TemplateListLayout.icon = "xitongguanli"
export default TemplateListLayout
