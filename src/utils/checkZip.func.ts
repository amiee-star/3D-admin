import { Alert, message } from "antd"
import { RcFile } from "antd/lib/upload"
import jsZip from "jszip"
import { reject, unzip } from "lodash"
import { qjtFloor, qjtName, regxWordZh } from "./regexp.func"
import iconvLite from "iconv-lite"
import eventBus from "@/utils/event.bus"

//全景图校验
const checkSky = (fileNames: string[], sourceName: string[]) => {
	eventBus.emit("showAlert", "")
	const numCheck = /^(\-)?\d+(\.\d+)?$/
	const numCheck2 = /^[0-9]+([.]{1}[0-9]+){0,1}$/
	let content = {
		tip1: {
			text: "",
			name: [] as string[]
		},
		tip2: {
			text: "",
			name: [] as string[]
		},
		tip3: {
			text: "",
			name: [] as string[]
		},
		tip4: {
			text: "",
			name: [] as string[]
		},
		tip5: {
			text: "",
			name: [] as string[]
		}
	}
	fileNames.forEach((m, index) => {
		if (!!m && m?.split("/").length <= 2) {
			const fileRealName = m.split("/").slice(-1)?.[0]

			const [name, x, y, other] = fileRealName.split(",")
			if (fileRealName.length) {
				const fileName = fileRealName.split(".").pop()

				if (fileName !== "jpg") {
					if (fileName === "zip" || fileName === "rar") {
						content.tip1.text = "此压缩包中不能再包含压缩包"
					}
					if (regxWordZh.test(fileRealName)) {
						content.tip5.text = "文件名不能为中文"
						content.tip5.name.push(fileRealName)
						const fileRealName2 = sourceName[index].split("/").slice(-1)?.[0]
						if (fileRealName2.length) {
							const fileName2 = fileRealName2.split(".").pop()
							if (fileName2 !== "jpg") {
								content.tip3.text = "不是jpg文件"
								content.tip3.name.push(fileRealName)
							}
						}
					} else {
						content.tip3.text = "不是jpg文件"
						content.tip3.name.push(fileRealName)
					}
				} else {
					if (!qjtFloor.test(name) || !numCheck.test(x) || !numCheck.test(y)) {
						content.tip4.text = '文件名必须为数字且只能包含","".""-"的半角符号，正确为name,x,y,z.jpg'
						content.tip4.name.push(fileRealName)
					}
					if (other) {
						const [z, j, ext] = other?.split(".")
						if (!numCheck.test(z) || (!!ext && !numCheck2.test(j)) || (!!ext && ext !== "jpg")) {
							if (content.tip4.name.indexOf(fileRealName) == -1) {
								content.tip4.text = '文件名必须为数字且只能包含","".""-"的半角符号，正确为name,x,y,z.jpg'
								content.tip4.name.push(fileRealName)
							}
						}
					} else {
						if (content.tip4.name.indexOf(fileRealName) == -1) {
							content.tip4.text = '文件名必须为数字且只能包含","".""-"的半角符号，正确为name,x,y,z.jpg'
							content.tip4.name.push(fileRealName)
						}
					}
				}
			}
		} else {
			content.tip2.text = "此压缩包中最多包含一层文件夹"
		}
	})
	if (content.tip1.text || content.tip2.text || content.tip3.text || content.tip4.text || content.tip5.text) {
		let error = JSON.stringify(content)
		throw `${error}`
	}
}
// 模型校验
const checkObj = (fileNames: string[], sourceName: string[]) => {
	eventBus.emit("showAlert", "")
	const okType = ["jpg", "mtl", "obj"].sort()
	let fileNum = 1
	let objNum: number = 0
	let mtlNum: number = 0
	let jpgNum: number = 0
	let objFileRealName: string
	let mtlFileRealName: string
	let content = {
		tip1: {
			text: "",
			name: [] as string[]
		},
		tip2: {
			text: "",
			name: [] as string[]
		},
		tip3: {
			text: "",
			name: [] as string[]
		},
		tip4: {
			text: "",
			name: [] as string[]
		},
		tip5: {
			text: "",
			name: [] as string[]
		},
		tip6: {
			text: "",
			name: [] as string[]
		}
	}

	const handle = (fileName: string, fileRealName: string) => {
		if (fileName == "obj") {
			objNum++
			if (fileNum == 1) {
				objFileRealName = fileRealName
			}

			if (objNum > 1) {
				content.tip5.text = "此压缩包需包含1个obj文件，1个mtl文件，至少1个以上jpg文件"
			}
		} else if (fileName == "mtl") {
			mtlNum++
			if (fileNum == 1) {
				mtlFileRealName = fileRealName
			}

			if (mtlNum > 1) {
				if (!content.tip5.text) {
					content.tip5.text = "此压缩包需包含1个obj文件，1个mtl文件，至少1个以上jpg文件"
				}
			}
		} else if (fileName == "jpg") {
			jpgNum++
		}
	}

	fileNames.map((m, index) => {
		if (!!m && m.split("/").length <= 2) {
			let fileRealName = m.split("/").slice(-1)?.[0]
			if (fileRealName.length) {
				const fileName = fileRealName.split(".").slice(-1)?.[0]
				let fileNameFirst = ""
				if (fileRealName.split(".").length > 2) {
					content.tip6.text = "文件命名必须为字母、数字、下划线、减号"
					content.tip6.name.push(fileRealName)
				} else {
					fileNameFirst = fileRealName.split(".")[0]
					if (!qjtName.test(fileNameFirst)) {
						content.tip6.text = "文件命名必须为字母、数字、下划线、减号"
						content.tip6.name.push(fileRealName)
					}
				}
				if (fileName == "zip" || fileName == "rar") {
					content.tip1.text = "此压缩包中不能再包含压缩包"
				}
				if (okType.indexOf(fileName) == -1) {
					const fileRealName3 = sourceName[index].split("/").slice(-1)?.[0]
					if (fileRealName3.length) {
						const fileName3 = fileRealName3.split(".").slice(-1)?.[0]
						if (okType.indexOf(fileName3) == -1) {
							content.tip3.text = "此压缩包不允许包含除(obj、mtl、jpg)以外的其他文件"
						}
					}
				}

				if (regxWordZh.test(fileRealName)) {
					// content.tip3.text = "文件名不能为中文"
					// content.tip3.name.push(fileRealName)
					let fileRealName2 = sourceName[index].split("/").slice(-1)?.[0]
					if (fileRealName2.length) {
						const fileName2 = fileRealName2.split(".").slice(-1)?.[0]
						handle(fileName2, fileRealName2)
					}
				}

				handle(fileName, fileRealName)
			}
		} else {
			content.tip2.text = "此压缩包中最多包含一层文件夹"
			fileNum = 2
		}
	})
	if (jpgNum < 1 || objNum < 1 || mtlNum < 1) {
		if (!content.tip4.text) {
			content.tip4.text = "此压缩包需包含1个obj文件，1个mtl文件，至少1个以上jpg文件"
		}
	}
	if (objFileRealName && objFileRealName?.split(".")[0] !== mtlFileRealName?.split(".")[0]) {
		content.tip5.text = "压缩包中obj和mtl文件的命名必须一致"
	}

	if (
		content.tip1.text ||
		content.tip2.text ||
		content.tip3.text ||
		content.tip4.text ||
		content.tip5.text ||
		content.tip6.text
	) {
		let error = JSON.stringify(content)
		throw `${error}`
	}
}

const checkZip = (type?: "Sky" | "Obj" | string) => (file: RcFile): Promise<RcFile> => {
	const fileName = file.name
	const fileNameFirst = fileName?.split(".")[0]
	const fileNameLast = fileName?.split(".")[1]
	if (file && qjtName.test(fileNameFirst)) {
		if (fileNameLast && fileNameLast === "zip") {
			return new Promise(async resolve => {
				const unZip = await new jsZip().loadAsync(file, { optimizedBinaryString: true, base64: true })
				try {
					if (type == "Sky") {
						checkSky(
							Object.keys(unZip.files).map(m => iconvLite.decode(Buffer.alloc(m.length, m), "cp936")),
							Object.keys(unZip.files)
						)
					} else {
						checkObj(
							Object.keys(unZip.files).map(m => iconvLite.decode(Buffer.alloc(m.length, m), "cp936")),
							Object.keys(unZip.files)
						)
					}
					resolve(file)
				} catch (error) {
					eventBus.emit("showAlert", error)
					reject("")
				}
			})
		} else {
			throw `此压缩包必须为zip文件`
		}
	} else {
		throw `压缩包命名必须为字母、数字、下划线、减号`
	}
}

export default checkZip
