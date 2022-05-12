import { userContext } from "@/components/provider/user.context"
import { PageProps } from "@/interfaces/app.interface"
import React, { useContext, useEffect } from "react"
import "./_layout.less"
const AuthLayout = (props: PageProps) => {
	const { location, history } = props
	const { redirect } = location.query
	const { state } = useContext(userContext)
	useEffect(() => {
		state.user &&
			history.replace(
				redirect
					? redirect === "/"
						? "/home/dashboard.html"
						: decodeURIComponent(redirect.toString())
					: "/home/dashboard.html"
			)
	}, [state])
	return (
		<div id="AuthLayout" className="full">
			{props.children}
		</div>
	)
}
export default AuthLayout
