import serviceSystem from "@/services/service.devloper"
import { CloseOutlined } from "@ant-design/icons"
import { Button, Card } from "antd"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import eventBus from "@/utils/event.bus"
import { mealList } from "@/interfaces/api.interface"
import { ModalRef } from "./modal.context"
import classNames from "classnames"
import "./developer.resource.less"
interface Props {
	id: string
}
const DeveloperMeal: React.FC<Props & ModalRef> = props => {
	const { id, modalRef } = props
	const [info, setInfo] = useState<mealList>()
	const [activeId, setActiveId] = useState("")
	useMemo(() => {
		serviceSystem.packagesList(id).then(res => {
			setInfo(res.data)
			setActiveId(res.data.packageId)
		})
	}, [id])
	const changeMeal = (id: string) => () => {
		setActiveId(id)
	}
	const closeModal = () => {
		modalRef.current.destroy()
	}
	const chooseMeal = useCallback(() => {
		serviceSystem.bindMeal({ packageId: activeId, devId: id }).then(res => {
			if (res.code === 200) {
				eventBus.emit("doSceneTemplate")
				closeModal()
			}
		})
	}, [activeId])
	return (
		<Card
			id="devMeal"
			style={{ width: 590 }}
			title="套餐变更"
			extra={
				<Button type="text" onClick={closeModal}>
					<CloseOutlined />
				</Button>
			}
		>
			<div className="contain">
				<ul className="flex mealList">
					{info &&
						info.packagesList.map((item, index) => {
							return (
								<li
									key={index}
									className={classNames("flex-center-column", { active: activeId === item.id })}
									onClick={changeMeal(item.id)}
								>
									<p className="name">{item.name}</p>
									<p>
										发布个数 <span>{item.publishScenes}</span>
									</p>
									<p className="time">
										有效期 <span>{item.day}天</span>
									</p>
									<div hidden={info.packageId !== item.id} className="activeTitle flex-center-column">
										当前套餐
									</div>
								</li>
							)
						})}
				</ul>
				<div className="tips">•变更套餐，则当前套餐剩余资源清零（不会转移），立即生效新套餐</div>
				<div className="tips">•续费当前套餐，则当前套餐剩余资源清零（不会顺延），立即重启本套餐</div>
				{info && (
					<div className="flex-end">
						<Button type="primary" htmlType="button" onClick={chooseMeal}>
							{info.packageId !== activeId ? "变更" : "续费"}
						</Button>
						<Button style={{ marginLeft: 10 }} htmlType="button" onClick={closeModal}>
							取消
						</Button>
					</div>
				)}
			</div>
		</Card>
	)
}
export default DeveloperMeal
