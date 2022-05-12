import { Button, Row, Col, Space, Modal, Menu, Dropdown, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceBoutique from "@/services/service.boutique"
import { ModalCustom } from "@/components/modal/modal.context"
import AddBoutiqueModal from "@/components/modal/addBoutique.modal"
import EditBoutiqueModal from "@/components/modal/editBoutique.modal"
import proxy from "../../../../config/proxy"

const addBoutique = () => {
	ModalCustom({
		content: AddBoutiqueModal
	})
}

const editBoutique = (id: string, tempId: string) => () => {
	ModalCustom({
		content: EditBoutiqueModal,
		params: {
			id,
			tempId
		}
	})
}

const deleteHandle = (id: number, boutiqueStatus: number) => {
	if (boutiqueStatus == 1) {
		message.warning("展厅已上架，无法删除！")
	} else {
		Modal.confirm({
			title: "删除",
			content: "是否删除当前精品模板？",
			closable: true,
			onOk: () => {
				serviceBoutique.deleteBoutique({ boutiqueId: id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doBoutique")
						message.success("删除成功！")
					}
				})
			}
		})
	}
}

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
								<Menu.Item>
									<a
										href={`${proxy.templateObsUrl[API_ENV]}/sceneFront/index.html?G_TEMP_ID=${item.tempId}`}
										target="_blank"
									>
										查看展厅
									</a>
								</Menu.Item>
								<Menu.Item onClick={editBoutique(item.id, item.tempId)}>修改</Menu.Item>
								<Menu.Item onClick={e => deleteHandle(item.id, item.boutiqueStatus)}>删除</Menu.Item>
								{/* <Menu.Item key="8">操作记录</Menu.Item> */}
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

const boutique = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>精品模板列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addBoutique}>
							添加展厅
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doBoutique", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doBoutique")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels([
						"tempName",
						"tempId",
						"phoneOrName",
						"typeId",
						"isAdded",
						"createType",
						"fastLayout",
						"recomType",
						"area",
						"startTime",
						"endTime"
					])}
					toSearch={setParams}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"hallThumbnail",
						"boutiqueName",
						"sz",
						"validSz",
						"hallType",
						"creatTs",
						"createName",
						"user",
						"boutiqueStatus",
						"createType",
						"fastLayout",
						"boutiqueSort"
					]).concat(columns)}
					apiService={serviceBoutique.boutiqueList}
				/>
			</Col>
		</Row>
	)
}
boutique.title = "精品模板"
export default boutique
