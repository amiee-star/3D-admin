import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, message, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceSystem from "@/services/service.system"
import { rolesListParams } from "@/interfaces/params.interface"
import { comboItem, rolesListItem } from "@/interfaces/api.interface"

interface Props {
	id: string
}
interface StateData {
	combo: comboItem[]
	rolesList: rolesListItem[]
}
const AddSceneModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const { Option } = Select
	const [roleData, setRoleData] = useState<StateData>()
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	useEffect(() => {
		Promise.all([serviceSystem.combo({ keyword: "" }), serviceSystem.rolesList(props.id)]).then(
			([combo, rolesList]) => {
				if (combo.code === 200 && rolesList.code === 200) {
					setRoleData({
						combo: combo.data,
						rolesList: rolesList.data
					})
				}
			}
		)
	}, [])

	const onFinish = useCallback((data: rolesListParams) => {
		setLoading(true)
		serviceSystem
			.roles({
				userId: props.id,
				roleIds: data.remember
			})
			.then(res => {
				if (res.code === 200) {
					closeModal()
					message.success("角色分配成功！")
					setLoading(false)
				}
			})
			.finally(() => {
				setLoading(false)
			})
	}, [])

	return (
		<Card
			style={{ width: 530 }}
			title="分配角色"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!roleData && (
				<Form
					layout="horizontal"
					labelCol={{ span: 4 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
					initialValues={{
						remember: roleData.rolesList.map(m => m.id)
					}}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item label="分配角色：" name="remember" valuePropName="checked">
							<Select
								showSearch
								mode="multiple"
								defaultValue={roleData.rolesList.map(m => m.id)}
								allowClear
								placeholder="请分配角色"
								filterOption={(input, option) => {
									if (option && option.props.title) {
										return option.title === input || option.title.indexOf(input) !== -1
									} else {
										return true
									}
								}}
							>
								{roleData.combo &&
									roleData.combo.map(item => {
										return (
											<Option value={item.id} key={item.id} title={item.name}>
												{item.name}
											</Option>
										)
									})}
							</Select>
						</Form.Item>
					</div>
					<div className="globalFooter">
						<Form.Item style={{ textAlign: "right" }}>
							<Button type="primary" htmlType="submit" loading={loading}>
								保存
							</Button>
							<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
								取消
							</Button>
						</Form.Item>
					</div>
				</Form>
			)}
		</Card>
	)
}

export default AddSceneModal
