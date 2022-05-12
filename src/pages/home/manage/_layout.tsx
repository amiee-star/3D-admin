import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const ManageLayout = (props: PageProps) => {
	return <>{props.children}</>
}
ManageLayout.title = "管理"
ManageLayout.icon = "guanwangguanli"
export default ManageLayout
