import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, Form, Input, InputNumber, message, Radio, Select, TreeSelect } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import serviceBoutique from "@/services/service.boutique"
import serviceOperate from "@/services/service.operate"
import { ModalRef } from "./modal.context"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import { templateItem, treeItem } from "@/interfaces/api.interface"
import "./relation.less"

const cardStyle = { width: 600 }

const { TreeNode } = TreeSelect

interface Props {
	id: string
}
let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceBoutique.templateCaseList({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}
const imgPrefix = "http://test-obs.3dyunzhan.com"
const CaseModal: React.FC<Props & ModalRef> = props => {
	const { modalRef, id } = props
	const [form] = Form.useForm()
	const [styleList, setStyleList] = useState([])
	const [userOptions, setUserOptions] = useState([])
	const [caseList, setCaseList] = useState(Array.from({ length: 4 }).fill({}))
	const [inputval, setinputval] = useState(Array.from({ length: 4 }).fill(""))
	const [finalval, setfinalval] = useState(Array.from({ length: 4 }).fill(""))
	const [loading, setLoading] = useState(false)
  const [showNewName, setShowNewName] = useState(false)
	const checkStyle = (rule: any, value: string | any[]) => {
		return new Promise(async (resolve, reject) => {
			let newArr
			if (!!value) {
				if (value.length > 5) {
					newArr = [].concat(value.slice(0, 4), value.slice(-1))
					form.setFieldsValue({
						styleIdList: newArr
					})
					reject(new Error("最多可选择5项!"))
				} else {
					newArr = value
					resolve()
				}
			} else {
				reject(new Error("请选择行业"))
			}
		})
	}
	useEffect(() => {
		serviceBoutique.styleList().then(rslt => setStyleList(rslt.data))
		if (id) {
			serviceOperate.getUpdateCase({ id: id }).then(res => {
				if (res.code === 200) {
					const { styleList, recomList, recomType } = res.data
					const styles = styleList.map((item: { styleId: string }) => {
						return item.styleId
					})

					const tempArr = [...recomList.slice(0, 4)]
					const tempInputArr = [...recomList.slice(0, 4).map((item: { tempId: string }) => item.tempId)]
					if (tempArr.length < 4) {
						let count = 4 - tempArr.length
						while (count--) {
							tempArr.push({})
						}
					}
					if (tempInputArr.length < 4) {
						let count = 4 - tempInputArr.length
						while (count--) {
							tempInputArr.push("")
						}
					}
          setShowNewName(!!recomType)
					setinputval(tempInputArr)
					setfinalval(tempInputArr)
					setCaseList(tempArr)
					form.setFieldsValue({
						...res.data,
						styleIdList: styles,
						tempRecomList: [...caseList]
					})
				}
			})
		}
	}, [])

	//  提交
	const onFinish = useCallback(
		data => {
			setLoading(true)
			const { styleIdList, recomType, recomName } = data
			const tempIdList = finalval.filter(item => {
				return item !== ""
			})
			const params = {
				...data,
				styleIdList: !!styleIdList ? styleIdList.join() : null,
        recomType: recomType ? 1 : 0,
        recomName: recomType ? recomName : ""
			}
			if (id) {
				params.tempRecomList = !!tempIdList ? tempIdList.join() : null
				params.id = !!id ? id : null
			}
			serviceOperate[!!id ? "updateCase" : "addCase"](params)
				.then(res => {
					if (res.code === 200) {
						eventBus.emit("doCaseList")
						modalRef.current.destroy()
						message.success("保存成功！")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[finalval]
	)

	const InputChange = useCallback(
		(v, id) => {
			const newInputVal = inputval.map((item, i) => {
				if (i === id) return v
				else return item
			})
			setinputval(newInputVal)
			// toRelationCase(v, i)
		},
		[inputval]
	)

	// 删除关联展厅
	const delRelationCase = (v: any, i: number) => {
		const arr1 = inputval.map((item, idx) => {
			if (idx == i) {
				return (item = "")
			} else {
				return item
			}
		})
		setinputval(arr1)
		setfinalval(arr1)
		// console.log(arr1)
		let arr2 = caseList.map((item: { thumb: string }, idx) => {
			if (idx == i) {
				return (item.thumb = "")
			} else {
				return item
			}
		})
		setCaseList(arr2)
	}

	// 关联展厅
	const toRelationCase = (i: number) => {
		const v = inputval[i]
		let param = {
			tempId: v as string
		}

		serviceOperate.getBindCase(param).then(res => {
			let tempUrl = res.data?.thumb
			if (!tempUrl) return
			if (res.code == 200) {
				const tempFinalval = Array.from({ length: 4 }).fill("")
				const newcaselist = caseList.map((item: any, id) => {
					if (i === id) {
						tempFinalval[id] = inputval[id]
						return {
							...item,
							thumb: tempUrl
						}
					} else {
						tempFinalval[id] = finalval[id]
						return item
					}
				})
				setfinalval(tempFinalval)
				setCaseList(newcaselist)
			}
		})
	}

	const changeHall = (value: string) => {
		const active = userOptions.filter(i => i.id == value)
	}

	const handleSearch = (value: string) => {
		if (value) {
			fetch(value, (data: templateItem[]) => setUserOptions(data))
		} else {
			setUserOptions([])
		}
	}

	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const mapTree = (list: treeItem[]): treeItem[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.name, value: m.id }
		})
	}

	const changeHandle = useCallback(value => {
		console.log(value)
	}, [])

	const renderTreeNodes = (data: any[]) =>
		data.map(item => {
			if (item.children.length > 0) {
				item.disabled = true
				return (
					<TreeNode key={item.id} title={item.name} value={item.id} disabled={item.disabled}>
						{renderTreeNodes(item.children)}
					</TreeNode>
				)
			}
			return <TreeNode {...item} key={item.id} title={item.name} value={item.id} />
		})
  const changeHome = useCallback(e => {
    setShowNewName(e.target.checked)
  }, [])
	// console.log(renderTreeNodes(styleList))

	return (
		<Card
			style={cardStyle}
			title={id ? "修改精品展厅" : "新增精品展厅"}
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				form={form}
				labelCol={{ span: 5 }}
				layout="horizontal"
				preserve={false}
				onFinish={onFinish}
				autoComplete="off"
				initialValues={{
					caseStatus: 1,
					caseType: 1
				}}
			>
				<div className="globalScroll">
					{!id && (
						<Form.Item label="展厅名称" name="tempId" rules={[{ required: true, message: "请选择展厅" }]}>
							<Select
								placeholder="请输入展厅名称/ID"
								onSearch={handleSearch}
								onChange={changeHall}
								notFoundContent={null}
								defaultActiveFirstOption={false}
								showArrow={false}
								showSearch
								filterOption={false}
							>
								{userOptions &&
									userOptions.map(d => (
										<Select.Option key={d.id} value={d.id}>
											{d.tempName}
										</Select.Option>
									))}
							</Select>
						</Form.Item>
					)}

					{!!id && (
						<Form.Item label="展厅名称" name="tempName">
							<Input disabled></Input>
						</Form.Item>
					)}
					<Form.Item
						label="行业"
						name="styleIdList"
						rules={[{ required: true, message: "请选择行业", validator: checkStyle }]}
					>
						<TreeSelect
							treeData={styleList?.length > 0 && mapTree(styleList)}
							// treeCheckable={true}
							// showCheckedStrategy="SHOW_CHILD"
							placeholder="请选择分类"
							treeDefaultExpandAll
							multiple
						>
							{/* {renderTreeNodes(styleList)} */}
						</TreeSelect>
					</Form.Item>
					<Form.Item label="形式" name="caseType">
						<Radio.Group>
							<Radio value={1}>展厅</Radio>
							<Radio value={2}>展台</Radio>
						</Radio.Group>
					</Form.Item>
					{!!id && (
						<Form.Item name="tags" label="标签">
							<Input maxLength={4} placeholder={"请输入标签"}></Input>
						</Form.Item>
					)}
					{!!id && (
						<Form.Item name="caseDesc" label="案例简介">
							<Input.TextArea showCount={true} maxLength={300} placeholder={"请输入案例简介"} />
						</Form.Item>
					)}
					{!!id && (
						<Form.Item name="evaluate" label="客户评价">
							<Input.TextArea showCount={true} maxLength={300} placeholder={"请输入客户评价"} />
						</Form.Item>
					)}
					{!!id && (
						<Form.Item name="tempRecomList" label="关联推荐">
							<div className="relationBox">
								{caseList.map((v: { thumb: string }, index) => (
									<div className="relation" key={index}>
										{!!v.thumb && (
											<CloseOutlined
												className="close-btn"
												onClick={() => {
													delRelationCase(v, index)
												}}
											/>
										)}

										{!!v.thumb && (
											<img
												src={v.thumb.indexOf("http") > -1 ? v.thumb : imgPrefix + v.thumb}
												alt=""
												className="caseCover"
											/>
										)}
										{!v.thumb && <div className="noContent">暂无内容</div>}
										<div className="relation-btn">
											<Input
												placeholder="请输入精品模板ID"
												value={inputval[index] as string}
												onChange={(e: any) => InputChange(e.target.value, index)}
												size="small"
											>
                      </Input>

											<Button type="primary" onClick={() => toRelationCase(index)}>
												关联
											</Button>
										</div>
									</div>
								))}
							</div>
						</Form.Item>
					)}

					<Form.Item label="排序" name="caseSort">
						<InputNumber
							max={9999}
							min={1}
							step={1}
							formatter={limitNumber}
							parser={limitNumber}
							placeholder="请输入1-9999之间的整数"
						/>
					</Form.Item>
					<Form.Item label="状态" name="caseStatus">
						<Radio.Group>
							<Radio value={0}>未上架</Radio>
							<Radio value={1}>上架</Radio>
						</Radio.Group>
					</Form.Item>
          <Form.Item label="小程序首页推荐">
            <Input.Group compact>
              <Form.Item name="recomType" valuePropName="checked" noStyle>
                <Checkbox style={{ height: "32px", lineHeight: "32px" }} onChange={changeHome}>
                  小程序首页推荐
                </Checkbox>
              </Form.Item>
              {!!showNewName && (
                <Form.Item name="recomName" noStyle>
                  <Input style={{ width: "50%" }} placeholder="请输入展厅名称" maxLength={18} />
                </Form.Item>
              )}
            </Input.Group>
          </Form.Item>
				</div>
				<div className="globalFooter">
					<Form.Item>
						<Button block type="primary" htmlType="submit" loading={loading}>
							保存
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Card>
	)
}

export default CaseModal
