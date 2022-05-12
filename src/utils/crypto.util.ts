/**
 * 加密工具类
 */
import CryptoJS from "crypto-js"
//加密key
const key = "201991022019ndit"
//加密偏移值
const piv = "1234567876543210"

/**
 * 加密
 */
export const Encrypt = (val: string | object) => {
	if (typeof val == "object") {
		val = JSON.stringify(val)
	}
	const message = CryptoJS.enc.Utf8.parse(val)
	const secret_key = CryptoJS.enc.Utf8.parse(key) //key
	const iv = CryptoJS.enc.Utf8.parse(piv) //偏移
	// Encrypt
	const ciphertext = CryptoJS.AES.encrypt(message, secret_key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	})
	return CryptoJS.enc.Base64.stringify(ciphertext.ciphertext)
}
/**
 * 解密
 * */
export const Decrypt = (val: string) => {
	const secret_key = CryptoJS.enc.Utf8.parse(key)
	const iv = CryptoJS.enc.Utf8.parse(piv)
	const ciphertext = CryptoJS.AES.decrypt(val, secret_key, {
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	})
	return ciphertext.toString(CryptoJS.enc.Utf8)
}
