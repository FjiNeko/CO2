<template>
  <view class="login-viewport">
    <view class="login-container">
      <!-- 顶部 NanoBanana 3D 沉浸式生态横幅 -->
      <view class="top-hero-banner">
        <!-- 横幅底图 1：睁眼欢迎态 (常态 / 手机号输入) -->
        <image
          class="banner-bg-img"
          :class="{ 'banner-active': !isShyMode, 'banner-faded': isShyMode }"
          src="/static/login_welcome.png"
          mode="aspectFill"
        ></image>

        <!-- 横幅底图 2：遮眼害羞态 (密码框聚焦时切换) -->
        <image
          class="banner-bg-img"
          :class="{ 'banner-active': isShyMode, 'banner-faded': !isShyMode }"
          src="/static/login_shy.png"
          mode="aspectFill"
        ></image>

        <!-- 顶部功能浮层：导航条与排版文字 (严格布局在左侧留白区) -->
        <view class="banner-overlay">
          <!-- 导航栏 -->
          <view class="banner-nav-bar">
            <view class="nav-back-btn" @click="handleBack">
              <!-- 矢量 SVG 返回箭头 (严禁 Emoji) -->
              <svg class="nav-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M15 18L9 12L15 6" stroke="#064E3B" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
            <!-- 右上角切换入口 (参考图设计：密码登录 / 验证码登录) -->
            <view class="nav-switch-btn" @click="toggleLoginMode">
              <text class="switch-text chinese-font">{{ loginMode === 'sms' ? '密码登录' : '验证码登录' }}</text>
            </view>
          </view>

          <!-- 左上排版留白区：品牌标语 -->
          <view class="welcome-title-group">
            <text class="welcome-lead chinese-font">欢迎来到</text>
            <view class="welcome-brand-row">
              <text class="brand-name chinese-font">碳行</text>
              <text class="brand-suffix number-font">CO₂</text>
            </view>
            <view class="brand-tag-row">
              <view class="amber-indicator-dot"></view>
              <text class="brand-sub-tag chinese-font">与泡泡共赴净零日常</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 下方悬浮白卡表单容器 (圆角弧形向上衔接横幅) -->
      <view class="form-sheet-card">
        <!-- 快捷模式指示标签 -->
        <view class="form-header-bar">
          <text class="form-mode-title chinese-font">{{ loginMode === 'sms' ? '手机验证码登录' : '账号密码登录' }}</text>
          <text class="form-mode-sub chinese-font">{{ loginMode === 'sms' ? '未注册手机号将自动创建碳账户' : '官方高安全加密鉴权体系' }}</text>
        </view>

        <!-- 表单区域 A：手机短信验证码登录 (100% 对应参考图) -->
        <view v-if="loginMode === 'sms'" class="form-content-wrap">
          <!-- 手机号输入框组合 -->
          <view class="input-line-box">
            <view class="country-code-pill">
              <text class="code-text number-font">+86</text>
              <svg class="chevron-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6 8L10 12L14 8" stroke="#064E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
            <view class="input-divider"></view>
            <input
              class="field-input number-font"
              type="number"
              maxlength="11"
              v-model="smsPhone"
              placeholder="请输入手机号码"
              placeholder-class="field-placeholder chinese-font"
            />
            <view v-if="smsPhone" class="clear-btn" @click="smsPhone = ''">
              <svg class="clear-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" fill="#E5E7EB"/>
                <path d="M7 7L13 13M13 7L7 13" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </view>
          </view>

          <!-- 验证码输入框：仅在输入了完整的 11 位手机号后才展示 -->
          <view v-if="smsPhone.trim().length === 11" class="input-line-box mt-3 fade-in-slide">
            <view class="input-prefix-icon">
              <!-- 安全盾牌矢量 SVG 图标 -->
              <svg class="field-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#064E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M9 12l2 2 4-4" stroke="#064E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
            <input
              class="field-input number-font"
              type="number"
              maxlength="6"
              v-model="smsCode"
              placeholder="请输入6位验证码"
              placeholder-class="field-placeholder chinese-font"
            />
            <view v-if="smsCode" class="clear-btn" @click="smsCode = ''">
              <svg class="clear-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" fill="#E5E7EB"/>
                <path d="M7 7L13 13M13 7L7 13" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </view>
            <view class="sms-send-btn" :class="{ 'sms-btn-disabled': countdown > 0 }" @click="handleSendCode">
              <text class="sms-btn-text" :class="countdown > 0 ? 'number-font' : 'chinese-font'">
                {{ countdown > 0 ? `${countdown}s` : (smsCodeSent ? '重新获取' : '获取验证码') }}
              </text>
            </view>
          </view>

          <!-- 主操作按钮 (参考图翠绿大按钮) -->
          <button
            class="submit-action-btn chinese-font"
            :class="{ 'btn-disabled': !canSubmitSms }"
            :loading="loading"
            @click="handleSubmitSms"
          >
            {{ smsPhone.trim().length === 11 ? '登 录' : '获取验证码' }}
          </button>

          <!-- 快捷子入口 (参考图设计：快速注册) -->
          <view class="sub-action-links">
            <text class="sub-link-text chinese-font" @click="handleQuickRegister">快速注册</text>
            <text class="sub-link-divider">|</text>
            <text class="sub-link-text chinese-font" @click="switchMode('password')">账号密码登录</text>
          </view>
        </view>

        <!-- 表单区域 B：账号密码登录 (无缝对接 FastAPI /api/v4/auth/login) -->
        <view v-else class="form-content-wrap">
          <!-- 账号输入框 -->
          <view class="input-line-box">
            <view class="input-prefix-icon">
              <svg class="field-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M20 21V19C20 16.7909 18.2091 15 16 15H8C5.79086 15 4 16.7909 4 19V21" stroke="#064E3B" stroke-width="2" stroke-linecap="round"/>
                <circle cx="12" cy="7" r="4" stroke="#064E3B" stroke-width="2"/>
              </svg>
            </view>
            <input
              class="field-input"
              type="text"
              v-model="username"
              placeholder="请输入账号 (如 testuser / user)"
              placeholder-class="field-placeholder chinese-font"
            />
            <view v-if="username" class="clear-btn" @click="username = ''">
              <svg class="clear-icon" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="10" cy="10" r="9" fill="#E5E7EB"/>
                <path d="M7 7L13 13M13 7L7 13" stroke="#9CA3AF" stroke-width="2" stroke-linecap="round"/>
              </svg>
            </view>
          </view>

          <!-- 密码输入框 (聚焦时激活吉祥物遮眼害羞态 isShyMode) -->
          <view class="input-line-box mt-3">
            <view class="input-prefix-icon">
              <svg class="field-svg-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="5" y="11" width="14" height="10" rx="2" stroke="#064E3B" stroke-width="2"/>
                <path d="M8 11V7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7V11" stroke="#064E3B" stroke-width="2"/>
              </svg>
            </view>
            <input
              class="field-input"
              :password="!showPassword"
              v-model="password"
              placeholder="请输入密码 (默认 123456)"
              placeholder-class="field-placeholder chinese-font"
              @focus="onPasswordFocus"
              @blur="onPasswordBlur"
            />
            <!-- 密码显隐切换图标 (矢量 SVG) -->
            <view class="pwd-toggle-btn" @click="showPassword = !showPassword">
              <!-- 显式状态 -->
              <svg v-if="showPassword" class="pwd-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 12S5 4 12 4s11 8 11 8-4 8-11 8-11-8-11-8z" stroke="#064E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <circle cx="12" cy="12" r="3" stroke="#064E3B" stroke-width="2"/>
              </svg>
              <!-- 隐式状态 -->
              <svg v-else class="pwd-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" stroke="#064E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                <line x1="1" y1="1" x2="23" y2="23" stroke="#064E3B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </view>
          </view>

          <!-- 极速体验快捷填入胶囊 (一键填入管理员或居民测试账号) -->
          <view class="quick-chips-row">
            <text class="chips-hint chinese-font">快捷测试：</text>
            <view class="quick-chip" @click="fillQuickAccount('testuser', '123456')">
              <view class="chip-admin-dot"></view>
              <text class="chip-text"><text class="chinese-font">管理员</text> (<text class="number-font">testuser</text>)</text>
            </view>
            <view class="quick-chip" @click="fillQuickAccount('user', '123456')">
              <view class="chip-user-dot"></view>
              <text class="chip-text"><text class="chinese-font">低碳居民</text> (<text class="number-font">user</text>)</text>
            </view>
          </view>

          <!-- 主操作按钮 -->
          <button
            class="submit-action-btn chinese-font"
            :class="{ 'btn-disabled': !canSubmitPassword }"
            :loading="loading"
            @click="handleSubmitPassword"
          >
            登 录
          </button>

          <!-- 快捷子入口 -->
          <view class="sub-action-links">
            <text class="sub-link-text chinese-font" @click="switchMode('sms')">验证码快捷登录</text>
            <text class="sub-link-divider">|</text>
            <text class="sub-link-text chinese-font" @click="handleForgetPassword">忘记密码</text>
          </view>
        </view>

        <!-- 底部弹性扩展空间 -->
        <view class="spacer-flex"></view>

        <!-- 第三方账号登录模块 (严格复刻参考图 纯矢量无 Emoji) -->
        <view class="third-party-section">
          <view class="third-divider-row">
            <view class="divider-line"></view>
            <text class="divider-text chinese-font">第三方账号登录</text>
            <view class="divider-line"></view>
          </view>

          <view class="oauth-icons-cluster">
            <!-- 微信生态图标 (矢量 SVG - 官方标准路径与微信绿) -->
            <view class="oauth-circle-btn" @click="handleThirdPartyLogin('微信')">
              <svg class="oauth-svg-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>WeChat</title>
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-6.656-6.088V8.89c-.135-.01-.27-.027-.407-.03zm-2.53 3.274c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.844 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.969-.982z" fill="#07C160"/>
              </svg>
              <text class="oauth-name chinese-font">微信</text>
            </view>

            <!-- Apple 图标 (矢量 SVG - 官方标准路径与专属黑色) -->
            <view class="oauth-circle-btn" @click="handleThirdPartyLogin('Apple')">
              <svg class="oauth-svg-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>Apple</title>
                <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" fill="#000000"/>
              </svg>
              <text class="oauth-name">Apple</text>
            </view>

            <!-- Google 图标 (矢量 SVG - 官方标准路径与 Google 红) -->
            <view class="oauth-circle-btn" @click="handleThirdPartyLogin('Google')">
              <svg class="oauth-svg-icon" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <title>Google</title>
                <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" fill="#EA4335"/>
              </svg>
              <text class="oauth-name">Google</text>
            </view>
          </view>
        </view>

        <!-- 底部协议许可勾选区 (参考图圆圈勾选协议) -->
        <view class="agreement-consent-row" @click="agreeTerms = !agreeTerms">
          <view class="custom-checkbox" :class="{ 'checked': agreeTerms }">
            <svg v-if="agreeTerms" class="check-tick-svg" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="#FFFFFF" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </view>
          <text class="agreement-desc chinese-font">
            阅读并同意
            <text class="link-highlight" @click.stop="viewProtocol('用户协议')">《用户协议》</text>
            和
            <text class="link-highlight" @click.stop="viewProtocol('隐私政策')">《隐私政策》</text>
          </text>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { loginApi } from '@/api/auth.js'

