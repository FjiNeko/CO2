// src/api/request.js

// 指向你本地运行的 FastAPI 后端地址
const BASE_URL = 'http://127.0.0.1:8000/api/v4'

export const request = (options) => {
  return new Promise((resolve, reject) => {
    // 从本地缓存获取 token，用于受保护接口的身份验证
    const token = uni.getStorageSync('token')
    
    uni.request({
      url: BASE_URL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Authorization': token ? `Bearer ${token}` : '', // 自动携带 JWT
        ...options.header
      },
      success: (res) => {
        // 请求成功 (HTTP 状态码 2xx)
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data)
        } else {
          // 处理后端返回的错误 (如密码错误、token过期等)
          uni.showToast({
            title: res.data?.detail || res.data?.message || '请求失败',
            icon: 'none'
          })
          reject(res.data)
        }
      },
      fail: (err) => {
        uni.showToast({
          title: '网络连接失败，请检查后端是否启动',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}