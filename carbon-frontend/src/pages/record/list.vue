<template>
  <view class="record-list-page">
    <!-- 顶部状态栏安全占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 顶部导航栏 -->
    <view class="top-nav-bar">
      <view class="nav-back-btn" @click="handleBack">
        <svg class="back-svg" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="#064E3B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <text class="nav-title chinese-font">减碳明细流水</text>
      <view class="nav-right-placeholder"></view>
    </view>

    <!-- 顶部汇总统计卡片 -->
    <view class="summary-hero-card">
      <view class="summary-item">
        <text class="summary-label chinese-font">累计申报记录</text>
        <view class="summary-val-row">
          <text class="summary-val num-font">{{ records.length }}</text>
          <text class="summary-unit chinese-font">笔</text>
        </view>
      </view>
      <view class="summary-divider"></view>
      <view class="summary-item">
        <text class="summary-label chinese-font">累计净发放积分</text>
        <view class="summary-val-row">
          <text class="summary-val num-font">{{ netPoints }}</text>
          <text class="summary-unit chinese-font">分</text>
        </view>
      </view>
    </view>

    <!-- 分类筛选 Tab 栏 -->
    <view class="filter-tab-bar">
      <view 
        v-for="tab in filterTabs" 
        :key="tab.key"
        class="filter-tab-item"
        :class="{ 'filter-active': currentFilter === tab.key }"
        @click="currentFilter = tab.key"
      >
        <text class="filter-tab-text chinese-font">{{ tab.label }}</text>
        <view v-if="currentFilter === tab.key" class="filter-active-line"></view>
      </view>
    </view>

    <!-- 流水列表区 -->
    <view class="records-container">
      <view v-if="filteredRecords.length > 0" class="records-list">
        <view 
          v-for="(item, index) in filteredRecords" 
          :key="index"
          class="record-item-card"
        >
          <!-- 左侧图标 -->
          <view class="record-icon-box" :class="item.carbon_points >= 0 ? 'box-green' : 'box-orange'">
            <!-- 公交 -->
            <svg v-if="item.activity_type === 'bus'" class="record-svg" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="3" width="16" height="16" rx="3" stroke="#10B981" stroke-width="2"/>
              <path d="M4 11H20M4 6H20" stroke="#10B981" stroke-width="2"/>
              <circle cx="7.5" cy="15.5" r="1.5" fill="#10B981"/>
              <circle cx="16.5" cy="15.5" r="1.5" fill="#10B981"/>
            </svg>
            <!-- 地铁 -->
            <svg v-else-if="item.activity_type === 'subway'" class="record-svg" viewBox="0 0 24 24" fill="none">
              <rect x="5" y="3" width="14" height="15" rx="4" stroke="#10B981" stroke-width="2"/>
              <path d="M5 10H19M5 6H19" stroke="#10B981" stroke-width="2"/>
              <circle cx="8.5" cy="14.5" r="1.5" fill="#10B981"/>
              <circle cx="15.5" cy="14.5" r="1.5" fill="#10B981"/>
            </svg>
            <!-- 骑行 -->
            <svg v-else-if="item.activity_type === 'bicycle'" class="record-svg" viewBox="0 0 24 24" fill="none">
              <circle cx="5.5" cy="17.5" r="3.5" stroke="#10B981" stroke-width="2"/>
              <circle cx="18.5" cy="17.5" r="3.5" stroke="#10B981" stroke-width="2"/>
              <path d="M15 6L9 6M12 6V11L18.5 17.5M5.5 17.5L9 11L14 11L16 7" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <!-- 兑换消耗 -->
            <svg v-else class="record-svg" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="8" width="16" height="13" rx="2.5" stroke="#F59E0B" stroke-width="2"/>
              <path d="M8 8V6C8 4.34315 9.34315 3 11 3H13C14.6569 3 16 4.34315 16 6V8" stroke="#F59E0B" stroke-width="2"/>
            </svg>
          </view>

          <!-- 中间详情 -->
          <view class="record-info">
            <view class="info-top-row">
              <text class="record-name chinese-font">{{ formatTypeName(item.activity_type) }}</text>
              <text v-if="item.distance" class="record-distance num-font">{{ item.distance }} km</text>
            </view>
            <text class="record-time num-font">{{ formatTimestamp(item.created_at) }}</text>
          </view>

          <!-- 右侧积分变动 -->
          <view class="record-points" :class="item.carbon_points >= 0 ? 'points-plus' : 'points-minus'">
            <text class="points-symbol num-font">{{ item.carbon_points >= 0 ? '+' : '' }}</text>
            <text class="points-val num-font">{{ formatPoints(item.carbon_points) }}</text>
          </view>
        </view>
      </view>

      <!-- 空状态 -->
      <view v-else class="empty-state-card">
        <view class="empty-icon-circle">
          <svg class="empty-svg" viewBox="0 0 24 24" fill="none">
            <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="empty-title chinese-font">暂无相关流水记录</text>
        <text class="empty-desc chinese-font">进行低碳出行申报或积分兑换后，记录将实时显示在此处</text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { request } from '@/api/request.js'

const records = ref([])
const currentFilter = ref('all')

const filterTabs = [
  { key: 'all', label: '全部' },
  { key: 'travel', label: '绿色出行' },
  { key: 'exchange', label: '商城兑换' }
]

// 净发放积分计算
const netPoints = computed(() => {
  const sum = records.value.reduce((acc, cur) => acc + (cur.carbon_points || 0), 0)
  if (sum >= 100000) return (sum / 10000).toFixed(1) + 'w'
  return sum.toFixed(1)
})

