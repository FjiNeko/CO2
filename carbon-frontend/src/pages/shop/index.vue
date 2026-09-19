<template>
  <view class="shop-page-wrapper">
    <!-- 顶部状态栏安全占位 -->
    <view class="status-bar-placeholder"></view>

    <!-- 顶部导航栏 -->
    <view class="top-nav-bar">
      <view class="nav-back-btn" @click="handleBack">
        <svg class="back-svg" viewBox="0 0 24 24" fill="none">
          <path d="M15 19L8 12L15 5" stroke="#064E3B" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </view>
      <text class="nav-title chinese-font">积分商城</text>
      <view class="nav-right-btn" @click="goToRecordList">
        <text class="nav-right-text chinese-font">兑换记录</text>
      </view>
    </view>

    <!-- 滚动区域 -->
    <scroll-view scroll-y class="shop-scroll-view">
      <!-- 1. 顶部积分余额 Hero 卡片 -->
      <view class="hero-balance-card">
        <view class="hero-bg-glow"></view>
        <view class="hero-card-inner">
          <view class="hero-top-row">
            <view class="balance-tag-pill">
              <svg class="sparkle-svg" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="#F59E0B"/>
              </svg>
              <text class="pill-label chinese-font">当前可用碳积分</text>
            </view>
            <view class="earn-more-btn" @click="goToEarnPoints">
              <text class="earn-btn-text chinese-font">去赚积分</text>
              <svg class="arrow-right-svg" viewBox="0 0 16 16" fill="none">
                <path d="M6 3L11 8L6 13" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
          </view>

          <view class="balance-amount-row">
            <text class="balance-number num-font">{{ formattedPoints }}</text>
            <text class="balance-unit chinese-font">分</text>
          </view>

          <view class="hero-foot-row">
            <view class="foot-info-item">
              <svg class="foot-leaf-svg" viewBox="0 0 24 24" fill="none">
                <path d="M12 22C12 22 20 18 20 12C20 6 12 2 12 2C12 2 4 6 4 12C4 18 12 22 12 22Z" stroke="#34D399" stroke-width="1.8" stroke-linejoin="round"/>
                <path d="M12 2V22" stroke="#34D399" stroke-width="1.6"/>
              </svg>
              <text class="foot-text chinese-font">坚持低碳出行 · 1公里骑行约得 10~20 积分</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 2. 分类筛选胶囊栏 -->
      <view class="category-tabs-wrap">
        <view 
          v-for="cat in categoryList" 
          :key="cat.id" 
          class="cat-chip" 
          :class="{ 'cat-chip-active': currentCat === cat.id }"
          @click="selectCategory(cat.id)"
        >
          <text class="cat-chip-text chinese-font">{{ cat.name }}</text>
        </view>
      </view>

      <!-- 3. 商品瀑布网格 (2列响应式卡片) -->
      <view class="product-grid">
        <view 
          v-for="item in filteredProducts" 
          :key="item.id" 
          class="product-card"
          :class="{ 'card-sold-out': item.stock <= 0 }"
        >
          <!-- 标签浮层 -->
          <view class="product-badge-wrap">
            <view v-if="item.stock <= 0" class="badge-pill badge-gray">
              <text class="badge-text chinese-font">已售罄</text>
            </view>
            <view v-else-if="item.stock < 10" class="badge-pill badge-amber">
              <text class="badge-text chinese-font">仅剩{{ item.stock }}件</text>
            </view>
            <view v-else class="badge-pill badge-emerald">
              <text class="badge-text chinese-font">热兑好物</text>
            </view>
          </view>

          <!-- 矢量产品图标容器 (纯 SVG 矢量图，严格 Zero Emoji) -->
          <view class="product-icon-container" :class="'icon-theme-' + getProductTheme(item)">
            <!-- 1. 美食外卖红包 / 代金券 -->
            <svg v-if="getProductTheme(item) === 'food'" class="product-vector-svg" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="10" width="32" height="28" rx="5" fill="#FEF3C7" stroke="#F59E0B" stroke-width="3"/>
              <path d="M8 20H40" stroke="#F59E0B" stroke-width="2.5" stroke-dasharray="4 4"/>
              <circle cx="24" cy="29" r="6" fill="#FDE68A" stroke="#D97706" stroke-width="2.5"/>
              <path d="M22 27L24 29L27 26" stroke="#B45309" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>

            <!-- 2. 咖啡饮品券 -->
            <svg v-else-if="getProductTheme(item) === 'coffee'" class="product-vector-svg" viewBox="0 0 48 48" fill="none">
              <path d="M10 16H34V30C34 34.4183 30.4183 38 26 38H18C13.5817 38 10 34.4183 10 30V16Z" fill="#E6F7F0" stroke="#10B981" stroke-width="3"/>
              <path d="M34 20H37C39.2091 20 41 21.7909 41 24V25C41 27.2091 39.2091 29 37 29H34" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
              <path d="M16 10C16 10 17 12 17 13" stroke="#059669" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M22 8C22 8 23 11 23 13" stroke="#059669" stroke-width="2.5" stroke-linecap="round"/>
              <path d="M28 10C28 10 29 12 29 13" stroke="#059669" stroke-width="2.5" stroke-linecap="round"/>
              <line x1="8" y1="41" x2="36" y2="41" stroke="#10B981" stroke-width="3" stroke-linecap="round"/>
            </svg>

            <!-- 3. 共享单车月卡 / 骑行卡 -->
            <svg v-else-if="getProductTheme(item) === 'bike'" class="product-vector-svg" viewBox="0 0 48 48" fill="none">
              <circle cx="14" cy="30" r="7" stroke="#065F46" stroke-width="3" fill="#D1FAE5"/>
              <circle cx="34" cy="30" r="7" stroke="#065F46" stroke-width="3" fill="#D1FAE5"/>
              <path d="M14 30L22 18H28L34 30" stroke="#059669" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 18L18 12H14" stroke="#064E3B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M26 24L30 15H33" stroke="#064E3B" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M22 30H27" stroke="#059669" stroke-width="3" stroke-linecap="round"/>
            </svg>

            <!-- 4. 能量保护罩 / 虚拟护盾 -->
            <svg v-else-if="getProductTheme(item) === 'shield'" class="product-vector-svg" viewBox="0 0 48 48" fill="none">
              <path d="M24 6L38 12V22C38 31 32 38 24 42C16 38 10 31 10 22V12L24 6Z" fill="#DEF7EC" stroke="#10B981" stroke-width="3" stroke-linejoin="round"/>
              <path d="M24 16V28M24 28C24 24 28 21 31 21M24 28C24 24 20 21 17 21" stroke="#065F46" stroke-width="2.6" stroke-linecap="round"/>
            </svg>

            <!-- 5. 默认通用生态礼盒券 -->
            <svg v-else class="product-vector-svg" viewBox="0 0 48 48" fill="none">
              <rect x="8" y="16" width="32" height="24" rx="4" fill="#E6F7F0" stroke="#10B981" stroke-width="3"/>
              <path d="M6 16H42V22H6V16Z" fill="#A7F3D0" stroke="#059669" stroke-width="2.5"/>
              <path d="M24 16V40" stroke="#059669" stroke-width="3"/>
              <path d="M24 16C21 16 18 13 18 10C18 7 21 7 24 16ZM24 16C27 16 30 13 30 10C30 7 27 7 24 16Z" stroke="#F59E0B" stroke-width="2.5" fill="#FEF3C7"/>
            </svg>
          </view>

          <!-- 商品信息 -->
          <view class="product-info-wrap">
            <text class="product-name chinese-font">{{ item.name }}</text>
            
            <view class="price-stock-row">
              <view class="price-box">
                <text class="price-value num-font">{{ item.points }}</text>
                <text class="price-label chinese-font">积分</text>
              </view>
              <text class="stock-info chinese-font">剩余 {{ item.stock }}</text>
            </view>
          </view>

          <!-- 兑换按钮 -->
          <view 
            class="action-exchange-btn"
            :class="{ 
              'btn-disabled': item.stock <= 0 || myPoints < item.points,
              'btn-not-enough': item.stock > 0 && myPoints < item.points
            }"
            @click="handleExchange(item)"
          >
            <text class="btn-text chinese-font">
              {{ item.stock <= 0 ? '暂时缺货' : (myPoints < item.points ? '积分不足' : '立即兑换') }}
            </text>
          </view>
        </view>
      </view>

      <!-- 空状态展示 -->
      <view v-if="filteredProducts.length === 0" class="empty-wrap">
        <svg class="empty-svg" viewBox="0 0 64 64" fill="none">
          <circle cx="32" cy="32" r="28" fill="#F1F5F9" stroke="#CBD5E1" stroke-width="2"/>
          <path d="M22 38C22 38 26 34 32 34C38 34 42 38 42 38" stroke="#94A3B8" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="24" cy="26" r="3" fill="#94A3B8"/>
          <circle cx="40" cy="26" r="3" fill="#94A3B8"/>
        </svg>
        <text class="empty-text chinese-font">该分类下暂无商品</text>
      </view>

      <!-- 底部安全留白 -->
      <view class="bottom-spacer"></view>
    </scroll-view>
  </view>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { request } from '@/api/request.js'

