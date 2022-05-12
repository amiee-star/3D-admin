/* 限制数字输入框只能输入整数 */
export const limitNumber = (value: number | string) => {
	if (typeof value === "string") {
		if (isNaN(Number(value))) return ""

		const len = value.length
		if (len === 1) {
			return value.replace(/[^\d]/g, "")
		} else if (len > 1) {
			if (value[0] === "0") return ""
			return value.replace(/[^\d]/g, "")
		} else {
			return ""
		}
	} else if (typeof value === "number") {
		return !isNaN(value)
			? String(value).replace(/^0(.*?)|([^\d])/g, (all, $1, $2) => {
					return ""
			  })
			: ""
	} else {
		return ""
	}
}

export const parseStringToNumber = (value: string) => {
	// console.log("parseStringToNumber")
	return parseInt(value)
}

export default limitNumber
