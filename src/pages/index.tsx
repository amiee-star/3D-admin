import { userContext } from "@/components/provider/user.context"
import { PageProps } from "@/interfaces/app.interface"
import React, { useContext, useEffect } from "react"

const IndexPage = (props: PageProps) => {
	const { history } = props
	const { state } = useContext(userContext)
	useEffect(() => {
		history.replace(state.user ? "/home/dashboard.html" : "/auth/login.html")
	}, [])
	return <></>
}
export default IndexPage
