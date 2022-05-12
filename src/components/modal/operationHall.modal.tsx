import serviceSystem from "@/services/service.system"
import { regxSPhone } from "@/utils/regexp.func"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Input, Form, Checkbox, Select, Radio, Table } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import eventBus from "@/utils/event.bus"
import { ModalRef } from "./modal.context"

interface Props {
	id: string
}

const OperationHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	useEffect(() => {
		serviceSystem.sysUserInfo(props.id).then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					...res.data
				})
			}
		})
	}, [props.id])

	return (
		<Card
			style={{ width: 530 }}
			title="操作记录"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="globalScroll">
				<ListTable
					size="small"
					searchParams={{}}
					columns={returnColumnFields(["WOperation", "WOperationTime", "WOperationUser"])}
					apiService={serviceSystem.sysUser}
				/>
			</div>
		</Card>
	)
}

export default OperationHallModal
