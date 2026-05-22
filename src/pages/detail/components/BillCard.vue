<template>
  <view class="bill-card">
    <view class="bill-date">
      <text class="date-text">{{ formattedDate }}</text>
      <view class="day-totals">
        <text class="day-income">收入 {{ dayIncome }}</text>
        <text class="day-expense">支出 {{ dayExpense }}</text>
      </view>
    </view>
    <view
      v-for="(item, index) in records"
      :key="item.id"
      class="bill-item-wrap"
      :class="{ 'bill-item-wrap-last': index === records.length - 1 }"
    >
      <wd-swipe-action :right-width="70">
        <template #default>
          <view class="bill-item" @tap="handleItemTap(item)">
            <view class="bill-item-left">
              <view class="category-icon" :style="{ backgroundColor: item.categoryColor }">
                <text class="iconfont" :class="item.categoryIcon"></text>
              </view>
              <view class="bill-item-info">
                <text class="bill-item-name">{{ item.displayName }}</text>
              </view>
            </view>
            <text class="bill-item-amount">
              {{ item.type === 'expense' || item.type === 'transfer' || item.type === 'repayment' ? '-' : '+' }}{{ formatAmount(item.amount) }}
            </text>
          </view>
        </template>
        <template #right>
          <view class="delete-btn" @tap.stop="handleDelete(item)">
            <text class="delete-btn-text">删除</text>
          </view>
        </template>
      </wd-swipe-action>
    </view>
  </view>
</template>

<script setup lang="ts">
export interface BillCardRecord {
  id: number
  type: 'income' | 'expense' | 'transfer' | 'repayment'
  amount: number
  displayName: string
  categoryIcon: string
  categoryColor: string
}

defineProps<{
  formattedDate: string
  dayIncome: string
  dayExpense: string
  records: BillCardRecord[]
}>()

const emit = defineEmits<{
  'record-tap': [record: BillCardRecord]
  'record-delete': [record: BillCardRecord]
}>()

const handleItemTap = (item: BillCardRecord) => {
  emit('record-tap', item)
}

const handleDelete = (item: BillCardRecord) => {
  emit('record-delete', item)
}

const formatAmount = (amount: number) => {
  return Math.abs(amount).toFixed(2)
}
</script>

<style scoped>
.bill-card {
  background: #fff;
  border-radius: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  overflow: hidden;
}

.bill-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 28rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.date-text {
  font-size: 28rpx;
  font-weight: 600;
  color: #2d3436;
}

.day-totals {
  display: flex;
  gap: 24rpx;
}

.day-income {
  font-size: 22rpx;
  color: #5c6b7a;
}

.day-expense {
  font-size: 22rpx;
  color: #5c6b7a;
}

.bill-item-wrap {
  border-bottom: 1rpx solid #f5f5f5;
}

.bill-item-wrap:last-child,
.bill-item-wrap-last {
  border-bottom: none;
}

.bill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 28rpx;
  transition: background 0.15s ease;
}

.bill-item:active {
  background: #fafafa;
}

.bill-item-left {
  display: flex;
  align-items: center;
  gap: 20rpx;
  flex: 1;
  min-width: 0;
}

.category-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.category-icon .iconfont {
  font-size: 36rpx;
  color: #5c6b7a;
}

.bill-item-info {
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  min-width: 0;
}

.bill-item-name {
  font-size: 28rpx;
  font-weight: 500;
  color: #2d3436;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.bill-item-amount {
  font-size: 32rpx;
  font-weight: 600;
  flex-shrink: 0;
  margin-left: 20rpx;
  color: #2d3436;
}

.delete-btn {
  width: 70px;
  height: 100%;
  background: #FA3534;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn-text {
  font-size: 26rpx;
  font-weight: 600;
  color: #FFFFFF;
}
</style>
