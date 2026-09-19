<template>
  <view class="user-page-wrapper">
    <!-- 顶部状态栏安全占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 1. 用户信息头部栏 -->
    <view class="profile-header">
      <view class="profile-avatar-box">
        <image 
          class="avatar-img" 
          :src="userInfo.avatar_url || '/static/default_avatar.png'" 
          mode="aspectFill"
        />
      </view>
      <view class="profile-info">
        <text class="profile-name chinese-font">{{ userInfo.username || '李小明' }}</text>
        <text class="profile-sub chinese-font">已低碳生活 <text class="num-font highlight-days">{{ stats.active_days || 135 }}</text> 天</text>
      </view>
    </view>

    <!-- 2. 已累计减碳 Hero 大卡片 -->
    <view class="hero-card">
      <!-- 内部装饰柔光背景 -->
      <view class="hero-glow"></view>

      <!-- 左侧减碳核心数据 -->
      <view class="hero-left">
        <text class="hero-label chinese-font">已累计减碳</text>
        <view class="hero-value-row">
          <text class="hero-num num-font">{{ formatPoints(stats.total_points) }}</text>
          <text class="hero-unit num-font">kg</text>
        </view>
        <view class="hero-badge">
          <!-- 纯矢量松树 SVG 图标 -->
          <svg class="tree-svg" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L6 10H9L4 17H10V22H14V17H20L15 10H18L12 2Z" fill="#FFFFFF"/>
          </svg>
          <text class="hero-badge-text chinese-font">相当于种植 {{ formatNumber(stats.trees_saved, 6) }} 棵树</text>
        </view>
      </view>

      <!-- 右侧 3D 生态灯泡 -->
      <view class="hero-right">
        <image 
          class="hero-bulb-img" 
          src="/static/eco_lightbulb.png" 
          mode="aspectFit"
        />
      </view>
    </view>

    <!-- 3. 三栏统计指标卡片组 -->
    <view class="metrics-row">
      <!-- 本周减碳 -->
      <view class="metric-card" @click="goTo('/pages/record/list')">
        <text class="metric-title chinese-font">本周减碳(kg)</text>
        <view class="metric-val-wrap">
          <view class="metric-num-box">
            <!-- 柔和琥珀光晕底衬 (100% 对齐参考设计) -->
            <view class="amber-glow-dot"></view>
            <text class="metric-val num-font">{{ formatNumber(stats.weekly_reduction, 16) }}</text>
          </view>
          <svg class="metric-arrow" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5L10.5 8L6 12.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
      </view>

      <!-- 连续打卡 -->
      <view class="metric-card" @click="handleCheckinTip">
        <text class="metric-title chinese-font">连续打卡(天)</text>
        <view class="metric-val-wrap">
          <view class="metric-num-box">
            <view class="amber-glow-dot"></view>
            <text class="metric-val num-font">{{ formatNumber(stats.checkin_days, 35) }}</text>
          </view>
          <svg class="metric-arrow" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5L10.5 8L6 12.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
      </view>

      <!-- 已获勋章 -->
      <view class="metric-card" @click="goTo('/pages/userCenter/rank')">
        <text class="metric-title chinese-font">已获勋章(个)</text>
        <view class="metric-val-wrap">
          <view class="metric-num-box">
            <view class="amber-glow-dot"></view>
            <text class="metric-val num-font">{{ formatNumber(stats.medals_count, 12) }}</text>
          </view>
          <svg class="metric-arrow" viewBox="0 0 16 16" fill="none">
            <path d="M6 3.5L10.5 8L6 12.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
      </view>
    </view>

    <!-- 4. 功能菜单列表大卡片 -->
    <view class="menu-card">
      <!-- 菜单 1：我的记录 -->
      <view class="menu-item" @click="goTo('/pages/record/list')">
        <view class="menu-icon-box icon-mint">
          <!-- 纯矢量记录剪贴板 SVG 图标 -->
          <svg class="menu-svg" viewBox="0 0 24 24" fill="none">
            <rect x="5" y="4" width="14" height="17" rx="3" stroke="#10B981" stroke-width="2" stroke-linejoin="round"/>
            <path d="M9 4.5V3.5C9 2.67157 9.67157 2 10.5 2H13.5C14.3284 2 15 2.67157 15 3.5V4.5" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
            <path d="M9 12.5L11 14.5L15 10.5" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="menu-name chinese-font">我的记录</text>
        <svg class="item-arrow" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4.5L13 10L7.5 15.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <view class="item-divider"></view>

      <!-- 菜单 2：碳中和勋章 -->
      <view class="menu-item" @click="goTo('/pages/userCenter/rank')">
        <view class="menu-icon-box icon-teal">
          <!-- 纯矢量勋章奖章 SVG 图标 -->
          <svg class="menu-svg" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="8.5" r="5.5" stroke="#0D9488" stroke-width="2"/>
            <path d="M12 7V10" stroke="#0D9488" stroke-width="2" stroke-linecap="round"/>
            <path d="M8.5 13.5L7 21L12 18L17 21L15.5 13.5" stroke="#0D9488" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="menu-name chinese-font">碳中和勋章</text>
        <svg class="item-arrow" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4.5L13 10L7.5 15.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <view class="item-divider"></view>

      <!-- 菜单 3：碳积分商城 -->
      <view class="menu-item" @click="goTo('/pages/shop/index')">
        <view class="menu-icon-box icon-emerald">
          <!-- 纯矢量购物袋 SVG 图标 -->
          <svg class="menu-svg" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="8" width="16" height="13" rx="2.5" stroke="#059669" stroke-width="2" stroke-linejoin="round"/>
            <path d="M8 8V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V8" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="14" r="1.5" fill="#059669"/>
          </svg>
        </view>
        <text class="menu-name chinese-font">碳积分商城</text>
        <svg class="item-arrow" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4.5L13 10L7.5 15.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <view class="item-divider"></view>

      <!-- 菜单 4：设置 -->
      <view class="menu-item" @click="goTo('/pages/userCenter/loginLog')">
        <view class="menu-icon-box icon-slate">
          <!-- 纯矢量齿轮设置 SVG 图标 -->
          <svg class="menu-svg" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3" stroke="#64748B" stroke-width="2"/>
            <path d="M19.4 15A1.65 1.65 0 0 0 20 16.27L20.09 16.36A2 2 0 0 1 18.67 19.8L18.49 19.7A1.65 1.65 0 0 0 16.8 19.92A1.65 1.65 0 0 0 16.1 21.36V21.6A2 2 0 0 1 12.1 21.6V21.36A1.65 1.65 0 0 0 11.4 19.92A1.65 1.65 0 0 0 9.71 19.7L9.53 19.8A2 2 0 0 1 8.11 16.36L8.2 16.27A1.65 1.65 0 0 0 8.8 15A1.65 1.65 0 0 0 7.36 14.3H7.12A2 2 0 0 1 7.12 10.3H7.36A1.65 1.65 0 0 0 8.8 9.6A1.65 1.65 0 0 0 8.2 8.13L8.11 8.04A2 2 0 0 1 9.53 4.6L9.71 4.7A1.65 1.65 0 0 0 11.4 4.48A1.65 1.65 0 0 0 12.1 3.04V2.8A2 2 0 0 1 16.1 2.8V3.04A1.65 1.65 0 0 0 16.8 4.48A1.65 1.65 0 0 0 18.49 4.7L18.67 4.6A2 2 0 0 1 20.09 8.04L20 8.13A1.65 1.65 0 0 0 19.4 9.6A1.65 1.65 0 0 0 20.84 10.3H21.08A2 2 0 0 1 21.08 14.3H20.84A1.65 1.65 0 0 0 19.4 15Z" stroke="#64748B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="menu-name chinese-font">设置</text>
        <svg class="item-arrow" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4.5L13 10L7.5 15.5" stroke="#CBD5E1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
    </view>

    <!-- 5. 退出当前账号按钮 -->
    <view class="logout-wrapper">
      <button class="logout-btn chinese-font" @click="handleLogout">
        退出当前账号
      </button>
    </view>

    <!-- 底部防遮挡垫高 -->
    <view class="bottom-spacer-for-tabbar"></view>

    <!-- 6. 底部悬浮胶囊式 Tab 栏 (与首页完全同构一致，当前激活：我的) -->
    <view class="floating-capsule-tabbar">
      <!-- Tab 1: 今天 -->
      <view class="tab-item" :class="{ 'tab-active': currentTab === 'today' }" @click="switchTabItem('today')">
        <view class="tab-icon-wrap">
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none">
            <rect x="3" y="4" width="18" height="17" rx="3" stroke="currentColor" stroke-width="2"/>
            <path d="M16 2V5M8 2V5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <path d="M3 9H21" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="14.5" r="2" fill="currentColor"/>
          </svg>
        </view>
        <text class="tab-text">今天</text>
      </view>

      <!-- Tab 2: 行动 (申报打卡) -->
      <view class="tab-item" :class="{ 'tab-active': currentTab === 'action' }" @click="switchTabItem('action')">
        <view class="tab-icon-wrap">
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="tab-text">行动</text>
      </view>

      <!-- Tab 3: 目标 (排行榜 / 统计) -->
      <view class="tab-item" :class="{ 'tab-active': currentTab === 'target' }" @click="switchTabItem('target')">
        <view class="tab-icon-wrap">
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="5" stroke="currentColor" stroke-width="2"/>
            <circle cx="12" cy="12" r="1.5" fill="currentColor"/>
          </svg>
        </view>
        <text class="tab-text">目标</text>
      </view>

      <!-- Tab 4: 我的 (当前激活) -->
      <view class="tab-item" :class="{ 'tab-active': currentTab === 'mine' }" @click="switchTabItem('mine')">
        <view class="tab-icon-wrap">
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none">
            <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="currentColor" stroke-width="2"/>
          </svg>
        </view>
        <text class="tab-text">我的</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/api/request.js'

