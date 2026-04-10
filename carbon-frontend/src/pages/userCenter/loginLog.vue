<template>
  <view class="log-container">
    <view v-for="(log, index) in logs" :key="index" class="log-card">
      <view class="log-top">
        <text class="status-tag" :class="log.status">{{ log.status === 'success' ? '登录成功' : '尝试失败' }}</text>
        <text class="time">{{ log.timestamp }}</text>
      </view>
      <view class="log-detail">
        <text>📍 IP地址: {{ log.ip }}</text>
        <text>🌏 地理位置: {{ log.location || '未知' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/api/request.js'

const logs = ref([])

onMounted(async () => {
  const res = await request({ url: '/user/login_history', method: 'GET' })
  if (res.code === 200) logs.value = res.data
})
</script>

<style>
.log-container { padding: 15px; background: #f4f4f4; min-height: 100vh; }
.log-card { background: #fff; border-radius: 10px; padding: 15px; margin-bottom: 12px; }
.log-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
.status-tag { font-size: 10px; padding: 2px 6px; border-radius: 4px; }
.success { background: #e8f5e9; color: #2e7d32; }
.failed { background: #ffebee; color: #c62828; }
.time { font-size: 12px; color: #999; }
.log-detail { font-size: 13px; color: #666; display: flex; flex-direction: column; line-height: 1.8; }
</style>