<template>
  <view class="page-viewport">
    <view class="home-container">
      <!-- 极简半透明棕榈叶脉络背景 (与起始页保持完全一致的视觉生态) -->
      <view class="leaf-bg-wrapper">
        <!-- 左上巨大棕榈叶脉络 -->
        <svg class="palm-leaf leaf-top-left" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="leafGradIdx1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.18" />
              <stop offset="60%" stop-color="#10B981" stop-opacity="0.06" />
              <stop offset="100%" stop-color="#10B981" stop-opacity="0.01" />
            </linearGradient>
            <filter id="glassBlurIdx1" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
          <path d="M 50 580 C 110 420 180 260 320 80" stroke="url(#leafGradIdx1)" stroke-width="3" stroke-linecap="round" filter="url(#glassBlurIdx1)"/>
          <path d="M 90 480 C 40 440 10 390 0 350" stroke="url(#leafGradIdx1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 125 400 C 180 370 230 330 260 270" stroke="url(#leafGradIdx1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 155 330 C 95 300 60 250 45 200" stroke="url(#leafGradIdx1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 195 250 C 255 220 300 180 330 120" stroke="url(#leafGradIdx1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 230 180 C 180 150 145 110 130 60" stroke="url(#leafGradIdx1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 275 125 C 330 100 365 70 385 20" stroke="url(#leafGradIdx1)" stroke-width="1.8" stroke-linecap="round" />
        </svg>

        <!-- 右下巨大棕榈叶脉络 -->
        <svg class="palm-leaf leaf-bottom-right" viewBox="0 0 450 650" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="leafGradIdx2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.14" />
              <stop offset="70%" stop-color="#10B981" stop-opacity="0.04" />
              <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <path d="M 380 50 C 310 220 220 390 70 590" stroke="url(#leafGradIdx2)" stroke-width="2.5" stroke-linecap="round" />
          <path d="M 330 150 C 390 180 430 220 445 270" stroke="url(#leafGradIdx2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 290 230 C 220 260 170 310 140 370" stroke="url(#leafGradIdx2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 245 320 C 315 350 360 400 380 460" stroke="url(#leafGradIdx2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 195 410 C 130 440 90 490 70 550" stroke="url(#leafGradIdx2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 140 500 C 200 530 240 570 260 620" stroke="url(#leafGradIdx2)" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </view>

      <!-- 顶部固定/状态区 (对齐参考图右侧设计) -->
      <view class="top-header-section">
        <!-- 主标题行：大字“今天” (#064E3B) + 右侧 3 个微型胶囊功能按钮 -->
        <view class="header-main-row">
          <text class="page-big-title">今天</text>
          
          <view class="top-action-icons">
            <!-- 手表/设备同步图标 -->
            <view class="icon-circle" @click="handleDeviceSync">
              <svg class="header-svg" viewBox="0 0 24 24" fill="none">
                <rect x="6" y="5" width="12" height="14" rx="4" stroke="#064E3B" stroke-width="2"/>
                <path d="M9 5V2H15V5" stroke="#064E3B" stroke-width="2" stroke-linecap="round"/>
                <path d="M9 19V22H15V19" stroke="#064E3B" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="12" r="1.5" fill="#10B981"/>
              </svg>
            </view>
            <!-- 减碳日历/流水图标 -->
            <view class="icon-circle" @click="goTo('/pages/record/list')">
              <svg class="header-svg" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="4" width="18" height="17" rx="3" stroke="#064E3B" stroke-width="2"/>
                <path d="M16 2V5M8 2V5" stroke="#064E3B" stroke-width="2" stroke-linecap="round"/>
                <path d="M3 9H21" stroke="#064E3B" stroke-width="2"/>
                <circle cx="8" cy="14" r="1.2" fill="#10B981"/>
                <circle cx="12" cy="14" r="1.2" fill="#10B981"/>
                <circle cx="16" cy="14" r="1.2" fill="#10B981"/>
              </svg>
            </view>
            <!-- 通知消息图标 -->
            <view class="icon-circle" @click="handleNotification">
              <svg class="header-svg" viewBox="0 0 24 24" fill="none">
                <path d="M18 8A6 6 0 006 8C6 15 3 17 3 17H21S18 15 18 8Z" stroke="#064E3B" stroke-width="2" stroke-linejoin="round"/>
                <path d="M13.73 21A2 2 0 0110.27 21" stroke="#064E3B" stroke-width="2" stroke-linecap="round"/>
                <circle cx="18" cy="7" r="2.5" fill="#F59E0B"/>
              </svg>
            </view>
          </view>
        </view>

        <!-- 横向周历胶囊栏 (带微型矢量探头标识) -->
        <view class="week-calendar-strip">
          <view 
            class="calendar-item" 
            v-for="(day, index) in weekDays" 
            :key="index"
            :class="{ 'active-day': day.active }"
            @click="selectDay(index)"
          >
            <!-- 选中日期上方的微型矢量探头吉祥物徽章 (与起始页泡泡色彩一致) -->
            <view class="peeking-mascot" v-if="day.active">
              <svg class="peek-svg" viewBox="0 0 20 16" fill="none">
                <path d="M2 15C2 7.5 6 3 10 3C14 3 18 7.5 18 15" fill="#10B981" stroke="#059669" stroke-width="1.8"/>
                <circle cx="5" cy="4" r="2.2" fill="#10B981"/>
                <circle cx="15" cy="4" r="2.2" fill="#10B981"/>
                <circle cx="8" cy="9" r="1.2" fill="#FFFFFF"/>
                <circle cx="12" cy="9" r="1.2" fill="#FFFFFF"/>
                <circle cx="10" cy="12" r="1" fill="#F59E0B"/>
              </svg>
            </view>
            <text class="day-num">{{ day.num }}</text>
          </view>
        </view>
      </view>

      <!-- 滚动内容区 -->
      <scroll-view class="main-scroll-view" scroll-y="true">
        <!-- 1. 中央吉祥物核心舞台区 (无边框、无底色、专属阶段背景、大图静态呈现) -->
        <view class="mascot-hero-card">
          <!-- 对应阶段专属背景层 (定制高精背景图与氛围元素) -->
          <view class="stage-scenery-wrap">
            <image 
              class="stage-scenery-img" 
              :src="currentStage.bgImg" 
              mode="aspectFit"
              :key="'bg-' + currentStage.id"
            ></image>
          </view>

          <!-- 核心吉祥物展示区 (已移除两侧按钮，大图居中静态呈现) -->
          <view class="scene-composition">
            <view class="mascot-center-wrap">
              <view class="mascot-soft-halo" :style="{ background: `radial-gradient(circle, ${currentStage.glowColor} 0%, rgba(255, 255, 255, 0) 70%)` }"></view>
              <image 
                class="mascot-avatar-img" 
                :src="currentStage.img" 
                mode="aspectFit"
                :key="'mascot-' + currentStage.id"
              ></image>
            </view>
          </view>

          <!-- 底部状态文字：蓄势待发 (0%) 等 (放大40%，居中呈现) -->
          <text class="status-label" @click="showEnergyInfo">{{ currentStage.actionTitle }} ({{ currentStage.percent }}%)</text>
        </view>

        <!-- 4 阶段交互切换胶囊栏 (支持用户随时点击切换 0% / 35% / 60% / 100% 查看对应形态) -->
        <view class="stage-stepper-capsule">
          <view 
            class="step-node" 
            v-for="(stage, idx) in stages" 
            :key="stage.id"
            :class="{ 'step-active': currentStageIndex === idx }"
            @click="switchStage(idx)"
          >
            <text class="step-percent">{{ stage.percent }}%</text>
            <text class="step-name">{{ stage.name }}</text>
          </view>
        </view>

        <!-- 2. 中部堆叠胶囊卡片组 (色彩与起始页自然生态统一：琥珀金、薄荷青、翡翠绿) -->
        <view class="stacked-banners-list">
          <!-- 卡片 1: 绿色商城限时特惠 (直连后端 mall_products 数据) -->
          <view class="banner-card banner-amber" v-if="bannerVisible.promo" @click="goTo('/pages/shop/index')">
            <view class="banner-icon-wrap">
              <svg class="banner-svg" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="8" width="18" height="13" rx="2" fill="#FEF3C7" stroke="#D97706" stroke-width="2"/>
                <path d="M12 8V21M3 13H21" stroke="#D97706" stroke-width="2"/>
                <path d="M12 8C10.5 8 9 6.5 9 5C9 3.5 10.5 3 12 5C13.5 3 15 3.5 15 5C15 6.5 13.5 8 12 8Z" fill="#FDE68A" stroke="#D97706" stroke-width="1.8"/>
              </svg>
            </view>
            <view class="banner-content">
              <view class="banner-title-row">
                <text class="banner-title">{{ featuredProduct.name || '绿行者会员 限时6折' }}</text>
              </view>
              <text class="banner-sub">现仅需 {{ featuredProduct.points || 50 }} 碳积分即可兑换</text>
            </view>
            <view class="banner-right-action">
              <view class="promo-chip">{{ featuredProduct.stock > 0 ? '热兑中' : '特惠' }}</view>
              <view class="close-btn" @click.stop="closeBanner('promo')">
                <svg class="close-svg" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
              </view>
            </view>
          </view>

          <!-- 卡片 2: 小组件提醒 (清新薄荷绿调) -->
          <view class="banner-card banner-mint" v-if="bannerVisible.widget" @click="goTo('/pages/record/add')">
            <view class="banner-icon-wrap">
              <svg class="banner-svg" viewBox="0 0 24 24" fill="none">
                <rect x="5" y="2" width="14" height="20" rx="3" fill="#D1FAE5" stroke="#059669" stroke-width="2"/>
                <line x1="9" y1="18" x2="15" y2="18" stroke="#059669" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="8" r="2.5" fill="#10B981"/>
              </svg>
            </view>
            <view class="banner-content">
              <text class="banner-title">添加 手机/手表 快捷小组件</text>
              <text class="banner-sub">随时随地随心记录低碳出行</text>
            </view>
            <view class="banner-right-action">
              <view class="close-btn" @click.stop="closeBanner('widget')">
                <svg class="close-svg" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
              </view>
            </view>
          </view>

          <!-- 卡片 3: 年度碳中和报告 (浓郁森林翡翠调) -->
          <view class="banner-card banner-forest" v-if="bannerVisible.report" @click="goTo('/pages/starter/index')">
            <view class="banner-icon-wrap">
              <svg class="banner-svg" viewBox="0 0 24 24" fill="none">
                <path d="M4 19V5C4 3.9 4.9 3 6 3H18C19.1 3 20 3.9 20 5V19C20 20.1 19.1 21 18 21H6C4.9 21 4 20.1 4 19Z" fill="#A7F3D0" stroke="#065F46" stroke-width="2"/>
                <path d="M8 15V17M12 11V17M16 8V17" stroke="#065F46" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </view>
            <view class="banner-content">
              <text class="banner-title">2026 年度碳中和报告 来啦</text>
              <text class="banner-sub">点击查收，解锁你的减碳排位 »</text>
            </view>
            <view class="banner-right-action">
              <view class="close-btn" @click.stop="closeBanner('report')">
                <svg class="close-svg" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6L6 18M6 6L18 18" stroke="#94A3B8" stroke-width="2.2" stroke-linecap="round"/>
                </svg>
              </view>
            </view>
          </view>
        </view>

        <!-- 3. 双列健康与减碳指标卡片 (参考图下部左右布局，直连后端数据) -->
        <view class="metrics-two-col-grid">
          <!-- 左卡片：绿色出行 -->
          <view class="metric-card" @click="goTo('/pages/record/list')">
            <view class="metric-header">
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none">
                <circle cx="5.5" cy="16.5" r="3.5" stroke="#10B981" stroke-width="2"/>
                <circle cx="18.5" cy="16.5" r="3.5" stroke="#10B981" stroke-width="2"/>
                <path d="M12 16.5L14.5 10H18M12 16.5L9.5 10L5.5 16.5M9.5 10L12 6H14.5" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              <text class="metric-name">绿色出行 ({{ stats.rank || '低碳居民' }})</text>
            </view>
            <view class="metric-body">
              <text class="metric-value">{{ stats.total_km }}</text>
              <text class="metric-unit">km</text>
            </view>
            <text class="metric-subtext">已减排 {{ ((stats.total_km || 0) * 0.18).toFixed(1) }}kg CO₂</text>
          </view>

          <!-- 右卡片：碳活力与能量条 -->
          <view class="metric-card" @click="goTo('/pages/userCenter/rank')">
            <view class="metric-header">
              <svg class="metric-icon-svg" viewBox="0 0 24 24" fill="none">
                <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#FEF3C7" stroke="#F59E0B" stroke-width="2"/>
              </svg>
              <text class="metric-name">碳中和活力</text>
            </view>
            <view class="metric-body">
              <text class="metric-value">{{ stats.total_points }}</text>
              <text class="metric-unit">分</text>
            </view>
            <!-- 渐变活力进度条 (翡翠绿 -> 森林绿 -> 琥珀金，随当前阶段动态联动) -->
            <view class="energy-progress-track">
              <view class="energy-progress-fill" :style="{ width: currentStage.percent + '%' }"></view>
            </view>
          </view>
        </view>

        <!-- 底部占位，防止被悬浮胶囊 TabBar 遮挡 -->
        <view class="bottom-spacer-for-tabbar"></view>
      </scroll-view>

      <!-- 4. 底部悬浮胶囊式 Tab 栏 (对齐参考图右侧：矢量 icon、胶囊形态、微悬浮、磨砂毛玻璃质感，与起始页生态色系呼应) -->
      <view class="floating-capsule-tabbar">
        <!-- Tab 1: 今天 (当前激活) -->
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

        <!-- Tab 4: 我的 / 个人中心 -->
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
  </view>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/api/request.js'

// 当前激活的底部 Tab
const currentTab = ref('today')

// 页面基础数据 (直连后端 /user/my_stats)
const stats = reactive({
  total_points: 0,
  total_km: 0,
  energyPercent: 75,
  rank: '低碳萌新',
  history: []
})

// 推荐特惠商品 (直连后端 /mall/products)
const featuredProduct = ref({
  id: 'p1',
  name: '绿行者限时特惠',
  points: 50,
  stock: 1
})

// 减碳蓄能 4 大成长阶段定义 (严格对应全新提示词与姿态设定)
const stages = [
  {
    id: 1,
    percent: 0,
    name: '慵懒侧躺',
    actionTitle: '蓄势待发',
    tag: '阶段 1 (0%)',
    desc: '晨光初醒 · 慵懒侧躺',
    subDesc: '软泥般侧躺地面，小手揉着惺忪睡眼，头顶小萌芽微垂耷拉，漂浮着半透明睡眠气泡',
    img: '/static/mascot_stage_1.png',
    bgImg: '/static/stage_bg_1.png',
    accentColor: '#94A3B8',
    glowColor: 'rgba(148, 163, 184, 0.35)'
  },
  {
    id: 2,
    percent: 30,
    name: '伸懒腰萌动',
    actionTitle: '萌芽初醒',
    tag: '阶段 2 (30%)',
    desc: '活力萌动 · 伸展懒腰',
    subDesc: '如小猫般前趴拉伸向前，翘起小屁股，头顶绿芽挺拔竖立，体内透出晨光般的微光',
    img: '/static/mascot_stage_2.png',
    bgImg: '/static/stage_bg_2.png',
    accentColor: '#10B981',
    glowColor: 'rgba(253, 224, 71, 0.35)'
  },
  {
    id: 3,
    percent: 75,
    name: '蓄力起跑',
    actionTitle: '蓄力起跑',
    tag: '阶段 3 (75%)',
    desc: '冲刺准备 · 蓄力起跑',
    subDesc: '半蹲前倾冲刺起跑姿态，小拳向上兴奋高挥，头顶萌芽含苞待放金黄花蕾，动能光流环绕',
    img: '/static/mascot_stage_3.png',
    bgImg: '/static/stage_bg_3.png',
    accentColor: '#059669',
    glowColor: 'rgba(16, 185, 129, 0.35)'
  },
  {
    id: 4,
    percent: 100,
    name: '凌空跃起绽放',
    actionTitle: '凌空绽放',
    tag: '阶段 4 (100%)',
    desc: '登峰造极 · 凌空绽放',
    subDesc: '凌空跃起肢体大展，头顶金色暖阳花绚丽盛开，环绕耀眼光环与飞扬绿叶粒子',
    img: '/static/mascot_stage_4.png',
    bgImg: '/static/stage_bg_4.png',
    accentColor: '#F59E0B',
    glowColor: 'rgba(245, 158, 11, 0.45)'
  }
]

// 当前选中/展示的阶段 (默认阶段 3: 蓄力起跑)
const currentStageIndex = ref(2)
const currentStage = computed(() => stages[currentStageIndex.value])

// 手动切换阶段 (支持用户点击胶囊实时切换形态)
const switchStage = (idx) => {
  currentStageIndex.value = idx
  stats.energyPercent = stages[idx].percent
}

// 横向周历数据
const weekDays = ref([])

// 初始化当前真实自然周历
const initWeekDays = () => {
  const now = new Date()
  const currentDayOfWeek = now.getDay() // 0 = 周日
  const mondayOffset = (currentDayOfWeek + 6) % 7
  const monday = new Date(now)
  monday.setDate(now.getDate() - mondayOffset)

  const list = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)
    list.push({
      num: String(d.getDate()),
      dateStr: `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`,
      active: d.toDateString() === now.toDateString()
    })
  }
  weekDays.value = list
}

