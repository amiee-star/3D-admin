// 接口返回需要的基础字段

export interface baseRes<D = {}> {
	success: boolean
	code: number
	message: string
	data: D //返回的数据字段
}

export interface PageData<D = {}> {
	tempGroup: any
	bindList: any
	filePreviewUrl: string
	fileSaveUrl: string
	currentPage: number
	pageNum: number
	pageSize: number
	totalPage: number
	count: number
	list: D[]
	fileHost: string
	helpVideo: {
		videoUrl: string
		coverUrl: string
	}
}

//!!!!!!!!!!!!!
export interface templateListItem {
	id: string
	name: string
	status: number
	userId: string
	thumbnail: string
	validSz: number
	hasTemplate: boolean
	finishTs: string
	owner: string
	ownerTelephone: string
	createTs: string
	createdBy: string
	updateTs: string
	updatedBy: string
}

export interface templateItem {
	id: string
	name: string
	userId: string
	thumbnail: string
	validSz: number
	resourceUrl: string
}

export interface hallListItem {
	validSz: number | string
	id: string
	sceneId: string
	name: string
	thumbnail: string
	publicStatus: boolean
	aliStatic: number
	aliStaticDic: string
	userId: string
	owner: string
	ownerTelephone: string
	check: number
	expireDate: string
	createTs: string
	createdBy: string
	updateTs: string
	updatedBy: string
	typeList: typeItem[]
}

export interface typeItem {
	typeId: string
	typeName: string
	tempId: string
}
export interface styleItem {
	styleId: string
	tempId: string
	styleName: string
}
export interface hallItem {
	check: number
	id: string
	name: string
	sceneId: string
	styleIdList: any[]
	thumbnail: string
	typeIdList: any[]
	userId: string
}
export interface addHallParams {
	name: string
	sceneId: string
	userId: string
	check: number
	thumbnail: string
	typeIdList: string[]
	styleIdList: string[]
}

export interface callDataItem {
	todayCount: number
	allCount: number
}

export interface seriesListItem {
	seriesData: number[]
	seriesDataBig?: number[]
	seriesName: string
}

export interface brokenLineItem {
	xaxisData: string[]
	seriesList: seriesListItem[]
}

export interface countProvinceItem {
	countId: number
	province: string
	ratio: number
	align?: string
}

export interface countCountryItem {
	countId: number
	country: string
	ratio: number
}

export interface countDeviceItem {
	countId: number
	deviceOS: string
	ratio: number
}

export interface tempListItem {
	id: string
	name: string
	tempName: string
	sz: string
	validSz: string
}

export interface userData {
	enabled: any
	description: string
	permissionName: string
	id: string
	username: string
	realName: string
	nickname: string
	avatar: string
	telephone: string
	email: string
	sex: number
	birthday: number
	signature: string
	accessToken: string
	userOrigin: number
	auth: boolean
	lastLoginIp: string
	lastLoginDate: number
	createTs: number
	type: string
	isShowAllMenus: boolean
	roleList?: number[]
}
export interface sceneListItem {
	sceneId: string
	sceneName: string
	thumbnail?: string
	srcId?: string
	srcType?: string
	sz?: string
	validSz?: string
	createTs: number
	createdBy: string
	createdName: string
	userId: string
	userName: string
	userPhone: string
	sceneStatus?: string
}

export interface getSortListItem {
	id: string
	createTs: string
	createdBy: string
	updateTs: string
	updatedBy: string
	categoryName: string
	categoryUrl: string
	categorySort: number
	deleted: string
}

export interface platformsItem {
	key: number | string
	value: string
}

export interface zuheSceneListItem {
	durationEndTs?: string
	id: string
	isCheck?: string
	isPublic?: string
	name?: string
	publish?: string
	sz?: string
	tempExpire: number
	thumb: string
	validSz: string
	// fileSaveUrl?: string
	filePreviewUrl: string
	fileSaveUrl: string
}

export interface liveInfoItem {
	endTime: number
	liveEndTime: number
	liveOpenType: number
	liveStartTime: number
	liveState: boolean
	liveUrl: string
	senceTemplateId: string
	startTime: number
}

