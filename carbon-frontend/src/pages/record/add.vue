<template>
  <view class="add-record-container">
    <view class="custom-nav">
      <view class="back-btn" @click="goHome">🏠 首页</view>
      <text class="nav-title">绿色申报</text>
    </view>

    <view class="form-card">
      <view class="header">
        <text class="emoji">🌳</text>
        <text class="title">申报绿色行程</text>
        <text class="desc">每一公里都在为地球降温</text>
      </view>

      <view class="form-item">
        <text class="label">出行方式</text>
        <view class="type-grid">
          <view 
            v-for="item in transportTypes" 
            :key="item.id"
            :class="['type-btn', form.activity_type === item.id ? 'active' : '']"
            @click="form.activity_type = item.id"
          >
            <text class="type-icon">{{ item.icon }}</text>
            <text class="type-name">{{ item.name }}</text>
          </view>
        </view>
      </view>

      <view class="form-item">
        <text class="label">行程距离 (公里)</text>
        <view class="input-wrapper">
          <input 
            type="digit" 
            v-model="form.value" 
            placeholder="请输入本次行程公里数" 
          />
          <text class="unit">km</text>
        </view>
      </view>

      <button class="submit-btn" :loading="loading" @click="handleSubmit">确认提交</button>
    </view>
  </view>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { request } from '@/api/request.js'

const transportTypes = [
  { id: 'bus', name: '公交', icon: '🚌' },
  { id: 'subway', name: '地铁', icon: '🚇' },
  { id: 'bicycle', name: '骑行', icon: '🚲' }
]

const form = reactive({ activity_type: 'bus', value: '' })
const loading = ref(false)

const goHome = () => uni.switchTab({ url: '/pages/index/index' })

const handleSubmit = async () => {
  if (!form.value || form.value <= 0) {
    return uni.showToast({ title: '请输入距离', icon: 'none' })
  }
  loading.value = true
  try {
    const res = await request({
      url: '/user/record',
      method: 'POST',
      data: { activity_type: form.activity_type, value: parseFloat(form.value) }
    })
    if (res.code === 200) {
      uni.showModal({
        title: '成功',
        content: `获得 ${res.data.points_earned} 积分！`,
        showCancel: false,
        success: () => goHome()
      })
    }
  } catch (e) {
    uni.showToast({ title: '申报失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}
</script>

<style>
.add-record-container { min-height: 100vh; background: #f0f4f2; padding-top: 60px; }
.custom-nav { position: fixed; top: 0; left: 0; width: 100%; height: 60px; background: #fff; display: flex; align-items: center; padding: 0 15px; box-shadow: 0 2px 5px rgba(0,0,0,0.05); z-index: 99; }
.back-btn { font-size: 14px; color: #2e7d32; background: #e8f5e9; padding: 5px 12px; border-radius: 15px; }
.nav-title { flex: 1; text-align: center; margin-right: 60px; font-weight: bold; }

.form-card { background: #fff; border-radius: 20px; padding: 30px 20px; margin: 20px; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
.header { text-align: center; margin-bottom: 30px; }
.emoji { font-size: 50px; display: block; }
.title { font-size: 20px; font-weight: bold; color: #2e7d32; display: block; }
.desc { font-size: 12px; color: #999; margin-top: 5px; }
.form-item { margin-bottom: 25px; }
.label { font-size: 14px; font-weight: bold; color: #444; margin-bottom: 12px; display: block; }
.type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; }
.type-btn { background: #f8f8f8; border-radius: 12px; padding: 15px 0; text-align: center; border: 2px solid transparent; }
.type-btn.active { background: #e8f5e9; border-color: #4caf50; }
.type-icon { font-size: 24px; display: block; }
.type-name { font-size: 13px; }
.input-wrapper { display: flex; align-items: center; background: #f8f8f8; padding: 0 15px; border-radius: 12px; height: 50px; }
.input-wrapper input { flex: 1; font-size: 18px; font-weight: bold; }
.submit-btn { background: #4caf50; color: #fff; height: 50px; line-height: 50px; border-radius: 25px; font-weight: bold; margin-top: 20px; }
</style>