import { Button, Row, Col, Space, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddStyleModal from "@/components/modal/addStyle.modal"
import serviceCatgory from "@/services/service.catgory"
import { treeItem } from "@/interfaces/api.interface"
import FormSearch from "@/components/form/form.search"

const addStyles = (id: string) => () => {
	ModalCustom({
		content: AddStyleModal,
		params: {
			parentId: id
		}
	})
}

const editStyles = (id: string, parentId: string) => () => {
	ModalCustom({
		content: AddStyleModal,
		params: {
			parentId,
			id
		}
	})
}

const deleteHandle = (id: string) => () => {
	Modal.confirm({
		title: "删除行业",
		content: "是否删除当前行业？",
		closable: true,
		onOk: () => {
			serviceCatgory.deleteStyle({ id: id }).then(res => {
				if (res.code === 200) {
					eventBus.emit("doStyles")
					Modal.destroyAll()
					message.success("删除成功！")
				}
			})
		}
	})
}
const columns: ColumnType<treeItem>[] = [
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
								{<Menu.Item onClick={editStyles(item.id, item.parentId)}>修改</Menu.Item>}
								{item.children?.length == 0 && <Menu.Item onClick={deleteHandle(item.id)}>删除</Menu.Item>}
								{<Menu.Item onClick={addStyles(item.id)}>新建子分类</Menu.Item>}
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
const CatgoryStyles = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>行业列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addStyles("0")}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doStyles", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doStyles")
		}
	}, [])

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["WstyleName"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					expandable={{
						defaultExpandAllRows: true
					}}
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["WstyleName", "Wstyle"]).concat(columns)}
					rowKey={row => row.id}
					apiService={serviceCatgory.getStylesList}
				/>
			</Col>
		</Row>
	)
}
CatgoryStyles.title = "分类管理"
export default CatgoryStyles
