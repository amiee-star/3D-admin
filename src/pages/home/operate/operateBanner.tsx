import { Row, Col, Modal, Button, Dropdown, Menu, Space, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceOperate from "@/services/service.operate"
import { ModalCustom } from "@/components/modal/modal.context"
import OperationBannerModal from "@/components/modal/operation.banner.modal"
import "./operateComment.less"

const OperateBanner = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const hasData = useRef(0)
	const handle = (id: number) => () => {
		ModalCustom({
			content: OperationBannerModal,
			params: {
				id
			}
		})
	}

	const deleteHandle = (id: any) => () => {
		if (hasData.current <= 1) {
			message.warning("最少有1个Banner位！")
		} else {
			Modal.confirm({
				title: "删除",
				content: "是否删除当前banner？",
				closable: true,
				onOk: () => {
					serviceOperate.deleteBanner({ id: id }).then(res => {
						if (res.code === 200) {
							eventBus.emit("doBannerList")
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
			width: 100,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item onClick={handle(item.id)}>修改</Menu.Item>
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
		eventBus.on("doBannerList", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doBannerList")
		}
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>Banner列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={handle(null)}>
							新增
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	const exportData = useCallback((data?: any[]) => {
		hasData.current = data.length
	}, [])

	return (
		<Row className="data-form full commentList">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["WshowType", "Woperation"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					exportData={exportData}
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"WcoverBanner",
						"Wbannername",
						"WbannerType",
						"WbannerShowType",
						"Wbannerlink",
						"Wsort"
					]).concat(columns)}
					apiService={serviceOperate.bannerList}
				/>
			</Col>
		</Row>
	)
}
OperateBanner.title = "Banner管理"
export default OperateBanner
