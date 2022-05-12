import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { Row, Col, Space, Button, message } from "antd"
import FormSearch from "@/components/form/form.search"
import { returnSearchFiels } from "@/utils/search.fields"
import ListTable from "@/components/utils/list.table"
import { returnColumnFields } from "@/utils/column.fields"
import serviceMarketing from "@/services/service.marketing"
import { ColumnType } from "antd/es/table/interface"
import "./coupon.less"
import "./salePeople.less"
import { ModalCustom } from "@/components/modal/modal.context"
import addDiscount from "@/components/modal/addDiscount"
import couponInfo from "@/components/modal/couponInfo"
import eventBus from "@/utils/event.bus"
import { PageProps,  } from "@/interfaces/app.interface"
import { salePerson } from "@/interfaces/api.interface"
interface loca {
  id: string
}
const coupon = (props: PageProps) => {
  const {id} = props.location.state as loca
  const [params, setParams] = useState({})
  const [info, setInfo] = useState({}as salePerson)
  const withParams = useRef<any>()

  const columns: ColumnType<any>[] = [
    {
      title: "操作",
      dataIndex: "sceneId",
      key: "sceneId",
      fixed: "right",
      width: 100,
      align: "center",
      render: (v,item) => {
        return (
          item.status === 0 ? <>
            <button onClick={addSale(item.id)}>编辑</button>
          </> : item.status === 1? <>
            <button onClick={lookInfo(item.id)}>查看订单</button>
          </>: <>
            <button onClick={delCoupon(item.id)}>删除</button>
          </>
        )
      }
    }
  ]
  const titleRender = useCallback(() => (
      <Row justify="space-between" align="middle">
        <Col>优惠券列表</Col>
        <Col>
          <Space>
            <Button type="primary" onClick={addSale()}>
              添加
            </Button>
          </Space>
        </Col>
      </Row>
    ),
    [])

  const addSale = (couponId?: string) => () => {
    ModalCustom({
      content: addDiscount,
      params: {
        salesmanId: id,
        couponId
      }
    })
  }
  const lookInfo = (id?: string) => () => {
    ModalCustom({
      content: couponInfo,
      params: {
         id
      }
    })
  }
  const delCoupon = (couponId?: string) => () => {
    serviceMarketing.delCoupon(couponId).then(res => {
      if (res.code === 200) {
        message.success("删除成功")
        eventBus.emit("doCoupon")
      }
    })
  }
  useEffect(() => {
    withParams.current = params
  }, [params])
  useEffect(() => {
    eventBus.on("doCoupon", () => setParams({ ...withParams.current }))
    return () => {
      eventBus.off("doCoupon")
    }
  }, [])
  useMemo(() => {
    if (id) {
      serviceMarketing.salesmanDetail(id).then(res => {
        if (res.code === 200) {
          const {name, telephone} = res.data
          const obj ={
            name,
            telephone
          }
          setInfo(obj)
        }
      })
      setParams({salesmanId: id})
    }

  },[id])
  return(
    <Row>
      <Col className="coupon-info" span={24}>
        <span>{info.name}：</span>
        <span>{info.telephone}</span>
      </Col>
      <Col className="form-search" span={24}>

        <FormSearch
          defaultParams={{salesmanId: id}}
          fields={returnSearchFiels(["couponType","couponStatus","couponName"])}
          toSearch={setParams}
        />
      </Col>
      <Col className="coupon-result" span={24}>
        <ListTable
          title={titleRender}
          searchParams={params}
          columns={returnColumnFields([
            "sort",
            "discount",
            "typeDic",
            "discountName",
            "validStartTime",
            "validEndTime",
            "discountStatus",
            "discountDesc",
          ]).concat(columns)}
          apiService={serviceMarketing.couponsList}
        />
      </Col>
    </Row>
  )
}
coupon.title = "优惠券"
coupon.menu = false
export default coupon
