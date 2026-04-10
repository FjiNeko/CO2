<template>
  <view class="index-container">
    <view class="user-card">
      <view class="user-info">
        <view class="avatar">👤</view>
        <view class="meta">
          <text class="nickname">{{ userInfo.username || 'user' }}</text>
          <view class="badge-row">
            <text class="rank-tag">碳中和达人</text>
            <text class="level-tag">Lv.4</text>
          </view>
        </view>
        <view class="sign-btn" @click="handleSign">已连签 3 天</view>
      </view>

      <view class="stats-grid">
        <view class="stat-item">
          <text class="num">{{ stats.total_points || 0 }}</text>
          <text class="label">累计碳积分</text>
        </view>
        <view class="stat-item">
          <text class="num">{{ stats.total_km || 0 }}</text>
          <text class="label">减碳里程(km)</text>
        </view>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-grid">
        <view class="menu-item" @click="goTo('/pages/record/add')">
          <view class="icon-box green">🌱</view>
          <text>行为申报</text>
        </view>
        <view class="menu-item" @click="goTo('/pages/shop/index')">
          <view class="icon-box blue">🛒</view>
          <text>积分商城</text>
        </view>
        <view class="menu-item" @click="goTo('/pages/userCenter/rank')">
          <view class="icon-box gold">🏆</view>
          <text>排行激励</text>
        </view>
        <view class="menu-item" @click="handleDeveloping">
          <view class="icon-box orange">📜</view>
          <text>碳中和证书</text>
        </view>
        <view class="menu-item" v-if="userInfo.role === 'admin'" @click="goTo('/pages/dashboard/dashboard')">
          <view class="icon-box dark">📊</view>
          <text>管理后台</text>
        </view>
        <view class="menu-item" @click="handleDeveloping">
          <view class="icon-box purple">💡</view>
          <text>低碳科普</text>
        </view>
        <view class="menu-item" @click="handleDeveloping">
          <view class="icon-box red">🎁</view>
          <text>每日福利</text>
        </view>
        <view class="menu-item" @click="handleDeveloping">
          <view class="icon-box cyan">📍</view>
          <text>回收站点</text>
        </view>
      </view>
    </view>

    <view class="chart-section">
      <view class="section-title">
        <text>📊 近一周减碳趋势</text>
        <text class="more-link" @click="goTo('/pages/record/list')">查看详情 ></text>
      </view>
      <view ref="userChartRef" class="user-echart"></view>
    </view>

    <view class="news-section">
      <view class="section-title">🌍 绿色生活指南</view>
      <view class="news-list">
        <view class="news-item" v-for="(item, i) in newsList" :key="i">
          <view class="news-content">
            <text class="news-title">{{ item.title }}</text>
            <view class="news-meta">
              <text class="news-tag">{{ item.tag }}</text>
              <text class="news-time">{{ item.time }}</text>
            </view>
          </view>
          <view class="news-img-box">{{ item.icon }}</view>
        </view>
      </view>
    </view>

    <view style="height: 30px;"></view>
  </view>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/api/request.js'
import * as echarts from 'echarts'

const userInfo = ref({ username: '加载中...', role: 'user' })
const stats = ref({ total_points: 0, total_km: 0, rank: '', history: { dates: [], points: [] } })
const userChartRef = ref(null)
let chartInstance = null

const newsList = ref([
  { title: '如何通过绿色出行每年减少200kg碳排放？', tag: '攻略', time: '2小时前', icon: '🚲' },
  { title: '2026年全球碳中和城市排名发布：本市入围前十', tag: '快讯', time: '5小时前', icon: '🏙️' },
  { title: '关于废旧电池回收的三个误区', tag: '科普', time: '昨天', icon: '🔋' }
])

onShow(async () => {
  userInfo.value.username = uni.getStorageSync('username') || 'user'
  userInfo.value.role = uni.getStorageSync('role') || 'user'

  try {
    const statsRes = await request({ url: '/user/my_stats', method: 'GET' })
    if (statsRes && statsRes.data) {
      stats.value = statsRes.data
      await nextTick()
      initUserChart()
    }
  } catch (e) {
    console.error("首页数据拉取失败:", e)
  }
})

