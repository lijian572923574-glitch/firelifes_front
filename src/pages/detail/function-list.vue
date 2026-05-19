<!--
  pages/detail/function-list.vue - 功能页
  功能：展示全部功能入口，支持拖拽排序，排序后明细页前4个入口同步更新
  技术：Vue3 + TypeScript + uni-app + Pinia + Wot Design
-->
<template>
  <view class="page">
    <wd-navbar
      title="功能页"
      left-arrow
      fixed
      placeholder
      bordered
      safe-area-inset-top
      @click-left="goBack"
    />

    <view class="hint-bar">
      <view class="hint-icon">💡</view>
      <text class="hint-text">拖拽左侧手柄可排序，前 4 个将展示在明细页</text>
    </view>

    <view class="section" v-if="topItems.length">
      <view class="section-header">
        <view class="section-dot"></view>
        <text class="section-title">明细页展示</text>
        <text class="section-sub">前 4 个</text>
      </view>

      <view class="function-grid">
        <view
          v-for="(item, index) in topItems"
          :key="item.key"
          class="function-card top-card"
          :class="{ 'is-dragging': dragIndex === index }"
          :style="dragIndex === index ? dragStyle : {}"
          @tap="handleItemClick(item)"
        >
          <view
            class="drag-handle"
            @touchstart.prevent="onDragStart($event, index)"
            @touchmove.prevent="onDragMove($event)"
            @touchend.prevent="onDragEnd"
          >
            <view class="drag-dots">
              <view class="drag-dot"></view>
              <view class="drag-dot"></view>
              <view class="drag-dot"></view>
            </view>
          </view>
          <view class="function-icon" :style="{ background: item.bg || 'rgba(0, 191, 255, 0.08)' }">
            <text class="iconfont" :class="item.icon" :style="{ color: item.color || '#00BFFF' }"></text>
          </view>
          <view class="function-info">
            <text class="function-name">{{ item.text }}</text>
            <text class="function-desc">{{ item.desc || '' }}</text>
          </view>
          <view class="rank-badge">{{ index + 1 }}</view>
        </view>
      </view>
    </view>

    <view class="section" v-if="restItems.length">
      <view class="section-header">
        <view class="section-dot secondary"></view>
        <text class="section-title">更多功能</text>
      </view>

      <view class="function-grid">
        <view
          v-for="(item, index) in restItems"
          :key="item.key"
          class="function-card"
          :class="{ 'is-dragging': dragIndex === index + 4 }"
          :style="dragIndex === index + 4 ? dragStyle : {}"
          @tap="handleItemClick(item)"
        >
          <view
            class="drag-handle"
            @touchstart.prevent="onDragStart($event, index + 4)"
            @touchmove.prevent="onDragMove($event)"
            @touchend.prevent="onDragEnd"
          >
            <view class="drag-dots">
              <view class="drag-dot"></view>
              <view class="drag-dot"></view>
              <view class="drag-dot"></view>
            </view>
          </view>
          <view class="function-icon" :style="{ background: item.bg || 'rgba(108, 92, 231, 0.08)' }">
            <text class="iconfont" :class="item.icon" :style="{ color: item.color || '#6c5ce7' }"></text>
          </view>
          <view class="function-info">
            <text class="function-name">{{ item.text }}</text>
            <text class="function-desc">{{ item.desc || '' }}</text>
          </view>
          <text class="function-arrow">›</text>
        </view>
      </view>
    </view>

    <view v-if="!localItems.length" class="empty-state">
      <text class="empty-icon">📋</text>
      <text class="empty-text">暂无功能入口</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useFunctionItemsStore, type FunctionItem } from '../../stores/functionItems'

const store = useFunctionItemsStore()
const localItems = ref<FunctionItem[]>([])

const dragIndex = ref(-1)
const dragStartY = ref(0)
const dragOffsetY = ref(0)
const ITEM_HEIGHT = 96

const topItems = computed(() => localItems.value.slice(0, 4))
const restItems = computed(() => localItems.value.slice(4))

const dragStyle = computed(() => ({
  transform: `translateY(${dragOffsetY.value}px) scale(1.02)`,
  zIndex: 10,
  opacity: 0.95,
}))

onMounted(() => {
  localItems.value = [...store.sortedItems]
})

const goBack = () => {
  const pages = getCurrentPages()
  if (pages.length > 1) {
    uni.navigateBack()
  } else {
    uni.redirectTo({ url: '/pages/detail/index' })
  }
}

