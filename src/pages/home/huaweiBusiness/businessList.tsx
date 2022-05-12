import React, { useCallback, useEffect, useState } from "react"
import { Button, Col, Dropdown, Menu, message, Modal, Row, Space } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceBusiness from "@/services/service.business"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import addBusiness from "@/components/modal/business/addBusiness"
import eventBus from "@/utils/event.bus"
import { history } from "umi"
import { CloseCircleOutlined } from "@ant-design/icons"
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
								<Menu.Item onClick={editorBusiness(item.id)}>编辑</Menu.Item>
								<Menu.Item onClick={toPage("/home/huaweiBusiness/themeList.html", item.id, item.domainName, item.name)}>
									主题管理
								</Menu.Item>
								<Menu.Item
									onClick={toPage("/home/huaweiBusiness/businessList/templateLibrary.html", item.id, "", item.name)}
								>
									企业专属模版库
								</Menu.Item>
								<Menu.Item onClick={toPage("/home/business/businessList/resource.html", item.id)}>资源管理</Menu.Item>
								<Menu.Item onClick={toPage("/home/business/businessList/statistics.html", item.id)}>统计报表</Menu.Item>
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
const editorBusiness = (id: string) => () => {
	ModalCustom({
		content: addBusiness,
		params: {
			id,
			isShowRealm: true
		}
	})
}
const resetPass = (id: string) => () => {
	Modal.confirm({
		title: "重置密码",
		content: "是否重置当前帐号密码？",
		closable: true,
		onOk: () => {
			serviceBusiness.companyResetPass({ id }).then(res => {
				if (res.code === 200) {
					message.destroy()
					message.success("重置成功")
					eventBus.emit("doHotspotIcon")
				}
			})
		}
	})
}

const toPage = (url: string, id: string, domainName?: string, companyName?: string) => () => {
	history.push({
		pathname: url,
		state: { id, domainName, companyName }
	})
}
const BusinessList = () => {
	const [params, setParams] = useState({})
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>企业列表</Col>
			</Row>
		),
		[]
	)
	const add = () => {
		ModalCustom({
			content: addBusiness
		})
	}
	useEffect(() => {
		eventBus.on("getBusinessList", () => {
			setParams({})
		})
		return () => {
			eventBus.off("getBusinessList")
		}
	}, [])
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["Wname"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"companyName",
						"domainName",
						"packageStatus",
						"topicCount",
						"WtempCount",
						"childCount",
						"publishCount",
						"createTs",
						"companyStatus"
					]).concat(columns)}
					apiService={serviceBusiness.businessList}
				/>
			</Col>
		</Row>
	)
}

BusinessList.title = "企业列表"
export default BusinessList
