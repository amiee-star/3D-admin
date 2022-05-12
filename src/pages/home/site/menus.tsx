import { Button, Row, Col, Space, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddMenus from "@/components/modal/addMenus.model"
import serviceSystem from "@/services/service.system"
import { menusInfoData } from "@/interfaces/api.interface"

const addMenus = (id: number, level: number, leaf: boolean) => () => {
	ModalCustom({
		content: AddMenus,
		params: {
			parentId: id,
			level,
			leaf
		}
	})
}

const editMenus = (id: number, parentId: number, level: number, leaf: boolean) => () => {
	ModalCustom({
		content: AddMenus,
		params: {
			parentId,
			id,
			level,
			leaf
		}
	})
}

const deleteRole = (item: menusInfoData) => () => {
	Modal.confirm({
		title: "删除菜单",
		content: "是否删除当前菜单？",
		closable: true,
		onOk: () => {
			serviceSystem.delMenus(item.id).then(rslt => {
				if (rslt.code === 200) {
					eventBus.emit("doSceneTemplate")
					Modal.destroyAll()
					message.success("删除成功！")
				}
			})
		}
	})
}
const columns: ColumnType<menusInfoData>[] = [
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
								{item.level != 1 && (
									<Menu.Item onClick={editMenus(item.id, item.parentId, item.level, item.leaf)}>修改</Menu.Item>
								)}
								{!item.children && item.level != 1 && <Menu.Item onClick={deleteRole(item)}>删除</Menu.Item>}
								{<Menu.Item onClick={addMenus(item.id, item.level, item.leaf)}>新建子菜单</Menu.Item>}
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
const SiteMenus = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	// const toTree = useCallback((list: userListItem[], parentId: number = 0) => {
	// 	console.log(list)
	// 	const len = list.length
	// 	function loop(parentId: number) {
	// 		const res: any[] = []
	// 		for (let i = 0; i < len; i++) {
	// 			let item: any = list[i]
	// 			if (item.parentId === parentId) {
	// 				item.children = loop(item.id)
	// 				if (!item.children.length) {
	// 					delete item.children
	// 				}
	// 				res.push(item)
	// 			}
	// 		}
	// 		return res
	// 	}
	// 	return loop(parentId)
	// }, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>菜单列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addMenus(1, 1, false)}>
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
			{/* <Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["keyword"])} toSearch={setParams} />
			</Col> */}
			<Col className="form-result" span={24}>
				<ListTable
					expandable={{
						defaultExpandedRowKeys: new Array(999).fill("").map((m, index) => index)
					}}
					// transformData={toTree}
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["ZmenuName", "ZmenuLevel", "ZmenuSort", "describe"]).concat(columns)}
					apiService={serviceSystem.menuList}
				/>
			</Col>
		</Row>
	)
}
SiteMenus.title = "菜单管理"
export default SiteMenus
