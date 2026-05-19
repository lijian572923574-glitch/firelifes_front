<!--
  components/BudgetBar.vue - 预算进度条组件（可复用）
  功能：展示预算进度条，颜色按百分比变化（绿→蓝→橙→红）
  Props: spent, amount, alertThreshold(默认80)
  技术：Vue3 + TypeScript + uni-app
-->
<template>
  <view class="budget-bar">
    <view class="budget-bar-track">
      <view
        class="budget-bar-fill"
        :style="{ width: displayPercent + '%' }"
        :class="'bar-' + alertLevel"
      ></view>
    </view>
    <text v-if="showLabel" class="budget-bar-label" :class="'text-' + alertLevel">
      {{ displayPercent.toFixed(0) }}%
    </text>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(defineProps<{
  spent: number
  amount: number
  alertThreshold?: number
  showLabel?: boolean
}>(), {
  alertThreshold: 80,
  showLabel: false,
})

const displayPercent = computed(() => {
  if (props.amount <= 0) return 0
  const pct = (props.spent / props.amount) * 100
  return Math.min(pct, 120)
})

const alertLevel = computed(() => {
  if (props.amount <= 0) return 'healthy'
  const pct = (props.spent / props.amount) * 100
  if (pct >= 100) return 'danger'
  if (pct >= props.alertThreshold) return 'warning'
  if (pct >= 60) return 'normal'
  return 'healthy'
})
</script>

<style scoped>
.budget-bar {
  display: flex;
  align-items: center;
  gap: 8rpx;
  width: 100%;
}

.budget-bar-track {
  flex: 1;
  height: 12rpx;
  border-radius: 6rpx;
  background: #e8e8e8;
  overflow: hidden;
}

.budget-bar-fill {
  height: 100%;
  border-radius: 6rpx;
  transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.bar-healthy {
  background: #00b894;
}
.bar-normal {
  background: #00bfff;
}
.bar-warning {
  background: #fdcb6e;
}
.bar-danger {
  background: #d63031;
}

.budget-bar-label {
  font-size: 22rpx;
  min-width: 60rpx;
  text-align: right;
}

.text-healthy { color: #00b894; }
.text-normal { color: #00bfff; }
.text-warning { color: #e17055; }
.text-danger { color: #d63031; }
</style>
