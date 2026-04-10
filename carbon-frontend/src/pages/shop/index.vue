<template>
  <view class="shop-container">
    <view class="shop-header">
      <view class="balance-card">
        <text class="label">当前可用积分</text>
        <text class="balance">{{ myPoints }}</text>
      </view>
    </view>

    <view class="product-grid">
      <view v-for="item in products" :key="item.id" class="product-item">
        <view class="p-icon">{{ item.icon }}</view>
        <view class="p-info">
          <text class="p-name">{{ item.name }}</text>
          <view class="p-bottom">
            <text class="p-price">{{ item.points }} 积分</text>
            <text class="p-stock">库存: {{ item.stock }}</text>
          </view>
        </view>
        <button 
          class="exchange-btn" 
          :disabled="item.stock <= 0"
          @click="handleExchange(item)"
        >立即兑换</button>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { request } from '@/api/request.js'

const products = ref([])
const myPoints = ref(0)

const initData = async () => {
  // 获取积分余额
  const statsRes = await request({ url: '/user/my_stats', method: 'GET' })
  myPoints.value = statsRes.data.total_points
  
  // 获取商品列表
  const prodRes = await request({ url: '/mall/products', method: 'GET' })
  products.value = prodRes.data
}

const handleExchange = async (product) => {
  uni.showModal({
    title: '确认兑换',
    content: `将消耗 ${product.points} 积分兑换 ${product.name}，是否继续？`,
    success: async (res) => {
      if (res.confirm) {
        try {
          const exchangeRes = await request({
            url: '/mall/exchange',
            method: 'POST',
            data: { product_id: product.id }
          })
          if (exchangeRes.code === 200) {
            uni.showToast({ title: '兑换成功！', icon: 'success' })
            initData() // 刷新余额和库存
          }
        } catch (e) {
          uni.showToast({ title: e.detail || '兑换失败', icon: 'none' })
        }
      }
    }
  })
}

onMounted(() => initData())
</script>

<style>
.shop-container { min-height: 100vh; background: #f8f8f8; padding: 15px; }
.shop-header { margin-bottom: 20px; }
.balance-card { background: linear-gradient(135deg, #FF9800, #F44336); padding: 20px; border-radius: 15px; color: #fff; }
.balance { font-size: 32px; font-weight: bold; display: block; }

.product-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 15px; }
.product-item { background: #fff; border-radius: 12px; padding: 15px; display: flex; flex-direction: column; align-items: center; }
.p-icon { font-size: 40px; margin-bottom: 10px; }
.p-name { font-size: 14px; font-weight: bold; margin-bottom: 10px; text-align: center; height: 40px; }
.p-bottom { width: 100%; display: flex; justify-content: space-between; font-size: 10px; color: #999; margin-bottom: 10px; }
.p-price { color: #F44336; font-weight: bold; font-size: 13px; }

.exchange-btn { width: 100%; height: 34px; line-height: 34px; background: #2e7d32; color: #fff; font-size: 12px; border-radius: 17px; }
.exchange-btn[disabled] { background: #ccc; }
</style>