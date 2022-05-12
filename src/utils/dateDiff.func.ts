import moment, { Moment } from "moment"
export const DateDiff = (start: number, end: number) => {
	var startStr = moment(start).format("YYYY-MM-DD")
	var endStr = moment(end).format("YYYY-MM-DD")
	var y2 = Number(startStr.split("-")[0])
	var m2 = Number(startStr.split("-")[1])
	var d2 = Number(startStr.split("-")[2])
	var y3 = Number(endStr.split("-")[0])
	var m3 = Number(endStr.split("-")[1])
	var d3 = Number(endStr.split("-")[2])
	var day2 = Number(new Date(y2, m2 - 1, d2))
	var day3 = Number(new Date(y3, m3 - 1, d3))
	var dnum = (day3 - day2) / 86400000
	var minfo = ""

	if (dnum > 0) {
		var mnum
		var mleft

		mnum = (y3 - y2) * 12 + (m3 - m2)
		if (d3 >= d2) {
			mleft = d3 - d2
		} else {
			mnum--
			mleft = (day3 - Number(new Date(y3, m3 - 2, d2))) / 86400000
		}
		minfo = (mnum > 0 ? mnum + "个月" : "") + mleft + "天"
	}
	return minfo
}

export default DateDiff
