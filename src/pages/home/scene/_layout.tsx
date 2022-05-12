import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const SceneLayout = (props: PageProps) => {
	return <>{props.children}</>
}
SceneLayout.title = "场景管理"
SceneLayout.icon = "mobanguanli"
export default SceneLayout
