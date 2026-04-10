<template>
  <view class="rank-container">
    <view class="rank-header">
      <text class="title">低碳先锋榜</text>
      <text class="subtitle">全站生态贡献实时排行</text>
    </view>

    <view class="podium-area" v-if="podiumList.length > 0">
      <view class="podium-item" v-if="podiumList[1]">
        <view class="avatar-wrap eco-2">
          <image class="avatar-img" src="/static/rank/avatar_2.png" mode="aspectFill"></image>
        </view>
        <text class="name">{{ podiumList[1].username }}</text>
        <view class="step step-2">
          <image class="step-icon" src="/static/rank/icon_leaf.png" mode="aspectFit"></image>
          <text class="rank-text">No.2</text>
          <text class="score">{{ podiumList[1].total_points }}</text>
        </view>
      </view>

      <view class="podium-item first-place" v-if="podiumList[0]">
        <image class="sprout-deco" src="/static/rank/top_sprout.png" mode="aspectFit"></image>
        <view class="avatar-wrap eco-1">
          <image class="avatar-img-main" src="/static/rank/avatar_1.png" mode="aspectFill"></image>
        </view>
        <text class="name">{{ podiumList[0].username }}</text>
        <view class="step step-1">
          <image class="step-icon-main" src="/static/rank/icon_tree.png" mode="aspectFit"></image>
          <text class="rank-text">No.1</text>
          <text class="score">{{ podiumList[0].total_points }}</text>
        </view>
      </view>

      <view class="podium-item" v-if="podiumList[2]">
        <view class="avatar-wrap eco-3">
          <image class="avatar-img" src="/static/rank/avatar_3.png" mode="aspectFill"></image>
        </view>
        <text class="name">{{ podiumList[2].username }}</text>
        <view class="step step-3">
          <image class="step-icon" src="/static/rank/icon_clover.png" mode="aspectFit"></image>
          <text class="rank-text">No.3</text>
          <text class="score">{{ podiumList[2].total_points }}</text>
        </view>
      </view>
    </view>

    <view class="list-area" v-if="restList.length > 0">
      <view class="list-item" v-for="(item, index) in restList" :key="index">
        <view class="rank-num">{{ index + 4 }}</view>
        <image class="list-avatar-img" src="/static/rank/default_avatar.png" mode="aspectFill"></image>
        <view class="info">
          <text class="list-name">{{ item.username }}</text>
          <text class="list-desc">累计申报 {{ item.activity_count }} 次</text>
        </view>
        <view class="list-points">
          <text class="val">{{ item.total_points }}</text>
          <text class="unit">积分</text>
        </view>
      </view>
    </view>
    
    <view class="empty-state" v-if="rankList.length === 0">
      <text>暂无数据，快去成为第一个低碳先锋吧！</text>
    </view>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { request } from '@/api/request.js'

const rankList = ref([])

// 提取前三名
const podiumList = computed(() => {
  return rankList.value.slice(0, 3)
})

// 提取第四名及之后
const restList = computed(() => {
  return rankList.value.slice(3)
})

const fetchRank = async () => {
  try {
    const res = await request({ url: '/rank/top', method: 'GET' })
    if (res.code === 200 && res.data) {
      rankList.value = res.data
    }
  } catch (e) {
    console.error('排行榜拉取失败:', e)
  }
}

onShow(() => {
  fetchRank()
})
</script>

<style>
/* 全局生态渐变背景：清新氧气感 */
.rank-container {
  min-height: 100vh;
  background: linear-gradient(180deg, #4caf50 0%, #f4f9f5 35%);
  padding: 0 20px 20px;
}

.rank-header {
  text-align: center;
  padding: 40px 0 20px;
  color: #fff;
}
.title {
  font-size: 26px;
  font-weight: bold;
  display: block;
  letter-spacing: 2px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.1);
}
.subtitle {
  font-size: 13px;
  opacity: 0.9;
  margin-top: 5px;
}

