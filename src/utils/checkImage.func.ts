import fileType from "@/constant/file.type"
import { message } from "antd"
import { RcFile } from "antd/lib/upload"

export const checkImage = (maxSize?: number) => (file: RcFile): Promise<RcFile> => {
	return new Promise(async (resolve, reject) => {
		if (maxSize === undefined) {
			resolve(file)
		}
		if (maxSize) {
			let error = ""
			if (maxSize !== undefined && file.size > maxSize * Math.pow(1024, 2)) {
				error = `图片大小超过${maxSize}M`
			}
			// !!error && message.error(error)
			error ? reject(error) : resolve(file)
		}
	})
}

export default checkImage
