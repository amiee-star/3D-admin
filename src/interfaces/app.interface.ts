import { FontKey } from "@/components/utils/font.icon"
import { ModalFuncProps } from "antd/lib/modal"
import { History, Location } from "history-with-query"

export interface PageProps {
	children: React.NamedExoticComponent
	history: History
	location: Location
	match: RouteMatch
	route: RouteItem
	routes: RouteItem[]
	staticContext: any //服务端渲染会用
}

export interface RouteItem {
	sort: any
	path: string
	component: React.NamedExoticComponent
	title?: string
	routes?: RouteItem[]
	exact?: boolean
	icon?: FontKey
	menu?: boolean
}

export interface RenderOpts {
	routes: RouteItem[]
	plugin: { hooks: RouteHooks; validKeys: string[] }
	history: History
	dynamicImport: boolean
	rootElement: string
	defaultTitle: string
}

export interface RouteHooks {
	modifyClientRenderOpts: any
	patchRoutes: any
	render: any
	onRouteChange: any
	rootContainer: any
}

export interface rootContainerParams {
	key: string
	ref: any
	props: {
		history: History
		routes: RouteItem[]
		plugin: { hooks: RouteHooks; validKeys: string[] }
		defaultTitle: string
	}
}

export interface RouteChangeParams {
	routes: RouteItem[]
	matchedRoutes: MatchedRoute[]
	location: Location
	action: string
}

export interface MatchedRoute {
	route: RouteItem
	match: RouteMatch
}
export interface RouteMatch {
	path: string
	url: string
	isExact: boolean
	params: any
}

export interface ModalReturn {
	destroy: () => void
	update: (configUpdate: ModalFuncProps | ((prevConfig: ModalFuncProps) => ModalFuncProps)) => void
}