// 宣传卡片显示状态
const bannerVisible = reactive({
  promo: true,
  widget: true,
  report: true
})

// 核心数据加载函数：全面接入云端数据服务
const loadHomeData = async () => {
  try {
    // 1. 获取当前用户个人碳账户汇总 (总积分、总公里数、段位与7天历史)
    const res = await request({ url: '/user/my_stats', method: 'GET' })
    if (res && res.data) {
      stats.total_points = typeof res.data.total_points === 'number' ? Number(res.data.total_points.toFixed(1)) : 0
      stats.total_km = typeof res.data.total_km === 'number' ? Number(res.data.total_km.toFixed(1)) : 0
      stats.rank = res.data.rank || '低碳居民'
      stats.history = res.data.history || []

      // 动态自动匹配成长阶段 (基于当前用户实际累积碳资产)
      if (stats.total_points < 100) currentStageIndex.value = 0
      else if (stats.total_points < 300) currentStageIndex.value = 1
      else if (stats.total_points < 600) currentStageIndex.value = 2
      else currentStageIndex.value = 3

      stats.energyPercent = stages[currentStageIndex.value].percent
    }
  } catch (err) {
    console.warn('加载个人碳账户数据失败:', err)
  }

  // 2. 获取绿色商城最新特惠商品
  try {
    const mallRes = await request({ url: '/mall/products', method: 'GET', silent: true })
    if (mallRes && mallRes.data && mallRes.data.length > 0) {
      const best = mallRes.data.find(p => p.stock > 0) || mallRes.data[0]
      featuredProduct.value = best
    }
  } catch (err) {
    console.warn('加载商城数据失败:', err)
  }
}

