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

const Operation = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
		message.destroy()
	}, [params])
	const titleRender = useCallback(() => <Row justify="space-between" align="middle"></Row>, [])
	useEffect(() => {
		eventBus.on("doSceneTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSceneTemplate")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels(["keyword", "creator", "businessType", "startTime2", "endTime2"])}
					toSearch={setParams}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "logDesc", "businessDesc", "businessId", "creator", "createTs"])}
					apiService={serviceSystem.getLogList}
				/>
			</Col>
		</Row>
	)
}
Operation.title = "操作记录"
export default Operation
