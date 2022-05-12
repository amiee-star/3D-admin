import { Button, Row, Col, Space, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddsystemUser from "@/components/modal/addsystemUser.modal"
import SetJurisdiction from "@/components/modal/setJurisdiction"
import serviceSystem from "@/services/service.system"
import { CloseCircleOutlined } from "@ant-design/icons"

const SiteSystemUser = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	useEffect(() => {
		withParams.current = params
		message.destroy()
	}, [params])

	const resetPassword = (id: string) => () => {
		Modal.confirm({
			title: "重置密码",
			content: "是否重置当前帐号密码？",
			closable: true,
			onOk: () => {
				serviceSystem.resetPassWord(id).then(res => {
					if (res.code === 200) {
						message.destroy()
						message.success({
							className: "alertMessage",
							content: (
								<p>
									<span>{`新密码：${res.data}`}</span>
									<CloseCircleOutlined onClick={closeHandle} />
								</p>
							),
							duration: 0
						})
						eventBus.emit("doHotspotIcon")
					}
				})
			}
		})
	}

	const unlockUser = (item: { id: string; username: string }) => () => {
		Modal.confirm({
			title: "解锁用户",
			content: `是否解锁当前用户"${item.username}"？`,
			closable: true,
			onOk: () => {
				serviceSystem.unlockUser(item.id).then(res => {
					if (res.code === 200) {
						message.destroy()
						message.success("解锁用户成功！")
						eventBus.emit("doHotspotIcon")
					}
				})
			}
		})
	}

	const closeHandle = () => {
		message.destroy()
	}

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>系统用户列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addScene}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	const addScene = () => {
		ModalCustom({
			content: AddsystemUser,
			params: {
				id: ""
			}
		})
	}

	const editScene = (id: string) => () => {
		ModalCustom({
			content: AddsystemUser,
			params: {
				id
			}
		})
	}

	const setJur = (id: string) => () => {
		ModalCustom({
			content: SetJurisdiction,
			params: {
				id
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
									<Menu.Item onClick={editScene(item.id)}>修改</Menu.Item>
									{/* <Menu.Item onClick={setJur(item.id)}>分配角色</Menu.Item> */}
									<Menu.Item onClick={resetPassword(item.id)}>重置密码</Menu.Item>
									<Menu.Item onClick={unlockUser(item)}>解锁用户</Menu.Item>
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

	useEffect(() => {
		eventBus.on("doSceneTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSceneTemplate")
		}
	}, [])

	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["keyword", "Wactive"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"account",
						"WrealName",
						"roleList",
						"Wactive",
						"WcreateUsername",
						"creatTs"
					]).concat(columns)}
					apiService={serviceSystem.sysUser}
				/>
			</Col>
		</Row>
	)
}
SiteSystemUser.title = "系统用户管理"
export default SiteSystemUser