/* ================= 生态领奖台布局 ================= */
.podium-area {
  display: flex;
  justify-content: center;
  align-items: flex-end;
  margin-top: 20px;
  height: 230px; /* 稍微调高一点，给图片留空间 */
}

.podium-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 30%;
  position: relative;
}

.first-place {
  width: 36%;
  z-index: 10;
}

/* 头像外圈生态色 (CSS 保持不变，作为图片的边框) */
.avatar-wrap {
  border-radius: 50%;
  padding: 3px;
  background: #fff;
  margin-bottom: 8px;
  box-shadow: 0 4px 10px rgba(0,0,0,0.08);
  display: flex; /* 确保图片居中 */
  justify-content: center;
  align-items: center;
}
.eco-1 { background: linear-gradient(135deg, #43a047, #1b5e20); } /* 森林绿 */
.eco-2 { background: linear-gradient(135deg, #8bc34a, #558b2f); } /* 生机绿 */
.eco-3 { background: linear-gradient(135deg, #26a69a, #00695c); } /* 海洋青 */

/* 替换后的头像图片样式 */
.avatar-img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid #fff;
}
.avatar-img-main {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: 2px solid #fff;
}

/* 第一名头顶的小幼苗动效 (改为图片) */
.sprout-deco {
  position: absolute;
  top: -30px;
  width: 35px;
  height: 35px;
  animation: grow 2s infinite ease-in-out;
}
@keyframes grow {
  0% { transform: translateY(0) scale(1); }
  50% { transform: translateY(-3px) scale(1.1); }
  100% { transform: translateY(0) scale(1); }
}

.name {
  font-size: 13px;
  color: #fff;
  font-weight: bold;
  margin-bottom: 6px;
  text-shadow: 0 1px 2px rgba(0,0,0,0.2);
  max-width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 梯坎高度与生态渐变色 */
.step {
  width: 100%;
  border-radius: 12px 12px 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 10px;
  color: #fff;
  box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
}
.step-1 { height: 130px; background: linear-gradient(180deg, #43a047, #2e7d32); } /* 森林 */
.step-2 { height: 100px; background: linear-gradient(180deg, #8bc34a, #689f38); } /* 绿叶 */
.step-3 { height: 85px; background: linear-gradient(180deg, #26a69a, #00796b); } /* 海洋 */

/* 领奖台上的AI生成Icon样式 */
.step-icon {
  width: 25px;
  height: 25px;
  margin-bottom: 4px;
}
.step-icon-main {
  width: 35px;
  height: 35px;
  margin-bottom: 4px;
}

.rank-text { font-size: 10px; font-weight: bold; opacity: 0.9; margin-bottom: 2px; letter-spacing: 1px; }
.score { font-size: 16px; font-weight: bold; text-shadow: 0 1px 1px rgba(0,0,0,0.1); }

/* ================= 常规列表区布局 ================= */
.list-area {
  background: #fff;
  border-radius: 16px;
  margin-top: 20px;
  padding: 10px 15px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.03);
}

.list-item {
  display: flex;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px dashed #f0f0f0;
}
.list-item:last-child {
  border-bottom: none;
}

.rank-num {
  width: 30px;
  font-size: 16px;
  font-weight: bold;
  color: #a5d6a7; 
  text-align: center;
}

/* 列表默认头像图片样式 */
.list-avatar-img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin: 0 12px;
}

.info { flex: 1; }
.list-name { font-size: 15px; font-weight: bold; color: #333; display: block; margin-bottom: 4px; }
.list-desc { font-size: 11px; color: #999; }

.list-points { text-align: right; }
.val { font-size: 16px; font-weight: bold; color: #43a047; display: block; }
.unit { font-size: 10px; color: #999; }

.empty-state { text-align: center; padding: 50px 0; color: #999; font-size: 14px; }
</style>