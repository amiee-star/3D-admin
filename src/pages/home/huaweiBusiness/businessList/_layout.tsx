import { PageProps } from "@/interfaces/app.interface"
import React from "react"
const BusinessListLayout = (props: PageProps) => {
	return <>{props.children}</>
}
BusinessListLayout.title = "企业列表"
BusinessListLayout.menu = false
BusinessListLayout.icon = "xitongguanli"
export default BusinessListLayout
