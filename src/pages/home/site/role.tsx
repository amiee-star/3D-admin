import { Button, Row, Col, Space, Dropdown, Menu, message, Modal } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddRole from "@/components/modal/addRole.modal"
import SetJurisdictionModal from "@/components/modal/setJurisdiction.modal"
import serviceSystem from "@/services/service.system"

const handle = (id: string) => () => {
	ModalCustom({
		content: AddRole,
		params: {
			id
		}
	})
}

const setHandle = (id: number) => () => {
	ModalCustom({
		content: SetJurisdictionModal,
		params: {
			id
		}
	})
}

const deleteRole = (item: any) => () => {
	if (item.hasTemplateCount) {
		message.error("当前角色已关联权限，无法删除")
	} else {
		Modal.confirm({
			title: "删除角色",
			content: "是否删除当前角色？",
			closable: true,
			onOk: () => {
				serviceSystem.delRole(item.id).then(rslt => {
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
const columns: ColumnType<any>[] = [
	{
		title: "操作",
		dataIndex: "sceneId",
		key: "sceneId",
		fixed: "right",
		width: 60,
		align: "center",
		render: (_v, item) => {
			return (
				<>
					<Dropdown
						overlay={
							<Menu>
								<Menu.Item onClick={handle(item.id)}>修改</Menu.Item>
								<Menu.Item onClick={setHandle(item.id)}>分配权限</Menu.Item>
								{!item.hasTemplateCount && <Menu.Item onClick={deleteRole(item)}>删除</Menu.Item>}
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
const SiteRole = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>角色列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle("")}>
							添加
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
				<FormSearch fields={returnSearchFiels(["keyword"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "roleName", "roleCode", "describe", "creatTs"]).concat(columns)}
					apiService={serviceSystem.rolrList}
				/>
			</Col>
		</Row>
	)
}
SiteRole.title = "角色管理"
export default SiteRole
