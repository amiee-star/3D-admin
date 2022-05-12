import React, { useCallback, useState } from "react"
import serviceHall from "@/services/service.hall"
import service4Dtemplate from "@/services/service.4Dtemplate"
export default {
	checkTemplate: (rule: any, value: string, callback2: (arg0?: string) => void) => {
		if (value?.length) {
			service4Dtemplate
				.validArea({
					id: value
				})
				.then(res => {
					if (res.data) {
						callback2()
					} else {
						callback2("该模板无有效面积，无法创建展厅")
					}
				})
				.finally(() => {})
		} else {
			callback2("请先选择模板")
		}
	},

	checkScene: (rule: any, value: string, callback2: (arg0?: string) => void) => {
		if (value?.length) {
			serviceHall
				.validArea2({
					id: value
				})
				.then(res => {
					if (res.data) {
						callback2()
					} else {
						callback2("当前展厅无有效面积，请在对应原始模板中填写后再进行配置")
					}
				})
				.finally(() => {})
		} else {
			callback2("请先选择模板")
		}
	}
}