onShow(async () => {
  currentTab.value = 'today'
  uni.hideTabBar({ animation: false })
  initWeekDays()
  await loadHomeData()
})

// 切换周历选中的某一天
const selectDay = (index) => {
  weekDays.value.forEach((d, i) => {
    d.active = (i === index)
  })
}

// 关闭横幅卡片
const closeBanner = (key) => {
  bannerVisible[key] = false
}

// 页面跳转助手
const goTo = (url) => {
  uni.switchTab({
    url,
    fail: () => {
      uni.navigateTo({ url })
    }
  })
}

// 顶部设备同步按钮
const handleDeviceSync = async () => {
  uni.showLoading({ title: '同步中...' })
  await loadHomeData()
  uni.hideLoading()
  uni.showToast({
    title: '已同步最新低碳数据',
    icon: 'none'
  })
}

// 顶部通知按钮
const handleNotification = async () => {
  try {
    const res = await request({ url: '/user/login_history', method: 'GET', silent: true })
    if (res && res.data && res.data.length > 0) {
      const latest = res.data[0]
      uni.showModal({
        title: '安全与同步提醒',
        content: `最近登录时间：${latest.timestamp || '刚刚'}\n登录 IP：${latest.ip || '127.0.0.1'}\n登录地点：${latest.location || '本地环境'}\n审计状态：${latest.status === 'success' ? '安全认证通过' : '待复核'}`,
        showCancel: false,
        confirmColor: '#10B981'
      })
    } else {
      uni.showToast({
        title: '暂无未读低碳提醒',
        icon: 'none'
      })
    }
  } catch (err) {
    uni.showToast({
      title: '系统连接正常',
      icon: 'none'
    })
  }
}