// 1. 状态定义
const products = ref([])
const myPoints = ref(0)
const currentCat = ref('all')

const categoryList = [
  { id: 'all', name: '全部好物' },
  { id: 'transit', name: '低碳出行' },
  { id: 'life', name: '生活茶饮' },
  { id: 'eco', name: '生态虚拟' }
]

// 2. 格式化积分
const formattedPoints = computed(() => {
  const p = Number(myPoints.value) || 0
  return p.toLocaleString()
})

// 3. 分类商品过滤
const filteredProducts = computed(() => {
  if (currentCat.value === 'all') return products.value
  return products.value.filter(item => {
    const theme = getProductTheme(item)
    if (currentCat.value === 'transit') return theme === 'bike'
    if (currentCat.value === 'life') return theme === 'food' || theme === 'coffee'
    if (currentCat.value === 'eco') return theme === 'shield'
    return true
  })
})

// 4. 根据商品特征匹配主题
const getProductTheme = (product) => {
  const name = product.name || ''
  const pid = product.id || ''
  if (pid === 'p1' || name.includes('外卖') || name.includes('红包') || name.includes('餐')) {
    return 'food'
  }
  if (pid === 'p2' || name.includes('咖啡') || name.includes('饮品') || name.includes('茶')) {
    return 'coffee'
  }
  if (pid === 'p3' || name.includes('单车') || name.includes('月卡') || name.includes('骑行')) {
    return 'bike'
  }
  if (pid === 'p4' || name.includes('森林') || name.includes('罩') || name.includes('盾') || name.includes('能量')) {
    return 'shield'
  }
  return 'default'
}

