import { Row, Col, Modal, Button, Dropdown, Menu, Space, Radio, message, Table, Tooltip, Image } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { ColumnType } from "antd/es/table/interface"
import storage from "./config/storage.js"
import "./operateComment.less"
import { wrap } from "lodash"

const AVStorage = new storage({
	table: "Comment",
	appId: "4cG6KBG54iv4KdOhfOwagBBu-gzGzoHsz",
	appKey: "kSAwH65w4qmnpQgOBa4qvwBA",
	username: "664782270@qq.com",
	password: "123456"
})

const uas = {
	wxapp: "小程序"
	// "art-office": "3D云展官网"
}
if (API_ENV == "pro") {
	uas["art-core"] = "官网"
} else {
	uas["art-core-mo"] = "官网"
}
interface TestDataItem {
	name: string
	hallId: string
	srcSubType: string
	commentContent: string
	createDate: string
	examine: string
}

const OperateComment = () => {
	const [params, setParams] = useState({})
	const [] = useState([])
	const withParams = useRef<any>()
	const [dataSource, setDataSource] = useState([])
	const [Pagination, setPagination] = useState({})
	const [currPage, setCurrPage] = useState(1)
	const [selectedRowKeys, setSelectedRowKeys] = useState([])
	const onSelectChange = (selectedRowKeys: React.SetStateAction<any[]>) => {
		setSelectedRowKeys(selectedRowKeys)
	}
	const onRemoves = () => {
		if (!selectedRowKeys || selectedRowKeys.length == 0) {
			message.warning("请先选择需要删除的内容")
			return
		}
		Modal.confirm({
			title: "警告",
			content: "是否确认删除，删除后将不可恢复",
			onOk: () => {
				AVStorage.removes(selectedRowKeys).then(() => {
					message.success("删除成功")
					setSelectedRowKeys([])
					getList(currPage, params)
				})
			}
		})
	}

	const updates = () => {
		if (!selectedRowKeys || selectedRowKeys.length == 0) {
			message.warning("请先选择需要通过的内容")
			return
		}
		AVStorage.updateStates(selectedRowKeys, 2).then(() => {
			message.success("更新成功")
			setSelectedRowKeys([])
			getList(currPage, params)
		})
	}

	const rowSelection = {
		selectedRowKeys,
		onChange: onSelectChange,
		getCheckboxProps: (record: { name: string }) => ({
			disabled: record.name === "Disabled User", // Column configuration not to be checked
			name: record.name
		})
	}

	const deleteHandle = (id: any) => () => {
		Modal.confirm({
			title: "警告",
			content: "是否确认删除，删除后将不可恢复",
			closable: true,
			onOk: () => {
				AVStorage.remove(id).then(() => {
					message.success("更新成功")
					getList(currPage, params)
				})
			}
		})
	}

	const handleSizeChange = (recode: any, e: any) => {
		let v = e.target.value
		AVStorage.updateState(recode.id, v).then(() => {
			message.success("更新成功")
			getList(currPage, params)
		})
	}

	const columns: ColumnType<any>[] = [
		{
			title: "姓名",
			key: "nick",
			width: "120px",
			render(record) {
				let uid = "无信息"
				if (record.attach && record.attach.userId) {
					uid = record.attach.userId
				}
				return (
					<span style={{ display: "flex", flexWrap: "wrap" }}>
						{record.avatar && <Image style={{ maxWidth: "100%", cursor: "pointer" }} src={record.avatar} alt="" />}
						<Tooltip title={uid}>
							<span>{record.nick}</span>
						</Tooltip>
					</span>
				)
			}
		},
		{
			title: "展厅ID",
			key: "url",
			width: "120px",
			render(record) {
				return (
					<span>
						<Tooltip title={record.url}>
							<span>{record.url}</span>
						</Tooltip>
					</span>
				)
			}
		},
		{
			title: "来源",
			key: "ua",
			width: "120px",
			render(record) {
				let ua = uas[record.ua] || "其他"
				return <span>{ua}</span>
			}
		},
		{
			title: "内容",
			key: "comment",
			render(recode) {
				let cls = ""
				let comment = recode.comment
				if (comment && comment.indexOf("*") >= 0) {
					cls = "danger"
				}
				return <span className={cls}>{comment}</span>
			}
		},
		{
			title: "创建时间",
			dataIndex: "_createAt",
			key: "_createAt",
			width: "180px"
		},

		{
			title: "审核",
			key: "check",
			width: "240px",
			render(record) {
				return (
					<span>
						<Radio.Group value={record.state} onChange={handleSizeChange.bind(this, record)}>
							<Radio.Button value="1">未审核</Radio.Button>
							<Radio.Button value="2">通过</Radio.Button>
							<Radio.Button value="3">未通过</Radio.Button>
						</Radio.Group>
					</span>
				)
			}
		},
		{
			title: "操作",
			key: "operate",
			width: 80,
			fixed: "right",
			render(record) {
				return (
					<>
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item onClick={deleteHandle(record.id)}>删除</Menu.Item>
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
		getList(1, params)
	}, [params])

	useEffect(() => {
		eventBus.on("doCommentTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doCommentTemplate")
		}
	}, [])

	const getList = (currentPage: number, params?: {}) => {
		const pageSize = 10
		currentPage = currentPage || 1
		AVStorage.list({ currentPage, pageSize, params }).then((res: { currentPage: any; list: any; count: any }) => {
			setCurrPage(res.currentPage)
			setDataSource(res.list)
			setPagination({
				pageSize: pageSize,
				current: res.currentPage,
				total: res.count,
				onChange(e: number) {
					getList(e, params)
				}
			})
		})
	}

	useEffect(() => {
		getList(1)
	}, [])

	return (
		<Row className="data-form full commentList">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["Wstate", "Wua", "Wurl"])} toSearch={setParams} />
			</Col>
			<Col className="form-btn" span={24}>
				<Row justify="space-between" align="middle">
					<Col>评论列表</Col>
					<Col>
						<Space>
							<Button type="primary" danger onClick={onRemoves}>
								删除选中
							</Button>
							<Button type="primary" onClick={updates}>
								通过选中
							</Button>
						</Space>
					</Col>
				</Row>
			</Col>
			<Col className="form-result" span={24}>
				<Table
					rowSelection={rowSelection}
					dataSource={dataSource}
					columns={columns}
					rowKey={recode => recode.id}
					pagination={Pagination}
				/>
			</Col>
		</Row>
	)
}
OperateComment.title = "评论管理"
export default OperateComment
