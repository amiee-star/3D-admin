import { PageProps } from "@/interfaces/app.interface"
import React from "react"
const BusinessLayout = (props: PageProps) => {
  return <>{props.children}</>
}
BusinessLayout.title = "企业管理"
BusinessLayout.icon = "xitongguanli"
export default BusinessLayout
