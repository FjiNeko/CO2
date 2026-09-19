// src/api/auth.js
import { BASE_URL, AUTH_URL } from './request.js'

/**
 * 账号密码登录 (专属调用 V5 认证接口)
 * @param {string} username 
 * @param {string} password 
 * @returns {Promise<any>}
 */
export const loginApi = (username, password) => {
  return new Promise((resolve, reject) => {
    uni.request({
      url: AUTH_URL,
      method: 'POST',
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
      success: (res) => {
        if (res.statusCode === 200 && res.data?.access_token) {
          uni.setStorageSync('token', res.data.access_token)
          uni.setStorageSync('username', username)
          uni.setStorageSync('role', res.data.role || 'user')
          resolve(res.data)
        } else {
          reject(res.data || { detail: '登录失败，请检查账号密码' })
        }
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

/**
 * 获取当前用户信息
 */
export const getUserInfoApi = () => {
  const token = uni.getStorageSync('token')
  return new Promise((resolve, reject) => {
    uni.request({
      url: `${BASE_URL}/user/me`,
      method: 'GET',
      header: {
        'Authorization': token ? `Bearer ${token}` : ''
      },
      success: (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          reject(res.data)
        }
      },
      fail: (err) => reject(err)
    })
  })
}
