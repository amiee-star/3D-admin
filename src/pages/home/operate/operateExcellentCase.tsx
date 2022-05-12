import { Button, Row, Col, Space, Modal, Menu, Dropdown, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import CaseModal from "@/components/modal/case.modal"
import serviceOperate from "@/services/service.operate"
import proxy from "../../../../config/proxy"

const addCase = () => {
	ModalCustom({
		content: CaseModal,
		params: {
			id: ""
		}
	})
}

const handle = (id: string) => () => {
	ModalCustom({
		content: CaseModal,
		params: {
			id
		}
	})
}

const deleteHandle = (id: number, caseStatus: number) => () => {
	if (caseStatus == 1) {
		message.warning("展厅已上架，无法删除！")
	} else {
		Modal.confirm({
			title: "删除精品案例",
			content: "是否删除当前精品案例？",
			closable: true,
			onOk: () => {
				serviceOperate.deleteCase({ id: id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doCaseList")
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
								<Menu.Item onClick={handle(item.id)}>修改</Menu.Item>
								<Menu.Item onClick={deleteHandle(item.id, item.caseStatus)}>删除</Menu.Item>
								{/* <Menu.Item>操作记录</Menu.Item> */}
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

const ExcellentCase = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>精品案例列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addCase}>
							添加案例
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doCaseList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doCaseList")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["tempName", "tempId", "styleId", "WisAdded", "area", "caseType","recomType",])}
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
						"validSz",
						"WstyleName2",
						"caseType",
						"creatTs",
						"WcaseStatus",
						"WcaseSort"
					]).concat(columns)}
					apiService={serviceOperate.getCaseList}
				/>
			</Col>
		</Row>
	)
}
ExcellentCase.title = "精品案例"
export default ExcellentCase
