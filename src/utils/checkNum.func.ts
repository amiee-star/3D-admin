import { values } from "lodash"

/* 限制数字输入框只能输入整数 */
const limitNumber = (value: number | string) => {
	if (typeof value === "string") {
		return !isNaN(Number(value)) ? value.replace(/^(0+)|[^\d]+/g, "") : ""
	} else if (typeof value === "number") {
		return !isNaN(value) ? String(value).replace(/^(0+)|[^\d]+/g, "") : ""
	} else {
		return ""
	}
}
export default limitNumber
