import { Button, Row, Col, Space, Popconfirm, Menu, Dropdown, message, Modal, notification } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceHall from "@/services/service.hall"
import { ModalCustom } from "@/components/modal/modal.context"
import CloneHallModal from "@/components/modal/cloneHall.modal"
import configServiceModal from "@/components/modal/configService.modal"
import CombinedHallInfo from "@/components/modal/combinedHallInfo.modal"
import proxy from "../../../../config/proxy"
import lsFunc from "@/utils/ls.func"
import { userData } from "@/interfaces/api.interface"

const getHallInfo = (id: string, id2: string) => () => {
	// serviceHall.getGroupTempId({})
	window.open(`${proxy.templateObsUrl[API_ENV]}/sceneFront/index.html?groupId=${id}`)
	// ModalCustom({
	// 	content: CombinedHallInfo,
	// 	params: {
	// 		id
	// 	}
	// })
}

const addHall = () => {
	ModalCustom({
		content: CombinedHallInfo
	})
}

const editHall = (id: string) => () => {
	ModalCustom({
		content: CombinedHallInfo,
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
			serviceHall.deleteZuheHall({ groupId: id }).then(rslt => {
				if (rslt.code === 200) {
					eventBus.emit("doHallTemplate")
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
								<Menu.Item onClick={getHallInfo(item.id, item.tempId)}>查看</Menu.Item>
								<Menu.Item onClick={editHall(item.id)}>编辑</Menu.Item>
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

const CombinedHall = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col></Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addHall}>
							添加
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
				<FormSearch fields={returnSearchFiels(["Zkeyword"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"ZCombinedHall",
						"Zname",
						"Zdescribe",
						"createName",
						"creatTs",
						"Zcode",
						"ZUrl"
					]).concat(columns)}
					apiService={serviceHall.zuheHallList}
				/>
			</Col>
		</Row>
	)
}
CombinedHall.title = "组合展厅"
export default CombinedHall
