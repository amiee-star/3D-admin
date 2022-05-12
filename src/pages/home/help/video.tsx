import { Button, Row, Col, Space, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { PageProps } from "@/interfaces/app.interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddHelpVideoModal from "@/components/modal/addHelpVideo.modal"
import serviceHelp from "@/services/service.help"
import proxy from "@/../config/proxy"

const HelpVideo = (props: PageProps) => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>帮助视频列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={addHelpVideo}>
							添加
						</Button>
					</Space>
				</Col>
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doHelpVideo", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doHelpVideo")
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
									<Menu.Item onClick={lookVideo(item.videoUrl)}>查看</Menu.Item>
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
	// 添加帮助视频
	const addHelpVideo = () => {
		ModalCustom({
			content: AddHelpVideoModal,
			params: {
				id: ""
			}
		})
	}
	// 编辑帮助视频
	const editHandle = (id: any) => () => {
		ModalCustom({
			content: AddHelpVideoModal,
			params: {
				id: id
			}
		})
	}
	const lookVideo = (id: any) => () => {
		const vUrl = id
		ModalCustom({
			content: () => (
				<video controls src={`${proxy.templateObsUrl[API_ENV]}${vUrl}`} width={800} style={{ maxHeight: 500 }} />
			),
			maskClosable: true
		})
	}
	// 删除
	const deleteHandle = (id: string) => () => {
		Modal.confirm({
			title: "删除视频",
			content: "是否删除当前视频？",
			closable: true,
			onOk: () => {
				serviceHelp.delHelpVideoInfo({ id }).then(res => {
					if (res.code == 200) {
						message.success("保存成功！")
						eventBus.emit("doHelpVideo")
					}
				})
			}
		})
	}

	// const deleteHandle = (id: any) => () => {
	// 	console.log("删除")
	// 	serviceHelp.delHelpVideoInfo({ id }).then(res => {
	// 		if (res.code == 200) {
	// 			message.success("保存成功！")
	// 			eventBus.emit("doHelpVideo")
	// 		}
	// 	})
	// }
	return (
		<Row className="data-form full">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["videoName"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"HelpVideoCover",
						"HelpVideoName",
						"helpVideoSort",
						"createUser",
						"createTs"
					]).concat(columns)}
					apiService={serviceHelp.getHelpVideoList}
					rowKey="id"
				/>
			</Col>
		</Row>
	)
}
HelpVideo.title = "帮助视频"
export default HelpVideo
