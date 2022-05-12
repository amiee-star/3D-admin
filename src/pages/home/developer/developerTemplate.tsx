import { Button, Row, Col, Space, Dropdown, Menu, Modal, message } from "antd"
import React, { useCallback, useEffect, useRef, useState } from "react"
import FormSearch from "@/components/form/form.search"
import ListTable from "@/components/utils/list.table"
import eventBus from "@/utils/event.bus"
import { PageProps } from "@/interfaces/app.interface"
import { returnSearchFiels } from "@/utils/search.fields"
import { returnColumnFields } from "@/utils/column.fields"
import { ColumnType } from "antd/es/table/interface"
import { ModalCustom } from "@/components/modal/modal.context"
import AddTemplateHallModal from "@/components/modal/addTemplateHall.modal"
import serviceSystem from "@/services/service.devloper"
import "./developer.less"
import proxy from "../../../../config/proxy"
import lsFunc from "@/utils/ls.func"
import { userData } from "@/interfaces/api.interface"

interface loca {
  id: string
}
interface info {
  userId: string
  userName: string
  telephone: string
  tag?: string
}



const deleteHandle = (devId: string) => () => {
	Modal.confirm({
		title: "删除展厅模板",
		content: "是否删除当前展厅模板？删除后开发者帐号下将不再显示此模板展厅",
		closable: true,
		onOk: async () => {
		  let rslt = await serviceSystem.devTempDelete({devId})
      if (rslt.code === 200) {
        eventBus.emit("doSceneTemplate")
        Modal.destroyAll()
        message.success("删除成功！")
      }
		}
	})
}

const DeveloperTemplate = (props: PageProps) => {
  const {id} = props.location.state as loca
  const [infos, setInfos] = useState<info>()
	const [params, setParams] = useState({})
	const withParams = useRef<any>()
  const configUrl = (lsFunc.getItem("user") as userData).accessToken
	useEffect(() => {
    withParams.current = params
	}, [params])
  useEffect(() => {
    serviceSystem.developersInfo(id).then(res => {
      if (res.code === 200) {
        const {userId,userName,telephone, tag } = res.data
        setInfos({userId,userName,tag,telephone})
        setParams({userId})
      }
    })
  },[])
	const titleRender = useCallback(
		() => (
			<Row justify="space-between" align="middle">
				<Col>开发者模版展厅</Col>
				<Col>
					<Space>
            { infos && <Button type="primary" onClick={addScene}>
							添加
						</Button>}
					</Space>
				</Col>
			</Row>
		),
		[infos]
	)
	useEffect(() => {
		eventBus.on("doSceneTemplate", () => setParams({ ...withParams.current }))
		return () => {
			eventBus.off("doSceneTemplate")
		}
	}, [])
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
                  <Menu.Item onClick={editScene(item.id)}>修改</Menu.Item>
                  <Menu.Item onClick={deleteHandle(item.id)}>删除</Menu.Item>
                  <Menu.Item onClick={editHall(item.tempId)}>配置展厅</Menu.Item>
                  <Menu.Item onClick={lookHall(item.tempId)}>查看展厅</Menu.Item>
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
  const addScene = () => {
    ModalCustom({
      content: AddTemplateHallModal,
      params: {
        userId: infos.userId
      }
    })
  }
  const editScene = (id: string) => () => {
    ModalCustom({
      content: AddTemplateHallModal,
      params: {
        id,
        userId: infos.userId
      }
    })
  }

  const editHall = (id: string) => () => {
    let url = ` ${proxy.hallUrl[API_ENV]}/?tempId=${id}&token=${configUrl}`
    window.open(url)
  }
  const lookHall = (id: string) => () => {
    let url = ` ${proxy.templateObsUrl[API_ENV]}/sceneFront/index.html?G_TEMP_ID=${id}`
    window.open(url)
  }
	return (
		<Row className="data-form full" id="data-form-info">
			<Col className="form-info" span={24}>
				<div className="content no-padding-top">
          {
            infos && <p className="title">
              开发者：<span hidden={!infos.userName}>{infos.userName} | </span>
              <span hidden={!infos.telephone}>{infos.telephone} | </span>
              <span hidden={!infos.tag}>{infos.tag}</span>
            </p>
          }
				</div>
			</Col>
			<Col className="form-search" span={24}>
        {infos && <FormSearch defaultParams={{userId: infos.userId}} fields={returnSearchFiels(["tempName", "tempId"])} toSearch={setParams} />}
			</Col>
			<Col className="form-result" span={24}>
				<ListTable
					title={titleRender}
					searchParams={params}
					columns={returnColumnFields([
						"sort",
						"hallThumbnail",
						"devHallName",
						"sz",
						"validSz",
						"creatTs",
						"createName",
						"createType"
					]).concat(columns)}
					apiService={serviceSystem.devTemList}
				/>
			</Col>
		</Row>
	)
}
DeveloperTemplate.title = "模版展厅配置"
DeveloperTemplate.menu = false
export default DeveloperTemplate
