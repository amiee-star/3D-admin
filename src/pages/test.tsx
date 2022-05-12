import FormEditor from "@/components/form/form.editor"
import { PageProps } from "@/interfaces/app.interface"
import React from "react"

const BaseLight = (props: PageProps) => {
	return (
		<>
			<div
				style={{
					width: 500,
					height: 400
				}}
			>
				<FormEditor
					onChange={e => {
						console.log(e)
					}}
				/>
			</div>
		</>
	)
}
BaseLight.title = "灯光管理"
export default BaseLight
