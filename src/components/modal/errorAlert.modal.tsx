import { Alert } from "antd"
import React, { ReactNode } from "react"
import "./errorAlert.modal.less"
interface Props {
	error: {
		tip1: {
			text: ""
			name: string[]
		}
		tip2: {
			text: ""
			name: string[]
		}
		tip3: {
			text: ""
			name: string[]
		}
		tip4: {
			text: ""
			name: string[]
		}
		tip5: {
			text: ""
			name: string[]
		}
		tip6: {
			text: ""
			name: string[]
		}
	}
}
const ErrorAlertModal: React.FC<Props & { children?: ReactNode }> = props => {
	const error = props?.error
	return (
		<>
			{error && (
				<Alert
					className="checkZipAlert"
					message="上传失败"
					type="error"
					closable
					banner
					description={
						<div>
							<div className="br" hidden={error.tip1.text == ""}>
								{error.tip1.name.map((item: string) => {
									return <p key={item + error.tip1.text}>{item}</p>
								})}
								<p>{error.tip1.text}</p>
							</div>
							<div className="br" hidden={error.tip2.text == ""}>
								{error.tip2.name.map((item: string) => {
									return <p key={item + error.tip2.text}>{item}</p>
								})}
								<p>{error.tip2.text}</p>
							</div>
							<div className="br" hidden={error.tip3.text == ""}>
								{error.tip3.name.map((item: string) => {
									return <p key={item + error.tip3.text}>{item}</p>
								})}
								<p>{error.tip3.text}</p>
							</div>
							<div className="br" hidden={error.tip4.text == ""}>
								{error.tip4.name.map((item: string) => {
									return <p key={item + error.tip4.text}>{item}</p>
								})}
								<p>{error.tip4.text}</p>
							</div>
							<div className="br" hidden={error?.tip5?.text == ""}>
								{error?.tip5?.name.map((item: string) => {
									return <p key={item + error?.tip5?.text}>{item}</p>
								})}
								<p>{error?.tip5?.text}</p>
							</div>
							<div className="br" hidden={error?.tip6?.text == ""}>
								{error?.tip6?.name.map((item: string) => {
									return <p key={item + error?.tip6?.text}>{item}</p>
								})}
								<p>{error?.tip6?.text}</p>
							</div>
						</div>
					}
				/>
			)}
		</>
	)
}

export default ErrorAlertModal