const userInfo = ref({
  username: '',
  role: 'user',
  avatar_url: ''
})

const stats = ref({
  total_points: 25.3,
  total_km: 88.5,
  rank: '低碳达人',
  weekly_reduction: 16,
  checkin_days: 35,
  medals_count: 12,
  active_days: 135,
  trees_saved: 6
})

const formatPoints = (val) => {
  if (val === undefined || val === null) return '25.3'
  const num = Number(val)
  if (isNaN(num)) return '25.3'
  if (num >= 100000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toFixed(1)
}

const formatNumber = (val, defaultVal = 0) => {
  if (val === undefined || val === null) return defaultVal
  const num = Number(val)
  if (isNaN(num)) return defaultVal
  if (num >= 100000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num
}

const loadUserData = async () => {
  try {
    const userRes = await request({ url: '/user/me', method: 'GET' })
    if (userRes && userRes.user_info) {
      userInfo.value = userRes.user_info
    }
  } catch (err) {
    console.warn('获取用户信息失败，使用默认值:', err)
  }

  try {
    const statsRes = await request({ url: '/user/my_stats', method: 'GET' })
    if (statsRes && statsRes.data) {
      stats.value = {
        ...stats.value,
        ...statsRes.data
      }
    }
  } catch (err) {
    console.warn('获取用户碳统计失败，使用默认值:', err)
  }
}

const currentTab = ref('mine')

onShow(() => {
  currentTab.value = 'mine'
  uni.hideTabBar({ animation: false })
  loadUserData()
})

// 底部悬浮胶囊 TabBar 切换逻辑 (与首页完全同构一致)
const switchTabItem = (tabKey) => {
  currentTab.value = tabKey
  const tabMap = {
    today: '/pages/index/index',
    action: '/pages/record/add',
    target: '/pages/userCenter/rank',
    mine: '/pages/userCenter/index'
  }
  const url = tabMap[tabKey]
  if (url) {
    if (tabKey === 'mine') {
      uni.pageScrollTo({ scrollTop: 0, duration: 200 })
      return
    }
    uni.switchTab({
      url,
      fail: () => {
        uni.navigateTo({ url })
      }
    })
  }
}

const goTo = (url) => {
  uni.switchTab({
    url,
    fail: () => {
      uni.navigateTo({ url })
    }
  })
}

const handleCheckinTip = () => {
  uni.showToast({
    title: `已连续打卡 ${stats.value.checkin_days || 35} 天，继续保持！`,
    icon: 'none'
  })
}

const handleLogout = () => {
  uni.showModal({
    title: '退出登录',
    content: '确定要退出当前账号并返回登录页吗？',
    confirmColor: '#10B981',
    cancelColor: '#9CA3AF',
    success: (res) => {
      if (res.confirm) {
        uni.removeStorageSync('token')
        uni.removeStorageSync('user_role')
        uni.reLaunch({
          url: '/pages/auth/login'
        })
      }
    }
  })
}
</script>

<style>
/* 1. 引入 OutfitBold 英文与数字字体 */
@font-face {
  font-family: 'OutfitBold';
  src: url('/static/fonts/Outfit-Black.ttf') format('truetype');
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
}

/* 2. 引入阿里巴巴普惠体 (官方全渠道免费商用) */
@font-face {
  font-family: 'AlibabaPuHuiTi';
  src: url('/static/fonts/AlibabaPuHuiTi-Bold.woff2') format('woff2');
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
}

/* 严格字体规范约束 */
.chinese-font {
  font-family: 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}

.num-font {
  font-family: 'OutfitBold', sans-serif !important;
}

/* 页面主容器 */
.user-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #E6F7F0 0%, #F5FAF7 28%, #F8FAF9 100%);
  padding-bottom: 50px;
  box-sizing: border-box;
}

/* 状态栏安全高度占位 */
.status-bar-placeholder {
  height: 48px;
  height: calc(44px + env(safe-area-inset-top));
}

/* ================= 1. 用户头部信息 ================= */
.profile-header {
  display: flex;
  align-items: center;
  padding: 8px 22px 14px;
}

.profile-avatar-box {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  border: 2.5px solid #FFFFFF;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.12);
  overflow: hidden;
  background: #E6F7F0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.avatar-img {
  width: 100%;
  height: 100%;
}

.profile-info {
  margin-left: 14px;
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 20px;
  font-weight: 700;
  color: #111827;
  line-height: 1.25;
}

.profile-sub {
  font-size: 13px;
  color: #64748B;
  margin-top: 5px;
  line-height: 1.2;
}

.highlight-days {
  color: #10B981;
  font-weight: 700;
  margin: 0 2px;
}

/* ================= 2. Hero 减碳大卡片 ================= */
.hero-card {
  position: relative;
  margin: 10px 16px 18px;
  border-radius: 24px;
  background: linear-gradient(135deg, #34D399 0%, #20C997 42%, #10B981 100%);
  box-shadow: 0 10px 28px -6px rgba(16, 185, 129, 0.38), 0 4px 12px -2px rgba(16, 185, 129, 0.16);
  padding: 24px 20px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
}

/* 柔光光斑 */
.hero-glow {
  position: absolute;
  top: -40px;
  right: -30px;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
}

.hero-left {
  display: flex;
  flex-direction: column;
  z-index: 2;
  flex: 1;
}

.hero-label {
  font-size: 15px;
  color: rgba(255, 255, 255, 0.94);
  font-weight: 500;
  letter-spacing: 0.3px;
}

.hero-value-row {
  display: flex;
  align-items: baseline;
  margin-top: 6px;
  margin-bottom: 12px;
}

.hero-num {
  font-size: 40px;
  line-height: 1;
  font-weight: 900;
  color: #FFFFFF;
  text-shadow: 0 2px 8px rgba(6, 78, 59, 0.15);
}

.hero-unit {
  font-size: 17px;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.95);
  margin-left: 5px;
}

.hero-badge {
  background: rgba(255, 255, 255, 0.22);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  border-radius: 20px;
  padding: 4px 12px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  width: fit-content;
  border: 0.5px solid rgba(255, 255, 255, 0.35);
}

.tree-svg {
  width: 13px;
  height: 13px;
  flex-shrink: 0;
}

.hero-badge-text {
  font-size: 12px;
  color: #FFFFFF;
  font-weight: 500;
}

.hero-right {
  position: relative;
  width: 135px;
  height: 135px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 2;
  margin-right: -6px;
}

.hero-bulb-img {
  width: 145px;
  height: 145px;
  animation: floatBulb 4s ease-in-out infinite;
}

@keyframes floatBulb {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-5px) rotate(1.2deg);
  }
}

