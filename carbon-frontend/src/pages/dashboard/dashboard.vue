<template>
  <view class="dashboard-page">
    <view class="header">
      <view class="header-left">
        <text class="title">🌍 全平台碳减排大数据看板</text>
        <text class="subtitle">AI 引擎预测：{{ predictionData?.growth_trend === 'Increasing' ? '持续增长' : '波动调整' }}</text>
      </view>
      <view class="header-right">
        <button class="action-btn sync-btn" @click="handleTriggerSpider" :disabled="isSyncing">🔄 数据同步</button>
        <button class="action-btn refresh-btn" @click="refreshAll">刷新看板</button>
      </view>
    </view>

    <view v-show="!isEmpty" class="content-wrapper">
      <view class="kpi-grid">
        <view class="kpi-card" v-for="(item, index) in kpiList" :key="index">
          <view class="kpi-icon">{{ item.icon }}</view>
          <view class="kpi-info">
            <text class="kpi-label">{{ item.label }}</text>
            <text class="kpi-value">{{ item.value }}</text>
          </view>
        </view>
      </view>

      <view class="charts-row">
        <view class="chart-card main-chart">
          <view class="card-header">
            <text class="card-title">📉 碳积分趋势分析与 AI 预测 (未来7天)</text>
            <text class="tag">ML Regression</text>
          </view>
          <view ref="trendChartRef" class="echart-container"></view>
        </view>
        
        <view class="chart-card sub-chart">
          <view class="card-title">🥧 场景贡献分布</view>
          <view ref="pieChartRef" class="echart-container"></view>
        </view>
      </view>

      <view class="stats-row" v-if="metrics">
        <view class="stat-item">
          <text class="stat-label">单次平均减碳</text>
          <text class="stat-value">{{ metrics.advanced_stats.avg_points_per_trip.toFixed(2) }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">算法置信度</text>
          <text class="stat-value" style="color: #ff9800;">{{ predictionData?.model_confidence || '0.89' }}</text>
        </view>
        <view class="stat-item">
          <text class="stat-label">波动标准差</text>
          <text class="stat-value">{{ metrics.advanced_stats.std_dev_points.toFixed(2) }}</text>
        </view>
      </view>
    </view>

    <view v-if="isEmpty" class="empty-state">
      <text>暂无大数据分析结果，请确认后端 MongoDB 是否存有记录。</text>
    </view>
  </view>
</template>

<script setup>

import { ref, onMounted, nextTick } from 'vue'
import { request } from '@/api/request.js'
import * as echarts from 'echarts'

// --- 响应式数据 ---
const isEmpty = ref(false)
const isSyncing = ref(false)
const metrics = ref(null)
const predictionData = ref(null)
const kpiList = ref([])

// --- DOM 引用 ---
const trendChartRef = ref(null)
const pieChartRef = ref(null)

// --- 图表实例 ---
let trendChartInstance = null
let pieChartInstance = null

// 1. 获取基础统计数据
const fetchHistoryData = async () => {
  const res = await request({ url: '/admin/dashboard', method: 'GET' })
  if (res.code === 204 || !res.data) {
    isEmpty.value = true
    return false
  }
  metrics.value = res.data
  kpiList.value = [
    { label: '累计用户', value: res.data.kpi.total_users, icon: '👥' },
    { label: '总记录', value: res.data.kpi.total_activities, icon: '📝' },
    { label: '减碳总量(kg)', value: res.data.kpi.total_carbon_points.toFixed(0), icon: '🍃' },
    { label: '绿色里程(km)', value: res.data.kpi.total_distance_km.toFixed(0), icon: '🚴' }
  ]
  isEmpty.value = false
  return true
}

// 2. 获取 AI 预测数据
const fetchPrediction = async () => {
  try {
    const res = await request({ url: '/admin/predict_trend', method: 'GET' })
    if (res.code === 200) {
      predictionData.value = res.data
    }
  } catch (e) {
    console.error('预测引擎调用失败', e)
  }
}

// 3. 核心：初始化并混合渲染图表
const initCharts = () => {
  if (!metrics.value || !predictionData.value) return

  const trendEl = trendChartRef.value?.$el || trendChartRef.value
  const pieEl = pieChartRef.value?.$el || pieChartRef.value

  // --- 趋势图逻辑 (实线+虚线) ---
  if (trendEl) {
    if (trendChartInstance) trendChartInstance.dispose()
    trendChartInstance = echarts.init(trendEl)

    const historyDates = metrics.value.trend.dates
    const historyPoints = metrics.value.trend.points
    const futureDates = predictionData.value.future_dates
    const futurePoints = predictionData.value.future_points

    // 拼接 X 轴日期
    const allDates = [...historyDates, ...futureDates]
    // 构造预测线数据 (前面填 null，确保衔接)
    const lastPoint = historyPoints[historyPoints.length - 1]
    const predictSeries = [...new Array(historyPoints.length - 1).fill(null), lastPoint, ...futurePoints]

    trendChartInstance.setOption({
      tooltip: { trigger: 'axis' },
      legend: { data: ['历史实测', 'AI 预测趋势'], bottom: 10 },
      grid: { left: '3%', right: '4%', bottom: '15%', containLabel: true },
      xAxis: { type: 'category', boundaryGap: false, data: allDates },
      yAxis: { type: 'value' },
      series: [
        {
          name: '历史实测',
          type: 'line',
          smooth: true,
          data: historyPoints,
          itemStyle: { color: '#4caf50' },
          areaStyle: { color: 'rgba(76, 175, 80, 0.1)' }
        },
        {
          name: 'AI 预测趋势',
          type: 'line',
          smooth: true,
          data: predictSeries,
          lineStyle: { type: 'dashed', width: 2, color: '#ff9800' },
          itemStyle: { color: '#ff9800' }
        }
      ]
    })
  }

  // --- 饼图逻辑 ---
  if (pieEl) {
    if (pieChartInstance) pieChartInstance.dispose()
    pieChartInstance = echarts.init(pieEl)
    const mapping = { bus: '公交', subway: '地铁', bicycle: '骑行' }
    const pieData = metrics.value.distribution.map(item => ({
      name: mapping[item.name] || item.name,
      value: item.value
    }))
    pieChartInstance.setOption({
      tooltip: { trigger: 'item' },
      series: [{
        type: 'pie',
        radius: ['50%', '70%'],
        data: pieData,
        itemStyle: { borderRadius: 8, borderColor: '#fff', borderWidth: 2 },
        label: { show: false }
      }]
    })
  }
}

// 刷新全部
const refreshAll = async () => {
  uni.showLoading({ title: '数据引擎重算中...', mask: true })
  const hasData = await fetchHistoryData()
  if (hasData) {
    await fetchPrediction()
    await nextTick()
    setTimeout(() => {
      initCharts()
      uni.hideLoading()
    }, 500)
  } else {
    uni.hideLoading()
  }
}

const handleTriggerSpider = async () => {
  isSyncing.value = true
  await request({ url: '/admin/trigger_spider', method: 'POST' })
  uni.showToast({ title: '爬虫已异步启动' })
  setTimeout(() => isSyncing.value = false, 3000)
}

onMounted(() => {
  // 物理防盗：检查角色
  const role = uni.getStorageSync('role')
  
  if (role !== 'admin') {
    uni.showToast({ title: '权限不足，正在返回...', icon: 'none' })
    
    // 1.5秒后强行踢回首页
    setTimeout(() => {
      uni.switchTab({ url: '/pages/index/index' })
    }, 1500)
    return
  }
  
  // 只有 admin 才能执行数据刷新
  refreshAll()
})
window.addEventListener('resize', () => {
  trendChartInstance?.resize()
  pieChartInstance?.resize()
})
</script>

<style>
.dashboard-page { min-height: 100vh; background: #f4f7f6; padding: 15px; }
.header { background: #fff; padding: 15px; border-radius: 12px; display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.03); }
.title { font-size: 18px; font-weight: bold; color: #2e7d32; display: block; }
.subtitle { font-size: 11px; color: #ff9800; font-weight: bold; }
.header-right { display: flex; gap: 8px; }

.action-btn { font-size: 12px; height: 32px; line-height: 32px; padding: 0 15px; border-radius: 6px; border: none; }
.sync-btn { background: #e8f5e9; color: #2e7d32; }
.refresh-btn { background: #4caf50; color: #fff; }

.kpi-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 15px; }
.kpi-card { background: #fff; padding: 15px; border-radius: 12px; display: flex; align-items: center; }
.kpi-icon { font-size: 26px; margin-right: 12px; }
.kpi-value { font-size: 20px; font-weight: bold; color: #333; }
.kpi-label { font-size: 12px; color: #999; display: block; }

.charts-row { display: flex; flex-direction: column; gap: 15px; }
.chart-card { background: #fff; border-radius: 12px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.02); }
.card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.card-title { font-size: 14px; font-weight: bold; border-left: 4px solid #4caf50; padding-left: 10px; }
.tag { font-size: 10px; background: #fff3e0; color: #ff9800; padding: 2px 6px; border-radius: 4px; }

.echart-container { width: 100%; height: 300px; min-height: 300px; }

.stats-row { display: flex; background: #fff; margin-top: 15px; padding: 15px 0; border-radius: 12px; }
.stat-item { flex: 1; text-align: center; border-right: 1px solid #eee; }
.stat-item:last-child { border-right: none; }
.stat-label { font-size: 11px; color: #999; display: block; margin-bottom: 5px; }
.stat-value { font-size: 16px; font-weight: bold; color: #333; }

.empty-state { text-align: center; padding-top: 120px; color: #999; font-size: 14px; }
</style>