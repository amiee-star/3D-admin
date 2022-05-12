import { Button, Row, Col, Space, Dropdown, Menu, Modal, message, Select, Upload } from "antd"
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
import AddHallModal from "@/components/modal/4DHall/addHall.modal"
import EditHallModal from "@/components/modal/4DHall/editHall.modal"
import CopyHallModal from "@/components/modal/4DHall/copyScene.modal"
import proxy from "../../../../config/proxy"
import { userContext } from "@/components/provider/user.context"
import urlFunc from "@/utils/url.func"

const SceneHall = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const { state } = useContext(userContext)
	const { user } = state
	const configUrl = user.accessToken
	let sceneId = ""
	const needData = useRef<any[]>([])
	const [selectItem, setSelectItem] = useState<{ [key: number]: any[] }>({})
	// 增加模板
	const addHall = () => {
		ModalCustom({
			content: AddHallModal
		})
	}
	// 编辑
	const editScene = (item: any) => () => {
		ModalCustom({
			content: EditHallModal,
			params: {
				id: item.id,
				item: item
			}
		})
	}

	// 复制
	const copyScene = (item: any) => () => {
		ModalCustom({
			content: CopyHallModal,
			params: {
				hallId: item.id,
				copyName: item.name
			}
		})
	}

	// 发布
	const getPublish = (item: any) => () => {
		Modal.confirm({
			title: "发布展厅",
			content: "是否发布该展厅？",
			closable: true,
			onOk: () => {
				service4Dtemplate.publishHall(item.id).then(rslt => {
					if (rslt.code === 200) {
						eventBus.emit("doHall")
						Modal.destroyAll()
						message.success("发布成功！")
					}
				})
			}
		})
	}

	// 删除
	const deleteHall = (item: any) => () => {
		// if (item.hasTemplateCount) {
		// 	message.error("当前模板已关联展厅，无法删除")
		// }
		Modal.confirm({
			title: "删除展厅",
			content: "是否删除当前展厅？",
			closable: true,
			onOk: () => {
				service4Dtemplate.deleteHall(item.id).then(rslt => {
					if (rslt.code === 200) {
						eventBus.emit("doHall")
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
			width: 60,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<Dropdown
							overlay={
								<Menu>
									{/* hidden={item.aliStatic !== 2} */}
									<Menu.Item>
										<a href={urlFunc.replaceUrl(`/view.html?sceneName=${item.id}`, "mo4Dbrowser")} target="_blank">
											预览
										</a>
									</Menu.Item>
									<Menu.Item>
										<a
											href={urlFunc.replaceUrl(`/editor.html?sceneName=${item.id}&token=${configUrl}`, "mo4Deditor")}
											target="_blank"
										>
											布展
										</a>
									</Menu.Item>
									<Menu.Item onClick={editScene(item)}>编辑</Menu.Item>
									<Menu.Item onClick={copyScene(item)}>复制</Menu.Item>
									<Menu.Item onClick={getPublish(item)}>发布</Menu.Item>
									{!item.hasTemplateCount && <Menu.Item onClick={deleteHall(item)}>删除</Menu.Item>}
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
				<Col>展厅列表</Col>
				<Col>
					<Space size="middle">
						<Button type="primary" onClick={addHall}>
							新增展厅
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
		eventBus.on("doHall", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doHall")
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
					service4Dtemplate.deleteHalls({ ids: params }).then(res => {
						if (res.code === 200) {
							message.success("所选展厅数据已成功删除")
							eventBus.emit("doHall")
							setSelectItem({})
							Modal.destroyAll()
						}
					})
				}
			})
		}
	}, [selectItem])

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels4D([
						"hallName",
						"hallId",
						// "typeId",
						// "styleId",
						"isCheck",
						"aliStatic",
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
						"hallName",
						"hallID",
						// "types",
						// "styles",
						"validSz",
						"owner",
						"isCheck",
						"aliStaticDic",
						"createTs",
						"createdBy",
						"updateTs",
						"updatedBy"
					]).concat(columns)}
					apiService={service4Dtemplate.hallList}
					rowSelection={{
						selectedRowKeys: selectKeys,
						onChange: selectChange
					}}
				/>
			</Col>
		</Row>
	)
}
SceneHall.title = "展厅列表"
export default SceneHall
