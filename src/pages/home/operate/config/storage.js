// 存储服务
// const AV = require('leancloud-storage');  // npm i leancloud-storage --save
import AV from "leancloud-storage"
//import User from "./user";
if (!Date.prototype.Format) {
	Date.prototype.Format = function (fmt) {
		//author: meizz
		var o = {
			"M+": this.getMonth() + 1, //月份
			"d+": this.getDate(), //日
			"h+": this.getHours(), //小时
			"m+": this.getMinutes(), //分
			"s+": this.getSeconds(), //秒
			"q+": Math.floor((this.getMonth() + 3) / 3), //季度
			S: this.getMilliseconds() //毫秒
		}
		if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length))
		for (var k in o)
			if (new RegExp("(" + k + ")").test(fmt))
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length))
		return fmt
	}
}

class storage {
	constructor(config) {
		config = config || {}
		const appId = config.appId
		const appKey = config.appKey
		const username = config.username
		const password = config.password
		this.config = config
		this.table = config.table || "Comment"
		if (appId && appKey) {
			AV.init({
				appId: appId,
				appKey: appKey,
				serverURLs: this.getServerURLs(AV, appId) //通过appid获取
			})
			if (username && password) {
				AV.User.logIn(username, password)
				// AV.User.signUp(username,password)
				// this.user = new AV.User();
				// new User().AddRight();
			}
			return this
		}
		throw new Error("appId and appKey is required !")
	}
	getServerURLs(AV, id) {
		;(AV.applicationId && delete AV._config.applicationId) || (AV.applicationId = void 0)
		;(AV.applicationKey && delete AV._config.applicationKey) || (AV.applicationKey = void 0)
		let serverURLs = id.slice(-9) === "-MdYXbMMI" ? "https://us.avoscloud.com" : "https://avoscloud.com"
		return serverURLs
	}
	QcountAll(k) {
		//获取所有的评论数量
		const me = this
		const table = me.table
		let cql = `select count(*) from ${table} where url='${decodeURI(k)}' `
		return AV.Query.doCloudQuery(cql)
	}
	QAll() {
		const me = this
		const table = me.table
		let cql = `select * from ${table}  order by createdAt,updatedAt desc `
		return me.query(cql)
	}
	async list(opt) {
		const me = this
		const table = me.table
		opt = opt || {}
		let pageSize = opt.pageSize || 20
		let url = opt?.params?.url || ""
		let state = opt?.params?.state || ""
		let ua = opt?.params?.ua || ""
		let currentPage = opt.currentPage || 1
		let s = (currentPage - 1) * pageSize
		let cql1 =
			API_ENV == "pro"
				? `select * from ${table} where ua='wxapp' or ua='art-core'`
				: `select * from ${table} where ua='wxapp' or ua='art-core-mo'`
		let cql3 = `select * from ${table}`
		let cql2 = ` order by createdAt,updatedAt desc  LIMIT ${s},${pageSize}`
		let cql = cql1 + cql2
		let aql1 =
			API_ENV == "pro"
				? `select count(*) from ${table} where ua='wxapp' or ua='art-core'`
				: `select count(*) from ${table} where ua='wxapp' or ua='art-core-mo'`
		let aql2 = `select count(*) from ${table}`
		let aql = aql1

		if (url) {
			if (API_ENV == "pro") {
				cql = cql3 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core'` + cql2
				aql = aql2 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core'`
			} else {
				cql = cql3 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core-mo'` + cql2
				aql = aql2 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core-mo'`
			}
			if (state && state !== 0) {
				cql = cql3 + ` where url='${url}' and state='${state}'` + cql2
				aql = aql2 + ` where url='${url}' and state='${state}'`
				if (ua) {
					if (ua !== "all") {
						cql = cql3 + ` where url='${url}' and state='${state}' and ua='${ua}'` + cql2
						aql = aql2 + ` where url='${url}' and state='${state}' and ua='${ua}'`
					} else {
						if (API_ENV == "pro") {
							cql =
								cql3 +
								` where url='${url}' and state='${state}' and ua='wxapp' or url='${url}' and state='${state}' and ua='art-core'` +
								cql2
							aql =
								aql2 +
								` where url='${url}' and state='${state}' and ua='wxapp' or url='${url}' and state='${state}' and ua='art-core'`
						} else {
							cql =
								cql3 +
								` where url='${url}' and state='${state}' and ua='wxapp' or url='${url}' and state='${state}' and ua='art-core-mo'` +
								cql2
							aql =
								aql2 +
								` where url='${url}' and state='${state}' and ua='wxapp' or url='${url}' and state='${state}' and ua='art-core-mo'`
						}
					}
				}
			} else {
				if (ua) {
					if (ua !== "all") {
						cql = cql3 + ` where url='${url}' and ua='${ua}'` + cql2
						aql = aql2 + ` where url='${url}' and ua='${ua}'`
					} else {
						if (API_ENV == "pro") {
							cql = cql3 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core'` + cql2
							aql = aql2 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core'`
						} else {
							cql = cql3 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core-mo'` + cql2
							aql = aql2 + ` where url='${url}' and ua='wxapp' or url='${url}' and ua='art-core-mo'`
						}
					}
				}
			}
		} else {
			if (state && state !== 0) {
				if (API_ENV == "pro") {
					cql = cql3 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core'` + cql2
					aql = aql2 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core'`
				} else {
					cql = cql3 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core-mo'` + cql2
					aql = aql2 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core-mo'`
				}
				if (ua) {
					if (ua !== "all") {
						cql = cql3 + ` where state='${state}' and ua='${ua}'` + cql2
						aql = aql2 + ` where state='${state}' and ua='${ua}'`
					} else {
						if (API_ENV == "pro") {
							cql = cql3 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core'` + cql2
							aql = aql2 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core'`
						} else {
							cql = cql3 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core-mo'` + cql2
							aql = aql2 + ` where state='${state}' and ua='wxapp' or state='${state}' and ua='art-core-mo'`
						}
					}
				}
			} else {
				if (ua) {
					if (ua !== "all") {
						cql = cql3 + ` where ua='${ua}'` + cql2
						aql = aql2 + ` where ua='${ua}'`
					} else {
						cql = cql1 + cql2
						aql = aql1
					}
				}
			}
		}

		let res = await Promise.all([me.query(cql), me.query(aql)])
		let list = me.formatList(res[0].results)
		let count = res[1].count
		return Promise.resolve({ list, pageSize, currentPage, count })
	}
	async remove(id) {
		const me = this
		const table = me.table
		let cql = `DELETE FROM ${table} where objectId='${id}'`
		return me.query(cql)
	}
	async removes(ids) {
		// 批量删除
		const me = this
		const table = me.table
		if (Array.isArray(ids)) {
			ids = JSON.stringify(ids).replace(/(\[|\])/g, "")
		}
		// let cql = `DELETE FROM ${table} where objectId in ${ids}`;
		let cql = `select * from ${table} where objectId in (${ids})`
		let res = await me.query(cql)
		let results = res.results || []
		for (let i = 0; i < results.length; i++) {
			results[i].destroy()
		}
		AV.Object.destroyAll(results)
		return AV.Object.fetchAll(results)
	}
	async updateState(id, state) {
		// 更新审核状态  1 未审核，2 审核通过， 3 审核不通过
		const me = this
		const table = me.table
		let cql = `update ${table} set state='${state}' where objectId='${id}' `
		return me.query(cql)
	}
	async updateStateWith(id, state) {
		const me = this
		const table = me.table
		var todo = AV.Object.createWithoutData(table, id)
		todo.set("state", state)
		return todo.save()
	}
	async updateStates(ids, state) {
		// 批量更新
		const me = this
		const table = me.table
		if (Array.isArray(ids)) {
			ids = JSON.stringify(ids).replace(/(\[|\])/g, "")
		}
		// let cql = `update ${table} set state='${state}' where objectId in (${ids}) `;
		let cql = `select * from ${table} where objectId in (${ids})`
		let res = await me.query(cql)
		let results = res.results || []
		for (let i = 0; i < results.length; i++) {
			results[i].save("state", String(state))
		}
		AV.Object.saveAll(results)
		return AV.Object.fetchAll(results)
	}
	Q(k, ids) {
		const me = this
		const table = me.table
		if (!ids) {
			let notExist = new AV.Query(table)
			notExist.doesNotExist("rid")
			let isEmpty = new AV.Query(table)
			isEmpty.equalTo("rid", "")
			let q = AV.Query.or(notExist, isEmpty)
			if (k === "*") q.exists("url")
			else q.equalTo("url", decodeURI(k))
			q.addDescending("createdAt")
			q.addDescending("insertedAt")
			return q
		} else {
			ids = JSON.stringify(ids).replace(/(\[|\])/g, "")
			let cql = `select * from ${table} where rid in (${ids}) order by createdAt,updatedAt desc `
			return AV.Query.doCloudQuery(cql)
		}
	}
	query(sql) {
		return AV.Query.doCloudQuery(sql)
	}
	formatList(list) {
		let result = []
		for (let i = 0; i < list.length; i++) {
			result.push(this.formatItem(list[i]))
		}
		return result
	}
	formatItem(item) {
		var obj = Object.assign({}, item.attributes)
		obj.id = item.id
		obj.cid = item.cid
		var d = item.get("createdAt")
		obj.createAt = d
		obj._createAt = this.getMsgTime(d)
		obj.updatedAt = d
		return obj
	}
	getMsgTime(d) {
		var createT = new Date(d)
		return createT.Format("yyyy-MM-dd hh:mm:ss")
	}
}
export default storage