export interface seviceConfigItem {
	custServiceCode: string
	hideLogo: boolean
	liveInfo: liveInfoItem[]
	liveService: number
	myBrowseService: number
	myCustService: number
	tempId: string
	varLook: number
	imageMore: boolean
	statSwitch: boolean
}

export interface productItem {
	id: number
	name: string
	price: string
}

export interface orderListItem {
	belonger?: string
	createTs: number
	fee: number
	id?: number
	outTradeNo: string
	product?: string
	sceneTemplateId: string
	sceneTemplateName: string
	serverType?: string
	status: string
	transactionType: string
	validSz?: number
}

export interface commentListItem {
	sceneId: string
	sceneName: string
	thumbnail?: string
	srcId?: string
	srcType?: string
	sz?: string
	validSz?: string
	createTs: number
	createdBy: string
	createdName: string
	userId: string
	userName: string
	userPhone: string
	sceneStatus?: string
}

export interface upFileItem {
	filePreviewUrl: string
	fileSaveUrl: string
	fileSize: number
}

export interface styleListItem {
	styleId: string
	name: string
	sort: number
}

export interface userListItem {
	birthday: string
	email: string
	id: string
	idCard: string
	nickname: string
	realName: string
	roleList: null
	sex: number
	state: number
	telephone: string
	userOrigin: null
	username: string
	name?: string
}
export interface styleList {
	styleId?: string
}
export interface typeList {
	typeId?: string
}
export interface hallInfo {
	belonger?: string
	check: number
	checkNote: null | string
	endTime?: number
	durationEndTs?: number
	extData?: string
	lockY: null | boolean
	lockYAngle: string
	lockZoom: number
	styleId?: string
	typeIdList: string
	styleIdList: string
	tempId: string
	tempName: string
	typeId?: string
	userId?: string
	userName?: string
	varSetting?: number
	addViewCount?: number
	addLikeCount?: number
	modelCount?: number
	gifCount?: number
	styleList?: styleList[]
	typeList?: typeList[]
	viewCount?: number
	likeCount?: number
	fastLayout: boolean
	sceneId: string
	sceneName?: string
	floorSetting: boolean
}

export interface hallTableInfo {
	tempName: string
	validSz: number
	styleList: styleListItem2[]
	typeList: typeListItem2[]
	createTs: number
	durationEndTs: number
	userName: string
	userPhone: string
	sceneFromVal: string
	boutique: boolean
	aliStatic: number
	fastLayout: boolean
	renderFlowStatus: number
	renderOver: null | boolean
	extData?: string
	parentId?: string | null
	parentName?: string | null
	sceneId: string
	sceneName: string
	tempId: string
	publishAfterStatus: number
	areaRemark?: string
}

export interface boutiqueInfo {
	styleList: any
	typeList: any
	boutiqueId: number
	boutiqueSort: number
	boutiqueStatus: number
	discountEndTime: number
	discountRate: number
	discountStartTime: number
	styleId: string
	sz: string | number
	tempId: string
	typeId: string
	validSz: string | null
	recomType: number | boolean
	recomName: string
}

export interface styleItem {
	name: string
	sort: number
	styleId: string
}

export interface typeItem {
	icon: string | null
	name: string
	order: number
	typeId: string
	xcxOrder: number
}
export interface templateItem {
	id: string
	sz: string
	tempName?: string
	sceneName?: string
}

export interface menusInfoData {
	id: number
	parentId: number
	menuName: string
	menuPath: string
	url: string
	icon: null
	sort: number
	level: number
	leaf: boolean
	type: number
	description: string
	children: menusInfoData[]
}

export interface changeMenus {
	id: number
	parentId: number
	menuName: string
	menuPath: string
	url: string
	icon: string
	sort: number
	level: number
	leaf: boolean
	type: number
	description: string
}

export interface rolesData<T> {
	userId?: string
	roleIds?: T[]
}

export interface rolesDataItem {
	ActualType: number
}

export interface rolesListItem {
	id: string
	code: string
	name: string
}

export interface comboItem {
	id: number
	name: string
	code: string
}

