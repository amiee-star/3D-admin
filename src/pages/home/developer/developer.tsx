import { Button, Row, Col, Space, Dropdown, Menu } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import DeveloperNature from "@/components/modal/developer.nature"
import DeveloperSource from "@/components/modal/developer.resource"
import DeveloperMeal from "@/components/modal/developer.meal"
import { history } from "umi"
import serviceSystem from "@/services/service.devloper"

const developerNature = (id: string) => () => {
	ModalCustom({
		content: DeveloperNature,
		params: {
			id
		}
	})
}

const developerSource = (id: string) => () => {
	ModalCustom({
		content: DeveloperSource,
		params: {
			id
		}
	})
}
const mealchange = (id: string) => () => {
	ModalCustom({
		content: DeveloperMeal,
		params: {
			id
		}
	})
}

const toHall = (id: string) => () => {
	history.push({
		pathname: "/home/developer/developerTemplate.html",
		state: { id }
	})
}

const toUselist = (id: string, userId: string) => () => {
	history.push({
		pathname: "/home/developer/developerUser.html",
		state: { id, userId }
	})
}

const columns: ColumnType<any>[] = [
	{
		title: "操作",
		fixed: "right",
		width: 60,
		align: "center",
		render: (v, item) => {
			return (
				<>
					<Dropdown
						overlay={
							<Menu>
								<Menu.Item onClick={developerNature(item.id)}>帐号属性配置</Menu.Item>
								<Menu.Item onClick={developerSource(item.id)}>帐号资源配置</Menu.Item>
								<Menu.Item onClick={mealchange(item.id)}>套餐变更</Menu.Item>
								<Menu.Item onClick={toHall(item.id)}>模板展厅配置</Menu.Item>
								<Menu.Item onClick={toUselist(item.id, item.userId)}>资源使用情况</Menu.Item>
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
const Developer = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>开发者帐号列表</Col>
				{/* <Col>
					<Space>
						<Button type="primary" onClick={templateConfig}>
							模版展厅配置
						</Button>
						<Button type="primary" onClick={resourceUsed}>
							资源使用详情
						</Button>
					</Space>
				</Col> */}
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doSceneTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSceneTemplate")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["Waccount", "Dusername", "Wlabel", "Dactive"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"account",
						"name",
						"WappId",
						"Wkey",
						"WapplicationTime",
						"Wlabel",
						"Wactive",
						"packageExpire",
						"packageName",
						"expireFlag"
					]).concat(columns)}
					apiService={serviceSystem.developersList}
				/>
			</Col>
		</Row>
	)
}
Developer.title = "开发者帐号"
export default Developer
