import React from "react"
import { ConfigProvider } from "antd"
import ModalContext from "@/components/modal/modal.context"
import UserProvider from "@/components/provider/user.context"

const ProjectEntry: React.FC = props => {
	return (
		<ConfigProvider>
			<UserProvider>
				<ModalContext>{props.children}</ModalContext>
			</UserProvider>
		</ConfigProvider>
	)
}
export default ProjectEntry
