import { userContext } from "@/components/provider/user.context"
import { PageProps, RouteItem } from "@/interfaces/app.interface"
import serviceScene from "@/services/service.scene"
import { DownOutlined } from "@ant-design/icons"
import { Button, Card, Col, Dropdown, Layout, Menu, PageHeader, Row } from "antd"
import { Route } from "antd/lib/breadcrumb/Breadcrumb"
import SubMenu from "antd/lib/menu/SubMenu"
import { ModalCustom, ModalRef } from "@/components/modal/modal.context"
import React, { useCallback, useContext, useEffect, useMemo, useState } from "react"
import "./_layout.less"
import RegisterFormModal from "@/components/modal/registerForm.modal"
import EditPassWordModal from "@/components/modal/editPassWord.modal"
import FontIcon, { FontKey } from "@/components/utils/font.icon"
import eventBus from "@/utils/event.bus"
import ErrorModal from "@/components/modal/errorAlert.modal"
import { clone } from "lodash"
interface errorItem {
	tip1: {
		text: ""
		name: string[]
	}
	tip2: {
		text: ""
		name: string[]
	}
	tip3: {
		text: ""
		name: string[]
	}
	tip4: {
		text: ""
		name: string[]
	}
	tip5: {
		text: ""
		name: string[]
	}
	tip6: {
		text: ""
		name: string[]
	}
}
const { Sider, Header, Content } = Layout
const IndexLayout = (props: PageProps & ModalRef) => {
	const { location, history, route } = props
	const [done, setDone] = useState(false)
	const { state, dispatch } = useContext(userContext)
	const [show, setShow] = useState(false)
	const [error, setError] = useState<errorItem>()
	useEffect(() => {
		// !state.user && history.replace(`/auth/login.html?redirect=${location.pathname + location.search}`)
		!state.user && history.replace(`/auth/login.html`)
	}, [state])
	const renderMenu = useCallback(
		(routes: RouteItem[]) => {
			const { authorities, user } = state
			return routes
				.filter(item => ("menu" in item ? item.menu : true))
				.filter(item => {
					if (!!authorities && !user.isShowAllMenus) {
						if (item.routes?.length) {
							const findChild = authorities.find(m => {
								return item.routes.map(n => n.path).includes(m.url)
							})
							if (findChild) {
								const findItem = authorities.find(m => m.id === findChild.parentId)
								if (findItem) {
									item.icon = findItem.icon as FontKey
									item.title = findItem.name
									item.sort = findItem.sort
									return true
								}
							} else {
								return false
							}
						} else {
							const findItem = authorities.find(m => m.url === item.path)
							if (findItem) {
								item.icon = findItem.icon as FontKey
								item.title = findItem.name
								item.sort = findItem.sort
								return true
							} else {
								return false
							}
						}
					} else {
						return item
					}
				})
				.sort((next, prev) => prev.sort - next.sort)
				.map(item => {
					if (item.routes && item.routes.length) {
						return (
							<SubMenu key={item.path} title={item.title} icon={<FontIcon icon={item.icon} />}>
								{renderMenu(item.routes)}
							</SubMenu>
						)
					} else {
						return <Menu.Item key={item.path}>{item.title}</Menu.Item>
					}
				})
		},
		[state]
	)
	const getDefault = useMemo(() => {
		function getPath(routes: RouteItem[], initVal: Route[]) {
			const item = routes.find(item => new RegExp(item.path).test(location.pathname))
			// if (item && ("menu" in item ? item.menu : true)) {
			if (item) {
				initVal.unshift({ path: item.path, breadcrumbName: item.title })
				if (item.routes && item.routes.length) {
					initVal = getPath(item.routes, initVal)
				}
			}
			return initVal
		}
		return getPath(route.routes, [])
	}, [location])

	const menuClick = useCallback(
		({ ...params }) => {
			history.push(params.key)
		},
		[state]
	)
	const [open, setOpen] = useState(getDefault.map(m => m.path))
	const onOpenChange = useCallback((e: React.ReactText[]) => setOpen(e.splice(-1).map(m => m.toString())), [])
	const logoutAction = useCallback(() => {
		serviceScene.logout().then(res => {
			if (res.code === 200) {
				dispatch({
					type: "clear"
				})
			}
		})
	}, [])
	const frontRegedit = useCallback(() => {
		ModalCustom({
			content: RegisterFormModal
		})
	}, [])

	const editPassWord = useCallback(() => {
		ModalCustom({
			content: EditPassWordModal,
			params: {
				userId: state.user.id
			}
		})
	}, [])

	// const backPage = (path: string) => () => {
	// 	let newPath = path.replace("(", "").replace(")", "").replace("?", "")
	// 	console.log(newPath)
	// 	if (newPath.split("/").length > 3 && newPath !== location.pathname) {
	// 		// history.push(newPath)
	// 	}
	// }

	useEffect(() => {
		if (!done && !!state.user && !state.authorities) {
			serviceScene.getMemuList({ id: state.user.id }).then(res => {
				if (res.code === 200) {
					dispatch({
						type: "set",
						payload: {
							...res.data
						}
					})
					setDone(true)
				}
			})
		}
	}, [state])
	useEffect(() => {
		eventBus.on("showAlert", val => {
			if (val) {
				setShow(true)
				setError(JSON.parse(val))
			} else {
				setShow(false)
			}
		})
	}, [])
	const hasAuthorities = useMemo(() => {
		return (
			(done && state.authorities && state.authorities.some(m => m.url === location.pathname)) ||
			location.pathname == "/home/dashboard.html"
		)
	}, [done, state])
	return (
		done && (
			<Layout id="IndexLayout" className="full">
				<Sider>
					<div className="layout-left-box">
						<div className="logo">
							{/* <FontIcon icon={FontKey.LOGO02} /> */}
							{/*<img src={require("@/assets/images/logo-icon.png")} alt="" />*/}
              数字展厅管理系统
						</div>
						<Menu
							className="layout-menu"
							onOpenChange={onOpenChange}
							openKeys={open}
							defaultOpenKeys={getDefault.map(m => m.path)}
							defaultSelectedKeys={getDefault.map(m => m.path)}
							theme="dark"
							mode="inline"
							onClick={menuClick}
						>
							{renderMenu(route.routes)}
						</Menu>
					</div>
				</Sider>
				<Layout>
					<Header>
						<Row justify="end" align="middle" gutter={10}>
							{/* <Col>
								<Button size="middle" type="primary" onClick={frontRegedit}>
									注册前台用户
								</Button>
							</Col> */}
							<Col>
								<Row justify="end" align="middle" gutter={10}>
									<Col className="head-img">
										{/* <Avatar src={state.user?.avatar} /> */}
										<FontIcon icon={FontKey.touxiang} />
									</Col>
									<Col>
										<Dropdown
											arrow
											placement="bottomCenter"
											overlay={
												<Menu>
													<Menu.Item onClick={editPassWord}>修改密码</Menu.Item>
													<Menu.Item onClick={logoutAction}>退出登录</Menu.Item>
													<Menu.Divider />
												</Menu>
											}
										>
											<a className="userName">
												{state.user?.username || ""} <DownOutlined />
											</a>
										</Dropdown>
									</Col>
								</Row>
							</Col>
						</Row>
					</Header>
					<Content>
						<div className="content-box">
							{getDefault.length > 0 && (
								<div className="content-head">
									<PageHeader
										title={""}
										breadcrumb={{
											routes: Array.from(getDefault).reverse(),
											itemRender: e => <span>{e.breadcrumbName}</span>
										}}
									/>
								</div>
							)}
							<div className="content-main">
								<Card className="full">{hasAuthorities && props.children}</Card>
							</div>
						</div>
					</Content>
					{/* <Footer className="t-cn">3D云展管理系统</Footer> */}
				</Layout>
				{show && <ErrorModal error={error}></ErrorModal>}
			</Layout>
		)
	)
}
export default IndexLayout
