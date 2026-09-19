<template>
  <view class="login-log-page-wrapper">
    <!-- 顶部状态栏安全占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 顶部导航栏 -->
    <view class="top-nav-bar">
      <view class="nav-back-btn" @click="handleBack">
        <svg class="back-svg" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="#064E3B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <text class="nav-title chinese-font">登录日志</text>
      <view class="nav-right-placeholder"></view>
    </view>

    <scroll-view scroll-y class="log-scroll-view">
      <!-- 头部安全保障 Hero 卡片 -->
      <view class="security-banner-card">
        <view class="security-left-box">
          <view class="security-badge-pill">
            <svg class="shield-check-svg" viewBox="0 0 24 24" fill="none">
              <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" fill="#DEF7EC" stroke="#10B981" stroke-width="2" stroke-linejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="#065F46" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <text class="pill-text chinese-font">账号安全审计防护</text>
          </view>
          <text class="security-title chinese-font">实时登录安全记录</text>
          <text class="security-sub chinese-font">系统记录最近登录的设备 IP 与属地，全天候守护您的碳账户资产</text>
        </view>
      </view>

      <!-- 日志列表 -->
      <view class="log-list-section" v-if="logs.length > 0">
        <view 
          v-for="(log, index) in logs" 
          :key="log._id || index" 
          class="log-item-card"
        >
          <!-- 顶部状态与时间行 -->
          <view class="item-header-row">
            <view 
              class="status-badge-pill" 
              :class="log.status === 'success' ? 'badge-success' : 'badge-failed'"
            >
              <svg v-if="log.status === 'success'" class="status-svg" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#10B981"/>
                <path d="M5 8L7 10L11 6" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <svg v-else class="status-svg" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" fill="#EF4444"/>
                <path d="M8 5V8.5M8 11H8.01" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round"/>
              </svg>
              <text class="status-text chinese-font">
                {{ log.status === 'success' ? '登录成功' : '尝试失败' }}
              </text>
            </view>

            <view class="time-box">
              <svg class="time-clock-svg" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="6.5" stroke="#94A3B8" stroke-width="1.3"/>
                <path d="M8 4.5V8L10.5 9.5" stroke="#94A3B8" stroke-width="1.3" stroke-linecap="round"/>
              </svg>
              <text class="time-text num-font">{{ log.timestamp }}</text>
            </view>
          </view>

          <!-- 详细信息网格 -->
          <view class="item-details-grid">
            <view class="detail-row">
              <view class="detail-icon-wrap">
                <svg class="detail-svg" viewBox="0 0 20 20" fill="none">
                  <rect x="3" y="4" width="14" height="10" rx="2" stroke="#059669" stroke-width="1.5"/>
                  <path d="M7 16H13M10 14V16" stroke="#059669" stroke-width="1.5" stroke-linecap="round"/>
                </svg>
              </view>
              <text class="detail-label chinese-font">网络IP地址：</text>
              <text class="detail-value num-font">{{ log.ip || '127.0.0.1' }}</text>
            </view>

            <view class="detail-row">
              <view class="detail-icon-wrap">
                <svg class="detail-svg" viewBox="0 0 20 20" fill="none">
                  <path d="M10 2C6.68629 2 4 4.68629 4 8C4 12.5 10 18 10 18C10 18 16 12.5 16 8C16 4.68629 13.3137 2 10 2Z" stroke="#0D9488" stroke-width="1.5" stroke-linejoin="round"/>
                  <circle cx="10" cy="8" r="2.5" stroke="#0D9488" stroke-width="1.4"/>
                </svg>
              </view>
              <text class="detail-label chinese-font">接入属地：</text>
              <text class="detail-value chinese-font">{{ log.location || '局域网/内网接入' }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-wrap">
        <svg class="empty-svg" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
          <path d="M22 38C22 38 26 34 32 34C38 34 42 38 42 38" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="24" cy="26" r="3" fill="#94A3B8"/>
          <circle cx="40" cy="26" r="3" fill="#94A3B8"/>
        </svg>
        <text class="empty-text chinese-font">暂无相关登录审计记录</text>
      </view>

      <!-- 底部安全留白 -->
      <view class="bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/api/request.js'

const logs = ref([])

const handleBack = () => {
  const pages = getCurrentPages()
  if (pages && pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/userCenter/index',
      fail: () => uni.navigateTo({ url: '/pages/userCenter/index' })
    })
  }
}