const showEnergyInfo = () => {
  uni.showModal({
    title: currentStage.value.name,
    content: `${currentStage.value.subDesc}。当前碳积分 ${stats.total_points} 分，减排出行 ${stats.total_km} 公里！`,
    showCancel: false,
    confirmColor: '#10B981'
  })
}

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
    if (tabKey === 'today') {
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
</script>

<style scoped>
/* 引入阿里巴巴普惠体 (免费商用) */
@font-face {
  font-family: 'AlibabaPuHuiTi';
  src: url('/static/fonts/AlibabaPuHuiTi-Bold.woff2') format('woff2');
  font-weight: 700 800 900;
  font-style: normal;
  font-display: swap;
}

/* 隐藏原生 uni-tabbar 节点 */
::v-deep uni-tabbar {
  display: none !important;
}

/* 外部居中视口 */
.page-viewport {
  width: 100vw;
  min-height: 100vh;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 页面主卡片容器 */
.home-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 100vh;
  max-height: 920px;
  background-color: #F8FAF9;
  background-image: 
    radial-gradient(circle at 50% 15%, rgba(16, 185, 129, 0.10) 0%, rgba(16, 185, 129, 0.02) 45%, rgba(248, 250, 249, 0) 75%),
    linear-gradient(180deg, #F8FAF9 0%, #f0f6f3 55%, #F8FAF9 100%);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

/* 背景巨大棕榈叶脉络 */
.leaf-bg-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.palm-leaf {
  position: absolute;
  opacity: 0.8;
}

.leaf-top-left {
  top: -20px;
  left: -70px;
  width: 370px;
  height: 530px;
  transform: rotate(-10deg);
}

.leaf-bottom-right {
  bottom: -30px;
  right: -80px;
  width: 390px;
  height: 570px;
  transform: rotate(10deg);
}

/* 顶部导航与周历区 */
.top-header-section {
  padding: 44px 22px 14px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  position: relative;
  z-index: 10;
}

/* 大字“今天” + 右侧 3 个图标 */
.header-main-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-big-title {
  font-family: 'AlibabaPuHuiTi', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 32px;
  font-weight: 800;
  color: #064E3B;
  letter-spacing: -0.5px;
}

.top-action-icons {
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.88);
  backdrop-filter: blur(8px);
  border: 1px solid rgba(16, 185, 129, 0.2);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.06);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.15s ease;
}

.icon-circle:active {
  transform: scale(0.92);
  background: #ffffff;
}

.header-svg {
  width: 20px;
  height: 20px;
}

/* 横向周历胶囊栏 */
.week-calendar-strip {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px 6px 4px;
}

.calendar-item {
  position: relative;
  width: 40px;
  height: 40px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.65);
  border: 1px solid rgba(16, 185, 129, 0.12);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.day-num {
  font-size: 15px;
  font-weight: 700;
  color: #4B6B5D;
}

/* 激活选中日期 */
.calendar-item.active-day {
  background: #ffffff;
  border-color: rgba(16, 185, 129, 0.35);
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.22);
}

