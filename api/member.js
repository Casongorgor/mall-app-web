import request from '@/utils/requestUtil'

export function memberLogin(data) {
	return request({
		method: 'POST',
		url: '/sso/login',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}
export function getVerifyCode(params) {
	return request({
		method: 'GET',
		url: '/sso/getAuthCode',
		params:params
	})
}
export function register(data) {
	return request({
		method: 'POST',
		url: '/sso/register',
		header: {
			'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		},
		data: data
	})
}

export function memberInfo() {
	return request({
		method: 'GET',
		url: '/sso/info'
	})
}
