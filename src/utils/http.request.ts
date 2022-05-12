import { baseRes, userData } from "@/interfaces/api.interface"
import { message } from "antd"
import Axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import Qs from "qs"
import formCheckFunc from "./formCheck.func"
import lsFunc from "./ls.func"

interface RequestOption<D> extends AxiosRequestConfig {
	url: string
	params?: D
}

function creatAxios(config: AxiosRequestConfig) {
	const defaultConf: AxiosRequestConfig = {
		baseURL: process.env.NODE_ENV === "production" ? "" : "/",
		timeout: 30 * 60 * 1000
	}
	const axiosInstance = Axios.create(Object.assign({}, defaultConf, config))
	axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
		const { headers = {} } = config
		const userInfo = lsFunc.getItem("user") as userData
		if (userInfo) {
			headers.JmAccessToken = (lsFunc.getItem("user") as userData).accessToken
		}
		return { ...config, headers }
	})
	axiosInstance.interceptors.response.use(value => {
		let result: AxiosResponse<baseRes<any>> = Object.assign({}, value)
		Object.keys(value.data).map(key => {
			result.data[key.toLocaleLowerCase()] = value.data[key]
		})
		if (result.data.success) {
			const { code, message: errMsg, success } = result.data
			if (code !== 200 && code !== 3018) {
				message.error(errMsg)
			}
			if (code === -1000) {
				lsFunc.clearItem()
				location.href = "/auth/login.html"
			}
			return result
		} else {
			const { code, message: errMsg } = result.data
			message.error(errMsg)
			throw { code, message: errMsg }
		}
	})
	return axiosInstance
}

function creatAxios2(config: AxiosRequestConfig) {
	const defaultConf: AxiosRequestConfig = {
		baseURL: process.env.NODE_ENV === "production" ? "" : "/",
		timeout: 30 * 60 * 1000
	}
	const axiosInstance = Axios.create(Object.assign({}, defaultConf, config))
	axiosInstance.interceptors.request.use((config: AxiosRequestConfig) => {
		const { headers = {} } = config
		const userInfo = lsFunc.getItem("user") as userData
		if (userInfo) {
			headers.JmAccessToken = (lsFunc.getItem("user") as userData).accessToken
		}
		return { ...config, headers }
	})
	axiosInstance.interceptors.response.use(value => {
		let result: AxiosResponse<baseRes<any>> = Object.assign({}, value)
		return result
	})
	return axiosInstance
}

export async function get<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).get<R>(url, {
			params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}
export async function postJson<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

export async function postBlob<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign(
			{
				headers: {
					"Content-Type": "application/json"
				}
			},
			config
		)
		let ajax = await creatAxios2(config).post<R>(url, params, {
			...config,
			responseType: "arraybuffer"
		})
		return ajax
	} catch (error) {
		throw error
	}
}

export async function patch<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign(
			{
				headers: {
					"Access-Control-Allow-Headers": "content-type,x-requested-with,JmAccessToken"
				}
			},
			config
		)
		let ajax = await creatAxios(config).patch<R>(url, {
			...params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

export async function put<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).put<R>(url, {
			...params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}
export async function del<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		let ajax = await creatAxios(config).delete<R>(url, {
			params,
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

export async function post<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		config = Object.assign({ headers: { "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8" } }, config)
		if (!config.headers["Content-Type"].includes("multipart")) {
			config.transformRequest = [data => !!data && Qs.stringify(data)]
		}
		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		throw error
	}
}

const paramsToFormData = (params: { [x: string]: string | Blob; constructor?: any }) => {
	params = params || {}
	let p
	if (params.constructor !== FormData) {
		p = new FormData()
		for (let i in params) {
			if (params[i]) {
				p.append(i, params[i])
			}
		}
	} else {
		p = params
	}
	return p
}

export async function fromData<R, P = {}>(
	option: RequestOption<P> = {
		url: ""
	}
) {
	try {
		let { url, params = {}, ...config } = option
		params = paramsToFormData(params)
		config = Object.assign(
			{
				headers: {
					"Content-Type": "multipart/form-data"
				}
			},
			config
		)
		let ajax = await creatAxios(config).post<R>(url, params, {
			...config
		})
		return ajax.data
	} catch (error) {
		console.log(error)
		throw error
	}
}
