import { PageProps } from "@/interfaces/app.interface"

import React from "react"
import "./dashboard.less"

const IndexDashboard = (props: PageProps) => {
	return (
		<div id="IndexDashboard">
			<div className="imgbg">
				<img src={require("../../assets/images/welcome.png")} />
			</div>

			<div className="title">欢迎使用数字展厅管理系统</div>
		</div>
	)
}
IndexDashboard.title = "欢迎"
IndexDashboard.menu = false
export default IndexDashboard
