import React, { useEffect, useState, useMemo, useCallback } from "react"
import { Row, Col, Input, Button, DatePicker, Table, Calendar, Select } from "antd"
import moment, { Moment } from "moment"

const timeDate = () => {
	const { RangePicker } = DatePicker
	const [active, setActive] = useState(2)
	const [hackValue, setHackValue] = useState<any>([])
	const [value, setValue] = useState<any>()
	const [dates, setDates] = useState([])
	const [selectDate, setSelectDate] = useState<string[]>([])
	const timeData = [
		{
			label: "昨日",
			value: 1
		},
		{
			label: "近一周",
			value: 2
		},
		{
			label: "近一月",
			value: 3
		},
		{
			label: "近一年",
			value: 5
		},
		{
			label: "累计",
			value: 6
		}
	]

	const disabledDate = (current: any) => {
		if (!dates || (dates && dates.length === 0)) {
			current > moment().endOf("day")
		}
		if (dates) {
			const tooLate = dates[0] && current.diff(dates[0], "days") > 60
			const tooEarly = dates[1] && dates[1].diff(current, "days") > 60
			return tooEarly || tooLate || current > moment().endOf("day")
		}
	}

	const calendarHandle = (val: React.SetStateAction<[Moment, Moment]>, dates: React.SetStateAction<string[]>) => {
		if (dates[0] && dates[1]) {
			setActive(4)
		} else {
			setActive(2)
		}
		setSelectDate(dates)
		setDates(val)
		setValue(val)
	}

	const onOpenChange = (open: Boolean) => {
		if (open) {
			setHackValue([])
			setDates([])
		} else {
			setHackValue(undefined)
		}
	}

	const selectTimeHandle = (val: number) => {
		setActive(val)
		setSelectDate(["", ""])
		setHackValue([])
		setDates([])
	}

	return (
		<div>
			<ul>
				{timeData.map(item => {
					return (
						<li
							key={item.value}
							onClick={() => selectTimeHandle(item.value)}
							className={item.value == active ? "active" : ""}
						>
							{item.label}
						</li>
					)
				})}
			</ul>
			<RangePicker
				value={hackValue || value}
				disabledDate={disabledDate}
				onChange={calendarHandle}
				onOpenChange={onOpenChange}
				format="YYYY-MM-DD"
			/>
		</div>
	)
}

export default timeDate
