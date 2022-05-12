import { Row, Col, Modal, Image, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import eventBus from "@/utils/event.bus"
import FontIcon, { FontKey } from "@/components/utils/font.icon"
import { ExclamationCircleOutlined } from "@ant-design/icons"
import serviceGeneral from "@/services/service.general"
import { narratorImgItem } from "@/interfaces/api.interface"
import "./generalHotspot.less"
import CustomUpload from "@/components/utils/custom.upload"
import checkImage from "@/utils/checkImage.func"
import proxy from "@/../config/proxy"

const { confirm } = Modal

const GeneralNarrator = () => {
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
	const [hotsPotData, setHotsPotData] = useState<narratorImgItem[]>()

	useEffect(() => {
		withParams.current = params
	}, [params])

	useEffect(() => {
		serviceGeneral.getImgList().then(res => {
			if (res.code === 200) {
				setHotsPotData(res.data)
			}
		})

		eventBus.on("doNarrator", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doNarrator")
		}
	}, [params])

	const batchDelete = (id: string) => () => {
		if (!!id) {
			confirm({
				title: "删除",
				icon: <ExclamationCircleOutlined />,
				content: "是否删除当前所选解说人物？",
				onOk() {
					serviceGeneral.deleteNarrator({ id: id }).then(res => {
						if (res.code === 200) {
							eventBus.emit("doNarrator")
							message.success("删除成功！")
						}
					})
				}
			})
		} else {
			message.warning("请先选择要删除的解说人物！")
		}
	}

	const successHandle = useCallback(() => {
		eventBus.emit("doNarrator")
	}, [])

	return (
		<div className="Narrator full">
			<Row justify="space-between">
				<Col>
					<span className="tips">
						<ExclamationCircleOutlined />
						图片要求：小于5M，gif格式
					</span>
				</Col>
				<Col>
					<ul className="operation">
						<CustomUpload
							extParams={{ businessType: 8 }}
							btnText="上传"
							size={Infinity}
							onChange={successHandle}
							customCheck={checkImage(5)}
							checkType="narratorImage"
							btnProps={{ type: "primary" }}
							accept=".gif"
							uploadCallTask={(res, item) =>
								new Promise(resolve => {
									let data = res.data
									if (res.code == 200) {
										serviceGeneral
											.addNarratorImg({
												fileUrl: data.fileSaveUrl || "",
												fileName: item.filename.slice(0, item.filename?.length - 4)
											})
											.then(() => {
												eventBus.emit("doNarrator")
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
							<div className="card" key={index}>
								<div className="box">
									<div className="box2">
										<Image src={`${proxy.templateObsUrl[API_ENV]}${item.fileUrl}`} alt="" />
									</div>
								</div>
								<div className="checkbox" onClick={batchDelete(item.id)}>
									<FontIcon icon={FontKey.shanchu} />
								</div>
							</div>
						)
					})}
			</Row>
		</div>
	)
}
GeneralNarrator.title = "解说人物"
export default GeneralNarrator
