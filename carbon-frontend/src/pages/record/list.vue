<template>
  <view class="list-container">
    <view class="header-bg"></view>
    <view class="list-card">
      <view class="title">📅 减碳流水明细</view>
      
      <view v-if="records.length === 0" class="empty">暂无减碳记录，快去申报吧！</view>
      
      <view class="record-item" v-for="(item, index) in records" :key="index">
        <view class="icon-box" :class="item.carbon_points > 0 ? 'plus' : 'minus'">
          {{ item.carbon_points > 0 ? '🌱' : '🛒' }}
        </view>
        <view class="info">
          <text class="type">{{ formatType(item.activity_type) }}</text>
          <text class="time">{{ item.created_at }}</text>
        </view>
        <view class="points" :class="item.carbon_points > 0 ? 'text-green' : 'text-red'">
          {{ item.carbon_points > 0 ? '+' : '' }}{{ item.carbon_points }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/api/request.js'

const records = ref([])

onMounted(async () => {
  try {
    const res = await request({ url: '/user/activities', method: 'GET' })
    if (res.code === 200) {
      records.value = res.data
    }
  } catch (e) {
    uni.showToast({ title: '记录拉取失败', icon: 'none' })
  }
})

// 格式化活动类型为中文
const formatType = (type) => {
  if (type.includes('EXCHANGE')) return '商城积分兑换'
  const map = { 'bus': '乘坐公交', 'subway': '乘坐地铁', 'bicycle': '共享骑行' }
  return map[type] || type
}
</script>

<style>
.list-container { min-height: 100vh; background: #f8f8f8; position: relative; }
.header-bg { background: #2e7d32; height: 120px; width: 100%; position: absolute; top: 0; left: 0; }
.list-card { position: relative; z-index: 10; margin: 20px 15px; background: #fff; border-radius: 16px; padding: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); min-height: 500px; }
.title { font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #333; padding-bottom: 15px; border-bottom: 1px solid #eee; }

.empty { text-align: center; color: #999; margin-top: 50px; font-size: 14px; }

.record-item { display: flex; align-items: center; padding: 15px 0; border-bottom: 1px dashed #f0f0f0; }
.record-item:last-child { border-bottom: none; }
.icon-box { width: 40px; height: 40px; border-radius: 50%; display: flex; justify-content: center; align-items: center; font-size: 20px; margin-right: 15px; }
.plus { background: #e8f5e9; }
.minus { background: #ffebee; }

.info { flex: 1; display: flex; flex-direction: column; }
.type { font-size: 15px; font-weight: bold; color: #333; margin-bottom: 5px; }
.time { font-size: 12px; color: #999; }

.points { font-size: 18px; font-weight: bold; }
.text-green { color: #4caf50; }
.text-red { color: #f44336; }
</style>