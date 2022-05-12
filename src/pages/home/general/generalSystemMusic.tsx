import { Row, Col, Modal, Button, Dropdown, Menu, Upload, Space, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import serviceGeneral from "@/services/service.general"
import EditMusicModal from "@/components/modal/editMusic.modal"
import { ModalCustom } from "@/components/modal/modal.context"
import { PlayCircleOutlined, PauseCircleOutlined } from "@ant-design/icons"
import "./generalSystemMusic.less"
import { systemPageItem } from "@/interfaces/api.interface"
import CustomUpload from "@/components/utils/custom.upload"
import checkAudio from "@/utils/checkAudio.func"

const GeneralSystemMusic = () => {
	const [params, setParams] = useState({})
	const [activePlay, setActivePlay] = useState("")
	const withParams = useRef<any>()
	const musicRef = useRef<HTMLAudioElement | null>(null)

	const deleteHandle = (id: string) => () => {
		Modal.confirm({
			title: "删除系统音乐",
			content: "是否删除当前音乐？",
			closable: true,
			onOk: () => {
				serviceGeneral.deleteMusic({ musicId: id }).then(res => {
					if (res.code === 200) {
						eventBus.emit("doMusic")
						Modal.destroyAll()
						message.success("删除成功！")
					}
				})
			}
		})
	}

	const editHandle = (id: string) => () => {
		ModalCustom({
			content: EditMusicModal,
			params: {
				id
			}
		})
	}

	const playHandle = useCallback(
		(willAudio: string) => () => {
			if (activePlay != willAudio) {
				setActivePlay(willAudio)
			} else {
				setActivePlay("")
			}
		},
		[activePlay]
	)

	const columns: ColumnType<systemPageItem>[] = [
		{
			title: "操作",
			dataIndex: "",
			key: "",
			fixed: "right",
			width: 50,
			align: "center",
			render: (v, item) => {
				return (
					<>
						<Dropdown
							overlay={
								<Menu>
									<Menu.Item onClick={editHandle(item.musicId)}>修改</Menu.Item>
									<Menu.Item onClick={deleteHandle(item.musicId)}>删除</Menu.Item>
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

	const auditionColumns: ColumnType<systemPageItem>[] = [
		{
			title: "试听",
			dataIndex: "",
			key: "",
			fixed: "right",
			width: 50,
			align: "center",
			className: "audition",
			render: (v, item) => {
				return (
					<div onClick={playHandle(`${item.musicId}#${item.musicFile}`)}>
						{`${item.musicId}#${item.musicFile}` == activePlay ? <PauseCircleOutlined /> : <PlayCircleOutlined />}
					</div>
				)
			}
		}
	]

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		eventBus.on("doMusic", () => setParams({ ...withParams.current }), setActivePlay(""))
		return () => {
			eventBus.off("doMusic")
		}
	}, [])
	useEffect(() => {
		if (!activePlay) return musicRef.current?.pause()
		const [id, playUrl] = activePlay.split("#")
		if (musicRef.current) {
			musicRef.current.pause()
		} else {
			musicRef.current = new Audio()
			musicRef.current.preload = "auto"
			musicRef.current.onended = () => {
				setActivePlay("")
			}
		}

		if (musicRef.current.id !== id) {
			musicRef.current.src = playUrl
			musicRef.current.id = id
		}
		musicRef.current.play()
	}, [activePlay])
	const successHandle = useCallback(() => {
		eventBus.emit("doMusic")
	}, [])

	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>音乐列表</Col>
				<Col>
					<Space>
						<Button type="primary" onClick={editHandle("")}>
							上传
						</Button>
						<CustomUpload
							extParams={{ businessType: 7 }}
							btnText="批量上传"
							size={Infinity}
							onChange={successHandle}
							customCheck={checkAudio(5)}
							checkType="audio"
							accept="audio/*"
							btnProps={{ type: "primary" }}
							uploadCallTask={(res, item) =>
								new Promise(resolve => {
									let data = res.data
									if (res.code == 200) {
										serviceGeneral.addMusic({
											url: data.fileSaveUrl || "",
											fileSize: data.fileSize || 0,
											name: item.filename.slice(0, item.filename?.length - 4),
											musicTypeId: ""
										})
									}
									resolve(true)
								})
							}
						/>
					</Space>
				</Col>
			</Row>
		),
		[]
	)

	return (
		<Row className="data-form full commentList">
			<Col className="form-search" span={24}>
				<FormSearch fields={returnSearchFiels(["WmusicType", "Wname"])} toSearch={setParams} />
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields(["sort", "WmusicName", "WfileAddress", "WmusicType"]).concat(
						auditionColumns,
						columns
					)}
					apiService={serviceGeneral.systemPageList}
					rowKey={row => row.musicId}
				/>
			</Col>
		</Row>
	)
}
GeneralSystemMusic.title = "系统音乐"
export default GeneralSystemMusic
