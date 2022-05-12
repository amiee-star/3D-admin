import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const HelpLayout = (props: PageProps) => {
	return <>{props.children}</>
}
HelpLayout.title = "帮助中心"
HelpLayout.icon = "guanwangguanli"
export default HelpLayout