// 登录模式：'sms' (手机验证码) 或 'password' (账号密码)
const loginMode = ref('sms')

// 吉祥物害羞模式 (输入密码或特定聚焦状态时为 true)
const isShyMode = ref(false)

// 协议勾选状态
const agreeTerms = ref(false)

// 手机号与短信验证码状态
const smsPhone = ref('')
const smsCode = ref('')
const smsCodeSent = ref(false)
const countdown = ref(0)
let timer = null

// 账号密码状态
const username = ref('')
const password = ref('')
const showPassword = ref(false)

// 请求加载状态
const loading = ref(false)

// 计算是否可提交验证码模式：输入完整11位手机号即激活
const canSubmitSms = computed(() => {
  return smsPhone.value.trim().length === 11
})

// 计算是否可提交密码模式
const canSubmitPassword = computed(() => {
  return username.value.trim().length > 0 && password.value.trim().length > 0
})

// 切换登录模式
const toggleLoginMode = () => {
  loginMode.value = loginMode.value === 'sms' ? 'password' : 'sms'
  isShyMode.value = false
}

const switchMode = (mode) => {
  loginMode.value = mode
  isShyMode.value = false
}

// 聚焦密码框：触发泡泡害羞遮眼萌动态
const onPasswordFocus = () => {
  isShyMode.value = true
}

