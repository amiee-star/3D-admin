import React, { useCallback, useEffect, useState } from "react"
import { Button, Col, Dropdown, Menu, Row, Space } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceSystem from "@/services/service.business"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import addTheme from "@/components/modal/business/addTheme"
import eventBus from "@/utils/event.bus"
import { history } from "umi"
import { PageProps } from "@/interfaces/app.interface"
interface loca {
	id: string
	domainName: string
	companyName: string
}
const themeList = (props: PageProps) => {
	const { id: companyId, domainName, companyName } = props.location.state as loca
	const [params, setParams] = useState({ companyId })
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
									<Menu.Item onClick={editorTheme(item.id)}>编辑</Menu.Item>
									<Menu.Item
										onClick={toPage("/home/business/businessList/themeList/templateList.html", item.id, item.name)}
									>
										模板管理
									</Menu.Item>
									<Menu.Item
										onClick={toPage("/home/huaweiBusiness/businessList/themeList/userList.html", item.id, item.name)}
									>
										用户管理
									</Menu.Item>
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
	const toPage = (url: string, id: string, name?: string) => () => {
		history.push({
			pathname: url,
			state: { topicId: id, companyId, companyName, name }
		})
	}
	const editorTheme = (id: string) => () => {
		ModalCustom({
			content: addTheme,
			params: {
				id,
				companyId,
				domainName,
				isShowRealm: true
			}
		})
	}
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
		ModalCustom({
			content: addTheme,
			params: {
				companyId,
				domainName
			}
		})
	}

	useEffect(() => {
		eventBus.on("getthemeList", () => {
			setParams({ companyId })
		})
		return () => {
			eventBus.off("getthemeList")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["Wname"])} toSearch={setParams} defaultParams={{ companyId }} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"topicName",
						"TdomainName",
						"tempCount",
						"sceneCount",
						"userCount",
						"createTs",
						"createdName"
					]).concat(columns)}
					apiService={serviceSystem.themeList}
				/>
			</Col>
		</Row>
	)
}

themeList.title = "主题管理"
themeList.menu = false
export default themeList
