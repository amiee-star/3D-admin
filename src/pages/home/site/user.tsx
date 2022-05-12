import { Button, Row, Col, Space, Dropdown, Menu, message, Modal } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceSystem from "@/services/service.system"
import { ModalCustom } from "@/components/modal/modal.context"
import AddUser from "@/components/modal/addUser.modal"
import { CloseCircleOutlined } from "@ant-design/icons"
import DownloadFile from "@/utils/downloadFile.func"
import "./user.less"

const addScene = () => {
	ModalCustom({
		content: AddUser,
		params: {
			id: ""
		}
	})
}

const editScene = (id: string) => () => {
	ModalCustom({
		content: AddUser,
		params: {
			id
		}
	})
}

const unlocking = (id: string) => () => {
	serviceSystem.unlocking(id).then(res => {
		if (res.code == 200) {
			message.success("解锁用户成功！")
		}
	})
}
const resetPassword = (id: string) => () => {
	Modal.confirm({
		title: "重置密码",
		content: "是否重置当前帐号密码？",
		closable: true,
		onOk: () => {
			serviceSystem.resetPassword(id).then(res => {
				if (res.code == 200) {
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
				}
			})
		}
	})
}

const closeHandle = () => {
	message.destroy()
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
								<Menu.Item onClick={unlocking(item.id)}>解锁用户</Menu.Item>
								<Menu.Item onClick={resetPassword(item.id)}>重置密码</Menu.Item>
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

const SiteUser = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		withParams.current = params
		message.destroy()
	}, [params])

	//导出
	const exportHandle = () => {
		let newParams = {
			...withParams.current
		}
		delete newParams.pageNum
		serviceSystem.exportUser(newParams).then(res => {
			DownloadFile(res, "前端用户", "application/vnd.ms-excel")
		})
	}

	//导入
	const importHandle = useCallback(e => {
		setLoading(true)
		const file = e.target.files[0]
		e.target.value = ""
		if (
			file.type !== "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" &&
			file.type !== "application/vnd.ms-excel"
		) {
			message.error("暂不支持该文件类型")
			return
		}
		// if (file.size / 1024 / 1024 > 5) {
		// 	message.error("文件大小超过5MB")
		// 	return
		// }
		serviceSystem
			.importUser({ file: file })
			.then(res => {
				if (res.code == 200) {
					message.success("导入成功！")
				}
			})
			.finally(() => setLoading(false))
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>前端用户列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addScene}>
							添加
						</Button>
						<div>
							<input
								type="file"
								accept=".xlsx, .xls"
								id="file-input"
								style={{ display: "none" }}
								onChange={importHandle}
							/>
							<label htmlFor="file-input" className="upload">
								<Button>导入</Button>
							</label>
						</div>
						<Button onClick={exportHandle}>导出</Button>
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
		<Row className="data-form full siteUser">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["userSource", "userSceneType", "keyword", "startTime", "endTime"])}
					toSearch={setParams}
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
						"origin",
						"releaseNum",
						"publishCount",
						"industry",
						"productDemand",
						"city",
						"creatTs"
					]).concat(columns)}
					apiService={serviceSystem.websitUser}
					loading={loading}
				/>
			</Col>
		</Row>
	)
}
SiteUser.title = "前端用户管理"
export default SiteUser
