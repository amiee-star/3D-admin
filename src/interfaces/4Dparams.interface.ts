import { ReactText } from "react"
import { upFileItem, areaListItem } from "./api.interface"

export interface PageParams {
	pageNum?: number
	pageSize?: number
	keywords?: string
}

export interface fineuploadParams {
	partIndex: number
	partSize: number
	totalParts: number
	totalFileSize: number
	filename: number
	uuid: number
	file: string
}
export interface sceneListParams {
	sceneId?: string
	sceneName?: string
	srcType?: string
}

export interface brokenLineParams {
	obj: string
	queryType: number
	startTimeStr: string
	endTimeStr: string
	topicId?: string
	tempType?: string
	timeType?: string
	timeStr?: string
	companyId?: string
}

export interface orderListParams {
	sceneId?: string
	sceneName?: string
	srcType?: string
}
export interface commentListParams {
	sceneId?: string
	sceneName?: string
	srcType?: string
}
/////!!!!!!!!!!!!!!!!!!!!!!!!!!
export interface addTemplatesParams {
	// sceneName: string
	// mark?: string
	// panoramaInfo: upFileItem
	// objInfo: upFileItem

	name: string
	userId: string
	thumbnail: string
	validSz: number
	resourceUrl: string
}

// export interface hallListParams {
// 	sceneId?: string
// 	sceneName?: string
// 	srcType?: string
// }

export interface hallListParams {
	id?: string
	name?: string
	validSz?: number
	userId?: string
}
export interface cloneHallParams {
	tempId: string
	newTempName: string
	userId: string
	check: number
}
// export interface hallListItem {

// }
//!!!!

export interface tempListParams {
	userId?: string
	keyword: string
	companyId?: string
	topicId?: string
}

export interface editSceneParams {
	id?: string
	name?: string
	validSz?: number
	userId?: string
}

export interface serviceConfigParams {
	tempId: string
	// myCustService: boolean | number
	// custServiceCode: string
	myBrowseService: boolean | number
	hideLogo: boolean
	statSwitch: boolean
	varLook: boolean | number
	imageMore: boolean | number
}

export interface createUserParams {
	username?: string
	telephone?: string
	realName?: string
	releases?: number
	active?: boolean
	remember?: boolean
	id?: string | number
	roleName?: string
	roleCode?: string
	description?: string
	permissionName?: string
	enabled?: boolean
	menuName?: string
	menuCode?: string
	url?: string
	menuPath?: string
	sort?: number
	level?: number
	type?: number
	parentId?: number | string
	roleId?: number[]
	password?: string
	rePassword?: string
}

export interface rolesListParams {
	remember?: string[]
}

export interface websitUserParams {
	origin?: number
	keyword?: string
}

export interface changeMenusParams extends addMenusParams {
	id?: number
}
export interface addMenusParams {
	parentId?: number
	menuName: string
	url?: string
	menuPath?: string
	sort?: number
	level: number
	leaf?: boolean
	type: number
	description?: string
	icon: string
}

export interface comboParams {
	keyword: string
}

export interface currencyParams {
	keywords: string
	pageNum: number
	pageSize: number
}

export interface rolesParams {
	userId?: string
	roleIds?: string[]
}

export interface permissionsParams {
	roleId: number
	permissionIdList: number[] | string[]
}

export interface savePermissionsParams {
	permissionId: number
	type: number
	resourceIds: ReactText[]
}

export interface searchPermissionsParams {
	permissionId: number
	type: number
}

export interface editPassWordParams {
	id: string
	oldPassword: string
	newPassword: string
	rePassword: string
}

export interface stylesListParams {
	id?: string
	name?: string
	sort?: string
}

export interface styleParams {
	id?: string
	categoryName: string
	categoryUrl: string
	categorySort: number
}

export interface typeListParams {
	id?: string
	name?: string
	order?: string
}

export interface typeParams {
	id?: string
	name: string
	order: number
}

export interface systemPageListParams {
	musicTypeId: string
	currentUserId: string
	tempId: string
	type: number
}

export interface addMusicParams {
	id?: string
	url?: string
	fileSize?: number
	name: string
	musicTypeId: string
}

export interface addIconParams {
	url: string
	name: string
	discripe: string
	fileSize: number
}

export interface addNarratorImgParams {
	fileName: string
	fileUrl: string
}

export interface formsParams {
	type?: string
	status?: string
	keyword?: string
}

export interface handleFormParams {
	id: number
	version?: number
	status: number
	remark: string
}
export interface bindcaseParams {
	tempId: string
}
export interface bannerListParams {
	type?: string
}

