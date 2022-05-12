import { userContext } from "@/components/provider/user.context"
import serviceScene from "@/services/service.scene"
import { LockOutlined, UserOutlined } from "@ant-design/icons"
import { Button, Card, Form, Input } from "antd"
import React, { useCallback, useContext, useState } from "react"
import CryptoJS from "crypto-js"
import "./login.less"

const AuthLogin = () => {
	const { dispatch } = useContext(userContext)
	const onFinish = useCallback(data => {
		const { username, password } = data
		serviceScene.login({ username, password: CryptoJS.MD5(password).toString() }).then(res => {
			if (res.code === 200) {
				dispatch({
					type: "set",
					payload: {
						user: res.data
					}
				})
			}
		})
	}, [])

	return (
		<div id="AuthLogin" className="full">
			<Card>
				<div className="login-content column">
					{/*<div className="title">*/}
					{/*	<img src={require("../../assets/images/logo.png")} alt="logo" />*/}
					{/*</div>*/}
					<div className="desc">欢迎使用数字展厅管理系统</div>
					<div className="form">
						<Form layout="horizontal" labelCol={{ span: 4 }} onFinish={onFinish} autoComplete="off">
							<Form.Item name="username" rules={[{ required: true, message: "请输入帐号!" }]}>
								<Input prefix={<UserOutlined />} placeholder="请输入帐号" />
							</Form.Item>
							<Form.Item name="password" rules={[{ required: true, message: "请输入密码!" }]}>
								<Input.Password prefix={<LockOutlined />} type="password" placeholder="请输入密码" />
							</Form.Item>
							<Form.Item>
								<Button type="primary" htmlType="submit" block className="login-btn">
									登录
								</Button>
							</Form.Item>
						</Form>
					</div>
				</div>
			</Card>
		</div>
	)
}

export default AuthLogin
