import React, { useCallback, useEffect, useState } from "react"
import { Button, Col, Dropdown, Menu, message, Modal, Row, Space } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceBusiness from "@/services/service.business"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddLoginManage from "@/components/modal/business/addLoginManage"
import eventBus from "@/utils/event.bus"
import { history } from "umi"
import { CloseCircleOutlined } from "@ant-design/icons"

const LoginManage = () => {
	const [params, setParams] = useState({})

	useEffect(() => {
		eventBus.on("getLoginList", () => {
			setParams({})
		})
		return () => {
			eventBus.off("getLoginList")
		}
	}, [])

	const add = () => {
		ModalCustom({
			content: AddLoginManage
		})
	}

	const edit = (id: string) => () => {
		ModalCustom({
			content: AddLoginManage,
			params: {
				id
			}
		})
	}

	const del = (id: string) => () => {
		Modal.confirm({
			title: "删除登录页模板",
			content: "是否删除当前登录页模板？",
			closable: true,
			onOk: () => {
				serviceBusiness.delLoginStyle(id).then(res => {
					if (res.code === 200) {
						message.success("删除成功！")
						eventBus.emit("getLoginList")
					}
				})
			}
		})
	}

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
									<Menu.Item onClick={edit(item.id)}>编辑</Menu.Item>
									{!v.relatedTopic && <Menu.Item onClick={del(item.id)}>删除</Menu.Item>}
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
				<Col>企业列表</Col>
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

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["Wname", "WRackStatus"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"loginTemThumb",
						"loginTemName",
						"relatedTopic",
						"rackStatus",
						"Wsort",
						"createTs",
						"createdName"
					]).concat(columns)}
					apiService={serviceBusiness.loginList}
				/>
			</Col>
		</Row>
	)
}

LoginManage.title = "登录管理"
export default LoginManage
