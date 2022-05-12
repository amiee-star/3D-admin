import fileType from "@/constant/file.type"
import { message } from "antd"
import { RcFile } from "antd/lib/upload"
import { reject } from "lodash"

export const checkAudio = (maxSize?: number) => (file: RcFile): Promise<RcFile> => {
	return new Promise(async resolve => {
		if (maxSize === undefined) {
			resolve(file)
		}
		if (maxSize) {
			let error = ""
			if (maxSize !== undefined && file.size > maxSize * Math.pow(1024, 2)) {
				error = `音频大小超过${maxSize}M`
			}
			!!error && message.error(error)
			error ? reject(error) : resolve(file)
		}
	})
}

export default checkAudio
