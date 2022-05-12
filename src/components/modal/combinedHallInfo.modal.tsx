import { zuheSceneListItem } from "@/interfaces/api.interface"
import serviceHall from "@/services/service.hall"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, Col, Form, Input, message, Row, Space } from "antd"
import FormUploads from "../form/form.uploads"
import "./combinedHallInfo.modal.less"
import eventBus from "@/utils/event.bus"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { ModalRef } from "./modal.context"
import SortItem from "@/components/utils/sort.item"

import FontIcon, { FontKey } from "@/components/utils/font.icon"
import checkImage from "@/utils/checkImage.func"

const cardStyle = { width: 1000 }
const cardStyle1 = { width: 456 }

interface Props {
	id: string
	dev?: boolean
}

const CombinedHallInfomodal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [next, setNext] = useState(false)
	const [hallList, setHallList] = useState<zuheSceneListItem[]>([])
	const [lists, setLists] = useState<zuheSceneListItem[]>([])
	const [sortResult, setSortResult] = useState<string[]>([])
	const [form] = Form.useForm()
	const [formShare] = Form.useForm()
	const [resetName, setResetName] = useState(false)
	const [loading, setLoading] = useState(false)
	const [loading2, setLoading2] = useState(false)
	// let [sub, setSub] = useState(-1)

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const onFinish = (values: any) => {
		setLoading(true)
		if (values.username || values.id) {
			serviceHall
				.getZuheTempList({ userKeywords: values.username, tempKeywords: values.id })
				.then(res => {
					setHallList(res.data)
					setLoading(false)
				})
				.finally(() => {
					setLoading(false)
				})
		}
	}

	const onChange = useCallback(
		e => {
			if (!lists.map(m => m.id).includes(e.target.value.id) && lists.length < 50) {
				setLists(lists.concat(e.target.value))
				setResetName(true)
			}
		},
		[lists]
	)

	const del = (id: string) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		let arr = lists.filter(item => {
			return item.id !== id
		})
		setLists(arr)
		setResetName(true)
	}

	const prevBtn = useCallback(() => {
		setNext(false)
	}, [])

	const sortChange = (data: string[]) => {
		setSortResult(data)
		setResetName(true)
	}

	const onFinishShare = useCallback(
		data => {
			setLoading2(true)
			let arr = []
			if (sortResult && sortResult.length > 0) {
				for (let j = 0; j < sortResult.length; j++) {
					for (let i = 0; i < lists.length; i++) {
						if (lists[i].id == sortResult[j]) {
							var obj = {
								tempId: lists[i].id,
								name: lists[i].name
							}
							arr.push(obj)
						}
					}
				}
			} else {
				for (let i = 0; i < lists.length; i++) {
					var obj = {
						tempId: lists[i].id,
						name: lists[i].name
					}
					arr.push(obj)
				}
			}

			if (props.id) {
				const params = {
					...data,
					coverUrl: data.coverUrl ? data.coverUrl[0]?.fileSaveUrl : "",
					phoneCoverUrl: data.phoneCoverUrl ? data.phoneCoverUrl[0]?.fileSaveUrl : "",
					tempGroupListStr: JSON.stringify(arr),
					groupId: props.id
				}
				serviceHall.updateInfo(params).then(() => {
					modalRef.current.destroy()
					eventBus.emit("doHallTemplate")
					setLoading2(false)
				})
			} else {
				const params = {
					...data,
					coverUrl: data.coverUrl ? data.coverUrl[0]?.fileSaveUrl : "",
					phoneCoverUrl: data.phoneCoverUrl ? data.phoneCoverUrl[0]?.fileSaveUrl : "",
					tempGroupListStr: JSON.stringify(arr)
				}
				serviceHall.addZuheHall(params).then(() => {
					modalRef.current.destroy()
					eventBus.emit("doHallTemplate")
					setLoading2(false)
				})
			}
		},
		[lists, sortResult]
	)

	const dianji = (index: number, event: any) => {
		lists[index].name = event.target.value
		setLists(lists)
		setResetName(true)
	}

	const nextBtn = useCallback(() => {
		if (lists.length < 2 || lists.length > 50) {
			message.warning("请选择2到50个展厅！")
		} else {
			setNext(true)
		}
	}, [lists])
	const [changeFormData, setChangeFormData] = useState({})
	const onValuesChange = (changedValues: any, allValues: any) => {
		formShare.setFieldsValue(allValues)
		setChangeFormData(allValues)
	}
	useEffect(() => {
		if (props.id) {
			serviceHall.getUpdateInfo({ groupId: props.id }).then(res => {
				if (Object.getOwnPropertyNames(changeFormData).length === 0) {
					formShare.setFieldsValue({
						...res.data.tempGroup,
						coverUrl: res.data.tempGroup.coverUrl
							? [
									{
										filePreviewUrl: res.data.tempGroup.coverUrl,
										fileSaveUrl: res.data.tempGroup.coverUrl,
										fileSize: 0
									}
							  ]
							: "",
						phoneCoverUrl: res.data.tempGroup.phoneCoverUrl
							? [
									{
										filePreviewUrl: res.data.tempGroup.phoneCoverUrl,
										fileSaveUrl: res.data.tempGroup.phoneCoverUrl,
										fileSize: 0
									}
							  ]
							: ""
						// buttonName: res.data.tempGroup.buttonName || "展厅导览"
					})
				} else {
					formShare.setFieldsValue(changeFormData)
				}
				if (!resetName) {
					setLists(res.data.bindList)
				}
			})
		} else {
			if (Object.getOwnPropertyNames(changeFormData).length !== 0) {
				formShare.setFieldsValue(changeFormData)
			}
		}
	}, [next])

	return (
		<Card
			className="CombinedHallInfomodal"
			style={!next ? cardStyle : cardStyle1}
			title="关联展厅"
			extra={
				<div className="tishi">
					{next ? (
						""
					) : (
						<div className="left">
							<span>已选展厅：</span>
							<span className="ys">{lists.length}</span>
							<span className="zs">/50</span>
						</div>
					)}
					<Button style={{ position: "relative", zIndex: 2 }} size="small" type="text" onClick={closeModal}>
						<CloseOutlined />
					</Button>
				</div>
			}
		>
			{next ? (
				<Form
					labelCol={{ span: 8 }}
					layout="vertical"
					form={formShare}
					preserve={false}
					onFinish={onFinishShare}
					onValuesChange={onValuesChange}
					autoComplete="off"
				>
					<Form.Item label="信息：" rules={[{ required: true, message: "请输入组合展厅名称" }]} name="groupName">
						<Input maxLength={30} />
					</Form.Item>
					<Form.Item name="describe">
						<Input.TextArea showCount maxLength={80} />
					</Form.Item>
					<Form.Item>
						<div>
							展厅封面：<span className="tips">仅支持2MB以内，.jpg、.png格式</span>
						</div>
					</Form.Item>
					<Form.Item style={{ marginBottom: 0 }}>
						<Row justify="space-between">
							<Form.Item label="PC端：" name="coverUrl" extra="建议尺寸1600*1000px">
								<FormUploads
									accept=".png, .jpg"
									checkType="hotImage"
									customCheck={checkImage(2)}
									size={1}
									extParams={{ businessType: 5 }}
								/>
							</Form.Item>
							<Form.Item label="手机端：" name="phoneCoverUrl" extra="1242*2016px">
								<FormUploads
									accept=".png, .jpg"
									checkType="hotImage"
									customCheck={checkImage(2)}
									size={1}
									extParams={{ businessType: 5 }}
								/>
							</Form.Item>
						</Row>
					</Form.Item>
					{/* <Form.Item label="按钮名称：" rules={[{ required: true, message: "请输入按钮名称" }]} name="buttonName">
						<Input maxLength={6} placeholder="请输入按钮名称" />
					</Form.Item> */}
					<Form.Item>
						<Row justify="end">
							<Space>
								<Button className="cancel-btn" onClick={prevBtn}>
									上一步：选择展厅
								</Button>
								<Button type="primary" htmlType="submit" loading={loading2}>
									保存
								</Button>
							</Space>
						</Row>
					</Form.Item>
				</Form>
			) : (
				<div className="one">
					<div className="left">
						<Form form={form} name="horizontal_login" layout="inline" onFinish={onFinish}>
							<Form.Item name="username">
								<Input placeholder="手机号或昵称" />
							</Form.Item>
							<Form.Item name="id">
								<Input type="text" placeholder="展厅名称或ID" />
							</Form.Item>
							<Form.Item shouldUpdate>
								{() => (
									<Button type="primary" htmlType="submit" loading={loading}>
										搜 索
									</Button>
								)}
							</Form.Item>
						</Form>
						<Row>
							{hallList.length <= 0 && <div className="searchTips">请先输入关键词搜索展厅</div>}

							{hallList.map((iteam, index) => {
								return (
									<Col span={7} key={index}>
										<Checkbox value={iteam} onChange={onChange} checked={lists.map(m => m.id).includes(iteam.id)}>
											<div className="list">
												<div className="top">
													{iteam.thumb ? (
														<img src={iteam.thumb} alt="" />
													) : (
														<img className="thumbnail" src={require("../../assets/images/logo-hui.png")} alt="" />
													)}
												</div>
												<div className="title">{iteam.name}</div>
											</div>
										</Checkbox>
									</Col>
								)
							})}
						</Row>
					</div>
					<div className="fgx"></div>
					<div className="left right">
						{/* <Checkbox.Group style={{ width: "100%" }} value={lists} onChange={change}> */}
						<Row id="container">
							<SortItem onChange={sortChange} handle=".ant-col">
								{lists.map((item, index) => {
									return (
										<Col span={24} key={item.id} data-id={item.id}>
											<div className="list">
												<div className="top top1">
													{item.thumb ? (
														<img src={item.thumb} alt="" />
													) : (
														<img className="thumbnail" src={require("../../assets/images/logo-hui.png")} alt="" />
													)}
													<div className="del" onClick={del(item.id)}>
														<FontIcon icon={FontKey.shanchu} />
													</div>
												</div>
												<div className="title noPadding">
													<Input
														className="input"
														id="inputTitle"
														defaultValue={item.name}
														maxLength={30}
														onChange={dianji.bind(null, index)}
													/>
												</div>
											</div>
										</Col>
									)
								})}
							</SortItem>
						</Row>
						{/* </Checkbox.Group> */}
					</div>
					<div className="bottom">
						<div className="bot_left">
							<img src={require("../../assets/images/tishi.png")} alt="" />
							已选展厅可编辑名称，且不影响原始展厅，仅展示在组合展厅列表中
						</div>
						<Button className="btn" type="primary" onClick={nextBtn}>
							下一步：分享设置
						</Button>
					</div>
				</div>
			)}
		</Card>
	)
}
export default CombinedHallInfomodal
