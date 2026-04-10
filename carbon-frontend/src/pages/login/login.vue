<template>
  <view class="login-container">
    <view class="bg-circle circle-top"></view>
    <view class="bg-circle circle-bottom"></view>

    <view class="login-card">
      <view class="header">
        <text class="logo-emoji">🍃</text>
        <text class="title">低碳畅行</text>
        <text class="subtitle">绿色消费账户大数据平台</text>
      </view>
      
      <view class="form-box">
        <view class="input-group">
          <text class="input-label">账号</text>
          <input 
            class="custom-input" 
            type="text" 
            v-model="form.username" 
            placeholder="请输入账号 (管理员: admin_root)" 
            placeholder-class="placeholder-style"
          />
        </view>
        
        <view class="input-group">
          <text class="input-label">密码</text>
          <input 
            class="custom-input" 
            type="password" 
            v-model="form.password" 
            placeholder="请输入密码" 
            placeholder-class="placeholder-style"
          />
        </view>

        <view class="options">
          <label class="remember">
            <switch checked color="#07c160" style="transform:scale(0.7)"/> 记住我
          </label>
          <text class="forget">忘记密码？</text>
        </view>

        <button class="login-btn" :class="{'btn-loading': isLoading}" @click="handleLogin" :disabled="isLoading">
          {{ isLoading ? '正在登录...' : '立 即 登 录' }}
        </button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { request } from '@/api/request.js'

const form = reactive({
  username: '',
  password: ''
})

const isLoading = ref(false)

const handleLogin = async () => {
  if (!form.username || !form.password) {
    uni.showToast({ title: '账号密码不能为空', icon: 'none' })
    return
  }
  isLoading.value = true

  try {
    const res = await request({
      url: '/auth/login',
      method: 'POST',
      header: { 'Content-Type': 'application/x-www-form-urlencoded' },
      data: { username: form.username, password: form.password }
    })

    if (res.access_token) {
      // 1. 完善数据存储
      uni.setStorageSync('token', res.access_token)
      uni.setStorageSync('role', res.role) 
      uni.setStorageSync('username', form.username) 
      
      uni.showToast({ title: '登录成功', icon: 'success' })
      
      // 2. 核心修改：角色分流跳转
      setTimeout(() => {
        if (res.role === 'admin') {
          // 如果是管理员，销毁所有页面，直接前往大数据看板
          uni.reLaunch({ 
            url: '/pages/dashboard/dashboard',
            success: () => console.log('管理员已进入看板')
          })
        } else {
          // 如果是普通用户，使用 switchTab 进入 C端首页
          uni.switchTab({ 
            url: '/pages/index/index',
            success: () => console.log('普通用户已进入首页')
          })
        }
      }, 1000)
    }
  } catch (error) {
    uni.showToast({ title: error.detail || '登录失败', icon: 'none' })
  } finally {
    isLoading.value = false
  }
}
</script>

<style>
/* 全局背景：渐变科技绿 */
.login-container {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #e0f2f1 0%, #a5d6a7 100%);
  position: relative;
  overflow: hidden;
}

/* 装饰背景圆（增加空间感） */
.bg-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 100%);
  backdrop-filter: blur(5px);
}
.circle-top {
  width: 300px;
  height: 300px;
  top: -100px;
  left: -50px;
}
.circle-bottom {
  width: 400px;
  height: 400px;
  bottom: -150px;
  right: -100px;
}

/* 毛玻璃质感登录卡片 */
.login-card {
  width: 85%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(15px);
  border-radius: 20px;
  padding: 40px 30px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.5);
  position: relative;
  z-index: 10;
}

/* 头部排版 */
.header {
  text-align: center;
  margin-bottom: 35px;
}
.logo-emoji {
  font-size: 48px;
  display: block;
  margin-bottom: 10px;
}
.title {
  font-size: 26px;
  font-weight: 800;
  color: #2e7d32;
  letter-spacing: 2px;
  display: block;
}
.subtitle {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
  display: block;
  letter-spacing: 1px;
}

/* 表单输入区 */
.input-group {
  margin-bottom: 20px;
}
.input-label {
  display: block;
  font-size: 14px;
  color: #444;
  margin-bottom: 8px;
  font-weight: bold;
}
.custom-input {
  height: 48px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid #c8e6c9;
  border-radius: 12px;
  padding: 0 16px;
  font-size: 15px;
  color: #333;
  transition: all 0.3s ease;
}
.custom-input:focus {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.2);
  background: #fff;
}
.placeholder-style {
  color: #aaa;
  font-size: 14px;
}

/* 选项区 */
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  font-size: 13px;
  color: #666;
}
.remember {
  display: flex;
  align-items: center;
}
.forget {
  color: #2e7d32;
  cursor: pointer;
}

/* 按钮样式 */
.login-btn {
  background: linear-gradient(90deg, #4caf50 0%, #2e7d32 100%);
  color: #fff;
  border-radius: 12px;
  font-size: 16px;
  font-weight: bold;
  letter-spacing: 2px;
  height: 50px;
  line-height: 50px;
  border: none;
  box-shadow: 0 4px 15px rgba(76, 175, 80, 0.4);
  transition: all 0.3s ease;
}
.login-btn:active {
  transform: translateY(2px);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.4);
}
.btn-loading {
  opacity: 0.8;
}
</style>