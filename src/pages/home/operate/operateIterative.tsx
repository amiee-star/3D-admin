import { Row, Col, Modal, Button, Dropdown, Menu, Space, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceOperate from "@/services/service.operate"
import proxy from "../../../../config/proxy"
import { history } from "umi"
import "./operateComment.less"

const operateIterative = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const hasData = useRef(0)
	const addhandle = (id: string) => () => {
		history.push({
			pathname: "/home/operate/operateIterativeInfo.html",
			state: { id }
		})
	}

	const deleteHandle = (id: any) => () => {
		Modal.confirm({
			title: "删除",
			content: "是否删除？",
			closable: true,
			onOk: () => {
				serviceOperate.upgradeDelete({ id: id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doUpgradeList")
						Modal.destroyAll()
						message.success("删除成功！")
					}
				})
			}
		})
	}
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
									<Menu.Item onClick={addhandle(item.id)}>编辑</Menu.Item>
									{/* <Menu.Item>
										<a href={`${proxy.hallUrl[API_ENV]}/?tempId=${item.id}&token=${configUrl}`} target="_blank">
											预览
										</a>
									</Menu.Item> */}
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
		eventBus.on("doUpgradeList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doUpgradeList")
		}
	}, [])

	const exportData = useCallback((data?: any[]) => {
		hasData.current = data.length
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>迭代更新列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addhandle(null)}>
							新增
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	return (
		<Row className="data-form full commentList">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["Zkeyword"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					exportData={exportData}
					searchParams={params}
					columns={returnColumnFields(["sort", "Wbannername", "Wstatus"]).concat(columns)}
					apiService={serviceOperate.getupgradeList}
				/>
			</Col>
		</Row>
	)
}
operateIterative.title = "迭代更新管理"
export default operateIterative