// 筛选后的列表
const filteredRecords = computed(() => {
  if (currentFilter.value === 'all') return records.value
  if (currentFilter.value === 'travel') {
    return records.value.filter(r => r.carbon_points >= 0 && !String(r.activity_type).includes('EXCHANGE'))
  }
  if (currentFilter.value === 'exchange') {
    return records.value.filter(r => r.carbon_points < 0 || String(r.activity_type).includes('EXCHANGE'))
  }
  return records.value
})

const handleBack = () => {
  const pages = getCurrentPages()
  if (pages && pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}

const formatPoints = (val) => {
  if (val === undefined || val === null) return '0.0'
  const num = Number(val)
  if (isNaN(num)) return '0.0'
  if (Math.abs(num) >= 100000) return (num / 10000).toFixed(1) + 'w'
  return num.toFixed(1)
}

const formatTypeName = (type) => {
  if (!type) return '低碳行为'
  if (String(type).includes('EXCHANGE')) return '商城礼品兑换'
  const map = {
    'bus': '乘坐公共汽车',
    'subway': '乘坐城市轨道',
    'bicycle': '低碳绿色骑行'
  }
  return map[type] || type
}

const formatTimestamp = (ts) => {
  if (!ts) return '刚刚'
  try {
    const d = new Date(ts)
    if (isNaN(d.getTime())) return String(ts)
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    const h = String(d.getHours()).padStart(2, '0')
    const min = String(d.getMinutes()).padStart(2, '0')
    return `${y}-${m}-${day} ${h}:${min}`
  } catch (e) {
    return String(ts)
  }
}

onMounted(async () => {
  try {
    const res = await request({ url: '/user/activities', method: 'GET' })
    if (res && res.code === 200 && res.data) {
      records.value = res.data
    }
  } catch (e) {
    console.warn('记录拉取失败:', e)
  }
})
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

.chinese-font {
  font-family: 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}

.num-font {
  font-family: 'OutfitBold', sans-serif !important;
}

/* 页面主容器 */
.record-list-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #E6F7F0 0%, #F5FAF7 25%, #F8FAF9 100%);
  padding-bottom: 40px;
  box-sizing: border-box;
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
  padding: 8px 16px;
  height: 48px;
}

.nav-back-btn {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  cursor: pointer;
}

.back-svg {
  width: 22px;
  height: 22px;
}

.nav-title {
  font-size: 18px;
  font-weight: 700;
  color: #064E3B;
}

.nav-right-placeholder {
  width: 40px;
}

/* 汇总卡片 */
.summary-hero-card {
  background: linear-gradient(135deg, #064E3B 0%, #047857 100%);
  border-radius: 22px;
  margin: 10px 16px 16px;
  padding: 20px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 24px -4px rgba(6, 78, 59, 0.25);
}

.summary-item {
  flex: 1;
}

.summary-label {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.85);
  display: block;
  margin-bottom: 6px;
}

.summary-val-row {
  display: flex;
  align-items: baseline;
}

.summary-val {
  font-size: 28px;
  font-weight: 900;
  color: #FFFFFF;
  line-height: 1;
}

.summary-unit {
  font-size: 13px;
  color: #A7F3D0;
  margin-left: 4px;
}

.summary-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.2);
  margin: 0 18px;
}

/* 分类筛选 Tab 栏 */
.filter-tab-bar {
  display: flex;
  margin: 0 16px 14px;
  background: #FFFFFF;
  border-radius: 14px;
  padding: 4px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.03);
}

.filter-tab-item {
  position: relative;
  flex: 1;
  height: 38px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.2s ease;
}

.filter-tab-item.filter-active {
  background: #ECFDF5;
}

.filter-tab-text {
  font-size: 13px;
  font-weight: 600;
  color: #64748B;
}

.filter-active .filter-tab-text {
  color: #064E3B;
  font-weight: 700;
}

/* 列表区 */
.records-container {
  padding: 0 16px;
}

.records-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.record-item-card {
  background: #FFFFFF;
  border-radius: 18px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(241, 245, 249, 0.9);
}

.record-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.box-green {
  background: #ECFDF5;
}

.box-orange {
  background: #FFFBEB;
}

.record-svg {
  width: 22px;
  height: 22px;
}

.record-info {
  flex: 1;
}

.info-top-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
}

.record-name {
  font-size: 15px;
  font-weight: 600;
  color: #1F2937;
}

.record-distance {
  font-size: 12px;
  color: #10B981;
  background: #ECFDF5;
  padding: 1px 6px;
  border-radius: 6px;
  font-weight: 700;
}

.record-time {
  font-size: 11px;
  color: #94A3B8;
}

.record-points {
  display: flex;
  align-items: baseline;
  text-align: right;
}

.points-plus {
  color: #10B981;
}

.points-minus {
  color: #F59E0B;
}

.points-symbol {
  font-size: 16px;
  font-weight: 800;
}

.points-val {
  font-size: 20px;
  font-weight: 900;
}

/* 空状态卡片 */
.empty-state-card {
  background: #FFFFFF;
  border-radius: 22px;
  padding: 50px 20px;
  text-align: center;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.025);
  margin-top: 10px;
}

.empty-icon-circle {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 16px;
}

.empty-svg {
  width: 30px;
  height: 30px;
}

.empty-title {
  font-size: 16px;
  font-weight: 700;
  color: #334155;
  display: block;
  margin-bottom: 6px;
}

.empty-desc {
  font-size: 12px;
  color: #94A3B8;
  max-width: 260px;
  margin: 0 auto;
  line-height: 1.5;
  display: block;
}
</style>