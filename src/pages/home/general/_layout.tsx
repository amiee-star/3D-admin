import { FontKey } from "@/components/utils/font.icon"
import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const GeneralLayout = (props: PageProps) => {
	return <>{props.children}</>
}
GeneralLayout.title = "通用管理"
GeneralLayout.icon = "tongyongguanli"
export default GeneralLayout
