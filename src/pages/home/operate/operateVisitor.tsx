import { Row, Col, Button, Space } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import serviceOperate from "@/services/service.operate"
import "./operateComment.less"
import proxy from "../../../../config/proxy"
import qs from "qs"
import DownloadFile from "@/utils/downloadFile.func"

const OperateVisitor = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		eventBus.on("doFormList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doFormList")
		}
	}, [])

	const exportHandle = () => {
		let obj = { ...withParams.current }
		delete obj.pageNum
		delete obj.pageSize
		serviceOperate.exportVisitors(obj).then(res => {
			DownloadFile(res, "访客信息", "application/vnd.ms-excel")
		})
	}

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>访客信息列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={exportHandle}>
							导出
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	return (
		<Row className="data-form full commentList">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["tempIdOrName", "telephoneOrName", "startTime", "endTime"])}
					toSearch={setParams}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"devHallName",
						"WrealName",
						"telephone",
						"consultSetting",
						"owner",
						"createTs"
					])}
					apiService={serviceOperate.visitorsList}
					rowKey={item => item.createTs}
				/>
			</Col>
		</Row>
	)
}
OperateVisitor.title = "访客信息"
export default OperateVisitor
