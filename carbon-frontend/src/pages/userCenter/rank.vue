<template>
  <view class="rank-page-wrapper">
    <!-- 顶部状态栏安全占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 顶部导航栏 -->
    <view class="top-nav-bar">
      <view class="nav-back-btn" @click="handleBack">
        <svg class="back-svg" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="#064E3B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <text class="nav-title chinese-font">低碳先锋榜</text>
      <view class="nav-right-placeholder"></view>
    </view>

    <!-- 页面主体内容滚动区 -->
    <scroll-view scroll-y class="rank-scroll-view">
      <!-- 头部大标题与说明 -->
      <view class="rank-header-card">
        <view class="header-pill">
          <svg class="pill-sparkle-svg" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#F59E0B"/>
          </svg>
          <text class="pill-title chinese-font">全站实时低碳贡献</text>
        </view>
        <text class="header-main-title chinese-font">绿行减碳影响力排行</text>
        <text class="header-desc chinese-font">每一份低碳出行都在汇聚成守护绿水青山的力量</text>
      </view>

      <!-- 前三名立体领奖台 (Top 3 Podium) -->
      <view class="podium-section" v-if="podiumList.length > 0">
        <!-- 亚军 (No. 2 - 左侧) -->
        <view class="podium-column column-second" v-if="podiumList[1]">
          <view class="podium-avatar-wrap silver-aura">
            <image 
              class="podium-avatar" 
              :src="podiumList[1].avatar_url || '/static/default_avatar.png'" 
              mode="aspectFill"
            />
            <view class="podium-rank-badge silver-badge">
              <text class="rank-badge-text num-font">2</text>
            </view>
          </view>
          <text class="podium-user-name chinese-font">{{ podiumList[1].username }}</text>
          <view class="podium-step step-second">
            <text class="podium-step-tag num-font">No.2</text>
            <view class="podium-score-row">
              <text class="score-num num-font">{{ formatScore(podiumList[1].total_points) }}</text>
              <text class="score-unit chinese-font">分</text>
            </view>
          </view>
        </view>

        <!-- 冠军 (No. 1 - 居中核心位置) -->
        <view class="podium-column column-first" v-if="podiumList[0]">
          <!-- 金色皇冠 SVG -->
          <view class="crown-box">
            <svg class="crown-svg" viewBox="0 0 24 24" fill="none">
              <path d="M2 19H22V21H2V19ZM3.5 17L2 7L7.5 11L12 4L16.5 11L22 7L20.5 17H3.5Z" fill="#F59E0B"/>
              <circle cx="12" cy="4" r="1.5" fill="#FEF3C7"/>
              <circle cx="2" cy="7" r="1" fill="#FEF3C7"/>
              <circle cx="22" cy="7" r="1" fill="#FEF3C7"/>
            </svg>
          </view>

          <view class="podium-avatar-wrap gold-aura">
            <image 
              class="podium-avatar avatar-first" 
              :src="podiumList[0].avatar_url || '/static/default_avatar.png'" 
              mode="aspectFill"
            />
            <view class="podium-rank-badge gold-badge">
              <text class="rank-badge-text num-font">1</text>
            </view>
          </view>
          <text class="podium-user-name name-first chinese-font">{{ podiumList[0].username }}</text>
          <view class="podium-step step-first">
            <text class="podium-step-tag num-font">No.1</text>
            <view class="podium-score-row">
              <text class="score-num num-font">{{ formatScore(podiumList[0].total_points) }}</text>
              <text class="score-unit chinese-font">分</text>
            </view>
          </view>
        </view>

        <!-- 季军 (No. 3 - 右侧) -->
        <view class="podium-column column-third" v-if="podiumList[2]">
          <view class="podium-avatar-wrap bronze-aura">
            <image 
              class="podium-avatar" 
              :src="podiumList[2].avatar_url || '/static/default_avatar.png'" 
              mode="aspectFill"
            />
            <view class="podium-rank-badge bronze-badge">
              <text class="rank-badge-text num-font">3</text>
            </view>
          </view>
          <text class="podium-user-name chinese-font">{{ podiumList[2].username }}</text>
          <view class="podium-step step-third">
            <text class="podium-step-tag num-font">No.3</text>
            <view class="podium-score-row">
              <text class="score-num num-font">{{ formatScore(podiumList[2].total_points) }}</text>
              <text class="score-unit chinese-font">分</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 4名及以后排行榜列表卡片 -->
      <view class="rank-list-card" v-if="restList.length > 0">
        <view class="list-card-header">
          <text class="list-card-title chinese-font">先锋榜单</text>
          <text class="list-card-tip chinese-font">每 10 分钟动态结算</text>
        </view>

        <view class="rank-list-items">
          <view 
            class="rank-row-item" 
            v-for="(item, index) in restList" 
            :key="item.username"
            :class="{ 'row-is-me': item.username === myUsername }"
          >
            <!-- 排名数字 -->
            <view class="rank-index-box">
              <text class="rank-index-num num-font">{{ index + 4 }}</text>
            </view>

            <!-- 用户头像 -->
            <view class="rank-user-avatar-wrap">
              <image 
                class="rank-user-avatar" 
                :src="item.avatar_url || '/static/default_avatar.png'" 
                mode="aspectFill"
              />
            </view>

            <!-- 用户信息 -->
            <view class="rank-user-info">
              <view class="name-badge-row">
                <text class="rank-user-name chinese-font">{{ item.username }}</text>
                <view v-if="item.username === myUsername" class="me-tag chinese-font">我</view>
              </view>
              <text class="rank-activity-desc chinese-font">累计绿色出行 {{ item.activity_count || 1 }} 次</text>
            </view>

            <!-- 碳积分分值 -->
            <view class="rank-score-wrap">
              <text class="rank-score-val num-font">{{ formatScore(item.total_points) }}</text>
              <text class="rank-score-sub chinese-font">积分</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 底部安全间隙，防止遮挡粘性个人条 -->
      <view class="bottom-spacer-for-sticky"></view>
    </scroll-view>

    <!-- 底部固定吸底：当前登录用户个人排名条 (悬浮在 TabBar 上方) -->
    <view class="my-sticky-rank-bar">
      <view class="my-bar-left">
        <view class="my-avatar-box">
          <image class="my-avatar-img" :src="myUserInfo.avatar_url || '/static/default_avatar.png'" mode="aspectFill" />
        </view>
        <view class="my-info-text">
          <text class="my-name chinese-font">{{ myUsername || '我' }}</text>
          <text class="my-rank-pos chinese-font">全站排名：<text class="num-font my-rank-num">{{ myRankDisplay }}</text></text>
        </view>
      </view>
      <view class="my-bar-right">
        <text class="my-points-val num-font">{{ formatScore(myTotalPoints) }}</text>
        <text class="my-points-label chinese-font">积分</text>
      </view>
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

      <!-- Tab 2: 行动 -->
      <view class="tab-item" :class="{ 'tab-active': currentTab === 'action' }" @click="switchTabItem('action')">
        <view class="tab-icon-wrap">
          <svg class="tab-svg" viewBox="0 0 24 24" fill="none">
            <path d="M13 2L4 14H12L11 22L20 10H12L13 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </view>
        <text class="tab-text">行动</text>
      </view>

      <!-- Tab 3: 目标 (当前激活) -->
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
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/api/request.js'

