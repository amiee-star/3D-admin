import moment from "moment"
import { getLocale } from "umi"
declare global {
	const API_ENV: string
	interface Window {
		routerBase: string
		publicPath: string
		isLocal: boolean
	}
}

//moment跟随全局语言
moment.locale(getLocale())
//监控集成
import * as Sentry from "@sentry/react"
import { BrowserTracing } from "@sentry/tracing"

Sentry.init({
	dsn: "https://cd712ce74d25473f8fb8fb18e25cec91@sentry.3dyunzhan.com/5",
	integrations: [new BrowserTracing()],
	tracesSampleRate: 1.0,
	environment: API_ENV || "test"
})