const initUserChart = () => {
  const el = userChartRef.value?.$el || userChartRef.value
  if (!el || !stats.value.history || !stats.value.history.dates || stats.value.history.dates.length === 0) return

  if (chartInstance) chartInstance.dispose()
  chartInstance = echarts.init(el)
  chartInstance.setOption({
    grid: { top: 20, bottom: 30, left: 40, right: 20 },
    xAxis: {
      type: 'category',
      data: stats.value.history.dates,
      axisLine: { lineStyle: { color: '#f0f0f0' } },
      axisLabel: { color: '#999', fontSize: 10 }
    },
    yAxis: {
      type: 'value',
      splitLine: { lineStyle: { type: 'dashed', color: '#f5f5f5' } },
      axisLabel: { color: '#999', fontSize: 10 }
    },
    series: [{
      data: stats.value.history.points,
      type: 'bar',
      itemStyle: {
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#66bb6a' },
          { offset: 1, color: '#43a047' }
        ]),
        borderRadius: [4, 4, 0, 0]
      },
      barWidth: '40%'
    }]
  })
}

const goTo = (url) => {
  if (url === '/pages/userCenter/index' || url === '/pages/index/index') {
    uni.switchTab({ url })
  } else {
    uni.navigateTo({ url })
  }
}

const handleDeveloping = () => uni.showToast({ title: '功能开发中', icon: 'none' })
const handleSign = () => uni.showToast({ title: '今日已签到', icon: 'success' })
</script>

<style>
.index-container {
  min-height: 100vh;
  background: #f7f9f8;
  padding: 15px;
}

/* 顶部卡片 */
.user-card {
  background: linear-gradient(135deg, #388e3c 0%, #66bb6a 100%);
  border-radius: 20px;
  padding: 20px;
  color: white;
  box-shadow: 0 8px 20px rgba(56, 142, 60, 0.2);
  margin-bottom: 15px;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 50%;
  font-size: 26px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.meta {
  margin-left: 12px;
  flex: 1;
}

.nickname {
  font-size: 18px;
  font-weight: bold;
}

.badge-row {
  display: flex;
  margin-top: 5px;
}

.rank-tag {
  font-size: 10px;
  background: rgba(255, 255, 255, 0.3);
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 5px;
}

.level-tag {
  font-size: 10px;
  background: #ffca28;
  color: #5d4037;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: bold;
}

.sign-btn {
  font-size: 11px;
  background: rgba(0, 0, 0, 0.1);
  padding: 5px 10px;
  border-radius: 15px;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

/* 数据展示 */
.stats-grid {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 15px;
}

.stat-item {
  flex: 1;
  text-align: center;
}

.num {
  font-size: 20px;
  font-weight: bold;
  display: block;
}

.label {
  font-size: 11px;
  opacity: 0.9;
  margin-top: 4px;
}

/* 金刚区 */
.menu-card {
  background: #fff;
  border-radius: 16px;
  padding: 15px 10px 5px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.menu-grid {
  display: flex;
  flex-wrap: wrap;
}

.menu-item {
  width: 25%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 15px;
}

.icon-box {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  margin-bottom: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.menu-item text {
  font-size: 11px;
  color: #555;
}

/* 图表区 */
.chart-section {
  background: #fff;
  border-radius: 16px;
  padding: 15px;
  margin-bottom: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.section-title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  font-size: 14px;
  font-weight: bold;
  color: #333;
}

.more-link {
  font-size: 11px;
  color: #999;
  font-weight: normal;
}

.user-echart {
  width: 100%;
  height: 200px;
}

/* 资讯区 */
.news-section {
  background: #fff;
  border-radius: 16px;
  padding: 15px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.02);
}

.news-item {
  display: flex;
  padding: 12px 0;
  border-bottom: 1px solid #f9f9f9;
}

.news-item:last-child {
  border-bottom: none;
}

.news-content {
  flex: 1;
}

.news-title {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  line-height: 1.4;
}

.news-meta {
  margin-top: 6px;
  display: flex;
  align-items: center;
}

.news-tag {
  font-size: 9px;
  color: #4caf50;
  background: #e8f5e9;
  padding: 2px 6px;
  border-radius: 4px;
  margin-right: 8px;
}

.news-time {
  font-size: 10px;
  color: #bbb;
}

.news-img-box {
  width: 40px;
  height: 40px;
  background: #f0f7f2;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
  margin-left: 10px;
}

/* 颜色 */
.green {
  background: #e8f5e9;
}

.blue {
  background: #e3f2fd;
}

.gold {
  background: #fff8e1;
}

.orange {
  background: #fff3e0;
}

.purple {
  background: #f3e5f5;
}

.red {
  background: #ffebee;
}

.cyan {
  background: #e0f7fa;
}

.dark {
  background: #eceff1;
}
</style>