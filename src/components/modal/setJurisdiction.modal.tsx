import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, Form, message, Select } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceSystem from "@/services/service.system"
import { rolesListParams } from "@/interfaces/params.interface"
import { rolesPermissionsItem } from "@/interfaces/api.interface"

interface Props {
	id: number
}
interface StateData {
	permissionList: rolesPermissionsItem[]
	rolesPermissions: number[]
}
const SetJurisdictionModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [form] = Form.useForm()
	const { Option } = Select
	const [data, setData] = useState<StateData>()
	const [loading, setLoading] = useState(false)
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])
	const onFinish = useCallback(
		(data2: rolesListParams) => {
			setLoading(true)
			serviceSystem
				.saveRolesPermissions({
					roleId: props.id,
					permissionIdList: data2.remember || data.rolesPermissions
				})
				.then(res => {
					if (res.code === 200) {
						closeModal()
						message.success("权限分配成功！")
						setLoading(false)
					}
				})
				.finally(() => {
					setLoading(false)
				})
		},
		[data]
	)

	useEffect(() => {
		Promise.all([serviceSystem.permissionListAll({ keyword: "" }), serviceSystem.rolesPermissions(props.id)]).then(
			([permissionList, rolesPermissions]) => {
				if (permissionList.code === 200 && rolesPermissions.code === 200) {
					setData({
						permissionList: permissionList.data,
						rolesPermissions: rolesPermissions.data
					})
				}
			}
		)
	}, [])

	return (
		<Card
			style={{ width: 530 }}
			title="分配权限"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			{!!data && (
				<Form
					layout="horizontal"
					labelCol={{ span: 4 }}
					form={form}
					preserve={false}
					onFinish={onFinish}
					autoComplete="off"
				>
					<div className="globalScroll">
						<Form.Item label="分配权限" name="remember" valuePropName="checked">
							<Select
								showSearch
								mode="multiple"
								defaultValue={data.rolesPermissions}
								allowClear
								placeholder="请分配权限"
								filterOption={(input, option) => {
									if (option && option.props.title) {
										return option.title === input || option.title.indexOf(input) !== -1
									} else {
										return true
									}
								}}
							>
								{data.permissionList &&
									data.permissionList.map(item => {
										return (
											<Option value={item.id} key={item.id} title={item.permissionName}>
												{item.permissionName}
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

export default SetJurisdictionModal
