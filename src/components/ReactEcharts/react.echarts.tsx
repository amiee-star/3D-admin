import React, { CSSProperties } from "react"

import "echarts/lib/chart/bar"
import "echarts/lib/chart/gauge"
import "echarts/lib/chart/graph"
import "echarts/lib/chart/line"
import "echarts/lib/chart/lines"
import "echarts/lib/chart/pie"
import "echarts/lib/chart/radar"
import "echarts/lib/component/axis"
import "echarts/lib/component/axisPointer"
import "echarts/lib/component/graphic"
import "echarts/lib/component/grid"
import "echarts/lib/component/legend"
import "echarts/lib/component/markLine"
import "echarts/lib/component/title"
import "echarts/lib/component/tooltip"

import "echarts/lib/component/dataZoom"
import "echarts/lib/component/brush"
import "echarts/lib/component/calendar"
import "echarts/lib/component/geo"
import "echarts/lib/component/timeline"
import "echarts/lib/component/toolbox"
import "echarts/lib/component/visualMap"
import echarts from "echarts/lib/echarts"
import isEqual from "fast-deep-equal"
import { bind, clear } from "size-sensor"
import echartsTheme from "./echarts.theme"

echarts.registerTheme("customed", echartsTheme)

const pick = (obj: Record<string, any> = {}, keys: string[] = []): Record<string, any> => {
	const r = {} as Record<string, any>
	keys.forEach(key => {
		r[key] = obj[key]
	})
	return r
}

export interface ReactEchartsProps extends echarts.EChartsOptionConfig {
	option: echarts.EChartOption
	theme?: object | string
	opts?: {
		devicePixelRatio?: number
		renderer?: string
		width?: number | string
		height?: number | string
	}
	style?: CSSProperties
	className?: string
	onChartReady?: (echart?: echarts.ECharts) => void
	showLoading?: boolean
	loadingOption?: echarts.EChartsLoadingOption
	onEvents?: {
		[key: string]: (data?: any, echart?: echarts.ECharts) => void
	}
	shouldSetOption?: (prevProps: ReactEchartsProps, currentProps: ReactEchartsProps) => boolean
}
export default class ReactEcharts extends React.Component<ReactEchartsProps> {
	constructor(props: any) {
		super(props)
		this.theme = this.props.theme
		this.echartsElement = null
		this.echartInstance = null
	}
	theme?: object | string
	echartsElement: HTMLDivElement | null
	echartInstance: echarts.ECharts | null
	componentDidMount() {
		this.rerender()
	}
	componentDidUpdate(prevProps: ReactEchartsProps) {
		// 以下属性修改的时候，需要 dispose 之后再新建
		// 1. 切换 theme 的时候
		// 2. 修改 opts 的时候
		// 3. 修改 onEvents 的时候，这样可以取消所以之前绑定的事件 issue #151
		if (
			!isEqual(prevProps.theme, this.theme) ||
			!isEqual(prevProps.opts, this.props.opts) ||
			!isEqual(prevProps.onEvents, this.props.onEvents)
		) {
			this.dispose()
			setTimeout(() => {
				this.rerender() // 重建
			}, 300)
			return
		}
		// 当这些属性保持不变的时候，不 setOption
		const pickKeys = ["option", "notMerge", "lazyUpdate", "showLoading", "loadingOption"]
		if (isEqual(pick(this.props, pickKeys), pick(prevProps, pickKeys))) {
			return
		}
		// 判断是否需要 setOption，默认为 true
		if (typeof this.props.shouldSetOption === "function" && !this.props.shouldSetOption(prevProps, this.props)) {
			return
		}
		const echartObj = this.renderEchartDom()
		// 样式修改的时候，可能会导致大小变化，所以触发一下 resize
		if (!isEqual(prevProps.style, this.props.style) || !isEqual(prevProps.className, this.props.className)) {
			try {
				echartObj && echartObj.resize()
			} catch (e) {
				console.warn(e)
			}
		}
	}
	componentWillUnmount() {
		this.dispose()
	}
	getEchartsInstance() {
		if (this.echartsElement) {
			return (
				echarts.getInstanceByDom(this.echartsElement) ||
				echarts.init(this.echartsElement, this.theme || "customed", this.props.opts)
			)
		}
	}
	dispose() {
		if (this.echartsElement) {
			try {
				clear(this.echartsElement)

				if (this.echartInstance) {
					this.echartInstance.clear()
				}
			} catch (e) {
				console.warn(e)
			}
			echarts.dispose(this.echartsElement)
		}
	}
	rerender() {
		const { onEvents, onChartReady } = this.props
		const echartObj = (this.echartInstance = this.renderEchartDom())
		if (echartObj) {
			this.bindEvents(echartObj, onEvents || {})
			if (typeof onChartReady === "function") {
				this.props.onChartReady && this.props.onChartReady(echartObj)
			}
			if (this.echartsElement) {
				bind(this.echartsElement, () => {
					try {
						echartObj.resize()
					} catch (e) {
						console.warn(e)
					}
				})
			}
		}
	}
	bindEvents(instance: echarts.ECharts, events: any) {
		const _bindEvent = (eventName: string, func?: Function) => {
			if (typeof eventName === "string" && typeof func === "function") {
				// todo 临时处理, 需要优化
				instance.off(eventName, func)
				instance.on(eventName, func)
				// instance.on(eventName, (param: any) => {
				// 	func(param, instance);
				// });
			}
		}
		for (const eventName in events) {
			if (Object.prototype.hasOwnProperty.call(events, eventName)) {
				_bindEvent(eventName, events[eventName])
			}
		}
	}
	renderEchartDom() {
		const echartObj = this.getEchartsInstance()
		if (!echartObj) return null
		echartObj.setOption(this.props.option, this.props.notMerge || false, this.props.lazyUpdate || false)
		if (this.props.showLoading) {
			echartObj.showLoading("default", this.props.loadingOption)
		} else {
			echartObj.hideLoading()
		}
		return echartObj
	}

	render() {
		const { style, className } = this.props
		const newStyle = {
			height: "100%",
			...style
		}
		return (
			<div
				ref={e => {
					this.echartsElement = e
				}}
				style={newStyle}
				className={`echarts-for-react${!!className ? ` ${className}` : ""}`}
			/>
		)
	}
}
