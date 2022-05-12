import { Row, Col, Menu, Dropdown, message, Modal } from "antd"
import React, { useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import RenderInfoModel from "@/components/modal/renderInfo.modal"
import serviceScene from "@/services/service.scene"

const SceneRender = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		withParams.current = params
	}, [params])

	const topping = (id: string) => () => {
		serviceScene.topping(id).then(res => {
			if (res.code == 200) {
				message.success("置顶成功！")
				eventBus.emit("doSceneRender")
			}
		})
	}

	const cancelQueue = (id: string) => () => {
		Modal.confirm({
			title: "是否取消排队？",
			content: "",
			closable: true,
			onOk: () => {
				serviceScene.cancelQueue(id).then(res => {
					if (res.code == 200) {
						message.success("取消排队成功！")
						eventBus.emit("doSceneRender")
					}
				})
			}
		})
	}

	const viewdetails = (id: string) => () => {
		ModalCustom({
			content: RenderInfoModel,
			params: {
				id
			}
		})
	}

	const reshading = (tempId: string) => () => {
		Modal.confirm({
			title: "是否重新渲染展厅？",
			content: "渲染完成后会自动发布展厅",
			closable: true,
			onOk: () => {
				serviceScene.reshading(tempId).then(res => {
					if (res.code == 200) {
						message.success("重渲成功！")
						eventBus.emit("doSceneRender")
					}
				})
			}
		})
	}

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "",
			key: "",
			fixed: "right",
			width: 60,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<Dropdown
							overlay={
								<Menu>
									{item.renderStatus == 1 && <Menu.Item onClick={reshading(item.tempId)}>重渲</Menu.Item>}
									{item.renderStatus == 1 && <Menu.Item onClick={viewdetails(item.id)}>查看详情</Menu.Item>}
									{item.renderStatus == 3 && !item.topStatus && <Menu.Item onClick={topping(item.id)}>置顶</Menu.Item>}
									{item.renderStatus == 3 && <Menu.Item onClick={cancelQueue(item.id)}>取消排队</Menu.Item>}
								</Menu>
							}
							trigger={["click"]}
						>
							<a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
								{item.renderStatus !== 2 ? "操作" : ""}
							</a>
						</Dropdown>
					</>
				)
			}
		}
	]

	useEffect(() => {
		eventBus.on("doSceneRender", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSceneRender")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["tempName", "tempId"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"wid",
						"hallThumbnail",
						"devHallName",
						"validSz",
						"sweeps",
						"createTs",
						"Wnickname",
						"WrenderStatus"
					]).concat(columns)}
					apiService={serviceScene.renderQueue}
				/>
			</Col>
		</Row>
	)
}
SceneRender.title = "渲染管理"
export default SceneRender
