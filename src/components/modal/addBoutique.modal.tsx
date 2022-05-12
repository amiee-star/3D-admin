import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Checkbox, DatePicker, Form, Input, InputNumber, message, Radio, Select, TreeSelect } from "antd"
import React, { useCallback, useEffect, useState, useRef } from "react"
import serviceBoutique from "@/services/service.boutique"
import { ModalRef } from "./modal.context"
import eventBus from "@/utils/event.bus"
import limitNumber from "@/utils/checkNum.func"
import { templateItem, treeItem } from "@/interfaces/api.interface"
import "./boutique.less"
const cardStyle = { width: 600 }

interface Props {}
let timeout: NodeJS.Timeout
let currentValue: string
function fetch(value: string = "", callback: Function) {
	if (timeout) {
		clearTimeout(timeout)
		timeout = null
	}
	currentValue = value

	function fake() {
		serviceBoutique.templateList({ keyword: value }).then(rslt => {
			if (currentValue === value) {
				callback(rslt.data)
			}
		})
	}

	timeout = setTimeout(fake, 300)
}

const AddHallModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [typeList, setTypeList] = useState([])
	const [userOptions, setUserOptions] = useState([])
	const [validSz, setValidSz] = useState<number>(0)
	const [loading, setLoading] = useState(false)
	const [boutiqueStatusVal, setBoutiqueStatusVal] = useState<number>(0)
	const [showNewName, setShowNewName] = useState(false)
	const [form] = Form.useForm()
	useEffect(() => {
		serviceBoutique.typeList().then(rslt => setTypeList(rslt.data))
	}, [])

	const checkType = (rule: any, value: string | any[]) => {
		return new Promise(async (resolve, reject) => {
			let newArr
			if (!!value) {
				if (value.length > 5) {
					newArr = [].concat(value.slice(0, 4), value.slice(-1))
					form.setFieldsValue({
						typeIdList: newArr
					})
					reject(new Error("最多可选择5项!"))
				} else {
					newArr = value
					resolve()
				}
			} else {
				reject(new Error("请选择分类"))
			}
		})
	}

	//  提交
	const onFinish = useCallback(data => {
		setLoading(true)
		const { tempLength, tempWidth, roamNumber, cdrNumber, typeIdList, recomType, recomName } = data
		serviceBoutique
			.addBoutique({
				...data,
				tempLength: tempLength > 99999999 ? 99999999.0 : tempLength,
				tempWidth: tempWidth > 99999999 ? 99999999.0 : tempWidth,
				roamNumber: roamNumber > 99999999 ? 99999999 : roamNumber,
				cdrNumber: cdrNumber > 99999999 ? 99999999 : cdrNumber,
				typeIdList: typeIdList.join(),
				recomType: recomType ? 1 : 0,
				recomName: recomType ? recomName : ""
			})
			.then(res => {
				if (res.code === 200) {
					eventBus.emit("doBoutique")
					modalRef.current.destroy()
					message.success("保存成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	const changeHall = (value: string) => {
		serviceBoutique.reselect(value).then(res => {
			if (res.code === 200) {
				form.setFieldsValue({
					typeIdList: res.data.typeList.map(item => {
						return item.typeId
					})
				})
				setValidSz(res.data.validSz)
			}
		})
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

	const changeHandle = useCallback(
		e => {
			setBoutiqueStatusVal(e.target.value)
		},
		[boutiqueStatusVal]
	)

	const changeHome = useCallback(e => {
    setShowNewName(e.target.checked)
	}, [])

	const mapTree = (list: treeItem[]): treeItem[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.name, value: m.id }
		})
	}

	return (
		<Card
			className="addHall"
			style={cardStyle}
			title="新增展厅"
			extra={
				<Button size="small" type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<Form
				labelCol={{ span: 5 }}
				layout="horizontal"
				preserve={false}
				onFinish={onFinish}
				initialValues={{ boutiqueStatus: 0 }}
				form={form}
				autoComplete="off"
			>
				<div className="globalScroll">
					<Form.Item
						className="hallName"
						label="展厅名称"
						name="tempId"
						rules={[{ required: true, message: "请选择展厅" }]}
					>
						<Select
							onSearch={handleSearch}
							onChange={changeHall}
							notFoundContent={null}
							defaultActiveFirstOption={false}
							showArrow={false}
							showSearch
							optionFilterProp="children"
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
					<Form.Item
						label="分类"
						name="typeIdList"
						required
						rules={[{ required: true, message: "请选择分类", validator: checkType }]}
					>
						<TreeSelect
							treeData={typeList?.length > 0 && mapTree(typeList)}
							// treeCheckable={true}
							// showCheckedStrategy="SHOW_CHILD"
							placeholder="请选择分类"
							treeDefaultExpandAll
							multiple
						></TreeSelect>
					</Form.Item>
					<Form.Item label="有效面积" name="validSz">
						<div>{validSz == 0 || !validSz ? "无有效面积，无法保存" : validSz + "m²"}</div>
					</Form.Item>
					<div className="line-box">
						<Form.Item name="tempLength" label="展厅长度">
							<InputNumber max={99999999} min={1} step={0.01} precision={2} placeholder="请输入1-99999999之间的数值" />
						</Form.Item>
						<span className="input-unit">m</span>
					</div>
					<div className="line-box">
						<Form.Item name="tempWidth" label="展厅宽度">
							<InputNumber max={99999999} min={1} step={0.01} precision={2} placeholder="请输入1-99999999之间的数值" />
						</Form.Item>
						<span className="input-unit">m</span>
					</div>

					{/* </Form.Item> */}
					{/* 漫游点位 */}
					<div className="line-box">
						<Form.Item label="漫游点位" name="roamNumber">
							<InputNumber
								max={99999999}
								min={1}
								step={1}
								formatter={limitNumber}
								parser={limitNumber}
								placeholder="请输入1-99999999之间的整数"
							/>
						</Form.Item>
						<span className="input-unit">个</span>
					</div>

					{/* 推荐布展素材 */}
					<div className="line-box">
						<Form.Item label="推荐布展素材" name="cdrNumber">
							<InputNumber
								max={99999999}
								min={1}
								step={1}
								formatter={limitNumber}
								parser={limitNumber}
								placeholder="请输入1-99999999之间的整数"
							/>
						</Form.Item>
						<span className="input-unit">个</span>
					</div>

					<Form.Item
						label="创建属性"
						name="createType"
						required
						rules={[{ required: true, message: "请选择创建属性" }]}
					>
						<Select>
							<Select.Option value={1}>空白模板</Select.Option>
							<Select.Option value={2}>复制模板</Select.Option>
						</Select>
					</Form.Item>
					<Form.Item label="折扣" name="discountRate">
						<InputNumber max={1} min={0.01} step={0.01} />
					</Form.Item>

					<Form.Item label="折扣开始时间" name="discountStartTimeStr">
						<DatePicker showTime />
					</Form.Item>
					<Form.Item label="折扣结束时间" name="discountEndTimeStr">
						<DatePicker showTime />
					</Form.Item>
					<Form.Item label="首页推荐">
						<Input.Group compact>
							<Form.Item name="recomType" valuePropName="checked" noStyle>
								<Checkbox style={{ height: "32px", lineHeight: "32px" }} onChange={changeHome}>
									首页推荐
								</Checkbox>
							</Form.Item>
							{!!showNewName && (
								<Form.Item name="recomName" noStyle>
									<Input style={{ width: "50%" }} placeholder="请输入展厅名称" maxLength={18} />
								</Form.Item>
							)}
						</Input.Group>
					</Form.Item>
					<Form.Item label="排序" name="boutiqueSort">
						<InputNumber
							max={9999}
							min={1}
							step={1}
							formatter={limitNumber}
							parser={limitNumber}
							placeholder="请输入1-9999之间的整数"
						/>
					</Form.Item>
					<Form.Item label="状态" name="boutiqueStatus">
						<Radio.Group onChange={changeHandle} value={boutiqueStatusVal}>
							<Radio value={0}>未上架</Radio>
							<Radio value={1}>上架</Radio>
						</Radio.Group>
					</Form.Item>
				</div>
				<div className="globalFooter">
					<Form.Item>
						<Button disabled={!!!validSz} block type="primary" htmlType="submit" loading={loading}>
							保存
						</Button>
					</Form.Item>
				</div>
			</Form>
		</Card>
	)
}

export default AddHallModal
