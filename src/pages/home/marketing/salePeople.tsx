import React, { useCallback, useEffect, useRef, useState } from "react"
import { Row, Col, Dropdown, Menu, Space, Button } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceMarketing from "@/services/service.marketing"
import { ColumnType } from "antd/es/table/interface"
import "./salePeople.less"
import { ModalCustom } from "@/components/modal/modal.context"
import addSalePeople from "@/components/modal/addSalePeople"
import eventBus from "@/utils/event.bus"
import { history } from "@@/core/history"
const salePeople = () => {
	const [params, setParams] = useState([])
	const withParams = useRef<any>()

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "sceneId",
			key: "sceneId",
			fixed: "right",
			width: 60,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item onClick={addSale(item.id)}>编辑</Menu.Item>
									<Menu.Item onClick={toPage(item.id)}>管理优惠券</Menu.Item>
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
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>销售列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addSale()}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	const addSale = (id?: string) => () => {
		ModalCustom({
			content: addSalePeople,
			params: {
				id
			}
		})
	}
	const toPage = (id: string) => () => {
		history.push({
			pathname: "/home/marketing/coupon.html",
			state: { id }
		})
	}
	useEffect(() => {
		withParams.current = params
	}, [params])
	useEffect(() => {
		eventBus.on("doSalePeople", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSalePeople")
		}
	}, [])
	return (
		<Row>
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["keyword", "Wactive"])} toSearch={setParams} />
			</Col>
			<Col className="coupon-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"salespersonName",
						"salespersonPhone",
						"couponCount",
						"couponActive"
					]).concat(columns)}
					apiService={serviceMarketing.salesmanList}
				/>
			</Col>
		</Row>
	)
}
salePeople.title = "优惠券"
export default salePeople
