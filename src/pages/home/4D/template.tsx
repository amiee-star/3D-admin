import { Button, Row, Col, Space, Dropdown, Menu, Modal, message, Select, Upload, Popover } from "antd"
import React, { useCallback, useEffect, useRef, useState, useContext, useMemo } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels4D } from "@/utils/search.fields4D"
import { return4DColumnFields } from "@/utils/column.fields4D"
import { ColumnType } from "antd/es/table/interface"
import serviceScene from "@/services/service.scene"
import service4Dtemplate from "@/services/service.4Dtemplate"
import { ModalCustom } from "@/components/modal/modal.context"
import AddTemplateModal from "@/components/modal/4DHall/addTemplate.modal"
import EditTemplateModal from "@/components/modal/4DHall/editTemplate.modal"
import EditSceneModal from "@/components/modal/editScene.modal"
import ResouresModal from "@/components/modal/resoures.modal"
import proxy from "../../../../config/proxy"
import { userContext } from "@/components/provider/user.context"
import urlFunc from "@/utils/url.func"
import { templateListItem } from "@/interfaces/4Dapi.interface"

const SceneTemplate = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const { state } = useContext(userContext)
	const { user } = state
	const configUrl = user.accessToken
	let sceneId = ""
	const needData = useRef<any[]>([])
	const [selectItem, setSelectItem] = useState<{ [key: number]: any[] }>({})
	// 增加模板
	const addTemplate = () => {
		ModalCustom({
			content: AddTemplateModal
		})
	}

	const editScene = (item: any, hasZip: boolean) => () => {
		ModalCustom({
			content: EditTemplateModal,
			params: {
				id: item.id,
				hasZip: hasZip
			}
		})
	}
	const deleteTemplate = (item: any) => () => {
		if (item.hasTemplate) {
			message.error("当前模板已关联展厅，无法删除")
		} else {
			Modal.confirm({
				title: "删除模板",
				content: "是否删除当前模板？",
				closable: true,
				onOk: () => {
					service4Dtemplate.deleteTemplate(item.id).then(rslt => {
						if (rslt.code === 200) {
							eventBus.emit("doTemplate")
							Modal.destroyAll()
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
									<Menu.Item onClick={editScene(item, false)}>编辑</Menu.Item>
									<Menu.Item hidden={item.status !== 2}>
										{/* <a href={`${proxy.templateUrl[API_ENV]}/showcase/3.2/view.html?sceneId=${item.id}`} target="_blank">
											预览
										</a> */}
										<a href={urlFunc.replaceUrl(`/view.html?sceneName=${item.id}`, "mo4Dbrowser")} target="_blank">
											预览
										</a>
									</Menu.Item>

									<Menu.Item onClick={editScene(item, true)}>更新</Menu.Item>
									{!item.hasTemplate && <Menu.Item onClick={deleteTemplate(item)}>删除</Menu.Item>}
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
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>模版列表</Col>
				<Col>
					<Space size="middle">
						<Button type="primary" onClick={addTemplate}>
							添加模版
						</Button>
						<Button type="primary" onClick={allDelete}>
							批量删除
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	useEffect(() => {
		eventBus.on("doTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doTemplate")
		}
	}, [])
	const selectChange = useCallback((selectedRowKeys: React.ReactText[], selectedRows: any[]) => {
		setSelectItem(selectedRows)
	}, [])

	const selectKeys = useMemo(() => {
		needData.current = []
		Object.values(selectItem).forEach(m => {
			needData.current = needData.current.concat(m)
		})
		return needData.current.map(m => m.id)
	}, [selectItem])
	// 批量删除
	const allDelete = useCallback(() => {
		let data: any[] = []
		Object.values(needData.current).forEach(m => {
			data = data.concat(m)
		})

		let params = data.map(m => m.id)
		if (data.length == 0) {
			Modal.confirm({
				title: "请至少勾选一条数据",
				onOk: () => {
					Modal.destroyAll()
				}
			})
		} else {
			Modal.confirm({
				title: "批量删除模板数据",
				content: "是否删除所有勾选模板数据？",
				closable: true,
				onOk: () => {
					service4Dtemplate.deleteTemplates({ ids: params }).then(rslt => {
						if (rslt.code === 200) {
							eventBus.emit("doTemplate")
							Modal.destroyAll()
							message.success("删除成功！")
						}
					})
				}
			})
		}
	}, [selectItem])

	return (
		<>
			<Row className="data-form full">
				<Col className="form-search" span={24}>
					<FormSearch
						fields={returnSearchFiels4D([
							"templateName",
							"templateId",
							"createUsername",
							"visionDone",
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
						columns={return4DColumnFields([
							"sort",
							"templateName",
							"templateId",
							"hasTemplate",
							"activeArea",
							"owner",
							"status",
							"finishTs",
							"createTs",
							"createdBy",
							"updateTs",
							"updatedBy"
						]).concat(columns)}
						apiService={service4Dtemplate.templateList}
						rowSelection={{
							selectedRowKeys: selectKeys,
							onChange: selectChange
						}}
					/>
				</Col>
			</Row>
		</>
	)
}
SceneTemplate.title = "模版列表"
export default SceneTemplate
