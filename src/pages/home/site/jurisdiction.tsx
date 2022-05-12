import { Button, Row, Col, Space, Dropdown, Menu, Switch } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import Addjurisdiction from "@/components/modal/addJurisdiction.modal"
import setMenuModal from "@/components/modal/setMenu.modal"
import serviceSystem from "@/services/service.system"

const addjurisdiction = () => {
	ModalCustom({
		content: Addjurisdiction,
		params: {
			id: ""
		}
	})
}

const editjurisdiction = (id: string) => () => {
	ModalCustom({
		content: Addjurisdiction,
		params: {
			id
		}
	})
}

const setMenu = (id: number) => () => {
	ModalCustom({
		content: setMenuModal,
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
		width: 60,
		align: "center",
		render: (_v, item) => {
			return (
				<>
					<Dropdown
						overlay={
							<Menu>
								<Menu.Item onClick={editjurisdiction(item.id)}>修改</Menu.Item>
								<Menu.Item onClick={setMenu(item.id)}>分配菜单</Menu.Item>
								{/* <Menu.Item>
									<Switch defaultChecked onChange={onChange} />
								</Menu.Item> */}
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
const Jurisdiction = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>权限列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addjurisdiction}>
							添加
						</Button>
					</Space>
				</Col>
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
				<FormSearch fields={returnSearchFiels(["keyword"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "ZjurisdictionName", "describe", "creatTs"]).concat(columns)}
					apiService={serviceSystem.permissionList}
				/>
			</Col>
		</Row>
	)
}

Jurisdiction.title = "权限管理"
export default Jurisdiction
