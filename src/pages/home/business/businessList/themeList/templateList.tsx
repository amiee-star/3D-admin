import React, { useCallback, useContext, useEffect, useState } from "react"
import { Button, Col, Dropdown, Menu, message, Modal, Row, Space } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceSystem from "@/services/service.business"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import editorTempScene from "@/components/modal/business/editorTempScene"
import eventBus from "@/utils/event.bus"
import { history } from "umi"
import proxy from "@/../config/proxy"
import { userContext } from "@/components/provider/user.context"
import { PageProps } from "@/interfaces/app.interface"
interface loca {
	topicId: string
	companyId: string
	companyName?: string
	name?: string
}
const tempList = (props: PageProps) => {
	const { topicId, companyId, companyName, name } = props.location.state as loca
	const [params, setParams] = useState({ topicId })
	const { state } = useContext(userContext)
	const { user } = state
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
										<a
											href={`${
												item.aliStatic === 0 ? proxy.templateUrl[API_ENV] : proxy.templateObsUrl[API_ENV]
											}/sceneFront/index.html?G_TEMP_ID=${item.tempId}`}
											target="_blank"
										>
											查看模板
										</a>
									</Menu.Item>
									{/* {!item.publicAttr && (
										<Menu.Item>
											<a href={`${proxy.hallUrl[API_ENV]}/?tempId=${item.tempId}&token=${configUrl}`} target="_blank">
												配置模板
											</a>
										</Menu.Item>
									)} */}
									<Menu.Item onClick={editorTemp(item.id)}>编辑</Menu.Item>
									<Menu.Item onClick={delTemp(item.id)}>删除</Menu.Item>
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
	const editorTemp = (id: string) => () => {
		ModalCustom({
			content: editorTempScene,
			params: {
				id,
				topicId
			}
		})
	}

	const delTemp = (id: string) => () => {
		Modal.confirm({
			title: "删除展厅模板",
			content: "是否删除当前展厅模板？删除后主题下将不再显示此模板展厅",
			closable: true,
			onOk: () => {
				serviceSystem.tempDelete({ id }).then(res => {
					if (res.code === 200) {
						message.success("删除成功！")
						eventBus.emit("getTempList")
					}
				})
			}
		})
	}

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>
					<div className="crumbs" style={{ display: "flex" }}>
						<span
							style={{ marginRight: "20px", cursor: "pointer" }}
							onClick={() => {
								history.go(-2)
							}}
						>
							企业名称：{companyName}
						</span>
						<span
							style={{ cursor: "pointer" }}
							onClick={() => {
								history.goBack()
							}}
						>
							主题名称：{name}
						</span>
					</div>
				</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={add}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	const add = () => {
		history.push({
			pathname: "/home/business/businessList/themeList/templateList/chooseTemplate.html",
			state: {
				topicId,
				companyId
			}
		})
	}

	useEffect(() => {
		eventBus.on("getTempList", () => {
			setParams({ topicId })
		})
		return () => {
			eventBus.off("getTempList")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["WtempId", "templateName", "publicAttr", "area"])}
					toSearch={setParams}
					defaultParams={{ topicId }}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"hallThumbnail",
						"tempName",
						"validSz",
						"sweeps",
						"createTs",
						"user",
						"createType",
						"publicAttr"
					]).concat(columns)}
					apiService={serviceSystem.topicTempList}
				/>
			</Col>
		</Row>
	)
}

tempList.title = "模板管理"
tempList.menu = false
export default tempList
