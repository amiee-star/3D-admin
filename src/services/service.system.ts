import {
	baseRes,
	menusInfoData,
	PageData,
	userData,
	userListItem,
	rolesListItem,
	comboItem,
	rolesPermissionsItem,
	menuTreeItem,
	mealInfo,
	mealList,
	tempParams,
	devInfo,
	devAddtemp,
	tempInfo,
	resoureInfo,
	logListItem,
	platformsItem
} from "@/interfaces/api.interface"
import {
	PageParams,
	addMenusParams,
	changeMenusParams,
	comboParams,
	createUserParams,
	rolesParams,
	websitUserParams,
	permissionsParams,
	savePermissionsParams,
	searchPermissionsParams,
	editPassWordParams,
	developersParams,
	updateDevParams,
	updateSourceParams,
	logListParams,
	exportParams
} from "@/interfaces/params.interface"
import { get, post, postJson, patch, put, del, postBlob, fromData } from "@/utils/http.request"
import urlFunc from "@/utils/url.func"

export default {
	//前台 创建用户信息
	createUser(params: createUserParams) {
		return postJson<baseRes<PageData>>({
			url: `${urlFunc.requestHost()}/v1/m/web/user`,
			params
		})
	},
	//前台 分页查询用户信息
	websitUser(params: websitUserParams & PageParams) {
		return postJson<baseRes<PageData<userListItem[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/page`,
			params
		})
	},
	//前台 查询用户详情
	websitUserInfo(id: string) {
		return get<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/${id}`
		})
	},
	//修改前端用户信息
	changWebInfo(params: createUserParams) {
		return patch<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/`,
			params
		})
	},
	//前台 获取用户来源下拉框数据接口
	userForm() {
		return get<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/origin`
		})
	},
	//后台用户列表
	sysUser(params: websitUserParams & PageParams) {
		return get<baseRes<PageData<userListItem[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user`,
			params
		})
	},
	//新增后台用户
	addSysUser(params: createUserParams) {
		return postJson<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/newest`,
			params
		})
	},
	// 查询用户详情
	sysUserInfo(id: string) {
		return get<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/${id}`
		})
	},
	//修改用户信息
	changUseInfo(params: createUserParams) {
		return patch<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user`,
			params
		})
	},
	//新增角色管理
	role(params: createUserParams) {
		return postJson<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role`,
			params
		})
	},
	//角色管理列表
	rolrList(params: websitUserParams & PageParams) {
		return get<baseRes<PageData<userListItem[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role`,
			params
		})
	},
	//查询角色详情
	roleInfo(id: string) {
		return get<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role/${id}`
		})
	},
	//修改角色
	changeRole(params: createUserParams) {
		return put<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role`,
			params
		})
	},
	//删除角色
	delRole(id: string) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role/${id}`
		})
	},
	//新增权限
	permission(params: createUserParams) {
		return postJson<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission`,
			params
		})
	},
	//权限列表、
	permissionList(params: websitUserParams & PageParams) {
		return get<baseRes<PageData<userListItem[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission`,
			params
		})
	},
	//权限列表、
	permissionListAll(params: { keyword: string }) {
		return get<baseRes<rolesPermissionsItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission/all`,
			params
		})
	},

	//查询权限详情
	permissionInfo(id: string) {
		return get<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission/${id}`
		})
	},
	//修改权限
	changePermission(params: createUserParams) {
		return put<baseRes<userData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission`,
			params
		})
	},
	//启用禁用权限
	stopPermission(id: string) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission/enabled`
		})
	},
	//获取菜单列表
	menuList(params: websitUserParams & PageParams) {
		return get<baseRes<PageData<menusInfoData[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/menu/tree`,
			params
		})
	},
	//新建菜单管理
	addMenu(params: addMenusParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/menu`,
			params
		})
	},
	//查询菜单详情
	menusInfo(id: number) {
		return get<baseRes<menusInfoData>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/menu/${id}`
		})
	},
	//编辑菜单
	changeMenus(params: changeMenusParams) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/menu`,
			params
		})
	},
	//删除菜单
	delMenus(id: number) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/menu/${id}`
		})
	},
	//分配角色列表
	combo(params: comboParams) {
		return get<baseRes<comboItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role/combo`,
			params
		})
	},
	//用户分配角色
	roles(params: rolesParams) {
		return postJson<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/roles`,
			params
		})
	},
	//查询指定用户已拥有的角色信息
	rolesList(id: string) {
		return get<baseRes<rolesListItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/${id}/roles`
		})
	},
	//查询角色已拥有的权限信息
	rolesPermissions(id: number) {
		return get<baseRes<number[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role/${id}/permissions`
		})
	},
	//给角色绑定权限信息
	saveRolesPermissions(params: permissionsParams) {
		return postJson<baseRes<rolesPermissionsItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/role/permissions`,
			params
		})
	},
	//菜单管理树形结构数据
	menuTree(params: websitUserParams & PageParams) {
		return get<baseRes<menuTreeItem[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/menu/tree`,
			params
		})
	},
	//保存权限对应的菜单
	savePermissionsMenu(params: savePermissionsParams) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission/menus`,
			params
		})
	},
	//查询权限菜单
	searchPermissionsMenu(params: searchPermissionsParams) {
		return get<baseRes<number[]>>({
			url: `${urlFunc.requestHost()}/v1/m/sys/permission/menus`,
			params
		})
	},
	//修改密码
	saveEditPassWord(params: editPassWordParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/password`,
			params
		})
	},
	//重置密码
	resetPassWord(id: string) {
		return put<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/${id}/password/anyone`
		})
	},
	//重置密码
	unlockUser(id: string) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/sys/user/${id}/unlock`
		})
	},
	//开发者列表
	developersList(params: developersParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers`,
			params
		})
	},
	//修改开发者信息
	updateDevelopers(params: updateDevParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/`,
			params
		})
	},
	//开发者信息
	developersInfo(id: string) {
		return get<baseRes<devInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${id}`
		})
	},
	//调整资源配置
	developersPackage(params: updateSourceParams) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/package`,
			params
		})
	},
	//查询开发者增购详情
	mealInfo(devId: string) {
		return get<baseRes<mealInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${devId}/extra`
		})
	},
	//查询套餐列表
	packagesList(id: string) {
		return get<baseRes<mealList>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${id}/packages`
		})
	},
	//套餐绑定功能
	bindMeal(params: { packageId: string; devId: string }) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/bind/package`,
			params
		})
	},
	//套餐绑定功能
	devTemList(params: tempParams) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getPageList`,
			params
		})
	},
	//新增开发者展厅
	devAddTemp(params: devAddtemp) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/addInfo`,
			params
		})
	},
	//拉取展厅列表
	devgetTempList(params: { keyword: string; type: number }) {
		return get<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getTempList`,
			params
		})
	},
	//删除开发者展厅
	devTempDelete(params: { devId: string }) {
		return del<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/delete`,
			params
		})
	},
	//开发者展厅配置信息
	devTempInfo(params: { id: string }) {
		return get<baseRes<tempInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/getUpdate`,
			params
		})
	},
	//开发者修改 名称 创建属性
	devTempUpdate(params: { devId: string; tempName: string; createType: number }) {
		return post<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/developers/temp/update`,
			params
		})
	},
	//开发者资源信息
	devResources(id: string) {
		return get<baseRes<resoureInfo>>({
			url: `${urlFunc.requestHost()}/v1/m/developers/${id}/resources`
		})
	},
	//解锁用户
	unlocking(id: string) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/${id}/unlock`
		})
	},
	//重置用户密码
	resetPassword(id: string) {
		return patch<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/${id}/reset/password`
		})
	},
	//前台 分页查询用户信息
	getLogList(params: logListParams & PageParams) {
		return get<baseRes<PageData<logListItem[]>>>({
			url: `${urlFunc.requestHost()}/v1/m/log`,
			params
		})
	},
	// 所属模块列表
	getBusinessTypes() {
		return get<baseRes<platformsItem>>({
			url: `${urlFunc.requestHost()}/v1/m/log/business/types`
		})
	},
	//导出前端用户
	exportUser(params: exportParams) {
		return postBlob<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/export`,
			params
		})
	},
	//上传文件
	importUser(params: { file: any }) {
		return fromData<baseRes>({
			url: `${urlFunc.requestHost()}/v1/m/web/user/import`,
			params
		})
	}
}