// 5. 初始化数据
const initData = async () => {
  try {
    // 获取积分余额
    const statsRes = await request({ url: '/user/my_stats', method: 'GET' })
    if (statsRes && statsRes.data) {
      myPoints.value = statsRes.data.total_points || 0
    }
  } catch (e) {
    console.error('获取用户统计异常:', e)
  }

  try {
    // 获取商品列表
    const prodRes = await request({ url: '/mall/products', method: 'GET' })
    if (prodRes && prodRes.data) {
      products.value = prodRes.data
    }
  } catch (e) {
    console.error('获取商品列表异常:', e)
  }
}

// 6. 交互处理
const handleBack = () => {
  const pages = getCurrentPages()
  if (pages && pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/userCenter/index',
      fail: () => uni.navigateTo({ url: '/pages/userCenter/index' })
    })
  }
}

const goToRecordList = () => {
  uni.navigateTo({
    url: '/pages/record/list',
    fail: () => uni.switchTab({ url: '/pages/userCenter/index' })
  })
}

const goToEarnPoints = () => {
  uni.switchTab({
    url: '/pages/record/add',
    fail: () => uni.navigateTo({ url: '/pages/record/add' })
  })
}

const selectCategory = (catId) => {
  currentCat.value = catId
}

// 7. 兑换逻辑
const handleExchange = async (product) => {
  if (product.stock <= 0) {
    uni.showToast({ title: '该商品已抢光啦', icon: 'none' })
    return
  }

  if (myPoints.value < product.points) {
    uni.showModal({
      title: '积分不足',
      content: `当前商品需要 ${product.points} 积分，您目前拥有 ${myPoints.value} 积分。快去申报绿色出行赚取积分吧！`,
      confirmText: '去赚积分',
      cancelText: '知道了',
      success: (mRes) => {
        if (mRes.confirm) {
          goToEarnPoints()
        }
      }
    })
    return
  }

  uni.showModal({
    title: '确认兑换商品',
    content: `将消耗 ${product.points} 积分兑换「${product.name}」，兑换后可在减碳记录中查看兑换流水。是否继续？`,
    confirmColor: '#10B981',
    success: async (res) => {
      if (res.confirm) {
        try {
          uni.showLoading({ title: '正在兑换...' })
          const exchangeRes = await request({
            url: '/mall/exchange',
            method: 'POST',
            data: { product_id: product.id }
          })
          uni.hideLoading()
          if (exchangeRes.code === 200) {
            uni.showToast({ title: '兑换成功！', icon: 'success' })
            await initData() // 刷新余额与库存
          } else {
            uni.showToast({ title: exchangeRes.detail || '兑换失败', icon: 'none' })
          }
        } catch (e) {
          uni.hideLoading()
          uni.showToast({ title: e.detail || '兑换失败，请稍后重试', icon: 'none' })
        }
      }
    }
  })
}