export interface rolesPermissionsItem {
	id: number
	permissionName: string
	description: string
	createTs: string
}

export interface menuTreeItem {
	children: menuTreeItem[]
	enabled: boolean
	hasPermission: boolean
	icon: string
	id: number
	leaf: boolean
	level: number
	menuName: string
	menuPath: string
	parentId: number
	sort: number
	title?: string
	type: number
	url: string
	key: number
}

export interface stylesListItem {
	fileHost: any
	docCategory: any
	name: string
	sort: number
	styleId: string
}

export interface typeListItem {
	name: string
	order: number
	id: string
}

export interface systemPageItem {
	isGood: boolean
	musicFile: string
	musicId: string
	musicType: string
	musicTypeId: string
	name: string
	singer: string
	size: number
	time: number
	type: boolean
}

export interface musicTypeItem {
	musicTypeId: string
	name: string
}

export interface hotsPotItem {
	delay: string
	delayStr: string
	discripe: string
	edgUrl: string
	enable: string
	extData: string
	fileType: number
	glbThumb: string
	height: string
	isIcon: boolean
	mp3: string
	name: string
	picId: string
	picPath: string
	picks: string
	picturesName: string
	playType: number
	size: number
	tags: string
	target: string
	url: string
	useMp3: string
	vcount: string
	videoThumb: string
	videoThumbName: string
	width: string
}

export interface narratorImgItem {
	id: string
	fileType: number
	fileName: string
	fileUrl: string
	fileSort: number
	fileSize: number
	contentType: string
}

export interface formListItem {
	id: number
	applyTime: number
	area: number
	handTime: string
	handler: string
	handlerId: string
	status: string
	telephone: string
	type: string
	remarks?: string
	tempId?: string
}

export interface formTypeItem {
	title?: string
	id?: number
	key: number | string
	value: string
	tempId?: string
}
export interface sortTypeItem {
	createLink: string
	description: string
	hoverIcon: string
	icon: string
	id: string
	moreLink: string
	name: string
	num: number
	sort: number
	tag: string
}

export interface bannerListItem {
	commentNum: number
	contentUrl: string
	createTs: number
	enable: boolean
	endTime: number
	id: number
	imgUrl: string
	sort: number
	startTime: number
	title: string
	type: string
	username: string
	description?: string
	industryId?: number
}

export interface bindcaseItem {
	thumb: string
}

export interface orderInfo {
	createTs: number
	fee: string
	outTradeNo: string
	sceneTemplateId: string
	sceneTemplateName: string
	status: string
	transactionType: string
	validSz: number
}

export interface caseListItem {
	caseSort: number
	caseStatus: number
	createTs: number
	id: number
	sceneId: string
	styleId: string
	styleName: string
	sz: number
	tempId: string
	tempName: string
	thumb: string
	typeId: number
	typeName: string
	validSz: number
	recomList: any
	styleList: any
}

export interface authInfoData {
	authorities: Authority[]
	userRoles: UserRole[]
}

export interface Authority {
	id: number
	parentId: number
	action: string
	icon: string
	name: string
	url?: string
	sort: number
}

export interface UserRole {
	roleId: number
	roleName: string
}

export interface hcaseListItem {
	id: string
	name: string
	url: string
	indexTradeId: number
	sort: number
	image?: string
}

export interface otherPermissionsItem {
	createTs: number
	description: string
	id: number
	permissionName: string
}

export interface sortListItem {
	createLink: string
	description: string
	hoverIcon: string
	icon: string
	id: string
	moreLink: string
	name: string
	num: number
	sort: number
	tag: string
}
export interface mealInfo {
	devId: string
	devPackageId: string
	expire: number
	lives: number
	onlineServices: number
	publishScenesExtra: number
	sceneSyncs: number
	version: number
	visitorInfos: number
}

export interface mealItem {
	id: string
	name: string
	publishScenes: number
	day: number
}

export interface mealList {
	packagesList: mealItem[]
	packageId: string
	devId: string
}

