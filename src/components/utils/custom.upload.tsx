import { baseRes, upFileItem } from "@/interfaces/api.interface"
import React, { useCallback, useState } from "react"
import { UploadRequestOption, RcFile } from "rc-upload/lib/interface"
import FilesMd5 from "@/utils/files.md5"
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface"
import serviceScene from "@/services/service.scene"
import { Button, message, Upload } from "antd"
import { ButtonProps } from "antd/lib/button"
import fileType from "@/constant/file.type"
interface Props {
	onChange?: (fileList?: upFileItem[]) => void
	accept?: "image/*" | "video/*" | "audio/*" | ".zip,.rar" | ".png, .jpg, .jpeg" | ".gif"
	size?: number //多文件上传的个数
	extParams?: object //上传接口需要的其他参数
	chunkSize?: number //分片包大小,以M为单位,不传默认为2M
	withChunk?: boolean //是否启用分片上传
	checkType?: keyof typeof fileType //强制检查类型
	customCheck?: (file: RcFile) => Promise<RcFile> // 文件验证function
	uploadCallTask?: (res?: baseRes<upFileItem>, item?: ParamsItem) => Promise<any> //每个文件上传完成后的操作
	btnText?: React.ReactNode
	btnProps?: Omit<ButtonProps, "disabled">
}
interface ParamsItem {
	partIndex: number
	partSize: number
	totalParts: number
	totalFileSize: number
	filename: string
	uuid: string
	file: Blob
	withChunk: boolean
	[key: string]: any
}

const CustomUpload: React.FC<Props> = props => {
	const {
		onChange,
		accept,
		size = 1,
		withChunk = false,
		chunkSize = 2,
		extParams,
		uploadCallTask,
		btnText = "上传",
		btnProps = {},
		checkType,
		customCheck
	} = props
	const [loading, setLoading] = useState(false)
	const beforeUpload = useCallback(async (file: RcFile, FileList: RcFile[]) => {
		try {
			let result = file
			result = await customCheckType(file)
			result = await customCheck(result)
			return result
		} catch (error) {
		  return Upload.LIST_IGNORE
			throw error
		}
	}, [])
	const onChangeSelf = useCallback((info: UploadChangeParam<UploadFile<baseRes<upFileItem>>>) => {
		setLoading(true)
		if (!info.fileList.some(m => m.status !== "done")) {
			setLoading(false)
			!!onChange &&
				onChange(
					info.fileList.map(item => {
						return item.response.data
					})
				)
		}
	}, [])
	const customCheckType = useCallback(
		async (file: RcFile) => {
			if (checkType === undefined || !checkType) {
				return file
			} else {
				let error = ""
				const checkTypeList = fileType[checkType]
				if (!checkTypeList.some(type => file.name.includes(type))) {
					error = "暂不支持该类型"
				}
				if (error) {
					message.error(error)
					throw error
				} else {
					return file
				}
			}
		},
		[checkType]
	)
	const customRequest = useCallback(
		async (options: UploadRequestOption) => {
			const { onSuccess, onError, onProgress, file } = options
			const params = await buildParams(file)
			let res: baseRes<upFileItem>
			let success = 0

			try {
				for (const item of params) {
					const FormPost = new FormData()
					Object.keys(item).forEach(key => {
						typeof item[key] === "object" && "uid" in item[key]
							? FormPost.append(key, item[key], item[key]["name"])
							: FormPost.append(key, item[key])
					})

					res = !withChunk ? await serviceScene.fileupload(FormPost) : await serviceScene.fineupload(FormPost)
					if (!!uploadCallTask) {
						await uploadCallTask(res, item)
					}
					onProgress(Object.create({ percent: Math.floor((++success / params.length) * 100) }))
				}
				onSuccess(res, null)
			} catch (error) {
				onError(error)
			}
		},
		[withChunk]
	)
	const buildParams = useCallback(
		(file: RcFile, maxChunkSize: number = chunkSize * Math.pow(1024, 2)): Promise<ParamsItem[]> => {
			return new Promise(async (resolve, reject) => {
				const { name: filename, size: totalFileSize } = file
				const partSize = withChunk ? maxChunkSize : totalFileSize
				const totalParts = withChunk ? Math.ceil(totalFileSize / partSize) : 1
				FilesMd5.md5(file, (error, md5) => {
					if (!!error) {
						reject(error)
					} else {
						resolve(
							new Array(totalParts).fill("0").map((v, partIndex) => ({
								file: withChunk ? file.slice(partIndex * partSize, (partIndex + 1) * partSize) : file,
								uuid: md5,
								partIndex,
								withChunk,
								partSize,
								totalParts,
								totalFileSize,
								filename,
								...extParams
							}))
						)
					}
				})
			})
		},
		[withChunk, chunkSize, extParams]
	)

	return (
		<Upload
			customRequest={customRequest}
			maxCount={size}
			multiple={size > 1}
			accept={accept}
			beforeUpload={beforeUpload}
			onChange={onChangeSelf}
			showUploadList={false}
		>
			<Button {...btnProps} disabled={loading}>
				{btnText}
			</Button>
		</Upload>
	)
}

export default CustomUpload
