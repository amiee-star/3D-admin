import { userData } from "@/interfaces/api.interface"

export interface localStorageData {
	todayTime: number
	user: userData
  developUserId: string
}
export default {
	/**
	 * 设置Storage
	 */
	setItem<T extends keyof localStorageData>(key: T, value: localStorageData[T]) {
		localStorage.setItem(key, JSON.stringify(value))
	},
	/**
	 * 读取Storage
	 * noConverted:不转换成对象
	 */
	getItem<T extends keyof localStorageData>(key: T, noConverted: boolean = false): localStorageData[T] | string | null {
		let value = localStorage.getItem(key)
		if (!value) {
			return null
		}
		return !noConverted ? JSON.parse(value) : value
	},
	/**
	 * 移除Storage
	 */
	removeItem(key: keyof localStorageData) {
		localStorage.removeItem(key)
	},
	/**
	 * 清空Storage
	 */
	clearItem() {
		localStorage.clear()
	}
}
