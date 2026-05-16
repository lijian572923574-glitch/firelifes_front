<template>
  <view class="function-bar-wrapper">
    <view class="function-bar">
      <view
        v-for="item in visibleItems"
        :key="item.key"
        class="function-item"
        @tap="handleItemClick(item)"
      >
        <view class="function-icon">
          <text class="iconfont" :class="item.icon"></text>
        </view>
        <text class="function-text">{{ item.text }}</text>
      </view>
      <view
        class="function-item"
        @tap="handleMoreClick"
      >
        <view class="function-icon">
          <text class="iconfont icon-qita"></text>
        </view>
        <text class="function-text">更多</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

export interface FunctionItem {
  key: string
  icon: string
  text: string
}

const props = withDefaults(defineProps<{
  items: FunctionItem[]
  maxVisible?: number
}>(), {
  maxVisible: 5
})

const emit = defineEmits<{
  'item-click': [item: FunctionItem]
  'more-click': []
}>()

const visibleItems = computed(() => {
  return props.items.slice(0, props.maxVisible - 1)
})

const handleItemClick = (item: FunctionItem) => {
  emit('item-click', item)
}

const handleMoreClick = () => {
  emit('more-click')
}
</script>

<style scoped>
.function-bar-wrapper {
  flex-shrink: 0;
  width: 100%;
  position: relative;
  z-index: 1;
}

.function-bar {
  display: flex;
  justify-content: space-around;
  padding: 18rpx 20rpx;
  background: #fff;
  box-shadow: 0 4rpx 16rpx rgba(0, 0, 0, 0.06);
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-icon {
  font-size: 40rpx;
  margin-bottom: 6rpx;
  color: #00BFFF;
}

.function-text {
  font-size: 20rpx;
  color: #999;
}
</style>