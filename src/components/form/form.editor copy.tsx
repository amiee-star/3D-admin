import Editor from "@/lib/wangEditor"
import serviceScene from "@/services/service.scene"
import urlFunc from "@/utils/url.func"
import React, { useEffect, useRef } from "react"
import FilesMd5 from "@/utils/files.md5"
import firstIndentEditor, { menuKey } from "../editor/firstIndent.editor"
interface Props {
	value?: string
	defaultContent?: string
	onChange?: (content?: string) => void
	editConf?: Omit<typeof Editor.prototype.config, "onchange">
}
const FormEditor: React.FC<Props> = props => {
	const { onChange, editConf = {}, defaultContent, value } = props

	const editorBox = useRef<HTMLDivElement>()
	const editor = useRef<Editor>()
	useEffect(() => {
		if (!editor.current && !!editorBox.current) {
			editor.current = new Editor(editorBox.current)
			editor.current.config = { ...editor.current.config, ...editConf }
			editor.current.config.onchange = (newContent: string) => {
				!!onChange && onChange(newContent)
			}

			// editor.current.config.customUploadImg = (files: File[], insert: (url: string) => void) => {
			// 	// files 是 input 中选中的文件列表
			// 	// insert 是获取图片 url 后，插入到编辑器的方法
			// 	// 上传代码返回结果之后，将图片插入到编辑器中
			// 	for (let index = 0; index < files.length; index++) {
			// 		const file = files[index]
			// 		let form = new FormData()
			//     form.append("file", file)
			//     //调用上传接口
			// 		uploadFile(form).then(res => {
			// 			insert(url + res.url)
			// 		})
			// 	}
			// }

			editor.current.config.customUploadImg = (files: File[], insert: (url: string) => void) => {
				// files 是 input 中选中的文件列表
				// insert 是获取图片 url 后，插入到编辑器的方法
				// 上传代码返回结果之后，将图片插入到编辑器中
				for (let index = 0; index < files.length; index++) {
					const file = files[index]
					let form = new FormData()

					// uuid: md5,
					// partIndex,
					// withChunk,
					// partSize,
					// totalParts,
					// totalFileSize,
					// filename,
					// ...extParams
					FilesMd5.md5(file, (error, md5) => {
						form.append("uuid", md5)
						form.append("file", file, file.name)
						form.append("filename", file.name)
						form.append("businessType", "5")
						serviceScene.fileupload(form).then(res => {
							insert(res.data.filePreviewUrl)
						})
					})
					// form.append("file", file)
					// form.append("file", file)
					//调用上传接口
					// serviceScene.fileupload(form).then(res => {
					// 	insert(`${urlFunc.replaceUrl(res.data.filePreviewUrl, "imageUrl")}`)
					// })
				}
			}
			editor.current.menus.extend(menuKey, firstIndentEditor)
			editor.current.config.menus.push(menuKey)
			editor.current.create()
		} else {
			if (!!defaultContent) {
				editor.current.txt.html(defaultContent)
			}
		}
		// return () => {
		// 	editor.current && editor.current.destroy()
		// }
	}, [defaultContent])
	useEffect(() => {
		value && editor.current && editor.current.txt.html(value)
	}, [value])
	return <div ref={editorBox} className="full" style={{ position: "relative" }} />
}

export default FormEditor
