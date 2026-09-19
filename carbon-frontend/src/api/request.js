// src/api/request.js

// 指向本地运行的 FastAPI 后端地址：C端业务接口统一采用 v3 版本
export const BASE_URL = 'http://127.0.0.1:8000/v3/api'
export const AUTH_URL = 'http://127.0.0.1:8000/v5/api/auth/login'

export const request = async (options) => {
  const token = uni.getStorageSync('token')

  return new Promise((resolve, reject) => {
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      success: async (res) => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else if (res.statusCode === 401) {
          // Token 失效或未登录
          uni.removeStorageSync('token')
          uni.removeStorageSync('username')
          uni.removeStorageSync('role')
          if (!options.silent) {
            uni.showToast({
              title: '请先登录账号',
              icon: 'none'
            })
            setTimeout(() => {
              uni.reLaunch({ url: '/pages/auth/login' })
            }, 800)
          }
          reject(res.data)
        } else {
          if (!options.silent) {
            uni.showToast({
              title: res.data?.detail || res.data?.message || '请求失败',
              icon: 'none'
            })
          }
          reject(res.data)
        }
      },
      fail: (err) => {
        if (!options.silent) {
          uni.showToast({
            title: '网络连接失败，请检查后端是否启动',
            icon: 'none'
          })
        }
        reject(err)
      }
    })
  })
}