.calendar-item.active-day .day-num {
  color: #064E3B;
  font-weight: 800;
}

/* 探头吉祥物微型徽章 */
.peeking-mascot {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 16px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: peekBounce 2s ease-in-out infinite;
}

.peek-svg {
  width: 18px;
  height: 14px;
}

@keyframes peekBounce {
  0%, 100% { transform: translateX(-50%) translateY(0); }
  50% { transform: translateX(-50%) translateY(-3px); }
}

/* 主滚动区域 */
.main-scroll-view {
  position: relative;
  z-index: 5;
  flex: 1;
  padding: 0 20px;
  box-sizing: border-box;
  overflow-y: auto;
}

/* 1. 中央吉祥物舞台区 (不带 border、border-radius、background) */
.mascot-hero-card {
  position: relative;
  width: 100%;
  min-height: 250px;
  border-radius: 0;
  background: transparent;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  border: none;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  padding: 2px 0 10px;
  box-sizing: border-box;
  margin-bottom: 8px;
  overflow: visible;
}

/* 对应阶段专属背景层 (高精定制渲染图) */
.stage-scenery-wrap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 230px;
  pointer-events: none;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stage-scenery-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0.95;
  transition: opacity 0.3s ease;
}

/* 场景组合 (纯净居中，已去除两侧按钮) */
.scene-composition {
  position: relative;
  width: 100%;
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0;
  z-index: 2;
}