const handleItemClick = (item: FunctionItem) => {
  if (dragIndex.value >= 0) return
  if (item.key === 'bill') {
    uni.navigateTo({ url: '/pages/detail/bill' })
    return
  }
  if (item.key === 'fire') {
    uni.navigateTo({ url: '/pages/detail/fire-progress' })
    return
  }
  uni.showToast({ title: `${item.text}功能开发中`, icon: 'none' })
}

const onDragStart = (e: any, index: number) => {
  dragIndex.value = index
  dragStartY.value = e.touches[0].clientY
  dragOffsetY.value = 0
}

const onDragMove = (e: any) => {
  if (dragIndex.value < 0) return
  const currentY = e.touches[0].clientY
  dragOffsetY.value = currentY - dragStartY.value

  const moveSteps = Math.round(dragOffsetY.value / ITEM_HEIGHT)
  if (moveSteps === 0) return

  const fromIndex = dragIndex.value
  const toIndex = Math.max(0, Math.min(localItems.value.length - 1, fromIndex + moveSteps))

  if (toIndex !== fromIndex) {
    const items = [...localItems.value]
    const [moved] = items.splice(fromIndex, 1)
    items.splice(toIndex, 0, moved)
    localItems.value = items
    dragIndex.value = toIndex
    dragStartY.value = currentY
    dragOffsetY.value = 0
  }
}

const onDragEnd = () => {
  if (dragIndex.value >= 0) {
    const newOrder = localItems.value.map((item) => item.key)
    store.reorder(newOrder)
  }
  dragIndex.value = -1
  dragOffsetY.value = 0
}
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}

.hint-bar {
  display: flex;
  align-items: center;
  margin: 20rpx 24rpx;
  padding: 16rpx 20rpx;
  background: linear-gradient(135deg, rgba(0, 191, 255, 0.06), rgba(108, 92, 231, 0.04));
  border-radius: 12rpx;
  border: 1rpx solid rgba(0, 191, 255, 0.1);
}

.hint-icon {
  font-size: 28rpx;
  margin-right: 12rpx;
}

.hint-text {
  font-size: 24rpx;
  color: #636e72;
  line-height: 1.5;
}

.section {
  margin-bottom: 8rpx;
}

.section-header {
  display: flex;
  align-items: center;
  padding: 24rpx 24rpx 12rpx;
}

.section-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 50%;
  background: #00BFFF;
  margin-right: 12rpx;
}

.section-dot.secondary {
  background: #6c5ce7;
}

.section-title {
  font-size: 26rpx;
  font-weight: 600;
  color: #2d3436;
}

.section-sub {
  font-size: 22rpx;
  color: #b2bec3;
  margin-left: 12rpx;
}

.function-grid {
  padding: 0 24rpx;
}

.function-card {
  display: flex;
  align-items: center;
  background: #fff;
  border-radius: 16rpx;
  padding: 22rpx 20rpx;
  margin-bottom: 14rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
  position: relative;
}

.function-card.is-dragging {
  box-shadow: 0 8rpx 30rpx rgba(0, 0, 0, 0.12);
}

.function-card.top-card {
  border-left: 6rpx solid #00BFFF;
}

.drag-handle {
  width: 52rpx;
  height: 52rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14rpx;
  flex-shrink: 0;
  border-radius: 10rpx;
  background: rgba(0, 0, 0, 0.02);
}

.drag-dots {
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  align-items: center;
}

.drag-dot {
  width: 6rpx;
  height: 6rpx;
  border-radius: 50%;
  background: #ccc;
}

.function-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 18rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18rpx;
  flex-shrink: 0;
}

.function-icon .iconfont {
  font-size: 36rpx;
}

.function-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.function-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #2d3436;
}

.function-desc {
  font-size: 22rpx;
  color: #b2bec3;
  margin-top: 4rpx;
}

.rank-badge {
  width: 36rpx;
  height: 36rpx;
  border-radius: 50%;
  background: rgba(0, 191, 255, 0.1);
  color: #00BFFF;
  font-size: 22rpx;
  font-weight: 600;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 8rpx;
}

.function-arrow {
  font-size: 32rpx;
  color: #ccc;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 120rpx 0;
}

.empty-icon {
  font-size: 64rpx;
  margin-bottom: 16rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #b2bec3;
}
</style>