export interface bannerParams {
	title: string
	imgUrl: string
	content?: string
	contentUrl: string
	type: number
	sort: number
	id: number
	industryId?: number
	remark?: string
}

export interface orderListParams {
	belonger: string
	transactionType: number
	keyword: string
}

export interface rechargeListParams {
	keyword: string
}

export interface caseParams {
	id?: string
	styleId?: string
	typeId?: string
	tempId?: string
	tempName?: string
	caseStatus?: string
	tempRecomList?: string
	styleIdList?: string
}

export interface caseListParams {
	keyword?: string
}

export interface hallListParams {
	status: number
	keyword?: string
}

export interface developersParams {
	pageNum: number
	pageSize: number
	username?: string
	name?: string
	tag?: string
	type?: number
	active?: boolean
}
export interface updateDevParams {
	id: string
	tag?: string
	publishCount?: number
	active?: boolean
}
export interface updateSourceParams {
	devId: string
	devPackageId: string
	expire: number
	publishScenesExtra?: number
	onlineServices?: number
	visitorInfos?: number
	lives?: number
	sceneSyncs?: number
	version: number
	vrLooks?: number
}
export interface helpVideoParams {
	id?: string
	videoName: string
	coverUrl: string
	videoUrl: string
	videoSort: string
}
export interface getHelpVideoInfoParams {
	id: string
}

export interface fileClassificationParams {
	pageNum: number
	pageSize: number
	categoryName: string
}
export interface delFileClassificationParams {
	id: string
}
export interface fileDetailListParams {
	pageNum: number
	pageSize: number
	titleName: string
}
export interface addFileDetailParams {
	id: string
	categoryId: number
	titleName: string
	titleContent: string
	docSort: number
}
export interface delFileDetailParams {
	id: string
}
export interface problemParams {
	pageNum: number
	pageSize: number
	keyword: string
}

export interface addProblemParams {
	id: string
	issueName: string
	answer: string
	issueSort: string
}
export interface polymerizationParams {
	keyword: String
}
export interface addSale {
	active?: boolean
	id?: number
	name: string
	telephone: string
}
export interface couponList {
	salesmanId?: string
	type?: number
	couponName?: string
	status: number
}
export interface addPolymerization {
	title: string
	remark: string
	imgUrl: string
	contentUrl: string
	sort: number
}
export interface addDiscount {
	salesmanId: string
	name: string
	discountAmount: number
	highestDeductionAmount: number
	type: number
	validStartTime: string
	validEndTime: string
	amount: number
	desc: string
	id?: string
}

export interface logListParams {
	keyword: string
	creator: string
	startTime: string
	endTime: string
	businessType: string
}

export interface upgradeAddInfoParams {
	info: upgradeInfoParams
	detailsList: upgradeDetailsListParams[]
}

export interface upgradeInfoParams {
	title: string
	status: number
}

export interface upgradeDetailsListParams {
	name: string
	describe: string
	linkUrl: string
	fileUrl: string
}
export interface businessListParams {
	name: string
}

export interface addBusiness {
	id?: string
	name: string
	username: string
	password: string
	domainName: string
	contact: string
	phone: string
	emailBox: string
	companyPhone: string
	companyAddress: string
	address: string
	companyStatus: string
}

export interface createResourceParams {
	companyId: string
	resourceId?: string
	vrCount: number
	expireDate: number
	areaBindList: areaListItem[]
}
export interface addTheme {
	id?: string
	companyId: string
	name: string
	simpleName: string
	domainName: string
	logo: string
}
export interface topicTempListParams {
	keyword?: string
	styleId?: string
	typeId?: string
}
export interface tempAdd {
	topicId: string
	topicTempList: object[]
}
export interface tempEdit {
	tempId: string
	name: string
	createType: number
	publicAttr: boolean
	userList: []
}

export interface topicUserParams {
	keyword?: string
	areaId?: string
	startTime?: string
	endTime?: string
	topicId: string
}
export interface topicUserAdd {
	id?: string
	companyId?: string
	topicId?: string
	username?: string
	telephone?: string
	releases?: number
	areaList: object[]
}

export interface businessHallParams {
	userId: string
	companyId: string
	topicId: string
	tempId: string
	tempName: string
}

export interface visitorsListParams {
	tempIdOrName: string
	telephoneOrName: string
	startTime: string
	endTime: string
}

export interface exportParams {
	params: number[]
	keyword: string
	startTime: string
	endTime: string
}

export interface exportVisitorsParams {
	tempIdOrName: string
	telephoneOrName: string
	startTime: string
	endTime: string
}
