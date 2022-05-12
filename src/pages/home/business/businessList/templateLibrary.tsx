import React, { useCallback, useEffect, useState, useRef, useContext } from "react"
import { Button, Col, Dropdown, Menu, message, Row, Space, Modal } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceBusiness from "@/services/service.business"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import { userContext } from "@/components/provider/user.context"
import TemplateLibraryModal from "@/components/modal/business/templateLibrary.modal"
import { PageProps } from "@/interfaces/app.interface"
import proxy from "../../../../../config/proxy"
import eventBus from "@/utils/event.bus"
import { history } from "umi"

interface loca {
	id: string
	companyName?: string
}

const TemplateLibrary = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const { state } = useContext(userContext)
	const { user } = state
	const { id: companyId, companyName } = props.location.state as loca
	const configUrl = user.accessToken

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
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
										<a href={`${proxy.hallUrl[API_ENV]}/?tempId=${item.tempId}&token=${configUrl}`} target="_blank">
											配置模板
										</a>
									</Menu.Item>
									<Menu.Item>
										<a
											href={`${
												item.aliStatic === 0 ? proxy.templateUrl[API_ENV] : proxy.templateObsUrl[API_ENV]
											}/sceneFront/index.html?G_TEMP_ID=${item.tempId}`}
											target="_blank"
										>
											查看模板
										</a>
									</Menu.Item>
									<Menu.Item onClick={updateTemplate(item.tempId)}>更新模板</Menu.Item>
									<Menu.Item onClick={handle(companyId, item.id)}>编辑</Menu.Item>
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
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>
					<div
						style={{ cursor: "pointer" }}
						onClick={() => {
							history.goBack()
						}}
					>
						企业名称：{companyName}
					</div>
				</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle(companyId, "")}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		eventBus.on("getTemplateLibrary", () => {
			setParams({ ...withParams.current })
		})
		return () => {
			eventBus.off("getTemplateLibrary")
		}
	}, [])

	const updateTemplate = (tempId: string) => () => {
		Modal.confirm({
			title: "更新展厅模板",
			content: "是否更新当前展厅模板？",
			closable: true,
			onOk: () => {
				serviceBusiness.updateTemplate(tempId).then(res => {
					if (res.code == 200) {
						message.success("模板更新成功！")
					}
				})
			}
		})
	}

	const handle = (companyId?: string, id?: string) => () => {
		ModalCustom({
			content: TemplateLibraryModal,
			params: {
				companyId,
				id
			}
		})
	}

	const deleteHandle = (id: string) => () => {
		Modal.confirm({
			title: "删除展厅模板",
			content: "是否删除当前展厅模板？删除后主题下将不再显示此模板展厅",
			closable: true,
			onOk: () => {
				serviceBusiness.companyTempDelete({ id: id }).then(res => {
					if (res.code == 200) {
						message.success("删除成功！")
						eventBus.emit("getTemplateLibrary")
					}
				})
			}
		})
	}

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["tempName", "tempId"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"hallThumbnail",
						"devHallName",
						"validSz",
						"sweeps",
						"creatTs",
						"user",
						"createType"
					]).concat(columns)}
					apiService={serviceBusiness.getTempList}
					aipParam={{ companyId: companyId }}
				/>
			</Col>
		</Row>
	)
}

TemplateLibrary.title = "企业专属模版库"
TemplateLibrary.menu = false
export default TemplateLibrary
