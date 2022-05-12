import React from "react"
import classNames from "classnames"
import "@/assets/less/admin-font/iconfont.less"

export enum FontKey {
	LOGO02 = "LOGO02",
	shenhetongguo = "shenhetongguo",
	quxiao = "quxiao",
	shangchuan = "shangchuan",
	paixu = "paixu",
	shibai = "shibai",
	tixing = "tixing",
	chenggong = "chenggong",
	shanchu1 = "shanchu1",
	shanchu = "shanchu",
	fangwenkongzhi = "fangwenkongzhi",
	chajianpeizhi = "chajianpeizhi",
	lixianbaoxiazai = "lixianbaoxiazai",
	fabu = "fabu",
	gengxinmoxing = "gengxinmoxing",
	chuangjian = "chuangjian",
	gengxinquanjingtu = "gengxinquanjingtu",
	fuzhizhanting = "fuzhizhanting",
	xiugai = "xiugai",
  tongjifenxi = "tongjifenxi",
  tongjifenxi1 = "tongjifenxi1",
	xitongguanli = "xitongguanli",
	yingxiaoguanli = "yingxiaoguanli",
	zhantingguanli = "zhantingguanli",
	tongyongguanli = "tongyongguanli",
	pinglunguanli = "pinglunguanli",
	mobanguanli = "mobanguanli",
	guanwangguanli = "guanwangguanli",
	fenleiguanli = "fenleiguanli",
	jiantou04 = "jiantou04",
	jiantou02 = "jiantou02",
	jiantou01 = "jiantou01",
	mima = "mima",
	jiantou03 = "jiantou03",
	yonghuming = "yonghuming",
	touxiang = "touxiang"
}
interface Props {
	icon: FontKey
}
const FontIcon: React.FC<Props> = props => {
	return <i className={classNames("scene-admin-front-icon", `scene-admin-icon-${props.icon}`)} />
}
export default FontIcon
