import { Button, Row, Col, Space, Popconfirm, Menu, Dropdown, message, Modal, notification, Upload } from "antd"
import React, { useCallback, useEffect, useRef, useState, useContext } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceHall from "@/services/service.hall"
import { ModalCustom } from "@/components/modal/modal.context"
import AddHallModal from "@/components/modal/addHall.modal"
import EditHallModal from "@/components/modal/editHall.modal"
import CloneHallModal from "@/components/modal/cloneHall.modal"
import configServiceModal from "@/components/modal/configService.modal"
import HallInfoModal from "@/components/modal/hallInfo.modal"
import proxy from "../../../../config/proxy"
import { userContext } from "@/components/provider/user.context"
import serviceScene from "@/services/service.scene"
import { UploadRequestOption } from "rc-upload/lib/interface"

const SceneTemplate = () => {
	const [params, setParams] = useState({})
	const { state } = useContext(userContext)
	const { user } = state
	const configUrl = user.accessToken
	const withParams = useRef<any>()
	let tempId = ""
	useEffect(() => {
		withParams.current = params
	}, [params])

	const getHallInfo = (id: string) => () => {
		ModalCustom({
			content: HallInfoModal,
			params: {
				id
			}
		})
	}

	const addHall = () => {
		ModalCustom({
			content: AddHallModal
		})
	}

	const editHall = (id: string) => () => {
		ModalCustom({
			content: EditHallModal,
			params: {
				id
			}
		})
	}

	const deleteHall = (id: any) => () => {
		Modal.confirm({
			title: "删除展厅",
			content: "是否删除当前展厅？",
			closable: true,
			onOk: () => {
				serviceHall.deleteHall({ tempId: id }).then(rslt => {
					if (rslt.code === 200) {
						eventBus.emit("doHallTemplate")
						Modal.destroyAll()
						message.success("删除成功！")
					}
				})
			}
		})
	}
	const cloneHall = (item: any) => () => {
		ModalCustom({
			content: CloneHallModal,
			params: {
				id: item.id,
				name: item.tempName
			}
		})
	}
	const publishHall = (id: string) => () => {
		Modal.confirm({
			title: "发布展厅",
			content: "是否发布当前展厅？发布成功后将会变更未付款展厅的支付状态。",
			closable: true,
			onOk: () => {
				serviceHall.publishHall({ tempId: id }).then(rslt => {
					if (rslt.code === 200) {
						eventBus.emit("doHallTemplate")
						Modal.destroyAll()
						message.success("发布成功！")
					}
				})
			}
		})
	}

	const rerenderHall = (id: string) => () => {
		serviceHall.rerenderHall({ tempId: id }).then(rslt => {
			if (rslt.code === 200) {
				notification.info({
					message: `提示`,
					description: "重新渲染中,请稍后查看",
					placement: "bottomRight"
				})
				eventBus.emit("doHallTemplate")
				Modal.destroyAll()
			} else {
				message.warn(rslt.message)
			}
		})
	}

	const closestHall = (id: string) => () => {
		serviceHall.closestHall({ tempId: id }).then(rslt => {
			if (rslt.code === 200) {
				notification.info({
					message: `提示`,
					description: "邻接点更新中,请稍后查看",
					placement: "bottomRight"
				})
				eventBus.emit("doHallTemplate")
				Modal.destroyAll()
			} else {
				message.warn(rslt.message)
			}
		})
	}

	const configService = (id: string) => () => {
		ModalCustom({
			content: configServiceModal,
			params: {
				id
			}
		})
	}

	const clickMap = (id: string) => () => {
		tempId = id
	}

	const updateMap = (options: UploadRequestOption) => {
		const { file } = options
		const form = new FormData()
		form.append("file", file)
		serviceScene.miniTempMap(tempId, form).then(res => {
			if (res.code === 200) {
				message.success("上传成功")
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
									<Menu.Item>
										<a
											href={`${
												item.aliStatic === 0 ? proxy.templateUrl[API_ENV] : proxy.templateObsUrl[API_ENV]
											}/sceneFront/index.html?G_TEMP_ID=${item.id}`}
											target="_blank"
										>
											查看展厅
										</a>
									</Menu.Item>
									<Menu.Item>
										<a href={`${proxy.hallUrl[API_ENV]}/?tempId=${item.id}&token=${configUrl}`} target="_blank">
											配置展厅
										</a>
									</Menu.Item>
									<Menu.Item onClick={getHallInfo(item.id)}>查看信息</Menu.Item>
									<Menu.Item onClick={editHall(item.id)}>修改</Menu.Item>
									<Menu.Item onClick={cloneHall(item)}>复制</Menu.Item>
									<Menu.Item onClick={publishHall(item.id)}>发布</Menu.Item>
									{item.renderFlowStatus !== 2 && item.renderFlowStatus !== 3 && (
										<Menu.Item onClick={rerenderHall(item.id)}>渲染发布</Menu.Item>
									)}
									{/*<Menu.Item onClick={closestHall(item.id)}>邻接点</Menu.Item>*/}
									<Menu.Item onClick={clickMap(item.id)}>
										<Upload accept=".png, .jpg, .jpeg" customRequest={updateMap} showUploadList={false}>
											上传小地图
										</Upload>
									</Menu.Item>
									{/*<Menu.Item>操作记录</Menu.Item>*/}
									<Menu.Item onClick={configService(item.id)}>增值服务配置</Menu.Item>
									{item.fastLayout && (
										<Menu.Item>
											<a
												href={`${proxy.hallUrl[API_ENV]}/?tempId=${item.id}&isAddStand=1&token=${configUrl}`}
												target="_blank"
											>
												展位配置
											</a>
										</Menu.Item>
									)}
									{item.fastLayout && (
										<Menu.Item>
											<a
												href={`${
													item.aliStatic === 0 ? proxy.templateUrl[API_ENV] : proxy.templateObsUrl[API_ENV]
												}/sceneFront/index.html?G_TEMP_ID=${item.id}&isFastView=1`}
												target="_blank"
											>
												查看展位
											</a>
										</Menu.Item>
									)}
									<Menu.Item onClick={deleteHall(item.id)}>删除</Menu.Item>
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

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>展厅列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addHall}>
							添加展厅
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doHallTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doHallTemplate")
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
						"sceneId",
						// "typeId",
						// "styleId",
						"HallSceneFrom",
						"aliStatic",
						"isCheck",
						"boutique",
						"varSetting",
						"renderFlowStatus",
						"fastLayout",
						"valueAddedService",
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
						"hallName",
						// "sz",
						"validSz",
						// "hallType",
						"creatTs",
						"user",
						"sceneFromVal",
						"boutique",
						"aliStatic",
						"isCheck",
						"fastLayout",
						"renderFlowStatus"
					]).concat(columns)}
					apiService={serviceHall.hallList}
				/>
			</Col>
		</Row>
	)
}
SceneTemplate.title = "展厅列表"
export default SceneTemplate
