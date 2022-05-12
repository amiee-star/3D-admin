import { Button, Row, Col, Space, Menu, Dropdown, message, Modal } from "antd"
import React, { useCallback, useEffect, useRef, useState, useContext } from "react"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceBusiness from "@/services/service.business"
import serviceHall from "@/services/service.hall"
import { ModalCustom } from "@/components/modal/modal.context"
import AddHallModal from "@/components/modal/business/addHall.modal"
import EditHallModal from "@/components/modal/business/editHall.modal"
import CloneHallModal from "@/components/modal/business/cloneHall.modal"
import HallInfoModal from "@/components/modal/business/hallInfo.modal"
import ValueAddedServiceModal from "@/components/modal/business/valueAddedService.modal"
import TableSearch from "@/components/tableSearch/tableSearch"
import proxy from "../../../../config/proxy"
import { userContext } from "@/components/provider/user.context"

const businessHallList = () => {
	const [params, setParams] = useState({})
	const { state } = useContext(userContext)
	const { user } = state
	const configUrl = user.accessToken
	const withParams = useRef<any>()
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

	const getServiceModal = (id: string) => () => {
		ModalCustom({
			content: ValueAddedServiceModal,
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

	const deleteHall = (id: string) => () => {
		Modal.confirm({
			title: "删除展厅",
			content: "是否删除当前展厅？",
			closable: true,
			onOk: () => {
				serviceBusiness.deleteHall({ id: id }).then(rslt => {
					if (rslt.code === 200) {
						eventBus.emit("doBusinessHallList")
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
				id: item.tempId,
				name: item.tempName
			}
		})
	}

	const publishHall = (id: string) => () => {
		Modal.confirm({
			title: "发布展厅",
			content: "是否发布该展厅？除超级管理员外其他权限发布展厅会消耗相应资源",
			closable: true,
			onOk: () => {
				serviceBusiness.publishHall({ tempId: id }).then(rslt => {
					if (rslt.code === 200) {
						eventBus.emit("doBusinessHallList")
						Modal.destroyAll()
						message.success("发布成功！")
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
									<Menu.Item>
										<a
											href={`${
												item.aliStatic === 0 ? proxy.templateUrl[API_ENV] : proxy.templateObsUrl[API_ENV]
											}/sceneFront/index.html?G_TEMP_ID=${item.tempId}`}
											target="_blank"
										>
											查看展厅
										</a>
									</Menu.Item>
									<Menu.Item>
										<a href={`${proxy.hallUrl[API_ENV]}/?tempId=${item.tempId}&token=${configUrl}`} target="_blank">
											配置展厅
										</a>
									</Menu.Item>
									<Menu.Item onClick={getHallInfo(item.tempId)}>查看信息</Menu.Item>
									<Menu.Item onClick={getServiceModal(item.tempId)}>增值服务</Menu.Item>
									<Menu.Item onClick={editHall(item.id)}>修改</Menu.Item>
									<Menu.Item onClick={cloneHall(item)}>复制</Menu.Item>
									<Menu.Item onClick={publishHall(item.tempId)}>发布</Menu.Item>
									{item.aliStatic !== 2 && <Menu.Item onClick={deleteHall(item.id)}>删除</Menu.Item>}
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
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doBusinessHallList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doBusinessHallList")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<TableSearch toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"hallThumbnail",
						"WhallName",
						"validSz",
						"sweeps",
						"creatTs",
						"createName",
						"Wusername",
						"aliStatic",
						"isCheck"
					]).concat(columns)}
					apiService={serviceBusiness.getTempPageList}
				/>
			</Col>
		</Row>
	)
}
businessHallList.title = "企业展厅列表"
export default businessHallList
