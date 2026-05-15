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
        v-if="hasMore"
        class="function-item"
        @tap="toggleExpand"
      >
        <view class="function-icon">
          <text class="iconfont" :class="expanded ? 'icon-fanhui' : 'icon-qita'"></text>
        </view>
        <text class="function-text">{{ expanded ? '收起' : '更多' }}</text>
      </view>
    </view>
    <view v-if="expanded && overflowItems.length > 0" class="function-expand">
      <view
        v-for="item in overflowItems"
        :key="item.key"
        class="function-item"
        @tap="handleItemClick(item)"
      >
        <view class="function-icon">
          <text class="iconfont" :class="item.icon"></text>
        </view>
        <text class="function-text">{{ item.text }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'

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
}>()

const expanded = ref(false)

const hasMore = computed(() => props.items.length > props.maxVisible)

const visibleItems = computed(() => {
  if (!hasMore.value || expanded.value) {
    return props.items
  }
  return props.items.slice(0, props.maxVisible - 1)
})

const overflowItems = computed(() => {
  if (!hasMore.value) return []
  return props.items.slice(props.maxVisible - 1)
})

const toggleExpand = () => {
  expanded.value = !expanded.value
}

const handleItemClick = (item: FunctionItem) => {
  emit('item-click', item)
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

.function-expand {
  display: flex;
  justify-content: space-around;
  padding: 18rpx 20rpx;
  background: #fff;
  border-top: 1rpx solid #f5f5f5;
  animation: expandIn 0.2s ease;
}

@keyframes expandIn {
  from {
    opacity: 0;
    transform: translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
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