.mascot-center-wrap {
  position: relative;
  width: 100%;
  height: 210px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mascot-soft-halo {
  position: absolute;
  width: 190px;
  height: 190px;
  border-radius: 50%;
  filter: blur(18px);
  transition: background 0.4s ease;
}

/* 阶段图放大 + 静止无浮动 */
.mascot-avatar-img {
  width: 250px;
  height: 195px;
  max-width: 90%;
  object-fit: contain;
  filter: drop-shadow(0 12px 20px rgba(6, 78, 59, 0.16));
  animation: none; /* 阶段图静止，没有浮动 */
  transform: none;
  transition: opacity 0.25s ease;
}

/* 底部状态文字 (移除 badge，只保留文字并在 13px 基础上放大 40%：18px，居中纯净呈现) */
.status-label {
  position: relative;
  z-index: 3;
  font-family: 'AlibabaPuHuiTi', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: 18px;
  font-weight: 800;
  color: #064E3B;
  letter-spacing: -0.2px;
  text-align: center;
  margin-top: 6px;
  cursor: pointer;
}

/* 4 阶段交互切换胶囊栏 */
.stage-stepper-capsule {
  width: 100%;
  height: 44px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.7);
  border: 1px solid rgba(16, 185, 129, 0.16);
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.05);
  display: flex;
  padding: 3px;
  box-sizing: border-box;
  margin-bottom: 16px;
  gap: 4px;
}