// 当前激活的底部 Tab
const currentTab = ref('target')

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
    if (tabKey === 'target') {
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

const rankList = ref([])
const myUserInfo = ref({})
const myTotalPoints = ref(0)
const myUsername = ref('')

// 提取前三名
const podiumList = computed(() => {
  return rankList.value.slice(0, 3)
})

// 提取第四名及之后
const restList = computed(() => {
  return rankList.value.slice(3)
})

// 计算我的排名展示
const myRankDisplay = computed(() => {
  if (!myUsername.value) return 'No. --'
  const foundIndex = rankList.value.findIndex(item => item.username === myUsername.value)
  if (foundIndex !== -1) {
    return `No. ${foundIndex + 1}`
  }
  return '未入榜 (需更多申报)'
})

// 数值格式化
const formatScore = (val) => {
  if (val === undefined || val === null) return '0.0'
  const num = Number(val)
  if (isNaN(num)) return '0.0'
  if (num >= 100000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  return num.toLocaleString()
}

// 返回主页或上一页
const handleBack = () => {
  const pages = getCurrentPages()
  if (pages && pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({ url: '/pages/index/index' })
  }
}

// 加载排行榜数据和当前用户信息
const fetchRankData = async () => {
  try {
    const userRes = await request({ url: '/user/me', method: 'GET', silent: true })
    if (userRes && userRes.user_info) {
      myUserInfo.value = userRes.user_info
      myUsername.value = userRes.user_info.username
    }
  } catch (err) {
    console.warn('获取当前用户失败:', err)
  }

  try {
    const statsRes = await request({ url: '/user/my_stats', method: 'GET', silent: true })
    if (statsRes && statsRes.data) {
      myTotalPoints.value = statsRes.data.total_points
    }
  } catch (err) {
    console.warn('获取用户积分失败:', err)
  }

  try {
    const res = await request({ url: '/rank/top', method: 'GET' })
    if (res && res.code === 200 && res.data) {
      rankList.value = res.data
    }
  } catch (err) {
    console.error('排行榜数据拉取失败:', err)
  }
}

onShow(() => {
  currentTab.value = 'target'
  uni.hideTabBar({ animation: false })
  fetchRankData()
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
.rank-page-wrapper {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #E6F7F0 0%, #F5FAF7 25%, #F8FAF9 100%);
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

/* 滚动区域 */
.rank-scroll-view {
  flex: 1;
  padding: 8px 16px;
  box-sizing: border-box;
}

/* 头部卡片 */
.rank-header-card {
  text-align: center;
  padding: 14px 10px 10px;
}

.header-pill {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  background: #FFFFFF;
  border-radius: 20px;
  padding: 4px 12px;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.08);
  margin-bottom: 8px;
}

.pill-sparkle-svg {
  width: 14px;
  height: 14px;
}

.pill-title {
  font-size: 11px;
  color: #064E3B;
  font-weight: 600;
}

.header-main-title {
  display: block;
  font-size: 22px;
  font-weight: 800;
  color: #064E3B;
  margin-bottom: 5px;
}

.header-desc {
  display: block;
  font-size: 12px;
  color: #64748B;
}

/* ================= 领奖台 (Top 3 Podium) ================= */
.podium-section {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 12px;
  margin: 20px 0 24px;
  padding: 0 6px;
}

.podium-column {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

/* 皇冠 */
.crown-box {
  margin-bottom: 2px;
  animation: bounceCrown 2.5s ease-in-out infinite;
}

.crown-svg {
  width: 28px;
  height: 28px;
}

@keyframes bounceCrown {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

/* 头像外光环 */
.podium-avatar-wrap {
  position: relative;
  border-radius: 50%;
  padding: 3px;
  background: #FFFFFF;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.08);
}

.gold-aura {
  border: 2.5px solid #F59E0B;
  box-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
}

.silver-aura {
  border: 2.5px solid #94A3B8;
  box-shadow: 0 0 12px rgba(148, 163, 184, 0.25);
}

.bronze-aura {
  border: 2.5px solid #F97316;
  box-shadow: 0 0 12px rgba(249, 115, 22, 0.25);
}

.podium-avatar {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  display: block;
}

.avatar-first {
  width: 66px;
  height: 66px;
}

/* 排名小标签 */
.podium-rank-badge {
  position: absolute;
  bottom: -4px;
  left: 50%;
  transform: translateX(-50%);
  width: 18px;
  height: 18px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid #FFFFFF;
}

.gold-badge { background: #F59E0B; }
.silver-badge { background: #94A3B8; }
.bronze-badge { background: #F97316; }

.rank-badge-text {
  font-size: 11px;
  color: #FFFFFF;
  font-weight: 800;
  line-height: 1;
}

.podium-user-name {
  font-size: 13px;
  font-weight: 600;
  color: #1F2937;
  margin-top: 8px;
  margin-bottom: 6px;
  max-width: 85px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.name-first {
  font-size: 14px;
  font-weight: 700;
  color: #064E3B;
}

/* 领奖台阶台柱 */
.podium-step {
  width: 100%;
  border-radius: 16px 16px 8px 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.step-first {
  height: 100px;
  background: linear-gradient(180deg, #FEF3C7 0%, #FDE68A 100%);
  border: 1.5px solid rgba(245, 158, 11, 0.4);
}

.step-second {
  height: 78px;
  background: linear-gradient(180deg, #F1F5F9 0%, #E2E8F0 100%);
  border: 1.5px solid rgba(148, 163, 184, 0.3);
}

.step-third {
  height: 66px;
  background: linear-gradient(180deg, #FFEDD5 0%, #FED7AA 100%);
  border: 1.5px solid rgba(249, 115, 22, 0.3);
}

.podium-step-tag {
  font-size: 12px;
  font-weight: 800;
  color: #64748B;
  margin-bottom: 2px;
}

.step-first .podium-step-tag {
  color: #B45309;
}

.podium-score-row {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.score-num {
  font-size: 16px;
  font-weight: 900;
  color: #064E3B;
}

.score-unit {
  font-size: 10px;
  color: #059669;
}

/* ================= 排行榜列表卡片 ================= */
.rank-list-card {
  background: #FFFFFF;
  border-radius: 22px;
  padding: 16px 16px 6px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.025);
  border: 1px solid rgba(241, 245, 249, 0.9);
  margin-bottom: 16px;
}

.list-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 12px;
  border-bottom: 1px solid #F1F5F9;
  margin-bottom: 6px;
}

.list-card-title {
  font-size: 15px;
  font-weight: 700;
  color: #1F2937;
}

.list-card-tip {
  font-size: 11px;
  color: #94A3B8;
}

.rank-row-item {
  display: flex;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #F8FAFC;
  transition: background 0.15s ease;
}

.rank-row-item:last-child {
  border-bottom: none;
}

.row-is-me {
  background: rgba(16, 185, 129, 0.05);
  border-radius: 12px;
  padding: 12px 8px;
}

.rank-index-box {
  width: 28px;
  text-align: center;
}

.rank-index-num {
  font-size: 15px;
  font-weight: 800;
  color: #94A3B8;
}

.rank-user-avatar-wrap {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  margin: 0 12px;
  background: #E6F7F0;
  flex-shrink: 0;
}

.rank-user-avatar {
  width: 100%;
  height: 100%;
}

.rank-user-info {
  flex: 1;
}

.name-badge-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.rank-user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1F2937;
}

.me-tag {
  font-size: 10px;
  color: #10B981;
  background: #ECFDF5;
  border: 0.5px solid #10B981;
  padding: 1px 5px;
  border-radius: 8px;
  font-weight: 700;
}

.rank-activity-desc {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
  display: block;
}

.rank-score-wrap {
  text-align: right;
}

.rank-score-val {
  font-size: 16px;
  font-weight: 800;
  color: #10B981;
  display: block;
  line-height: 1.1;
}

.rank-score-sub {
  font-size: 10px;
  color: #94A3B8;
}

/* 隐藏原生 uni-tabbar 节点 */
::v-deep uni-tabbar {
  display: none !important;
}

.bottom-spacer-for-sticky {
  height: 180px;
  height: calc(180px + env(safe-area-inset-bottom));
}

/* ================= 底部固定吸底：我的排名条 (位于悬浮 TabBar 上方) ================= */
.my-sticky-rank-bar {
  position: fixed;
  bottom: 96px;
  bottom: calc(96px + env(safe-area-inset-bottom));
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 44px);
  max-width: 410px;
  height: 60px;
  background: rgba(255, 255, 255, 0.96);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  border-radius: 18px;
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 
    0 8px 24px rgba(6, 78, 59, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  box-sizing: border-box;
  z-index: 990;
}

.my-bar-left {
  display: flex;
  align-items: center;
}

.my-avatar-box {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #10B981;
  overflow: hidden;
  margin-right: 10px;
  background: #E6F7F0;
}

.my-avatar-img {
  width: 100%;
  height: 100%;
}

.my-name {
  font-size: 14px;
  font-weight: 700;
  color: #111827;
  display: block;
}

.my-rank-pos {
  font-size: 11px;
  color: #64748B;
  margin-top: 1px;
  display: block;
}

.my-rank-num {
  color: #10B981;
  font-weight: 800;
}

.my-bar-right {
  display: flex;
  align-items: baseline;
  gap: 3px;
}

.my-points-val {
  font-size: 22px;
  font-weight: 900;
  color: #064E3B;
}

.my-points-label {
  font-size: 11px;
  color: #059669;
  font-weight: 600;
}

/* ================= 底部悬浮胶囊式 Tab 栏 ================= */
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