export interface tempParams {
	pageNum: number
	pageSize: number
	tempName?: string
	tempId?: string
	userId?: string
}
export interface devAddtemp {
	tempType: number
	businessId: number
	tempName: string
	createType: number
	userId: string
}
export interface devInfo {
	userId: string
	userName: string
	telephone: string
	tag: string
}
export interface UserTemp {
	pageNum?: number
	pageSize?: number
	tempName?: string
	tempId?: string
	phoneOrName?: string
	isCheck?: number
	syncStatic?: number
	serverType?: number
	startTime?: string
	endTime?: string
	devUserId: string
}
export interface tempInfo {
	validSz?: number
}
export interface accountOverview {
	delScenes: number
	importUsers: number
	livesUses: number
	onlineServicesUses: number
	publishScenesUses: number
	sceneSyncsUses: number
	totalScenes: number
	visitorInfosUses: number
	expireStr: string
	vrLooksUses: number
}
export interface developerPackagesInfo {
	totalScenes: number
	importUsers: number
	visitorInfos: number
	visitorInfosUses: number
	lives: number
	livesUses: number
	sceneSyncs: number
	sceneSyncsUses: number
	publishScenes: number
	publishScenesUses: number
	delScenes: number
	onlineServices: number
	onlineServicesUses: number
	expireStr: string
	vrLooksUses: number
	vrLooks: number
}

export interface resoureInfo {
	developerInfo: devInfo
	developerPackagesInfo: developerPackagesInfo
	accountOverview: accountOverview
}

export interface overviewDataItem {
	tempCount: number
	aliStatic: number
	publishCount: number
	notPublishCount: number
	boutiqueCount: number
}

export interface ratioDataItem {
	countTwo: number
	ratioTwo: number
	count: number
	name: string
	ratio: number
}

export interface rankingListItem {
	id: number
	name: number
	thumb: string
	count: string
}

export interface userDataItem {
	allUserCount: number
	registerRate: number
	userCount: number
	userExtCount: number
	userExtRate: number
	userPublishCount: number
	userPublishRate: number
	userTempCount: number
	userTempRate: number
	visitorCount: number
}

export interface userDataItem2 {
	aliStatic: number
	boutiqueCount: number
	notPublishCount: number
	publishCount: number
	tempCount: number
}

export interface salePerson {
	active?: boolean
	coupons?: number
	createTs?: number
	id?: number
	name: string
	telephone: string
	unusedCoupons?: number
}
export interface couponInfo {
	validEndTime?: string
	validStartTime?: string
}
export interface couponOrderInfo {
	outTradeNo?: string
	fee?: number
	transactionType?: string
	status?: string
	sceneTemplateId?: string
	sceneTemplateName?: string
	validSz?: number
	serverType?: string
	salesmanName?: string
	discountAmount?: string
	couponType?: string
	createTs?: string
}

export interface styleListItem2 {
	styleId: string
	styleName: string
	tempId: string
}

export interface typeListItem2 {
	tempId: string
	typeId: string
	typeName: string
}

export interface reselectItem {
	styleList: styleListItem2[]
	typeList: typeListItem2[]
	validSz: number
}

export interface logListItem {
	list: logItem[]
}

export interface logItem {
	id: number
	requestUri: string
	method: string
	ip: string
	businessId: string
	businessTitle: string
	businessType: string
	businessDesc: string
	logDesc: string
	nickname: string
	creator: string
	createTs: string
}

export interface renderQueueItem {
	id: string
	tempId: string
	tempName: string
	thumb: string
	validSz: number
	userId: string
	username: string
	nickname: string
	renderStatus: number
	renderStatusDict: string
	sort: number
	topStatus: boolean
	sweeps: number
	createTs: string
}

export interface renderInfo {
	id: string
	nickname: string
	remark: string
	renderEndTime: number
	renderStartTime: number
	renderStatus: number
	sort: number
	tempId: string
	tempName: string
	thumb: string
	userId: string
	username: string
}

export interface upgradeListItem {
	id: string
	createTs: string
	createdBy: string
	updateTs: string
	updatedBy: string
	title: string
	describe: string
	status: number
	deleted: number
	sort: number
}

export interface upgradeEditItem {
	info: upgradeInfoItem
	detailsList: upgradeDetailsListItem[]
}

