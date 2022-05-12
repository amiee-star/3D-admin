import { Row, Col, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import HallInfoModal from "@/components/modal/hallInfo.modal"
import CopySceneModal from "@/components/modal/copyScene.modal"
import OperationHallModal from "@/components/modal/operationHall.modal"
import EditHallDeveloperModal from "@/components/modal/editHall.developer.modal"
import serviceSystem from "@/services/service.devloper"
import "./developer.less"
import { PageProps } from "@/interfaces/app.interface"
import { accountOverview, developerPackagesInfo, userData } from "@/interfaces/api.interface"
import proxy from "../../../../config/proxy"
import lsFunc from "@/utils/ls.func"
interface info {
	userId: string
	userName: string
	telephone: string
	tag?: string
}
interface loca {
	id: string
	userId: string
}
let configUrl = (lsFunc.getItem("user") as userData).accessToken



const DeveloperUser = (props: PageProps) => {
	const { id, userId } = props.location.state as loca
	const [params, setParams] = useState({ devUserId: userId })
	const [developerInfo, setDeveloperInfo] = useState<info>()
	const [developerPackagesInfo, setDeveloperPackagesInfo] = useState<developerPackagesInfo>()
	const [accountOverview, setAccountOverview] = useState<accountOverview>()
	const withParams = useRef<any>()
  const developUserId = useRef("")
  const columns: ColumnType<any>[] = [
    {
      title: "操作",
      dataIndex: "sceneId",
      key: "sceneId",
      fixed: "right",
      width: 60,
      align: "center",
      render: (v, item) => {
        return (
          <>
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item onClick={copyScene(item.tempId, item.tempName)}>复制</Menu.Item>
                  <Menu.Item onClick={deleteHandle(item.tempId)}>删除</Menu.Item>
                  <Menu.Item onClick={sendScene(item.tempId)}>发布</Menu.Item>
                  <Menu.Item onClick={editInfo(item.tempId)}>修改</Menu.Item>
                  <Menu.Item onClick={lookScene(item.tempId)}>查看展厅</Menu.Item>
                  <Menu.Item onClick={EditorScene(item.tempId)}>编辑展厅</Menu.Item>
                  <Menu.Item onClick={viewScene(item.tempId)}>查看信息</Menu.Item>
                  {/* <Menu.Item onClick={operationHandle(item.tempId)}>操作记录</Menu.Item> */}
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
  const viewScene = (id: string) => () => {
    ModalCustom({
      content: HallInfoModal,
      params: {
        id,
        dev: true
      }
    })
  }

  const copyScene = (tempId: string, copyName: string) => () => {
    ModalCustom({
      content: CopySceneModal,
      params: {
        tempId,
        copyName,
        userId: developUserId.current
      }
    })
  }

  const editInfo = (id: string) => () => {
    ModalCustom({
      content: EditHallDeveloperModal,
      params: {
        id,
        userId: developUserId.current
      }
    })
  }

  const operationHandle = (id: string) => () => {
    ModalCustom({
      content: OperationHallModal,
      params: {
        id
      }
    })
  }

  const sendScene = (id: string) => () => {
    Modal.confirm({
      title: "发布展厅",
      content: "是否发布当前展厅？",
      closable: true,
      onOk: async () => {
        await serviceSystem.publishDevUserTemp({ tempId: id, devUserId: developUserId.current })
        eventBus.emit("doSceneTemplate")
        message.success("发布成功！")
      }
    })
  }

  const EditorScene = (id: string) => () => {
    let url = ` ${proxy.hallUrl[API_ENV]}/?tempId=${id}&token=${configUrl}`
    window.open(url)
  }
  const lookScene = (id: string) => () => {
    let url = ` ${proxy.templateObsUrl[API_ENV]}/sceneFront/index.html?G_TEMP_ID=${id}`
    window.open(url)
  }
  const deleteHandle = (id: string) => () => {
    Modal.confirm({
      title: "删除展厅",
      content: "是否删除当前展厅？",
      closable: true,
      onOk: async () => {
        await serviceSystem.deleteDevUserTemp({ tempId: id, devUserId: developUserId.current })
        eventBus.emit("doSceneTemplate")
        message.success("删除成功！")
      }
    })
  }

	useEffect(() => {
		withParams.current = params
	}, [params])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>开发者用户展厅</Col>
				{/* <Col>
					<Space>
						<Button type="primary" onClick={addScene}>
							添加
						</Button>
					</Space>
				</Col> */}
			</Row>
		),
		[]
	)
	useEffect(() => {
		eventBus.on("doSceneTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSceneTemplate")
		}
	}, [])
	useEffect(() => {
		serviceSystem.devResources(id).then(res => {
			if (res.code === 200) {
				const { userId, userName, telephone, tag } = res.data.developerInfo
				setDeveloperInfo({ userId, userName, tag, telephone })
				setDeveloperPackagesInfo(res.data.developerPackagesInfo)
				setAccountOverview(res.data.accountOverview)
        developUserId.current = userId
				// lsFunc.setItem("developUserId", userId)
			}
		})
	}, [])
	const concatParams = (params: { dateTime: object }) => {
		if (params.dateTime) {
			params["startTime"] = Date.parse(params.dateTime[0])
			params["endTime"] = Date.parse(params.dateTime[1])
			delete params.dateTime
		}
		setParams(Object.assign(params, { devUserId: userId }))
	}
	return (
		<Row className="data-form full" id="data-form-info">
			<Col className="form-info" span={24}>
				<div className="content no-padding-top">
					{developerInfo && (
						<p className="title">
							开发者：<span hidden={!developerInfo.userName}>{developerInfo.userName} | </span>
							<span hidden={!developerInfo.telephone}>{developerInfo.telephone} | </span>
							<span hidden={!developerInfo.tag}>{developerInfo.tag}</span>
						</p>
					)}
				</div>
				{accountOverview && (
					<div className="content">
						<p className="title">帐号总览：{accountOverview.expireStr}</p>
						<p className="details-info">
							<span>展厅总数：{accountOverview.totalScenes}</span>
							<span>
								发布展厅总数：{accountOverview.publishScenesUses}（-{accountOverview.delScenes}）
							</span>
							<span>导入用户总数：{accountOverview.importUsers}</span>
							<span>在线客服：{accountOverview.onlineServicesUses}</span>
							<span>直播：{accountOverview.livesUses}</span>
							<span>访客信息：{accountOverview.visitorInfosUses}</span>
							<span>离线同步：{accountOverview.onlineServicesUses}</span>
							<span>VR带看：{accountOverview.vrLooksUses}</span>
						</p>
					</div>
				)}
				{developerPackagesInfo && (
					<div className="content">
						<p className="title">本周期总览：{developerPackagesInfo.expireStr}</p>
						<p className="details-info">
							<span>展厅总数：{developerPackagesInfo.totalScenes}</span>
							<span>
								发布展厅总数：{developerPackagesInfo.publishScenesUses}（-{developerPackagesInfo.delScenes}）/
								{developerPackagesInfo.publishScenes}
							</span>
							<span>导入用户总数：{developerPackagesInfo.importUsers}</span>
							<span>
								在线客服：{developerPackagesInfo.onlineServicesUses}/{developerPackagesInfo.onlineServices}
							</span>
							<span>
								直播：{developerPackagesInfo.livesUses}/{developerPackagesInfo.lives}
							</span>
							<span>
								访客信息：{developerPackagesInfo.visitorInfosUses}/{developerPackagesInfo.visitorInfos}
							</span>
							<span>离线同步：{developerPackagesInfo.sceneSyncs}</span>
							<span>
								VR带看：{developerPackagesInfo.vrLooksUses}/{developerPackagesInfo.vrLooks}
							</span>
						</p>
					</div>
				)}
			</Col>
			<Col className="form-search" span={24}>
				<FormSearch
					fields={returnSearchFiels([
						"tempName",
						"tempId",
						"WuserName",
						"aliStatic",
						"WisCheck",
						"DsynchState",
						"WaddServices",
						"WdateTime"
					])}
					toSearch={concatParams}
				/>
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"hallThumbnail",
						"devHallName",
						"validSz",
						"creatTs",
						"user",
						"aliStatic",
						"durationEndTs",
						"isCheck",
						"deverver",
						"syncStatic"
					]).concat(columns)}
					apiService={serviceSystem.getUserTempPageList}
				/>
			</Col>
		</Row>
	)
}
DeveloperUser.title = "资源使用情况"
DeveloperUser.menu = false
export default DeveloperUser
