import { Button, Row, Col, Space, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { PageProps } from "@/interfaces/app.interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddHelpProblemModal from "@/components/modal/addHelpProblem.modal"
import serviceHelp from "@/services/service.help"
const HelpProblem = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>常见问题列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addHelpProblem}>
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
									<Menu.Item onClick={editHandle(item.id)}>修改</Menu.Item>
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
	//添加常见问题
	const addHelpProblem = () => {
		ModalCustom({
			content: AddHelpProblemModal,
			params: {
				id: ""
			}
		})
	}
	// 编辑常见问题
	const editHandle = (id: any) => () => {
		ModalCustom({
			content: AddHelpProblemModal,
			params: {
				id: id
			}
		})
	}
	// 删除
	const deleteHandle = (id: string) => () => {
		Modal.confirm({
			title: "删除常见问题",
			content: "是否删除当前问题？",
			closable: true,
			onOk: () => {
				serviceHelp.delProblem({ id }).then(res => {
					if (res.code === 200) {
						message.success("删除成功！")
						eventBus.emit("doStyle")
						Modal.destroyAll()
					}
				})
			}
		})
	}

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["Xkeyword"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "issueName", "answer", "issueSort", "createdName", "createTs"]).concat(
						columns
					)}
					apiService={serviceHelp.getProblemList}
					rowKey="id"
				/>
			</Col>
		</Row>
		// <div>wodwodewode</div>
	)
}
HelpProblem.title = "常见问题"
export default HelpProblem
