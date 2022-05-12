import { Row, Col, Modal, Button, Dropdown, Menu, Space, Tooltip, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceOperate from "@/services/service.operate"
import fromTableHallModal from "@/components/modal/fromTableHall.modal"
import "./operateComment.less"
import FontIcon, { FontKey } from "@/components/utils/font.icon"
import { ModalCustom } from "@/components/modal/modal.context"

const OperateHall = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()

	const deleteHandle = (id: number) => () => {
		Modal.confirm({
			title: "删除",
			content: "是否删除当前表单？",
			closable: true,
			onOk: () => {
				serviceOperate.deleteHallForm({ id: id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doFormList")
						Modal.destroyAll()
						message.success("删除成功！")
					}
				})
			}
		})
	}

	const handle = (id: number) => () => {
		ModalCustom({
			content: fromTableHallModal,
			params: {
				id
			}
		})
	}

	const processColumns: ColumnType<any>[] = [
		{
			title: "处理状态",
			dataIndex: "status",
			key: "status",
			width: 180,
			align: "center",
			render: (v, item) => {
				return (
					<>
						{(item.status == "可跟进客户" || item.status == "无效客户") && (
							<Tooltip placement="top" title={item?.remark}>
								<span className="Wcustomer" style={{ cursor: "pointer" }}>
									{item.status}
								</span>
								<FontIcon icon={FontKey.pinglunguanli} />
							</Tooltip>
						)}
						{item.status == "未处理" && <span style={{ color: "#F56C6C" }}>未处理</span>}
					</>
				)
			}
		}
	]

	const columns: ColumnType<any>[] = [
		{
			title: "操作",
			dataIndex: "sceneId",
			key: "sceneId",
			fixed: "right",
			width: 100,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<Dropdown
							overlay={
								<Menu>
									{item.status == "未处理" && <Menu.Item onClick={handle(item.id)}>处理</Menu.Item>}
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

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		eventBus.on("doFormList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doFormList")
		}
	}, [])

	return (
		<Row className="data-form full commentList">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["WStatus", "WcustomType", "keyword"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"telephone",
						"WcustomType",
						"Wsz",
						"WapplyTime",
						"Whandler",
						"WprocessTime"
					]).concat(processColumns, columns)}
					apiService={serviceOperate.hallList}
				/>
			</Col>
		</Row>
	)
}
OperateHall.title = "展厅定制"
export default OperateHall
