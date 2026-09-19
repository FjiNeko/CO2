<template>
  <view class="page-viewport">
    <view class="starter-container">
      <!-- 极简半透明玻璃质感巨大棕榈叶脉络背景 (SVG) -->
      <view class="leaf-bg-wrapper">
        <!-- 左上巨大棕榈叶脉络 -->
        <svg class="palm-leaf leaf-top-left" viewBox="0 0 400 600" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.22" />
              <stop offset="60%" stop-color="#10B981" stop-opacity="0.08" />
              <stop offset="100%" stop-color="#10B981" stop-opacity="0.01" />
            </linearGradient>
            <filter id="glassBlur1" x="-10%" y="-10%" width="120%" height="120%">
              <feGaussianBlur stdDeviation="1.5" />
            </filter>
          </defs>
          <path d="M 50 580 C 110 420 180 260 320 80" stroke="url(#leafGrad1)" stroke-width="3" stroke-linecap="round" filter="url(#glassBlur1)"/>
          <path d="M 90 480 C 40 440 10 390 0 350" stroke="url(#leafGrad1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 125 400 C 180 370 230 330 260 270" stroke="url(#leafGrad1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 155 330 C 95 300 60 250 45 200" stroke="url(#leafGrad1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 195 250 C 255 220 300 180 330 120" stroke="url(#leafGrad1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 230 180 C 180 150 145 110 130 60" stroke="url(#leafGrad1)" stroke-width="1.8" stroke-linecap="round" />
          <path d="M 275 125 C 330 100 365 70 385 20" stroke="url(#leafGrad1)" stroke-width="1.8" stroke-linecap="round" />
        </svg>

        <!-- 右下巨大棕榈叶脉络 -->
        <svg class="palm-leaf leaf-bottom-right" viewBox="0 0 450 650" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="leafGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stop-color="#10B981" stop-opacity="0.18" />
              <stop offset="70%" stop-color="#10B981" stop-opacity="0.06" />
              <stop offset="100%" stop-color="#10B981" stop-opacity="0.0" />
            </linearGradient>
          </defs>
          <path d="M 380 50 C 310 220 220 390 70 590" stroke="url(#leafGrad2)" stroke-width="2.5" stroke-linecap="round" />
          <path d="M 330 150 C 390 180 430 220 445 270" stroke="url(#leafGrad2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 290 230 C 220 260 170 310 140 370" stroke="url(#leafGrad2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 245 320 C 315 350 360 400 380 460" stroke="url(#leafGrad2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 195 410 C 130 440 90 490 70 550" stroke="url(#leafGrad2)" stroke-width="1.6" stroke-linecap="round" />
          <path d="M 140 500 C 200 530 240 570 260 620" stroke="url(#leafGrad2)" stroke-width="1.6" stroke-linecap="round" />
        </svg>
      </view>

      <!-- 画面中偏上：吉祥物泡泡（占据全屏幕 50% 高度，严格紧贴文字上方） -->
      <view class="mascot-anchor-section">
        <view class="glass-halo"></view>
        <!-- 紧密裁剪后的透明底泡泡主体 -->
        <image 
          class="mascot-img" 
          src="/static/mascot_paopao.png" 
          mode="heightFix"
        ></image>
      </view>

      <!-- 底部核心交互区 (紧随泡泡脚下，参考图1左侧设计排版) -->
      <view class="bottom-layout-area">
        <view class="hero-bottom-row">
          <!-- 大标题保持在左下角，顶部无多余空白，紧贴泡泡 -->
          <view class="left-title-block">
            <text class="big-year">2026</text>
            <text class="big-app-title">低碳畅行</text>
            <!-- 主行：（加粗）踏入净零旅程 -->
            <text class="primary-headline">踏入净零旅程</text>
          </view>

          <!-- 右侧：参考图里的圆圈带右箭头交互区 -->
          <view class="right-cta-cluster" @click="handleStart">
            <!-- 圆圈带右箭头按钮 (叠加 2px #F59E0B 漫反射光晕) -->
            <view class="circle-arrow-btn">
              <svg class="arrow-svg" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 12H19M19 12L13 6M19 12L13 18" stroke="#F8FAF9" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>

            <!-- 按钮下方文字：“与泡泡共赴低碳日常”与 4px 琥珀色指示圆点 -->
            <view class="cta-label-row">
              <view class="amber-dot"></view>
              <text class="cta-sub-text">与泡泡共赴低碳日常</text>
            </view>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
const handleStart = () => {
  const token = uni.getStorageSync('token')
  if (token) {
    // 已登录：直接跳转主页 (足迹)
    uni.switchTab({
      url: '/pages/index/index',
      fail: () => {
        uni.reLaunch({
          url: '/pages/index/index'
        })
      }
    })
  } else {
    // 未登录：先跳转登录页面
    uni.reLaunch({
      url: '/pages/auth/login'
    })
  }
}
</script>

<style scoped>
/* 引入类似参考图的现代化几何无衬线免费商用字体 Outfit Black (OFL) */
@font-face {
  font-family: 'OutfitBold';
  src: url('/static/fonts/Outfit-Black.ttf') format('truetype');
  font-weight: 800 900;
  font-style: normal;
  font-display: swap;
}

/* 引入阿里巴巴普惠体 (官方全渠道免费商用) */
@font-face {
  font-family: 'AlibabaPuHuiTi';
  src: url('/static/fonts/AlibabaPuHuiTi-Bold.woff2') format('woff2');
  font-weight: 700 800 900;
  font-style: normal;
  font-display: swap;
}

/* 外部居中视口（适配 PC 浏览居中与移动端全屏） */
.page-viewport {
  width: 100vw;
  min-height: 100vh;
  background-color: #e9ecef;
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 页面主容器：中心聚焦式构图，轻拟物 + 玻璃质感 */
.starter-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  height: 100vh;
  max-height: 920px;
  background-color: #F8FAF9;
  background-image: 
    radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.11) 0%, rgba(16, 185, 129, 0.03) 50%, rgba(248, 250, 249, 0) 80%),
    linear-gradient(180deg, #F8FAF9 0%, #f0f6f3 58%, #F8FAF9 100%);
  display: flex;
  flex-direction: column;
  justify-content: flex-end; /* 朝底部紧凑排版 */
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
  opacity: 0.85;
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

/* 吉祥物泡泡区域：精确占据全屏 50% 高度，严格贴靠在 2026 文字顶端 */
.mascot-anchor-section {
  position: relative;
  z-index: 3;
  height: 50vh;
  max-height: 50vh;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-bottom: -12px; /* 负边距使泡泡脚底彻底紧咬 2026 文字顶边 */
  padding: 0;
}

/* 柔和漫反射高光光晕底板 */
.glass-halo {
  position: absolute;
  width: 44vh;
  height: 44vh;
  max-width: 420px;
  max-height: 420px;
  bottom: 0px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.95) 0%, rgba(240, 253, 244, 0.45) 55%, rgba(16, 185, 129, 0) 75%);
  filter: blur(14px);
  z-index: 1;
}

