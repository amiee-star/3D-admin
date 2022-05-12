import React, { useCallback, useEffect, useState } from "react"
import { Button, Col, Dropdown, Menu, Row, Space, message, Modal } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceSystem from "@/services/service.business"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import addUser from "@/components/modal/business/addUser"
import allocate from "@/components/modal/business/allocateResources"
import { CloseCircleOutlined } from "@ant-design/icons"
import eventBus from "@/utils/event.bus"
import { PageProps } from "@/interfaces/app.interface"
import { history } from "umi"

interface loca {
	companyId?: string
	topicId: string
	companyName?: string
	name?: string
}
const userList = (props: PageProps) => {
	const { companyId, topicId, companyName, name } = props.location.state as loca
	const [params, setParams] = useState({ topicId })
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
									<Menu.Item onClick={allocateResource(item.id)}>资源分配</Menu.Item>
									<Menu.Item onClick={resetPass(item.id)}>重置密码</Menu.Item>
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
	const resetPass = (id: string) => () => {
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
						eventBus.emit("getuserList")
					}
				})
			}
		})
	}

	const closeHandle = () => {
		message.destroy()
	}

	const editorTheme = (id: string) => () => {
		ModalCustom({
			content: addUser,
			params: {
				id,
				companyId
			}
		})
	}
	const allocateResource = (id: string) => () => {
		ModalCustom({
			content: allocate,
			params: {
				id,
				companyId
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
			</Row>
		),
		[]
	)
	const add = () => {
		ModalCustom({
			content: addUser,
			params: {
				companyId,
				topicId
			}
		})
	}

	useEffect(() => {
		eventBus.on("getuserList", () => {
			setParams({ topicId })
		})
		return () => {
			eventBus.off("getuserList")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["keyword", "userSceneType", "areaId", "startTime", "endTime"])}
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
						"account",
						"telephone",
						"Wnickname",
						"releaseNum",
						"publishCount",
						"areaRemark",
						"createTs"
					]).concat(columns)}
					apiService={serviceSystem.topicUsersList}
				/>
			</Col>
		</Row>
	)
}

userList.title = "用户管理"
userList.menu = false
export default userList