onMounted(() => {
  initData()
})
</script>

<style>
/* 1. 字体声明 */
@font-face {
  font-family: 'OutfitBold';
  src: url('/static/fonts/Outfit-Black.ttf') format('truetype');
  font-weight: 400 900;
  font-style: normal;
  font-display: swap;
}

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

/* 页面主框架 */
.shop-page-wrapper {
  min-height: 100vh;
  background: linear-gradient(180deg, #E6F7F0 0%, #F5FAF7 20%, #F8FAF9 100%);
  display: flex;
  flex-direction: column;
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
  padding: 8px 18px 12px;
  background: transparent;
}

.nav-back-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px rgba(6, 78, 59, 0.08);
}

.back-svg {
  width: 20px;
  height: 20px;
}

.nav-title {
  font-size: 18px;
  font-weight: bold;
  color: #064E3B;
  letter-spacing: 0.5px;
}

.nav-right-btn {
  padding: 6px 12px;
  border-radius: 16px;
  background: rgba(16, 185, 129, 0.12);
  display: flex;
  align-items: center;
}

.nav-right-text {
  font-size: 13px;
  font-weight: 600;
  color: #065F46;
}

/* 滚动容器 */
.shop-scroll-view {
  flex: 1;
  padding: 0 16px;
  box-sizing: border-box;
}

/* 1. Hero 积分余额卡片 */
.hero-balance-card {
  position: relative;
  border-radius: 20px;
  background: linear-gradient(135deg, #064E3B 0%, #065F46 45%, #0D9488 100%);
  box-shadow: 0 12px 28px rgba(6, 78, 59, 0.22);
  overflow: hidden;
  margin-bottom: 20px;
}

.hero-bg-glow {
  position: absolute;
  top: -40px;
  right: -40px;
  width: 140px;
  height: 140px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.25) 0%, rgba(245, 158, 11, 0) 70%);
  pointer-events: none;
}

.hero-card-inner {
  position: relative;
  padding: 22px 20px 18px;
  display: flex;
  flex-direction: column;
}

.hero-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}

.balance-tag-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(8px);
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.sparkle-svg {
  width: 14px;
  height: 14px;
  margin-right: 6px;
}

.pill-label {
  font-size: 12px;
  color: #F0FDF4;
  font-weight: 500;
}

.earn-more-btn {
  display: inline-flex;
  align-items: center;
  background: rgba(245, 158, 11, 0.25);
  border: 1px solid rgba(245, 158, 11, 0.5);
  padding: 5px 12px;
  border-radius: 16px;
  transition: opacity 0.2s;
}

.earn-more-btn:active {
  opacity: 0.8;
}

.earn-btn-text {
  font-size: 12px;
  color: #FEF3C7;
  font-weight: 600;
  margin-right: 2px;
}

.arrow-right-svg {
  width: 12px;
  height: 12px;
}

.balance-amount-row {
  display: flex;
  align-items: baseline;
  margin-bottom: 12px;
}

.balance-number {
  font-size: 42px;
  color: #FFFFFF;
  line-height: 1;
  letter-spacing: -1px;
}

.balance-unit {
  font-size: 16px;
  color: #A7F3D0;
  font-weight: 600;
  margin-left: 6px;
}

.hero-foot-row {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  padding-top: 10px;
}

.foot-info-item {
  display: flex;
  align-items: center;
}

.foot-leaf-svg {
  width: 14px;
  height: 14px;
  margin-right: 6px;
  flex-shrink: 0;
}