export interface upgradeInfoItem {
	createTs: number
	createdBy: string
	deleted: number
	describe: string
	id: string
	sort: number
	status: number
	title: string
	updateTs: number
	updatedBy: string
}

export interface upgradeDetailsListItem {
	createTs: number
	createdBy: string
	describe: string
	fileUrl: string | any
	id: string
	linkUrl: string
	name: string
	sort: number
	updateTs: number
	updatedBy: string
	upgradeId: string
}
export interface businessInfo {
	name: string
	password: string
	repassword?: string
	username: string
	phone: number
	companyPhone: number
	companyAddress: string
	companyStatus: boolean
	emailBox: string
	avatar: string
	logo: string
}
export interface resourceInfoItem {
	useTempCount: number
	tempCount: number
	useVrCount: number
	companyId: string
	id: string
	vrCount: number
	expireDate: number
	areaList: areaListItem[]
}

export interface areaListItem {
	areaId: number
	remark: string
	min: number
	max: number
	price: number
	tempCount: number
	useTempCount: number
	addCount?: number
}

export interface resourceListItem {
	id: string
	orderNumber: string
	resourceType: number
	tempCount: number
	vrCount: number
	createTs: number
	expireDate: number
}

export interface getResourceInfoItem {
	companyId: string
	id: string
	useVrCount: number
	vrCount: number
	addVrCount?: number
	createTs: number
	expireDate: number
	areaList: areaListItem[]
	tempCount: number
	resourceCount: number
	resourceType: number
	addCountSum?: number
}
export interface areaInterva {
	entityPrice?: string
	areaId: number
	max?: number
	min?: number
	price?: number
	remark: string
	virtualPrice?: string
	userRemainCount?: number
	remainCount?: number
}

export interface tempListItem {
	id: string
	companyId: string
	tempId: string
	name: string
	createType: number
	createTs: string
	createdBy: string
	createdName: string
	roamCount: number
	thumb: string
	validSz: string
	userId: string
	userName: string
}

export interface tempKeywordItem {
	id: string
	name: string
	tempName: string
	sz: string
	validSz: string
}
export interface bestTemp {
	id: string
	name: string
	sz: string
	validSz: string
	thumb: string
}

export interface listData<D = {}> {
	currentPage: number
	pageSize: number
	totalPage: number
	count: number
	list: D[]
}
export interface topicTempInfo {
	id: string
	name: string
	publicAttr: boolean
	tempId: string
	userList: topicUserItem[]
}
export interface topicUserItem {
	id: string
	username: string
	nickname: string
	publishCount?: number
	sceneTotalCount?: number
	releases?: number
	areaList?: areaInterva[]
}
export interface themeInfo {
	name: string
	logo: string
	id: string
}

export interface businessListItem {
	id: string
	name: string
}

export interface tempPageListItem {
	pageNum: number
	pageSize: number
	companyId: string
	topicId: string
	tempName: string
	tempId: string
	phoneOrName: string
	aliStatic: number
	isCheck: number
	startTime: string
	endTime: string
	valueAddedService: number
}

export interface topicTempItem {
	tempId: string
	tempName: string
	topicId: string
}

export interface topicUserListItem {
	id: string
	nickname: string
	username: string
	topicId: string
}

export interface serviceConfigItem {
	tempId: string
	varLook: number
	varLookCount: number
	varLookInfo: varLookInfoItem
	myBrowseService: number
}

export interface varLookInfoItem {
	expireFlag: boolean
	remainCount: number
	totalCount: number
	useCount: number
}

export interface polymerizationInfo {
	imgUrl: string
}

export interface loginListItem {
	id: string
	name: string
	thumb: string
	styleFile: string
	relatedTopic: boolean
	rackStatus: boolean
	sort: number
}

export interface visitorsListItem {
	tempId: string
	tempName: string
	owner: string
	company: string
	realName: string
	telephone: string
	remark: string
	createTs: string
}

export interface pricelistItem {
	id: number
	min: number
	max: number
	name: string
	virtualPrice: string
	entityPrice: string
}
