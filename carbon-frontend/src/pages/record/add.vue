<template>
  <view class="record-page-wrapper">
    <!-- 顶部状态栏安全占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 顶部导航栏 -->
    <view class="top-nav-bar">
      <view class="nav-back-btn" @click="handleBack">
        <svg class="back-svg" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="#064E3B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <text class="nav-title chinese-font">绿色申报</text>
      <view class="nav-right-placeholder"></view>
    </view>

    <!-- 核心卡片容器 -->
    <view class="main-content">
      <!-- 头部引导 Hero 卡片 -->
      <view class="hero-banner">
        <view class="hero-banner-content">
          <view class="hero-badge-pill">
            <svg class="pill-sprout-svg" viewBox="0 0 24 24" fill="none">
              <path d="M12 22V12M12 12C12 7.02944 16.0294 3 21 3C21 7.97056 16.9706 12 12 12ZM12 12C12 7.02944 7.97056 3 3 3C3 7.97056 7.02944 12 12 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <text class="pill-text chinese-font">碳减排认证出行</text>
          </view>
          <text class="hero-banner-title chinese-font">申报今日绿色足迹</text>
          <text class="hero-banner-desc chinese-font">输入您的绿色出行里程，系统将依据权威排放因子即时发放减碳积分</text>
        </view>
      </view>

      <!-- 申报表单大卡片 -->
      <view class="form-card">
        <!-- 1. 选择出行方式 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-title chinese-font">选择出行方式</text>
            <text class="section-sub chinese-font">动态排放核算因子</text>
          </view>
          
          <view class="transport-grid">
            <view 
              v-for="item in transportList" 
              :key="item.id"
              class="transport-card"
              :class="{ 'card-active': form.activity_type === item.id }"
              @click="selectTransport(item.id)"
            >
              <!-- 选中对勾小徽章 -->
              <view v-if="form.activity_type === item.id" class="active-check-badge">
                <svg class="check-svg" viewBox="0 0 16 16" fill="none">
                  <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view>

              <!-- 矢量交通工具图标 -->
              <view class="transport-icon-box" :class="'box-' + item.id">
                <svg v-if="item.id === 'bus'" class="transport-svg" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="3" width="16" height="16" rx="3" stroke="currentColor" stroke-width="2"/>
                  <path d="M4 11H20M4 6H20" stroke="currentColor" stroke-width="2"/>
                  <circle cx="7.5" cy="15.5" r="1.5" fill="currentColor"/>
                  <circle cx="16.5" cy="15.5" r="1.5" fill="currentColor"/>
                  <path d="M6 19V21M18 19V21" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>

                <svg v-else-if="item.id === 'subway'" class="transport-svg" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="3" width="14" height="15" rx="4" stroke="currentColor" stroke-width="2"/>
                  <path d="M5 10H19M5 6H19" stroke="currentColor" stroke-width="2"/>
                  <circle cx="8.5" cy="14.5" r="1.5" fill="currentColor"/>
                  <circle cx="15.5" cy="14.5" r="1.5" fill="currentColor"/>
                  <path d="M7 18L4 21M17 18L20 21M10 21H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>

                <svg v-else class="transport-svg" viewBox="0 0 24 24" fill="none">
                  <circle cx="5.5" cy="17.5" r="3.5" stroke="currentColor" stroke-width="2"/>
                  <circle cx="18.5" cy="17.5" r="3.5" stroke="currentColor" stroke-width="2"/>
                  <path d="M15 6L9 6M12 6V11L18.5 17.5M5.5 17.5L9 11L14 11L16 7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </view>

              <text class="transport-name chinese-font">{{ item.name }}</text>
              <text class="transport-factor num-font">+{{ item.factor }} 分/km</text>
            </view>
          </view>
        </view>

        <!-- 2. 行程距离输入 -->
        <view class="form-section">
          <view class="section-header">
            <text class="section-title chinese-font">行程距离</text>
            <text class="section-tip chinese-font">支持单日多段多次申报</text>
          </view>

          <!-- 距离主输入框 -->
          <view class="distance-input-box">
            <input 
              class="distance-input num-font" 
              type="digit" 
              v-model="form.value" 
              placeholder="0.0" 
              placeholder-class="placeholder-text"
              maxlength="6"
            />
            <text class="distance-unit num-font">km</text>
          </view>

          <!-- 快捷里程轻触胶囊 -->
          <view class="quick-chips-row">
            <view 
              v-for="chip in quickDistances" 
              :key="chip"
              class="quick-chip"
              :class="{ 'chip-active': String(form.value) === String(chip) }"
              @click="setQuickDistance(chip)"
            >
              <text class="chip-text num-font">{{ chip }} km</text>
            </view>
          </view>
        </view>

        <!-- 3. 预估碳积分与减碳成果即时展示 -->
        <view class="estimate-result-card" :class="{ 'has-value': estimatedPoints > 0 }">
          <view class="estimate-left">
            <text class="estimate-label chinese-font">预计获得碳积分</text>
            <view class="estimate-num-row">
              <text class="estimate-plus num-font">+</text>
              <text class="estimate-val num-font">{{ estimatedPoints }}</text>
              <text class="estimate-unit chinese-font">分</text>
            </view>
          </view>
          <view class="estimate-right">
            <view class="co2-pill">
              <svg class="co2-leaf-svg" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z" stroke="#10B981" stroke-width="2"/>
                <path d="M8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12C16 14.2091 14.2091 16 12 16" stroke="#10B981" stroke-width="2" stroke-linecap="round"/>
              </svg>
              <text class="co2-text chinese-font">减碳 {{ estimatedCo2 }} kg</text>
            </view>
          </view>
        </view>

        <!-- 4. 提交按钮 -->
        <button 
          class="submit-action-btn chinese-font" 
          :disabled="loading || !isValidDistance"
          :class="{ 'btn-disabled': !isValidDistance }"
          @click="handleSubmit"
        >
          <text v-if="!loading">确认申报并领取积分</text>
          <text v-else>正在核算入库...</text>
        </button>
      </view>

      <!-- 底部防遮挡占位 -->
      <view class="bottom-spacer-for-tabbar"></view>
    </view>

    <!-- 底部悬浮胶囊式 Tab 栏 -->
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

      <!-- Tab 2: 行动 (当前激活) -->
      <view class="tab-item" :class="{ 'tab-active': currentTab === 'action' }" @click="switchTabItem('action')">
        <view class="tab-icon-wrap">
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="tab-text">行动</text>
      </view>

      <!-- Tab 3: 目标 (排行榜) -->
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

      <!-- Tab 4: 我的 -->
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
import { ref, reactive, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/api/request.js'

// 当前激活的底部 Tab
const currentTab = ref('action')

onShow(() => {
  currentTab.value = 'action'
  uni.hideTabBar({ animation: false })
})

// 底部悬浮胶囊 TabBar 切换逻辑
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
    if (tabKey === 'action') {
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

// 出行方式字典与实时因子（与后端 rules 严格对应）
const transportList = [
  { id: 'bus', name: '公共汽车', factor: 2.65 },
  { id: 'subway', name: '城市轨道', factor: 6.48 },
  { id: 'bicycle', name: '绿色骑行', factor: 9.28 }
]

const form = reactive({
  activity_type: 'subway',
  value: ''
})

const loading = ref(false)
const quickDistances = [3, 5, 10, 20]

// 选中交通方式
const selectTransport = (id) => {
  form.activity_type = id
}

// 快速填入公里数
const setQuickDistance = (val) => {
  form.value = String(val)
}

// 当前出行因子的换算
const currentFactor = computed(() => {
  const target = transportList.find(t => t.id === form.activity_type)
  return target ? target.factor : 2.65
})

// 预估碳积分
const estimatedPoints = computed(() => {
  const km = parseFloat(form.value)
  if (isNaN(km) || km <= 0) return '0.0'
  return (km * currentFactor.value).toFixed(1)
})

// 预估减碳量 (kg)
const estimatedCo2 = computed(() => {
  const km = parseFloat(form.value)
  if (isNaN(km) || km <= 0) return '0.00'
  // 按照行业标准，每公里平均减排约 0.15~0.25 kg
  const factorKg = form.activity_type === 'bicycle' ? 0.25 : (form.activity_type === 'subway' ? 0.18 : 0.12)
  return (km * factorKg).toFixed(2)
})

// 表单合法性
const isValidDistance = computed(() => {
  const km = parseFloat(form.value)
  return !isNaN(km) && km > 0 && km <= 1000
})

// 返回上一页或主页
const handleBack = () => {
  const pages = getCurrentPages()
  if (pages && pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}

// 提交绿色申报
const handleSubmit = async () => {
  if (!isValidDistance.value) {
    return uni.showToast({
      title: '请输入有效的行程公里数',
      icon: 'none'
    })
  }

  loading.value = true
  try {
    const res = await request({
      url: '/user/record',
      method: 'POST',
      data: {
        activity_type: form.activity_type,
        value: parseFloat(form.value)
      }
    })

    if (res && res.code === 200) {
      const earned = res.data?.points ?? res.data?.points_earned ?? estimatedPoints.value
      uni.showModal({
        title: '绿色申报成功',
        content: `恭喜！本次行程核算发放 ${earned} 碳积分，已存入您的个人碳账户。`,
        confirmText: '查看足迹',
        cancelText: '继续申报',
        confirmColor: '#10B981',
        cancelColor: '#6B7280',
        success: (modalRes) => {
          if (modalRes.confirm) {
            uni.switchTab({ url: '/pages/index/index' })
          } else {
            form.value = ''
          }
        }
      })
    } else {
      uni.showToast({
        title: res?.message || '申报提交未成功',
        icon: 'none'
      })
    }
  } catch (err) {
    uni.showToast({
      title: err?.detail || '网络连接繁忙，请稍后再试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
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

.chinese-font {
  font-family: 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}

.num-font {
  font-family: 'OutfitBold', sans-serif !important;
}

/* 页面容器 */
.record-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #E6F7F0 0%, #F5FAF7 25%, #F8FAF9 100%);
  padding-bottom: 40px;
  box-sizing: border-box;
}

/* 状态栏安全高度占位 */
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

/* 主内容区 */
.main-content {
  padding: 10px 16px;
}

/* 头部引导 Hero 卡片 */
.hero-banner {
  background: linear-gradient(135deg, #ECFDF5 0%, #E6F7F0 100%);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 20px;
  padding: 18px 18px;
  margin-bottom: 16px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.05);
}

.hero-badge-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 3px 10px;
  box-shadow: 0 2px 6px rgba(16, 185, 129, 0.08);
  margin-bottom: 8px;
}

.pill-sprout-svg {
  width: 14px;
  height: 14px;
}

.pill-text {
  font-size: 11px;
  color: #059669;
  font-weight: 600;
}

.hero-banner-title {
  display: block;
  font-size: 18px;
  font-weight: 700;
  color: #064E3B;
  margin-bottom: 4px;
}

.hero-banner-desc {
  display: block;
  font-size: 12px;
  color: #64748B;
  line-height: 1.5;
}

/* 表单卡片 */
.form-card {
  background: #FFFFFF;
  border-radius: 24px;
  padding: 22px 18px 26px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
  border: 1px solid rgba(229, 231, 235, 0.5);
}

.form-section {
  margin-bottom: 22px;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.section-title {
  font-size: 15px;
  font-weight: 700;
  color: #1F2937;
}

.section-sub, .section-tip {
  font-size: 12px;
  color: #94A3B8;
}

/* 交通方式网格 */
.transport-grid {
  display: flex;
  gap: 10px;
}

.transport-card {
  position: relative;
  flex: 1;
  background: #F8FAF9;
  border-radius: 16px;
  border: 1.5px solid #F1F5F3;
  padding: 16px 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
}

.transport-card.card-active {
  background: #ECFDF5;
  border-color: #10B981;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.15);
}

.active-check-badge {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #10B981;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-svg {
  width: 10px;
  height: 10px;
}

.transport-icon-box {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: #FFFFFF;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #64748B;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.card-active .transport-icon-box {
  color: #10B981;
  background: #FFFFFF;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.18);
}

.transport-svg {
  width: 24px;
  height: 24px;
}

.transport-name {
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
  margin-bottom: 2px;
}

.transport-factor {
  font-size: 11px;
  color: #059669;
  font-weight: 600;
}

/* 里程输入框 */
.distance-input-box {
  background: #F8FAF9;
  border: 1.5px solid #E2E8F0;
  border-radius: 18px;
  height: 62px;
  padding: 0 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.2s ease;
}

.distance-input-box:focus-within {
  border-color: #10B981;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.distance-input {
  flex: 1;
  font-size: 32px;
  color: #111827;
  font-weight: 800;
  height: 100%;
}

.placeholder-text {
  color: #CBD5E1;
  font-size: 28px;
}

.distance-unit {
  font-size: 20px;
  color: #64748B;
  font-weight: 700;
  margin-left: 8px;
}

/* 快捷里程胶囊 */
.quick-chips-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.quick-chip {
  flex: 1;
  height: 36px;
  border-radius: 10px;
  background: #F1F5F9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.quick-chip.chip-active {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid #10B981;
}

.chip-text {
  font-size: 13px;
  font-weight: 600;
  color: #475569;
}

.chip-active .chip-text {
  color: #064E3B;
  font-weight: 700;
}

/* 预估成果卡片 */
.estimate-result-card {
  background: linear-gradient(135deg, #F0FDF4 0%, #ECFDF5 100%);
  border: 1px dashed rgba(16, 185, 129, 0.4);
  border-radius: 18px;
  padding: 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.estimate-label {
  font-size: 12px;
  color: #059669;
  font-weight: 600;
  display: block;
}

.estimate-num-row {
  display: flex;
  align-items: baseline;
  margin-top: 4px;
}

.estimate-plus {
  font-size: 20px;
  color: #10B981;
  font-weight: 800;
  margin-right: 2px;
}

.estimate-val {
  font-size: 32px;
  line-height: 1;
  color: #064E3B;
  font-weight: 900;
}

.estimate-unit {
  font-size: 14px;
  color: #059669;
  font-weight: 600;
  margin-left: 4px;
}

.co2-pill {
  display: flex;
  align-items: center;
  gap: 5px;
  background: rgba(255, 255, 255, 0.9);
  padding: 6px 12px;
  border-radius: 20px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
}

.co2-leaf-svg {
  width: 14px;
  height: 14px;
}

.co2-text {
  font-size: 12px;
  color: #064E3B;
  font-weight: 600;
}

/* 提交按钮 */
.submit-action-btn {
  height: 52px;
  line-height: 52px;
  border-radius: 16px;
  background: linear-gradient(135deg, #34D399 0%, #10B981 100%);
  color: #FFFFFF;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  box-shadow: 0 8px 20px -4px rgba(16, 185, 129, 0.4);
  border: none;
  transition: all 0.2s ease;
}

.submit-action-btn::after {
  border: none;
}

.submit-action-btn:active {
  transform: scale(0.985);
  box-shadow: 0 4px 12px -2px rgba(16, 185, 129, 0.3);
}

.btn-disabled {
  background: #CBD5E1 !important;
  box-shadow: none !important;
  color: #94A3B8 !important;
}

/* 隐藏原生 uni-tabbar 节点 */
::v-deep uni-tabbar {
  display: none !important;
}

/* 底部防遮挡占位 */
.bottom-spacer-for-tabbar {
  height: 96px;
  height: calc(96px + env(safe-area-inset-bottom));
}

/* 底部悬浮胶囊式 Tab 栏 */
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