import { defineConfig, IConfig } from "umi"
import ProxyConfig from "./proxy"
function buildProxy() {
	const proxyList = {} as Record<string, any>
	Object.keys(ProxyConfig).forEach(it => {
		proxyList[`/${it}`] = {
			target: ProxyConfig[it][process.env.API_ENV || "test"],
			changeOrigin: true,
			pathRewrite: { [`^/${it}`]: "" }
		}
	})
	return proxyList
}

export default defineConfig({
	base: "./",
	outputPath: "./dist/",
	proxy: buildProxy(),
	devServer: {
		port: 8001
	},
	exportStatic: {
		htmlSuffix: true,
		dynamicRoot: true
	},
	history: {
		type: "browser"
	},
	ignoreMomentLocale: true,
	mountElementId: "app",
	runtimePublicPath: true,
	hash: true,
	chunks: ["rule3D"],
	chainWebpack: conf => {
		const entryVal = conf.entry("umi").values()
		conf.entryPoints
			.delete("umi")
			.end()
			.entry("rule3D")
			.merge(entryVal)
			.end()
			.module.rule("no-use-base64")
			.test(/no64/i)
			.use("file-loader")
			.loader("file-loader")
			.options({
				name: "static/[name]-[hash:8].[ext]"
			})
	},
	define: {
		API_ENV: process.env.API_ENV || "test"
	},
	dynamicImport: {
		loading: "@/components/utils/page.loading.tsx"
	},
	locale: {
		antd: true,
		title: true,
		baseNavigator: true,
		baseSeparator: "-"
	},
	dva: false,
	fastRefresh: {}
	// dva: {
	// 	immer: true,
	// 	hmr: false,
	// 	skipModelValidate: false,
	// 	extraModels:false
	// }
	// antd: {
	//   //暗黑模式
	//   dark: false,
	//   //紧凑布局
	// 	compact: true
	// }
	// cssModulesTypescriptLoader: {
	// 	mode: "emit"
	// },
	// cssLoader: {
	// 	localsConvention: "camelCase"
	// }
	// theme: {
	//   '@primary-color': '#1DA57A',
	// }
} as IConfig)