// 离开密码框：恢复泡泡开朗欢迎常态
const onPasswordBlur = () => {
  isShyMode.value = false
}

// 一键快捷填入预设账号
const fillQuickAccount = (u, p) => {
  username.value = u
  password.value = p
  uni.showToast({
    title: `已填入 ${u} 凭证`,
    icon: 'none',
    duration: 1200
  })
}

// 返回上一页或返回主页
const handleBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.switchTab({
      url: '/pages/index/index',
      fail: () => uni.reLaunch({ url: '/pages/index/index' })
    })
  }
}

// 发送短信验证码
const handleSendCode = () => {
  if (countdown.value > 0) return
  if (smsPhone.value.trim().length !== 11) {
    uni.showToast({ title: '请输入有效的11位手机号', icon: 'none' })
    return
  }

  loading.value = true
  setTimeout(() => {
    loading.value = false
    smsCodeSent.value = true
    smsCode.value = '123456' // 便捷预填体验码
    countdown.value = 60
    if (timer) clearInterval(timer)
    timer = setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    uni.showToast({
      title: '验证码已发送 (体验码: 123456)',
      icon: 'none',
      duration: 2500
    })
  }, 500)
}

// 提交短信验证码登录
const handleSubmitSms = async () => {
  if (!agreeTerms.value) {
    uni.showToast({
      title: '请阅读并勾选协议',
      icon: 'none'
    })
    return
  }

  if (smsPhone.value.trim().length !== 11) {
    uni.showToast({ title: '请输入有效的11位手机号', icon: 'none' })
    return
  }

  if (!smsCode.value.trim()) {
    if (!smsCodeSent.value) {
      handleSendCode()
      return
    }
    uni.showToast({ title: '请输入6位验证码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await loginApi('user', '123456')
    uni.setStorageSync('mobile', smsPhone.value)
    uni.showToast({
      title: '登录成功',
      icon: 'none',
      duration: 1500
    })
    setTimeout(() => {
      handleLoginSuccess()
    }, 1200)
  } catch (err) {
    uni.showToast({
      title: err?.detail || '登录失败，请稍后重试',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 提交账号密码登录 (无缝对接 FastAPI 后端)
const handleSubmitPassword = async () => {
  if (!agreeTerms.value) {
    uni.showToast({
      title: '请阅读并勾选协议',
      icon: 'none'
    })
    return
  }

  if (!username.value.trim() || !password.value.trim()) {
    uni.showToast({ title: '请输入账号和密码', icon: 'none' })
    return
  }

  loading.value = true
  try {
    const res = await loginApi(username.value.trim(), password.value.trim())
    uni.showToast({
      title: `登录成功 (${res.role === 'admin' ? '系统管理员' : '低碳居民'})`,
      icon: 'none',
      duration: 1500
    })
    setTimeout(() => {
      handleLoginSuccess()
    }, 1200)
  } catch (err) {
    uni.showToast({
      title: err?.detail || '用户名或密码错误',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

// 登录成功后跳转 (C端纯化：统一跳转至移动端首页)
const handleLoginSuccess = () => {
  uni.switchTab({
    url: '/pages/index/index',
    fail: () => uni.reLaunch({ url: '/pages/index/index' })
  })
}

// 快速注册
const handleQuickRegister = () => {
  uni.showModal({
    title: '快速注册',
    content: '低碳畅行现已开启免密极速开户，输入手机号获取验证码即可直接完成注册与创建碳账户。',
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: '#10B981'
  })
}

// 忘记密码
const handleForgetPassword = () => {
  uni.showModal({
    title: '找回密码',
    content: '测试环境默认账号为 testuser (管理员) 和 user (普通居民)，默认密码均为 123456。如需重置密码请联系系统管理员。',
    showCancel: false,
    confirmText: '我知道了',
    confirmColor: '#10B981'
  })
}

// 第三方登录提示
const handleThirdPartyLogin = (platform) => {
  uni.showToast({
    title: `${platform} 一键授权服务正在接入中`,
    icon: 'none'
  })
}

// 查看协议
const viewProtocol = (title) => {
  uni.showModal({
    title: `《${title}》`,
    content: `欢迎使用低碳畅行绿色消费账户系统。本服务由绿色计算与碳普惠大数据实验室提供，严格保障您的个人隐私与数据安全。`,
    showCancel: false,
    confirmText: '已阅读',
    confirmColor: '#10B981'
  })
}
</script>

<style scoped>
/* 1. 引入初始页 2026 数字字体 Outfit-Black (OFL) */
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

/* 全局字体适配规范：中文使用普惠体，数字使用 OutfitBold */
.chinese-font {
  font-family: 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
}

.number-font {
  font-family: 'OutfitBold', sans-serif !important;
  font-weight: 800;
  letter-spacing: 0.5px;
}

/* 视口与基准容器 (优化移动端软键盘弹出时的回弹与滚动，防止内容被截断或遮挡) */
.login-viewport {
  width: 100vw;
  min-height: 100vh;
  background-color: #E8ECE9;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  font-family: 'OutfitBold', 'AlibabaPuHuiTi', 'Alibaba PuHuiTi 3.0', 'PingFang SC', 'Microsoft YaHei', sans-serif;
}

.login-container {
  position: relative;
  width: 100%;
  max-width: 480px;
  min-height: 100vh;
  background-color: #FFFFFF;
  display: flex;
  flex-direction: column;
  overflow-x: hidden;
  box-sizing: border-box;
}

/* 顶部 16:9 横幅插画区域 */
.top-hero-banner {
  position: relative;
  width: 100%;
  height: 275px;
  overflow: hidden;
  background-color: #E5F3ED;
  flex-shrink: 0;
}

/* 16:9 渲染图全屏铺满底图 */
.banner-bg-img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: right center;
  transition: opacity 0.4s ease;
}

.banner-active {
  opacity: 1;
  z-index: 1;
}

.banner-faded {
  opacity: 0;
  z-index: 0;
}

/* 悬浮在横幅上的信息图层 */
.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  box-sizing: border-box;
  padding: 44px 22px 24px 22px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  pointer-events: none;
}

/* 顶部导航栏 */
.banner-nav-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  pointer-events: auto;
}

.nav-back-btn {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(6, 78, 59, 0.08);
  transition: background 0.2s;
  flex-shrink: 0;
}

.nav-back-btn:active {
  background: rgba(255, 255, 255, 0.95);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
}

.nav-switch-btn {
  padding: 6px 14px;
  border-radius: 20px;
  background: rgba(255, 255, 255, 0.75);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(6, 78, 59, 0.12);
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(6, 78, 59, 0.08);
  transition: all 0.2s;
  flex-shrink: 0;
}

.nav-switch-btn:active {
  background: rgba(255, 255, 255, 0.95);
}

.switch-text {
  font-size: 13px;
  font-weight: 700;
  color: #064E3B;
  letter-spacing: 0.5px;
}

/* 左上留白区品牌排版 */
.welcome-title-group {
  display: flex;
  flex-direction: column;
  max-width: 58%;
  pointer-events: auto;
  margin-bottom: 22px;
}

.welcome-lead {
  font-size: 26px;
  font-weight: 800;
  color: #064E3B;
  letter-spacing: 0.5px;
  line-height: 1.15;
}

.welcome-brand-row {
  display: flex;
  align-items: baseline;
  gap: 6px;
  margin-top: 4px;
}

.brand-name {
  font-size: 32px;
  font-weight: 900;
  color: #D97706; /* 暖阳琥珀金加重对比度 */
  letter-spacing: 1px;
  text-shadow: 0 2px 8px rgba(217, 119, 6, 0.2);
}

.brand-suffix {
  font-size: 22px;
  font-weight: 900;
  color: #10B981;
  letter-spacing: 0.5px;
}

.brand-tag-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
}

.amber-indicator-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background-color: #F59E0B;
  box-shadow: 0 0 8px #F59E0B;
  flex-shrink: 0;
}

.brand-sub-tag {
  font-size: 12px;
  color: #064E3B;
  opacity: 0.75;
  letter-spacing: 0.3px;
  font-weight: 600;
}

/* 下方悬浮白卡表单卡片 (圆角向上微 overlap) */
.form-sheet-card {
  position: relative;
  z-index: 5;
  flex: 1;
  margin-top: -20px;
  border-radius: 28px 28px 0 0;
  background-color: #FFFFFF;
  padding: 30px 24px 28px 24px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 -8px 28px rgba(6, 78, 59, 0.09);
}

.form-header-bar {
  margin-bottom: 22px;
}

.form-mode-title {
  font-size: 20px;
  font-weight: 800;
  color: #064E3B;
  display: block;
}

.form-mode-sub {
  font-size: 12px;
  color: #6B7280;
  margin-top: 4px;
  display: block;
}

/* 输入框组合通用样式：高灵敏布局，防止任何图标被遮挡 */
.form-content-wrap {
  display: flex;
  flex-direction: column;
}

.input-line-box {
  position: relative;
  display: flex;
  align-items: center;
  height: 52px;
  background-color: #F8FAF9;
  border-radius: 14px;
  padding: 0 14px;
  border: 1px solid #E5E7EB;
  box-sizing: border-box;
  transition: border-color 0.2s, background-color 0.2s;
  overflow: visible;
}

.input-line-box:focus-within {
  border-color: #10B981;
  background-color: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.12);
}

.mt-3 {
  margin-top: 14px;
}

@keyframes slideDownFade {
  from {
    opacity: 0;
    transform: translateY(-8px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in-slide {
  animation: slideDownFade 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.country-code-pill {
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  flex-shrink: 0;
}

.code-text {
  font-size: 16px;
  font-weight: 800;
  color: #064E3B;
}

.chevron-icon {
  width: 14px;
  height: 14px;
  min-width: 14px;
  flex-shrink: 0;
}

.input-divider {
  width: 1px;
  height: 22px;
  min-width: 1px;
  background-color: #D1D5DB;
  margin: 0 12px;
  flex-shrink: 0;
}

/* 前缀图标容器：固定 24x24 尺寸与 flex-shrink:0，绝对不被压缩或遮挡 */
.input-prefix-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  max-width: 24px;
  margin-right: 10px;
  flex-shrink: 0;
}

.field-svg-icon {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  flex-shrink: 0;
  display: block;
}

/* 核心输入框：width: 0 与 min-width: 0 彻底杜绝 flex 溢出挤压遮挡两侧图标 */
.field-input {
  flex: 1;
  width: 0;
  min-width: 0;
  height: 100%;
  font-size: 16px;
  color: #111827;
  font-weight: 600;
  background: transparent;
  border: none;
  outline: none;
}

.field-placeholder {
  color: #9CA3AF;
  font-size: 14px;
  font-weight: normal;
}

/* 清除图标容器 */
.clear-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  min-width: 24px;
  cursor: pointer;
  padding: 2px;
  margin-right: 6px;
  flex-shrink: 0;
}

.clear-icon {
  width: 18px;
  height: 18px;
  min-width: 18px;
  min-height: 18px;
  flex-shrink: 0;
  display: block;
}

/* 密码显隐切换按钮 */
.pwd-toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  min-width: 28px;
  cursor: pointer;
  padding: 4px;
  flex-shrink: 0;
}

.pwd-icon {
  width: 20px;
  height: 20px;
  min-width: 20px;
  min-height: 20px;
  flex-shrink: 0;
  display: block;
}

/* 验证码右侧获取/倒计时按钮 */
.sms-send-btn {
  flex-shrink: 0;
  padding: 6px 12px;
  background-color: #E6F4EA;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  box-sizing: border-box;
}

.sms-send-btn:active {
  background-color: #D1EAD8;
}

.sms-btn-disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.sms-btn-text {
  font-size: 13px;
  font-weight: 700;
  color: #10B981;
  white-space: nowrap;
}

/* 快捷测试胶囊 */
.quick-chips-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 14px;
  margin-bottom: 6px;
}

.chips-hint {
  font-size: 12px;
  color: #9CA3AF;
}

.quick-chip {
  display: flex;
  align-items: center;
  gap: 6px;
  background-color: #F3F4F6;
  padding: 5px 10px;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #E5E7EB;
}

.quick-chip:active {
  background-color: #E5E7EB;
  transform: scale(0.96);
}

.chip-admin-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #EF4444;
  flex-shrink: 0;
}

.chip-user-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #10B981;
  flex-shrink: 0;
}

.chip-text {
  font-size: 11px;
  font-weight: 600;
  color: #374151;
}

/* 主提交按钮 (参考图翠绿大圆角按钮) */
.submit-action-btn {
  width: 100%;
  height: 52px;
  border-radius: 26px;
  background: linear-gradient(135deg, #10B981 0%, #059669 100%);
  color: #FFFFFF;
  font-size: 17px;
  font-weight: 700;
  letter-spacing: 1.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 24px;
  box-shadow: 
    0 8px 20px -2px rgba(16, 185, 129, 0.38),
    0 0 14px rgba(245, 158, 11, 0.2);
  border: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.submit-action-btn:active {
  transform: scale(0.98);
  box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
}

.btn-disabled {
  opacity: 0.65;
  cursor: not-allowed;
}

/* 按钮下方子入口 */
.sub-action-links {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-top: 16px;
}

.sub-link-text {
  font-size: 13px;
  color: #6B7280;
  cursor: pointer;
  transition: color 0.2s;
}

.sub-link-text:active {
  color: #10B981;
}

.sub-link-divider {
  font-size: 12px;
  color: #D1D5DB;
}

.spacer-flex {
  flex: 1;
  min-height: 20px;
}

/* 第三方登录模块 (参考图纯矢量圆圈按键) */
.third-party-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 20px;
  margin-bottom: 20px;
}

.third-divider-row {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.divider-line {
  flex: 1;
  height: 1px;
  background-color: #E5E7EB;
}

.divider-text {
  font-size: 12px;
  color: #9CA3AF;
  letter-spacing: 0.3px;
}

.oauth-icons-cluster {
  display: flex;
  justify-content: center;
  gap: 32px;
  margin-top: 18px;
}

.oauth-circle-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.oauth-svg-icon {
  width: 44px;
  height: 44px;
  padding: 10px;
  border-radius: 50%;
  background-color: #F3F4F6;
  border: 1px solid #E5E7EB;
  transition: all 0.2s;
  box-sizing: border-box;
}

.oauth-circle-btn:active .oauth-svg-icon {
  background-color: #E5E7EB;
  transform: scale(0.92);
}

.oauth-name {
  font-size: 11px;
  color: #6B7280;
  font-weight: 500;
}

/* 协议同意勾选 */
.agreement-consent-row {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  padding-bottom: 8px;
}

.custom-checkbox {
  width: 17px;
  height: 17px;
  border-radius: 50%;
  border: 1.6px solid #CBD5E1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #FFFFFF;
  transition: all 0.2s;
  flex-shrink: 0;
}

.custom-checkbox.checked {
  background-color: #10B981;
  border-color: #10B981;
}

.check-tick-svg {
  width: 11px;
  height: 11px;
  flex-shrink: 0;
}

.agreement-desc {
  font-size: 11.5px;
  color: #9CA3AF;
  line-height: 1.4;
}

.link-highlight {
  color: #10B981;
  font-weight: 600;
  cursor: pointer;
}
</style>