/* ================= 3. 三栏统计指标卡片 ================= */
.metrics-row {
  display: flex;
  gap: 11px;
  margin: 0 16px 18px;
}

.metric-card {
  flex: 1;
  background: #FFFFFF;
  border-radius: 18px;
  padding: 16px 8px 14px;
  text-align: center;
  box-shadow: 0 3px 14px rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(241, 245, 249, 0.9);
  transition: transform 0.15s ease;
  cursor: pointer;
}

.metric-card:active {
  transform: scale(0.97);
}

.metric-title {
  font-size: 12px;
  color: #64748B;
  font-weight: 500;
  display: block;
}

.metric-val-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 10px;
  gap: 3px;
}

.metric-num-box {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

/* 柔和微型琥珀光斑 (100% 还原参考设计中的微黄底色点) */
.amber-glow-dot {
  position: absolute;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 12px;
  background: #FED7AA;
  border-radius: 50%;
  opacity: 0.8;
  filter: blur(4px);
  pointer-events: none;
  z-index: 1;
}

.metric-val {
  position: relative;
  z-index: 2;
  font-size: 26px;
  font-weight: 800;
  color: #111827;
  line-height: 1;
}

.metric-arrow {
  width: 12px;
  height: 12px;
  margin-left: 2px;
}

/* ================= 4. 功能菜单列表大卡片 ================= */
.menu-card {
  background: #FFFFFF;
  border-radius: 22px;
  margin: 0 16px 20px;
  padding: 4px 18px;
  box-shadow: 0 3px 16px rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(241, 245, 249, 0.9);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 16px 0;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.menu-item:active {
  opacity: 0.75;
}

.menu-icon-box {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.icon-mint {
  background: #ECFDF5;
}

.icon-teal {
  background: #F0FDFA;
}

.icon-emerald {
  background: #ECFDF5;
}

.icon-slate {
  background: #F8FAFC;
}

.menu-svg {
  width: 20px;
  height: 20px;
}

.menu-name {
  flex: 1;
  font-size: 16px;
  font-weight: 600;
  color: #1F2937;
  letter-spacing: 0.2px;
}

.item-arrow {
  width: 16px;
  height: 16px;
}

.item-divider {
  height: 1px;
  background: #F3F4F6;
  width: 100%;
}

/* ================= 5. 退出登录按钮 ================= */
.logout-wrapper {
  margin: 10px 16px 20px;
}

.logout-btn {
  background: #FFFFFF;
  color: #EF4444;
  border-radius: 16px;
  border: 1px solid #FEE2E2;
  font-size: 15px;
  font-weight: 600;
  height: 48px;
  line-height: 48px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.04);
  transition: all 0.2s ease;
}

.logout-btn::after {
  border: none;
}

.logout-btn:active {
  background: #FEF2F2;
  transform: scale(0.99);
}

/* ================= 6. 底部悬浮胶囊式 Tab 栏 ================= */
.bottom-spacer-for-tabbar {
  height: 95px;
}

.floating-capsule-tabbar {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 44px);
  max-width: 410px;
  height: 64px;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border: 1px solid rgba(255, 255, 255, 0.95);
  box-shadow: 
    0 12px 32px rgba(16, 185, 129, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 8px;
  box-sizing: border-box;
  z-index: 999;
}

.tab-item {
  flex: 1;
  height: 48px;
  border-radius: 9999px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
  color: #64748B;
}

.tab-icon-wrap {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.tab-svg {
  width: 19px;
  height: 19px;
}

.tab-text {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.2px;
}

/* 激活态 Tab */
.tab-item.tab-active {
  background: rgba(16, 185, 129, 0.13);
  color: #064E3B;
}

.tab-item.tab-active .tab-text {
  font-weight: 700;
}
</style>