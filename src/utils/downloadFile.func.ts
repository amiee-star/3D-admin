import moment from "moment"

export const DownloadFile = (response: any, name: string, type: string) => {
	const blob = new Blob([response.data], {
		type: type
	})
	const href = window.URL.createObjectURL(blob) // 创建下载的链接
	const time = new Date().toLocaleDateString()
	const aEle = document.createElement("a") // 创建a标签
	aEle.href = href
	aEle.download = time + name // 下载后文件名
	document.body.appendChild(aEle)
	aEle.click() // 点击下载
	document.body.removeChild(aEle) // 下载完成移除元素
	window.URL.revokeObjectURL(href) // 释放掉blob对象
}

export default DownloadFile
