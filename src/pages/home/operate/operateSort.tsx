import { Row, Col, Modal, Button, Dropdown, Menu, Space, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceOperate from "@/services/service.operate"
import { ModalCustom } from "@/components/modal/modal.context"
import OperationBannerModal from "@/components/modal/operation.banner.modal"
import OperationSortModal from "@/components/modal/operation.sort.modal"
import "./operateComment.less"

const OperateSort = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	const handle = (id: number) => () => {
		ModalCustom({
			content: OperationSortModal,
			params: {
				id
			}
		})
	}

	const deleteHandle = (id: number) => () => {
		Modal.confirm({
			title: "删除",
			content: "是否删除当前行业分类？",
			closable: true,
			onOk: () => {
				serviceOperate.deleteSort({ id: id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doSortList")
						Modal.destroyAll()
						message.success("删除成功！")
					}
				})
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
									<Menu.Item onClick={handle(item.id)}>修改</Menu.Item>
									<Menu.Item onClick={deleteHandle(item.id)}>删除</Menu.Item>
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

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		eventBus.on("doSortList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSortList")
		}
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>行业分类列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle(null)}>
							新增
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
				<FormSearch fields={returnSearchFiels(["keyword"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "Wname", "WmoreLink", "Wsort"]).concat(columns)}
					apiService={serviceOperate.sortList}
				/>
			</Col>
		</Row>
	)
}
OperateSort.title = "行业分类"
export default OperateSort