onMounted(async () => {
  try {
    const res = await request({ url: '/user/login_history', method: 'GET' })
    if (res && res.code === 200 && Array.isArray(res.data)) {
      logs.value = res.data
    }
  } catch (e) {
    console.error('获取登录日志异常:', e)
  }
})
</script>

<style>
/* 1. 字体规范声明 */
@font-face {
  font-family: 'OutfitBold';
  src: url('/static/fonts/Outfit-Black.ttf') format('truetype');
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: 'AlibabaPuHuiTi';
  src: url('/static/fonts/AlibabaPuHuiTi-Bold.woff2') format('woff2');
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
}

.chinese-font {
  font-family: 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}

.num-font {
  font-family: 'OutfitBold', sans-serif !important;
}

/* 页面主框架 */
.login-log-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #E6F7F0 0%, #F5FAF7 20%, #F8FAF9 100%);
  display: flex;
  flex-direction: column;
}

/* 状态栏安全占位 */
.status-bar-placeholder {
  height: 44px;
  height: calc(44px + env(safe-area-inset-top));
}

/* 顶部导航栏 */
.top-nav-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 18px 12px;
  background: transparent;
}

.nav-back-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(6, 78, 59, 0.08);
}

.back-svg {
  width: 20px;
  height: 20px;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #064E3B;
  letter-spacing: 0.5px;
}

.nav-right-placeholder {
  width: 38px;
}

/* 滚动区域 */
.log-scroll-view {
  flex: 1;
  padding: 0 16px;
  box-sizing: border-box;
}

/* 头部安全卡片 */
.security-banner-card {
  border-radius: 20px;
  background: linear-gradient(135deg, #064E3B 0%, #065F46 60%, #0D9488 100%);
  box-shadow: 0 10px 26px rgba(6, 78, 59, 0.18);
  padding: 20px;
  margin-bottom: 20px;
}

.security-badge-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  margin-bottom: 10px;
}

.shield-check-svg {
  width: 15px;
  height: 15px;
  margin-right: 6px;
}

.pill-text {
  font-size: 12px;
  color: #F0FDF4;
  font-weight: 500;
}

.security-title {
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
  display: block;
  margin-bottom: 6px;
}

.security-sub {
  font-size: 12px;
  color: #D1FAE5;
  line-height: 1.5;
  display: block;
  opacity: 0.9;
}

/* 日志列表卡片 */
.log-list-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.log-item-card {
  background: #FFFFFF;
  border-radius: 16px;
  padding: 16px;
  box-shadow: 0 4px 16px rgba(6, 78, 59, 0.04);
  border: 1px solid #F1F5F9;
}

.item-header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #F1F5F9;
}

.status-badge-pill {
  display: inline-flex;
  align-items: center;
  padding: 3px 10px;
  border-radius: 14px;
}

.badge-success {
  background: #DEF7EC;
  color: #065F46;
}

.badge-failed {
  background: #FEE2E2;
  color: #991B1B;
}

.status-svg {
  width: 14px;
  height: 14px;
  margin-right: 5px;
}

.status-text {
  font-size: 12px;
  font-weight: 600;
}

.time-box {
  display: flex;
  align-items: center;
}

.time-clock-svg {
  width: 13px;
  height: 13px;
  margin-right: 5px;
}

.time-text {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
}

/* 详细网格 */
.item-details-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-row {
  display: flex;
  align-items: center;
}

.detail-icon-wrap {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: #F8FAF9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8px;
}

.detail-svg {
  width: 14px;
  height: 14px;
}

.detail-label {
  font-size: 12px;
  color: #64748B;
  margin-right: 4px;
}

.detail-value {
  font-size: 13px;
  color: #1E293B;
  font-weight: 600;
}

/* 空状态 */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.empty-svg {
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #94A3B8;
}

/* 底部留白 */
.bottom-spacer {
  height: 40px;
}
</style>