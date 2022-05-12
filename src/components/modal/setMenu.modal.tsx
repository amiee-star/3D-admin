import { CloseOutlined } from "@ant-design/icons"
import { Button, Card, message, Row, Space, Tree } from "antd"
import React, { useCallback, useEffect, useState } from "react"
import { ModalRef } from "./modal.context"
import serviceSystem from "@/services/service.system"
import { menuTreeItem } from "@/interfaces/api.interface"

interface Props {
	id: number
}
interface StateData {
	menuTree: menuTreeItem[]
}

const SetMenuModal: React.FC<Props & ModalRef> = props => {
	const { modalRef } = props
	const [data, setData] = useState<StateData>()
	const [checkedKeys, setCheckedKeys] = useState<React.Key[]>([])
	const closeModal = useCallback(() => {
		modalRef.current.destroy()
	}, [])

	const confirmHandle = useCallback(() => {
		serviceSystem
			.savePermissionsMenu({
				permissionId: props.id,
				type: 2,
				resourceIds: checkedKeys
			})
			.then(res => {
				if (res.code === 200) {
					closeModal()
					message.success("菜单分配成功！")
				}
			})
	}, [checkedKeys])

	const mapTree = (list: menuTreeItem[]): menuTreeItem[] => {
		return list.map(m => {
			return { ...m, children: m.children ? mapTree(m.children) : [], title: m.menuName, key: m.id }
		})
	}

	useEffect(() => {
		Promise.all([
			serviceSystem.menuTree({ keyword: "" }),
			serviceSystem.searchPermissionsMenu({ permissionId: props.id, type: 2 })
		]).then(([menuTree, searchPermissionsMenu]) => {
			if (menuTree.code === 200 && searchPermissionsMenu.code === 200) {
				setData({
					menuTree: menuTree.data
				})
				console.log(searchPermissionsMenu.data)
				setCheckedKeys(searchPermissionsMenu.data)
			}
		})
	}, [])

	const onCheck = (checkedKeys: React.Key[]) => {
		setCheckedKeys(checkedKeys)
	}

	return (
		<Card
			style={{ width: 530 }}
			title="分配菜单"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="globalScroll">
				{!!data && (
					<Tree
						checkable
						defaultExpandAll
						selectable={false}
						checkedKeys={checkedKeys}
						onCheck={onCheck}
						treeData={data?.menuTree && mapTree(data.menuTree)}
					/>
				)}
			</div>
			<Row justify="end" className="globalFooter">
				<Space>
					<Button className="cancel-btn" onClick={closeModal}>
						取消
					</Button>
					<Button type="primary" onClick={confirmHandle}>
						保存
					</Button>
				</Space>
			</Row>
		</Card>
	)
}

export default SetMenuModal
