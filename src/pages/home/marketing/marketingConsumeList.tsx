import { Row, Col, Dropdown, Menu } from "antd"
import React, { useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { ModalCustom } from "@/components/modal/modal.context"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceMarketing from "@/services/service.marketing"
import orderListInfoModal from "@/components/modal/orderListInfo.modal"
import "./marketing.less"

const getHallInfo = (id: number) => () => {
	ModalCustom({
		content: orderListInfoModal,
		params: {
			id
		}
	})
}

const columns: ColumnType<any>[] = [
	{
		title: "操作",
		dataIndex: "sceneId",
		key: "sceneId",
		fixed: "right",
		width: 100,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<Dropdown
						overlay={
							<Menu>
								<Menu.Item onClick={getHallInfo(item.id)}>查看详情</Menu.Item>
							</Menu>
						}
						trigger={["click"]}
					>
						<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
							操作
						</a>
					</Dropdown>
				</>
			)
		}
	}
]

const MarketingConsumeList = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		eventBus.on("doOrderListTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doOrderListTemplate")
		}
	}, [])
	return (
		<Row className="data-form full" id="marketing">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["serverType", "keyword", "startTime", "endTime"])}
					toSearch={setParams}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"orderNumber",
						"serverType",
						"hallName2",
						"hallId",
						"accountNo",
						"consumption",
						"money",
						"orderDate",
						"orderStatus"
					]).concat(columns)}
					apiService={serviceMarketing.orderList}
				/>
			</Col>
		</Row>
	)
}
MarketingConsumeList.title = "消费记录"
export default MarketingConsumeList
