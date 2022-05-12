import { Button, Row, Col, Space, Dropdown, Menu, Modal, message, Select, Upload } from "antd"
import React, { useCallback, useEffect, useRef, useState, useContext } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceScene from "@/services/service.scene"
import { ModalCustom } from "@/components/modal/modal.context"
import AddSceneModal from "@/components/modal/addScene.modal"
import EditSceneModal from "@/components/modal/editScene.modal"
import ResouresModal from "@/components/modal/resoures.modal"
import SceneFromListModal from "@/components/modal/sceneFromList.modal"
import proxy from "../../../../config/proxy"
import { userData } from "@/interfaces/api.interface"
import { UploadRequestOption } from "rc-upload/lib/interface"
import { userContext } from "@/components/provider/user.context"

const SceneTemplate = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const { state } = useContext(userContext)
	const { user } = state
	const configUrl = user.accessToken
	let sceneId = ""

	const addScene = () => {
		ModalCustom({
			content: AddSceneModal
		})
	}

	const editScene = (item: any) => () => {
		ModalCustom({
			content: EditSceneModal,
			params: {
				id: item.id,
				userinfo: item.belongerTelephone || item.belonger
			}
		})
	}
	const deleteScene = (item: any) => () => {
		if (item.hasTemplateCount) {
			message.error("当前模板已关联展厅，无法删除")
		} else {
			Modal.confirm({
				title: "删除模板",
				content: "是否删除当前模板？",
				closable: true,
				onOk: () => {
					serviceScene.deleteScene(item.id).then(rslt => {
						if (rslt.code === 200) {
							eventBus.emit("doSceneTemplate")
							Modal.destroyAll()
							message.success("删除成功！")
						}
					})
				}
			})
		}
	}
	const updateObj = (id: string, title: string) => () => {
		ModalCustom({
			content: ResouresModal,
			params: {
				id,
				title,
				resourceFunc: serviceScene.updateObj,
				keyName: ["objUrl", "objFileSize", "Obj"]
			}
		})
	}

	const updatePano = (id: string, title: string) => () => {
		ModalCustom({
			content: ResouresModal,
			params: {
				id,
				title,
				resourceFunc: serviceScene.updatePano,
				keyName: ["panoUrl", "panoSize", "Sky"]
			}
		})
	}

	const getSceneFromList = (id: string) => () => {
		ModalCustom({
			content: SceneFromListModal,
			params: {
				id
			}
		})
	}

	const clickMap = (id: string) => () => {
		sceneId = id
	}

	const updateMap = (options: UploadRequestOption) => {
		const { file } = options
		const form = new FormData()
		form.append("file", file)
		serviceScene.miniMap(sceneId, form).then(res => {
			if (res.code === 200) {
				message.success("上传成功")
			}
		})
	}

	const scenePublish = (id: string) => () => {
		serviceScene.scenePublish(id).then(res => {
			if (res.code === 200) {
				message.success("模板发布成功")
			}
		})
	}
	const resetNeighbors = (id: string) => () => {
		serviceScene.resetNeighbors(id).then(res => {
			if (res.code === 200) {
				message.success("邻接点重置成功")
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
									<Menu.Item hidden={item.visionDone !== "已完成"}>
										<a href={`${proxy.templateUrl[API_ENV]}/showcase/3.2/view.html?sceneId=${item.id}`} target="_blank">
											查看
										</a>
									</Menu.Item>
									<Menu.Item hidden={item.visionDone !== "已完成"}>
										<a
											href={`${proxy.templateUrl[API_ENV]}/showcase/3.2/smallMap.html?sceneId=${item.id}&token=${configUrl}`}
											target="_blank"
										>
											配置
										</a>
									</Menu.Item>
									<Menu.Item onClick={getSceneFromList(item.id)}>查看来源</Menu.Item>
									<Menu.Item onClick={editScene(item)}>修改</Menu.Item>
									{!item.hasTemplateCount && <Menu.Item onClick={deleteScene(item)}>删除</Menu.Item>}
									<Menu.Item hidden={item.visionDone !== "已完成"} onClick={updateObj(item.id, "更新模型")}>
										更新模型
									</Menu.Item>
									<Menu.Item hidden={item.visionDone !== "已完成"} onClick={updatePano(item.id, "更新全景图")}>
										更新全景图
									</Menu.Item>
									<Menu.Item hidden={item.visionDone !== "已完成"} onClick={clickMap(item.id)}>
										<Upload accept=".png, .jpg, .jpeg" customRequest={updateMap} showUploadList={false}>
											上传小地图
										</Upload>
									</Menu.Item>
									<Menu.Item hidden={item.visionDone !== "已完成"} onClick={scenePublish(item.id)}>
										发布模板
									</Menu.Item>
									<Menu.Item hidden={item.visionDone !== "已完成"} onClick={resetNeighbors(item.id)}>
										启用VR Path
									</Menu.Item>
									{/*<Menu.Item key="8">操作记录</Menu.Item>*/}
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
					<Space>
						<Button type="primary" onClick={addScene}>
							添加模版
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
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels([
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
					columns={returnColumnFields([
						"sort",
						"thumbnail",
						"sceneId",
						"sceneName",
						"hasTemplateCount",
						"sz",
						"validSz",
						"sweeps",
						"creatTs",
						"createName",
						"belonger",
						// "belongerTelephone",
						"visionDone"
					]).concat(columns)}
					apiService={serviceScene.sceneList}
				/>
			</Col>
		</Row>
	)
}
SceneTemplate.title = "模版列表"
export default SceneTemplate
