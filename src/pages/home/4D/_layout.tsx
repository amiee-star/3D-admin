import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const SceneLayout = (props: PageProps) => {
	return <>{props.children}</>
}
SceneLayout.title = "4D展厅管理"
SceneLayout.icon = "mobanguanli"
export default SceneLayout
