import { Row, Col, Modal, Checkbox, Button, Image, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import eventBus from "@/utils/event.bus"
import FontIcon, { FontKey } from "@/components/utils/font.icon"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import serviceGeneral from "@/services/service.general"
import { hotsPotItem } from "@/interfaces/api.interface"
import "./generalHotspot.less"
import CustomUpload from "@/components/utils/custom.upload"
import checkImage from "@/utils/checkImage.func"
import proxy from "@/../config/proxy"

const { confirm } = Modal

const GeneralHotspot = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const [selectIcons, setSelectIcons] = useState([])
	const [isShow, setIsshow] = useState(false)
	const [hotsPotData, setHotsPotData] = useState<hotsPotItem[]>()

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		serviceGeneral.getIconList().then(res => {
			if (res.code === 200) {
				setHotsPotData(res.data)
			}
		})

		eventBus.on("doHotspotIcon", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doHotspotIcon")
		}
	}, [params])

	const selectIconHandle = useCallback(
		(item: hotsPotItem) => {
			if (selectIcons.indexOf(item.picId) === -1) {
				setSelectIcons([...selectIcons, item.picId])
			} else {
				setSelectIcons(
					selectIcons.filter(v => {
						return v !== item.picId
					})
				)
			}
		},
		[selectIcons]
	)

	const batchDelete = useCallback(() => {
		if (!isShow) {
			setSelectIcons([])
			setIsshow(true)
		} else {
			if (!!selectIcons && selectIcons.length > 0) {
				confirm({
					title: "删除",
					icon: <ExclamationCircleOutlined />,
					content: "是否删除当前所选热点图标？",
					onOk() {
						serviceGeneral.deleteHotPot({ picIds: selectIcons.toString() }).then(res => {
							if (res.code === 200) {
								eventBus.emit("doHotspotIcon")
								setIsshow(false)
								message.success("删除成功！")
							}
						})
					}
				})
			} else {
				message.warning("请先选择要删除的热点图标！")
			}
		}
	}, [isShow, selectIcons])

	const cancelHandle = useCallback(() => {
		setIsshow(false)
	}, [])

	const allSelect = useCallback(
		e => {
			if (e.target.checked) {
				const arr: string[] = []
				hotsPotData.map(item => {
					arr.push(item.picId)
				})
				setSelectIcons(arr)
			} else {
				setSelectIcons([])
			}
		},
		[selectIcons]
	)

	const successHandle = useCallback(() => {
		eventBus.emit("doHotspotIcon")
	}, [])

	return (
		<div className="HotspotIcon full">
			<Row justify="space-between">
				<Col>
					<span className="tips">
						<ExclamationCircleOutlined />
						图片要求：小于5M，png/jpg/jpeg格式
					</span>
				</Col>
				<Col>
					<ul className="operation">
						<li className="allSelect" hidden={!isShow}>
							<Checkbox onChange={allSelect}>全选</Checkbox>
						</li>
						<li hidden={!isShow} onClick={batchDelete}>
							<FontIcon icon={FontKey.shanchu} />
							批量删除
						</li>
						<li hidden={isShow} onClick={batchDelete}>
							<Button>批量删除</Button>
						</li>
						<li hidden={!isShow} onClick={cancelHandle}>
							<Button>取消</Button>
						</li>
						<CustomUpload
							extParams={{ businessType: 8 }}
							btnText="批量上传"
							size={Infinity}
							onChange={successHandle}
							customCheck={checkImage(5)}
							checkType="hotImage"
							btnProps={{ type: "primary" }}
							accept=".png, .jpg, .jpeg"
							uploadCallTask={(res, item) =>
								new Promise(resolve => {
									let data = res.data
									if (res.code == 200) {
										serviceGeneral.addIcon({
											url: data.fileSaveUrl || "",
											fileSize: data.fileSize || 0,
											name: item.filename.slice(0, item.filename?.length - 4),
											discripe: ""
										})
									}
									resolve()
								})
							}
						/>
					</ul>
				</Col>
			</Row>
			<Row className="icons">
				{hotsPotData &&
					hotsPotData.map((item, index) => {
						return (
							<div className="card" onClick={e => selectIconHandle(item)} key={index}>
								<div className="box">
									<div className="box2">
										<Image src={`${proxy.templateObsUrl[API_ENV]}${item.picPath}`} alt="" />
									</div>
								</div>
								<div
									hidden={!isShow}
									className={selectIcons.indexOf(item.picId) !== -1 ? "checkbox active" : "checkbox"}
								>
									<span></span>
									<FontIcon icon={FontKey.chenggong} />
								</div>
							</div>
						)
					})}
			</Row>
		</div>
	)
}
GeneralHotspot.title = "热点图标"
export default GeneralHotspot
