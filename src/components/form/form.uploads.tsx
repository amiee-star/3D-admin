import React, { useCallback, useState, useMemo, useEffect, useRef } from "react"
import { Upload, Typography, Space, message } from "antd"
import {
	PlusOutlined,
	LoadingOutlined,
	FilePdfTwoTone,
	FileExcelTwoTone,
	FileWordTwoTone,
	PictureTwoTone,
	PaperClipOutlined,
	VideoCameraTwoTone,
	AudioTwoTone,
	FileZipTwoTone
} from "@ant-design/icons"
import { UploadChangeParam } from "antd/lib/upload"
import { UploadFile, UploadListType } from "antd/lib/upload/interface"
import { AsyncModal, ModalCustom } from "../modal/modal.context"
import serviceScene from "@/services/service.scene"
import { baseRes, upFileItem } from "@/interfaces/api.interface"
import FilesMd5 from "@/utils/files.md5"
import { UploadRequestOption, RcFile } from "rc-upload/lib/interface"
import fileType from "@/constant/file.type"
import ImageCropModal from "../modal/async/imagecrop.modal"
import VideoCoverModal from "../modal/async/videocover.modal"
interface Props {
	onChange?: (fileList: upFileItem[]) => void
	onRemove?: (uuid?: string) => void
	value?: upFileItem[]
	accept?:
		| "image/*"
		| "video/*"
		| "audio/*"
		| ".zip,.rar"
		| ".png, .jpg, .jpeg"
		| ".png, .jpg"
		| ".zip"
		| ".png"
		| ".jpg, .jpeg, .gif"
		| ".css"
		| ".jpg, .jpeg"
	size?: number //多文件上传的个数
	extParams?: object
	chunkSize?: number //分片包大小,以M为单位,不传默认为2M
	withChunk?: boolean //是否启用分片上传
	checkType?: keyof typeof fileType //强制检查类型
	customCheck?: (file: RcFile) => boolean | Promise<void | Blob | File> // 文件验证function
	imgAction?: {
		crop?: boolean //是否裁剪
		videoCover?: boolean //是否视频封面截图
	}
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

const FormUploads: React.FC<Props> = props => {
	const { onChange, accept, size = 1, value, withChunk = false, chunkSize = 2, extParams, imgAction, checkType } = props
	const checkUrlType = useCallback((url: string) => {
		return (
			Object.keys(fileType).filter(key => {
				const data: string[] = fileType[key]
				return data.includes(url.substr(url.lastIndexOf(".")))
			})[0] || "image"
		)
	}, [])
	const defaultFileList = useMemo<UploadFile<baseRes<upFileItem>>[]>(() => {
		return !!value
			? value.map(item => ({
					url: item.filePreviewUrl,
					name: item.fileSaveUrl.split("/").splice(-1)[0],
					type: checkUrlType(item.fileSaveUrl),
					size: item.fileSize,
					uid: item.fileSaveUrl.split("/").splice(-1)[0],
					status: "done",
					response: {
						data: item,
						success: true,
						code: 200,
						message: ""
					}
			  }))
			: []
	}, [])
	const [fileList, setFileList] = useState<UploadFile[]>(defaultFileList)
	const customCheck = useCallback(
		async (file: RcFile): Promise<RcFile> => {
			if (!props.customCheck) return file
			const checkResult = props.customCheck(file)
			if (checkResult instanceof Promise) {
				return checkResult as Promise<RcFile>
			} else {
				if (checkResult) {
					return file
				} else {
					throw "未知错误"
				}
			}
		},
		[props.customCheck]
	)
	const customCheckType = useCallback(
		async (file: RcFile) => {
			if (checkType === undefined || !checkType) {
				return file
			} else {
				let error = ""
				const checkTypeList = fileType[checkType]
				if (!checkTypeList.some(type => file.name.toLowerCase().includes(type))) {
					error = "暂不支持该类型"
				}
				if (error) {
					// message.error(error)
					throw error
				} else {
					return file
				}
			}
		},
		[checkType]
	)
	const beforeUpload = useCallback(async (file: RcFile) => {
		try {
			let result = file
			result = await customCheckType(file)
			if (!!imgAction?.videoCover) {
				result = await AsyncModal<RcFile>({
					content: VideoCoverModal,
					params: { file: result, crop: !!imgAction?.crop }
				})
			}
			if (!imgAction?.videoCover && !!imgAction?.crop) {
				result = await AsyncModal<RcFile>({
					content: ImageCropModal,
					params: { file: result }
				})
			}
			result = await customCheck(result)
			return result
		} catch (error) {
			if (error != undefined) {
				message.error(error)
			}
			return Upload.LIST_IGNORE as RcFile
		}
	}, [])

	const onChangeSelf = useCallback((info: UploadChangeParam<UploadFile<baseRes<upFileItem>>>) => {
		info.fileList.forEach(m => {
			m.url = m.response ? m.response.data.filePreviewUrl : ""
		})
		setFileList(info.fileList)
		if (!info.fileList.some(m => m.status !== "done")) {
			!!onChange &&
				onChange(
					info.fileList.map(item => {
						return item.response.data
					})
				)
		}
	}, [])
	useEffect(() => {
		if (!!value && !value.length && !!fileList.length && !fileList.some(m => m.status !== "done")) {
			setFileList([])
		}
	}, [value])
	const uploadBtn = useMemo(() => {
		return (
			<Space direction="vertical">
				<PlusOutlined />
				<Typography.Text>上传</Typography.Text>
			</Space>
		)
	}, [])

	const iconRender = useCallback((file: UploadFile, listType?: UploadListType) => {
		const fileSufIconList = [
			{ type: <FilePdfTwoTone />, suf: [".pdf"] },
			{ type: <FileExcelTwoTone />, suf: [".xlsx", ".xls", ".csv"] },
			{ type: <FileWordTwoTone />, suf: [".doc", ".docx"] },
			{
				type: <PictureTwoTone />,
				suf: [".webp", ".svg", ".png", ".gif", ".jpg", ".jpeg", ".jfif", ".bmp", ".dpg"]
			},
			{
				type: <VideoCameraTwoTone />,
				suf: [".mp4", ".3gp", ".mkv", ".rm", ".wmv", ".avi"]
			},
			{
				type: <AudioTwoTone />,
				suf: [".mp3", ".wav", ".wma", ".ogg"]
			},
			{
				type: <FileZipTwoTone />,
				suf: [".zip", ".rar", ".7z", ".ios"]
			}
		]
		let icon = file.status === "uploading" ? <LoadingOutlined /> : <PaperClipOutlined />
		if (listType === "picture" || listType === "picture-card") {
			if (listType === "picture-card" && file.status === "uploading") {
				icon = <LoadingOutlined />
			} else {
				fileSufIconList.forEach(item => {
					if (item.suf.includes(file.name.substr(file.name.lastIndexOf(".")))) {
						icon = item.type
					}
				})
			}
		}
		return icon
	}, [])
	const isImageUrl = useCallback((file: UploadFile) => {
		// console.log(checkUrlType(file.url || "") === "image")
		return checkUrlType(file.url || "") === "image"
	}, [])
	const onPreview = useCallback((file: UploadFile<baseRes<upFileItem>>) => {
		if (file.status === "done") {
			const url = file.response.data.filePreviewUrl?.match("http")
				? file.response.data.filePreviewUrl
				: "/" + file.response.data.filePreviewUrl
			if (!!file.type.match("image")) {
				return ModalCustom({
					content: () => <img src={url} width={800} />,
					maskClosable: true
				})
			}
			if (!!file.type.match("video")) {
				return ModalCustom({
					content: () => <video controls src={url} width={800} />,
					maskClosable: true
				})
			}
			if (!!file.type.match("audio")) {
				return ModalCustom({
					content: () => <audio src={url} controls />,
					maskClosable: true
				})
			}
			return window.open(url, "_blank")
		}
	}, [])
	const customRequest = useCallback(
		async (options: UploadRequestOption) => {
			const { onSuccess, onError, onProgress, file } = options
			const params = await buildParams(file as RcFile)
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
						uuid.current = md5
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
	const uuid = useRef<string>()
	const onRemove = useCallback(() => {
		props.onRemove && props.onRemove(uuid.current || "")
	}, [props])
	useEffect(() => {
		console.log(defaultFileList)
	}, [defaultFileList])
	return (
		<Upload
			customRequest={customRequest}
			maxCount={size}
			defaultFileList={defaultFileList}
			multiple={size > 1 && !imgAction?.crop && !imgAction?.videoCover}
			accept={!imgAction?.videoCover ? accept : "video/*"}
			listType="picture-card"
			onPreview={onPreview}
			isImageUrl={isImageUrl}
			beforeUpload={beforeUpload}
			onRemove={onRemove}
			onChange={onChangeSelf}
			iconRender={iconRender}
		>
			{fileList.length >= size ? null : uploadBtn}
		</Upload>
	)
}

export default FormUploads