.step-node {
  flex: 1;
  height: 100%;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.22s ease;
  color: #4B6B5D;
}

.step-percent {
  font-size: 12px;
  font-weight: 800;
  line-height: 1.1;
}

.step-name {
  font-size: 9.5px;
  font-weight: 500;
  opacity: 0.85;
}

.step-node.step-active {
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 3px 8px rgba(16, 185, 129, 0.28);
}

.step-node.step-active .step-name {
  opacity: 1;
  font-weight: 600;
}

/* 2. 堆叠胶囊卡片列表 */
.stacked-banners-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 16px;
}

.banner-card {
  position: relative;
  width: 100%;
  padding: 12px 14px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.05);
  cursor: pointer;
  transition: transform 0.15s ease;
}

.banner-card:active {
  transform: scale(0.98);
}

.banner-amber {
  background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 60%, #ecfdf5 100%);
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.banner-mint {
  background: linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 100%);
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.banner-forest {
  background: linear-gradient(135deg, #e6f7f0 0%, #d1fae5 100%);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.banner-icon-wrap {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  flex-shrink: 0;
}

.banner-svg {
  width: 26px;
  height: 26px;
}

.banner-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.banner-title {
  font-size: 14px;
  font-weight: 700;
  color: #064E3B;
}

.banner-sub {
  font-size: 11px;
  color: #4B6B5D;
}

.banner-right-action {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.promo-chip {
  padding: 2px 8px;
  border-radius: 12px;
  background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%);
  color: #ffffff;
  font-size: 10px;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(245, 158, 11, 0.3);
}

.close-btn {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.close-svg {
  width: 14px;
  height: 14px;
}

/* 3. 双列指标卡片 */
.metrics-two-col-grid {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.metric-card {
  flex: 1;
  background: #ffffff;
  border-radius: 20px;
  border: 1px solid rgba(16, 185, 129, 0.16);
  padding: 14px 16px;
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.06);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 96px;
  cursor: pointer;
  transition: transform 0.15s ease;
}

.metric-card:active {
  transform: scale(0.97);
}

.metric-header {
  display: flex;
  align-items: center;
  gap: 6px;
}

.metric-icon-svg {
  width: 18px;
  height: 18px;
}

.metric-name {
  font-size: 12px;
  font-weight: 600;
  color: #4B6B5D;
}

.metric-body {
  display: flex;
  align-items: baseline;
  gap: 3px;
  margin: 6px 0;
}

.metric-value {
  font-size: 22px;
  font-weight: 800;
  color: #064E3B;
}

.metric-unit {
  font-size: 12px;
  font-weight: 600;
  color: #94a3b8;
}

.metric-subtext {
  font-size: 10.5px;
  color: #059669;
  font-weight: 500;
}

/* 渐变活力进度条 */
.energy-progress-track {
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #e2e8f0;
  overflow: hidden;
  margin-top: 4px;
}

.energy-progress-fill {
  height: 100%;
  border-radius: 3px;
  background: linear-gradient(90deg, #10B981 0%, #059669 60%, #F59E0B 100%);
  transition: width 0.4s ease;
}

/* 底部防遮挡垫高 */
.bottom-spacer-for-tabbar {
  height: 95px;
}

/* 4. 底部悬浮胶囊式 Tab 栏 */
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
