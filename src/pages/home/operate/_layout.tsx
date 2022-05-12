import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const OperateLayout = (props: PageProps) => {
	return <>{props.children}</>
}
OperateLayout.title = "运营管理"
OperateLayout.icon = "guanwangguanli"
export default OperateLayout