.foot-text {
  font-size: 11px;
  color: #D1FAE5;
  opacity: 0.9;
}

/* 2. 分类筛选胶囊 */
.category-tabs-wrap {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  overflow-x: auto;
  white-space: nowrap;
}

.cat-chip {
  padding: 7px 16px;
  border-radius: 20px;
  background: #FFFFFF;
  border: 1px solid #E2E8F0;
  box-shadow: 0 2px 6px rgba(6, 78, 59, 0.03);
  transition: all 0.2s ease;
}

.cat-chip-active {
  background: #064E3B;
  border-color: #064E3B;
  box-shadow: 0 4px 12px rgba(6, 78, 59, 0.18);
}

.cat-chip-text {
  font-size: 13px;
  color: #64748B;
  font-weight: 600;
}

.cat-chip-active .cat-chip-text {
  color: #FFFFFF;
}

/* 3. 商品网格 (2列) */
.product-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.product-card {
  position: relative;
  background: #FFFFFF;
  border-radius: 18px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 16px rgba(6, 78, 59, 0.05);
  border: 1px solid #F1F5F9;
  transition: transform 0.15s ease;
}

.product-card:active {
  transform: translateY(1px);
}

.card-sold-out {
  opacity: 0.72;
}

/* 徽章 */
.product-badge-wrap {
  position: absolute;
  top: 10px;
  left: 10px;
  z-index: 2;
}

.badge-pill {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: bold;
}

.badge-emerald {
  background: #DEF7EC;
  color: #065F46;
}

.badge-amber {
  background: #FEF3C7;
  color: #D97706;
}

.badge-gray {
  background: #F1F5F9;
  color: #94A3B8;
}

.badge-text {
  font-size: 10px;
  font-weight: 600;
}

/* 产品图标容器 */
.product-icon-container {
  width: 100%;
  height: 96px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
}

.icon-theme-food {
  background: linear-gradient(180deg, #FFFBEB 0%, #FEF3C7 100%);
}

.icon-theme-coffee {
  background: linear-gradient(180deg, #F0FDF4 0%, #DCFCE7 100%);
}

.icon-theme-bike {
  background: linear-gradient(180deg, #ECFDF5 0%, #D1FAE5 100%);
}

.icon-theme-shield {
  background: linear-gradient(180deg, #E6FFFA 0%, #CCFBF1 100%);
}

.icon-theme-default {
  background: linear-gradient(180deg, #F8FAFC 0%, #F1F5F9 100%);
}

.product-vector-svg {
  width: 52px;
  height: 52px;
}

/* 商品详情 */
.product-info-wrap {
  flex: 1;
  display: flex;
  flex-direction: column;
  margin-bottom: 12px;
}

.product-name {
  font-size: 14px;
  font-weight: bold;
  color: #1E293B;
  line-height: 1.35;
  height: 38px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  margin-bottom: 8px;
}

.price-stock-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.price-box {
  display: flex;
  align-items: baseline;
}

.price-value {
  font-size: 18px;
  color: #064E3B;
  font-weight: bold;
}

.price-label {
  font-size: 11px;
  color: #10B981;
  margin-left: 3px;
  font-weight: 600;
}

.stock-info {
  font-size: 10px;
  color: #94A3B8;
}

/* 兑换按钮 */
.action-exchange-btn {
  width: 100%;
  height: 36px;
  border-radius: 18px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 3px 10px rgba(16, 185, 129, 0.25);
  transition: all 0.2s ease;
}

.action-exchange-btn:active {
  transform: scale(0.98);
}

.btn-disabled {
  background: #E2E8F0 !important;
  box-shadow: none !important;
}

.btn-disabled .btn-text {
  color: #94A3B8 !important;
}

.btn-not-enough {
  background: #F1F5F9 !important;
  border: 1px solid #E2E8F0;
  box-shadow: none !important;
}

.btn-not-enough .btn-text {
  color: #64748B !important;
}

.btn-text {
  font-size: 13px;
  color: #FFFFFF;
  font-weight: 600;
}

/* 空状态 */
.empty-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
}

.empty-svg {
  width: 56px;
  height: 56px;
  margin-bottom: 12px;
}

.empty-text {
  font-size: 14px;
  color: #94A3B8;
}

/* 底部留白 */
.bottom-spacer {
  height: 40px;
}
</style>