/* 透明底吉祥物主体：50% 屏幕高度，真实触底 */
.mascot-img {
  position: relative;
  height: 50vh;
  max-height: 50vh;
  width: auto;
  display: block;
  z-index: 2;
  filter: drop-shadow(0 16px 26px rgba(16, 185, 129, 0.22));
  transform-origin: bottom center;
  animation: floatMascot 4s ease-in-out infinite;
}

@keyframes floatMascot {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-6px);
  }
}

/* 底部核心展示与交互区 (参考图1排版) */
.bottom-layout-area {
  position: relative;
  z-index: 5;
  padding: 0 24px 38px 24px;
  display: flex;
  flex-direction: column;
}

/* 左右对齐底排：左侧大标题 + 右侧圆形箭头按钮与文字 */
.hero-bottom-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  width: 100%;
}

/* 大标题保持在左下角 */
.left-title-block {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* 2026 大字标：采用 Outfit Black (OFL)，紧凑行高消除顶部空白 */
.big-year {
  font-family: 'OutfitBold', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: clamp(52px, 14vw, 80pt);
  font-weight: 900;
  color: #064E3B;
  line-height: 0.82;
  margin: 0;
  padding: 0;
  display: block;
}

/* 低碳畅行 标题：66pt 磅数，使用阿里巴巴普惠体 */
.big-app-title {
  font-family: 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(36px, 10vw, 66pt);
  font-weight: 800;
  color: #064E3B;
  line-height: 1.05;
  margin-top: 6px;
  letter-spacing: -0.5px;
}

/* 主行：（加粗）踏入净零旅程，使用阿里巴巴普惠体 */
.primary-headline {
  font-family: 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif;
  font-size: clamp(15pt, 4vw, 22pt);
  font-weight: 700;
  color: #064E3B;
  line-height: 1.25;
  margin-top: 8px;
  letter-spacing: 0.2px;
  white-space: nowrap;
}

/* 右侧交互区：圆圈带右箭头与文字 */
.right-cta-cluster {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  padding-bottom: 2px;
  margin-left: 14px;
  flex-shrink: 0;
}

/* 参考图里的圆圈带右箭头按钮 */
.circle-arrow-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%; /* 正圆形 */
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  /* 按钮边缘叠加轻微的 2px #F59E0B 漫反射光晕 */
  box-shadow: 
    0 0 16px 2px rgba(245, 158, 11, 0.44),
    0 8px 20px -2px rgba(16, 185, 129, 0.38),
    inset 0 1.5px 2px rgba(255, 255, 255, 0.45);
  transition: all 0.22s ease;
  animation: buttonPulse 3s ease-in-out infinite;
}

.circle-arrow-btn:active {
  transform: scale(0.92);
  box-shadow: 
    0 0 8px 1px rgba(245, 158, 11, 0.45),
    0 4px 10px rgba(16, 185, 129, 0.3);
}

.arrow-svg {
  width: 24px;
  height: 24px;
}

/* 微呼吸微动效 */
@keyframes buttonPulse {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-3px) scale(1.03);
  }
}

/* 按钮下方文字：“与泡泡共赴低碳日常” */
.cta-label-row {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 8px;
}

/* 4px 微型指示圆点以 #F59E0B 为主色 */
.amber-dot {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: #F59E0B;
  box-shadow: 0 0 6px rgba(245, 158, 11, 0.9);
  flex-shrink: 0;
}

/* 文字：与泡泡共赴低碳日常 11pt 透明度 60% */
.cta-sub-text {
  font-size: 11pt;
  font-weight: 500;
  color: #064E3B;
  opacity: 0.65;
  letter-spacing: 0.2px;
  white-space: nowrap;
}
</style>
