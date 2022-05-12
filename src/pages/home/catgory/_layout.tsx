import { PageProps } from "@/interfaces/app.interface"
import { UpCircleOutlined } from "@ant-design/icons"
import React from "react"

const CatgoryLayout = (props: PageProps) => {
	return <>{props.children}</>
}
CatgoryLayout.title = "类别管理"
CatgoryLayout.icon = "fenleiguanli"
export default CatgoryLayout
