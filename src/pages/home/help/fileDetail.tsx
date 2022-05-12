import { Button, Row, Col, Space, Dropdown, Menu, Modal, message, Form, Input, InputNumber, Select } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { PageProps } from "@/interfaces/app.interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddHelpFileDetailModal from "@/components/modal/addHelpFileDetail.modal"
import serviceHelp from "@/services/service.help"
import TextArea from "antd/lib/input/TextArea"
import limitNumber from "@/utils/checkNum.func"
import FormEditor from "@/components/form/form.editor"
import "./fileDetail.less"
const HelpFileDetail = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const [form] = Form.useForm()
	const [showAdd, setShowAdd] = useState(false)
	const [isAdd, setIsAdd] = useState(true)
	const [updateId, setUpdateId] = useState("")
	const [isClick, setIsClick] = useState(false)
	const closeModal = useCallback(() => {
		setShowAdd(false)
		setIsClick(false)
		setIsAdd(false)
	}, [])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>文档详情列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addHelpFile}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doStyle", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doStyle")
		}
	}, [])
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
									<Menu.Item onClick={editHandle(item.id)}>修改</Menu.Item>
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
	// 添加文件详情
	const addHelpFile = () => {
		// ModalCustom({
		// 	content: AddHelpFileDetailModal,
		// 	params: {
		// 		id: ""
		// 	}
		// })
		setShowAdd(true)
		setIsAdd(true)
	}
	const [infoData, setInfoData] = useState<any>({})
	// 编辑文件详情
	const editHandle = useCallback(
		(id: any) => () => {
			// ModalCustom({
			// 	content: AddHelpFileDetailModal,
			// 	params: {
			// 		id: id
			// 	}
			// })
			setUpdateId(id)
			serviceHelp.getFileDetailInfo({ id }).then(res => {
				if (res.code === 200) {
					form.setFieldsValue({
						...res.data
					})
					setInfoData(res.data)
				}
			})
			setShowAdd(true)
			setIsAdd(false)
		},
		[isAdd, updateId]
	)
	// 删除
	const deleteHandle = (id: string) => () => {
		Modal.confirm({
			title: "删除文档详情",
			content: "是否删除当前文档详情？",
			closable: true,
			onOk: () => {
				serviceHelp.delFileDetail({ id }).then(res => {
					if (res.code == 200) {
						message.success("保存成功！")
						eventBus.emit("doStyle")
					}
				})
			}
		})
	}

	// const deleteHandle = (id: any) => () => {
	// 	// console.log("删除")
	// 	serviceHelp.delFileDetail({ id }).then(res => {
	// 		if (res.code == 200) {
	// 			message.success("保存成功！")
	// 			eventBus.emit("doStyle")
	// 		}
	// 	})
	// }
	const [fileClassOptions, setFileClassOptions] = useState([])
	useEffect(() => {
		// 获取文档分类
		serviceHelp.getStylesList({ pageNum: 1, pageSize: 1000, categoryName: "" }).then(res => {
			if (res.code === 200) {
				let optionList = res.data.list
				setFileClassOptions(optionList)
			}
		})
	}, [])
	const onFinish = useCallback(
		data => {
			setIsClick(true)
			if (!!isAdd) {
				serviceHelp.addFileDetail(data).then(res => {
					if (res.code === 200) {
						eventBus.emit("doStyle")
						closeModal()
						message.success("保存成功！")
						setIsClick(false)
					}
				})
			} else {
				serviceHelp.updateFileDetail({ ...data, id: updateId }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doStyle")
						closeModal()
						message.success("保存成功！")
						setIsClick(false)
					}
				})
			}
		},
		[isAdd, updateId]
	)

	return !!showAdd ? (
		<Form
			layout="horizontal"
			labelCol={{ span: 3 }}
			form={form}
			preserve={false}
			onFinish={onFinish}
			autoComplete="off"
		>
			<Form.Item label="文档分类：" name="categoryId" rules={[{ required: true, message: "请选择文档分类" }]}>
				<Select
					// onSearch={handleSearch}
					// onChange={changeHall}
					// notFoundContent={null}
					// defaultActiveFirstOption={false}
					// showArrow={false}
					// showSearch
					// filterOption={false}
					listHeight={120}
					// open={true}
				>
					{fileClassOptions &&
						fileClassOptions.map(d => (
							<Select.Option key={d.id} value={d.id}>
								{d.categoryName}
							</Select.Option>
						))}
				</Select>
			</Form.Item>
			<Form.Item
				label="副标题："
				name="titleName"
				rules={[
					{ required: true, message: "请输入副标题" },
					{ message: "请输入1-10个文字", max: 10 }
				]}
			>
				<TextArea allowClear placeholder="请输入副标题（最多10个字符）" />
			</Form.Item>
			<Form.Item label="排序：" name="docSort">
				<InputNumber
					max={9999}
					min={1}
					step={1}
					formatter={limitNumber}
					parser={limitNumber}
					placeholder="请输入1-9999之间的整数"
				/>
			</Form.Item>
			<Form.Item label="内容：" name="titleContent">
				<FormEditor
					// onChange={e => {
					// 	console.log(e)
					// }}
					defaultContent={infoData?.titleContent}
				/>
			</Form.Item>
			<Form.Item style={{ textAlign: "right" }}>
				{!isClick ? (
					<Button type="primary" htmlType="submit">
						保存
					</Button>
				) : (
					<Button type="primary" htmlType="submit" disabled>
						保存
					</Button>
				)}
				<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
					取消
				</Button>
			</Form.Item>
		</Form>
	) : (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["titleName", "documentSort"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"categoryName",
						"subtitle",
						"docSort",
						"createTs",
						"createdName"
					]).concat(columns)}
					apiService={serviceHelp.getFileDetailList}
					rowKey="id"
				/>
			</Col>
		</Row>
	)
}
HelpFileDetail.title = "文档详情"
export default HelpFileDetail
