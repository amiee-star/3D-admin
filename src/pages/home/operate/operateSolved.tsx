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
import addPolymerization from "@/components/modal/addPolymerization"
import EditCaseModal from "@/components/modal/EditCaseModal"
import "./operateComment.less"

const OperateSolved = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	const handle = (id: number) => () => {
		ModalCustom({
			content: addPolymerization,
			params: {
				id
			}
		})
	}
	const handleEdit = (id: number) => () => {
		ModalCustom({
			content: EditCaseModal,
			params: {
				id
			}
		})
	}
	const deleteHandle = (id: number) => () => {
		Modal.confirm({
			title: "删除",
			content: "是否删除当前行业案例？",
			closable: true,
			onOk: () => {
				serviceOperate.delPolymerization({ id: id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doStyle")
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
									<Menu.Item onClick={handleEdit(item.id)}>修改</Menu.Item>
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
		eventBus.on("doStyle", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doStyle")
		}
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>行业案例列表</Col>
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
					columns={returnColumnFields(["sort", "Pcover", "HallName", "HallIntroduce", "HallLink", "Wsort"]).concat(
						columns
					)}
					apiService={serviceOperate.getPolymerizationList}
				/>
			</Col>
		</Row>
	)
}
OperateSolved.title = "云展会聚合页"
export default OperateSolved
