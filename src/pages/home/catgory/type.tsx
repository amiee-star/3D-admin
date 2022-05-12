import { Button, Row, Col, Space, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { typeListItem } from "@/interfaces/api.interface"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceCatgory from "@/services/service.catgory"
import { ModalCustom } from "@/components/modal/modal.context"
import AddTypeModal from "@/components/modal/addType.modal"

const addType = (id: string) => () => {
	ModalCustom({
		content: AddTypeModal,
		params: {
			parentId: id
		}
	})
}

const editHandle = (id: string, parentId: string) => () => {
	ModalCustom({
		content: AddTypeModal,
		params: {
			id,
			parentId
		}
	})
}

const deleteHandle = (id: string) => () => {
	Modal.confirm({
		title: "删除分类",
		content: "是否删除当前分类？",
		closable: true,
		onOk: () => {
			serviceCatgory.deleteType({ id: id }).then(res => {
				if (res.code === 200) {
					eventBus.emit("doStyle")
					Modal.destroyAll()
					message.success("删除成功！")
				}
			})
		}
	})
}

const columns: ColumnType<typeListItem>[] = [
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
								<Menu.Item onClick={editHandle(item.id, item.parentId)}>修改</Menu.Item>
								{item.children?.length == 0 && <Menu.Item onClick={deleteHandle(item.id)}>删除</Menu.Item>}
								{<Menu.Item onClick={addType(item.id)}>新建子分类</Menu.Item>}
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
const CatgoryType = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>分类列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addType("0")}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doStyle", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doStyle")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["WtypeName"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					expandable={{
						defaultExpandAllRows: true
					}}
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["WtypeName", "Wsort"]).concat(columns)}
					apiService={serviceCatgory.getTypeList}
					rowKey={row => row.id}
				/>
			</Col>
		</Row>
	)
}
CatgoryType.title = "分类管理"
export default CatgoryType
