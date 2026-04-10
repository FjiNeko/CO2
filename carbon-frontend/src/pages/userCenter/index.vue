<template>
  <view class="center-container">
    <view class="user-header">
      <view class="user-info">
        <view class="avatar">👤</view>
        <view class="meta">
          <text class="username">{{ userInfo.username || '未登录' }}</text>
          <text class="role-tag">{{ userInfo.role === 'admin' ? '系统管理员' : '低碳居民' }}</text>
        </view>
      </view>
    </view>

    <view class="score-card">
      <view class="score-item">
        <text class="val">{{ stats.total_points }}</text>
        <text class="lab">当前积分</text>
      </view>
      <view class="divider"></view>
      <view class="score-item">
        <text class="val">{{ stats.total_km }}</text>
        <text class="lab">累计公里</text>
      </view>
    </view>

    <view class="menu-list">
      <view class="list-item" @click="goTo('/pages/userCenter/loginLog')">
        <text class="icon">📜</text>
        <text class="text">登录审计日志</text>
        <text class="arrow">></text>
      </view>
      <view class="list-item" @click="handleDeveloping">
        <text class="icon">🎁</text>
        <text class="text">我的兑换记录</text>
        <text class="arrow">></text>
      </view>
      <view class="list-item" @click="handleDeveloping">
        <text class="icon">⚙️</text>
        <text class="text">系统设置</text>
        <text class="arrow">></text>
      </view>
    </view>

    <button class="logout-btn" @click="handleLogout">退出登录</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/api/request.js'

const userInfo = ref({})
const stats = ref({ total_points: 0, total_km: 0 })

onShow(async () => {
  const userRes = await request({ url: '/user/me', method: 'GET' })
  userInfo.value = userRes.user_info
  
  const statsRes = await request({ url: '/user/my_stats', method: 'GET' })
  stats.value = statsRes.data
})

const goTo = (url) => uni.navigateTo({ url })
const handleDeveloping = () => uni.showToast({ title: '功能开发中', icon: 'none' })

const handleLogout = () => {
  uni.showModal({
    title: '提示',
    content: '确定退出系统？',
    success: (res) => {
      if (res.confirm) {
        uni.clearStorageSync()
        uni.reLaunch({ url: '/pages/login/login' })
      }
    }
  })
}
</script>

<style>
.center-container { min-height: 100vh; background: #f8f8f8; }
.user-header { background: #2e7d32; height: 160px; padding: 40px 20px; box-sizing: border-box; }
.user-info { display: flex; align-items: center; }
.avatar { width: 64px; height: 64px; background: rgba(255,255,255,0.2); border-radius: 50%; font-size: 30px; display: flex; justify-content: center; align-items: center; }
.meta { margin-left: 15px; }
.username { color: #fff; font-size: 20px; font-weight: bold; display: block; }
.role-tag { font-size: 11px; color: #e8f5e9; background: rgba(0,0,0,0.1); padding: 2px 8px; border-radius: 10px; margin-top: 5px; display: inline-block; }

.score-card { margin: -30px 15px 15px; background: #fff; border-radius: 12px; display: flex; padding: 20px 0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
.score-item { flex: 1; text-align: center; }
.val { font-size: 20px; font-weight: bold; color: #333; display: block; }
.lab { font-size: 12px; color: #999; margin-top: 4px; }
.divider { width: 1px; height: 30px; background: #eee; margin-top: 10px; }

.menu-list { background: #fff; margin: 0 15px; border-radius: 12px; overflow: hidden; }
.list-item { display: flex; align-items: center; padding: 18px 15px; border-bottom: 1px solid #f9f9f9; }
.icon { font-size: 18px; margin-right: 12px; }
.text { flex: 1; font-size: 15px; color: #333; }
.arrow { color: #ccc; font-size: 14px; }

.logout-btn { margin: 30px 15px; background: #fff; color: #ff5252; border-radius: 12px; border: 1px solid #ffebee; font-size: 16px; }
</style>