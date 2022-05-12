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
import AddHelpFileModal from "@/components/modal/addHelpFile.modal"
import serviceHelp from "@/services/service.help"
const HelpFile = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])

	const deleteHandle = (id: string) => () => {
		Modal.confirm({
			title: "删除文档分类",
			content: "是否删除当前文档分类？",
			closable: true,
			onOk: () => {
				serviceHelp.delFileClassification({ id }).then(res => {
					if (res.code === 200) {
						message.success("删除成功！")
						eventBus.emit("doStyle")
						Modal.destroyAll()
					}
				})
			}
		})
	}

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>文档分类列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addHelpFile}>
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
	// 添加帮助文件分类
	const addHelpFile = () => {
		ModalCustom({
			content: AddHelpFileModal,
			params: {
				id: ""
			}
		})
	}
	// 编辑文件分类
	const editHandle = (id: any) => () => {
		ModalCustom({
			content: AddHelpFileModal,
			params: {
				id: id
			}
		})
	}
	// 删除
	// const deleteHandle = (id: any) => () => {
	// 	console.log("删除")
	// 	serviceHelp.delFileClassification({ id }).then(res => {
	// 		if (res.code == 200) {
	// 			message.success("保存成功！")
	// 			eventBus.emit("doStyle")
	// 		}
	// 	})
	// }
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["categoryName"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "categoryName", "categorySort", "createdName", "createTs"]).concat(
						columns
					)}
					apiService={serviceHelp.getStylesList}
					rowKey="id"
				/>
			</Col>
		</Row>
		// <div>wodwodewode</div>
	)
}
HelpFile.title = "文档分类"
export default HelpFile
