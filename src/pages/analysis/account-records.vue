<template>
  <view class="page-container">
    <view class="account-header">
      <view class="account-icon category-icon-svg" :class="getAccountIconClass(accountInfo.icon, accountInfo.type)"></view>
      <text class="account-name">{{ accountInfo.name }}</text>
      <text class="account-balance" :class="{ negative: accountInfo.balance < 0 }">
        {{ formatAmount(accountInfo.balance) }}
      </text>
      <view class="monthly-summary">
        <view class="summary-item">
          <text class="summary-label">本月支出</text>
          <text class="summary-value expense">{{ formatAbs(monthlySummary.expense) }}</text>
        </view>
        <view class="summary-divider"></view>
        <view class="summary-item">
          <text class="summary-label">本月收入</text>
          <text class="summary-value income">{{ formatAbs(monthlySummary.income) }}</text>
        </view>
      </view>
    </view>

    <view v-if="loading && recordList.length === 0" class="loading-state">
      <text>加载中...</text>
    </view>

    <view v-else-if="recordList.length === 0" class="empty-state">
      <text class="empty-text">暂无交易记录</text>
    </view>

    <scroll-view
      v-else
      class="record-scroll"
      scroll-y
      @scrolltolower="loadMore"
    >
      <view v-for="group in groupedRecords" :key="group.date" class="date-group">
        <view class="date-header">
          <text class="date-text">{{ group.label }}</text>
          <view class="date-totals">
            <text v-if="group.expense > 0" class="date-expense">支出{{ formatAbs(group.expense) }}</text>
            <text v-if="group.income > 0" class="date-income">收入{{ formatAbs(group.income) }}</text>
          </view>
        </view>
        <view v-for="record in group.records" :key="record.id" class="record-item" @tap="goToEdit(record)">
          <view class="record-icon-wrap" :style="{ backgroundColor: record.type === 'income' ? 'var(--color-success-light, #e8f5e9)' : 'var(--color-danger-light, #fde8e8)' }">
            <view class="category-icon-svg" :class="getCategoryIconClass(record.categoryName)"></view>
          </view>
          <view class="record-info">
            <text class="record-name">{{ getRecordName(record) }}</text>
            <text v-if="record.remark" class="record-remark">{{ record.remark }}</text>
          </view>
          <text class="record-amount" :class="record.direction === 'in' ? 'income' : 'expense'">
            {{ record.direction === 'in' ? '+' : '-' }}{{ formatAbs(record.amount) }}
          </text>
        </view>
      </view>

      <view v-if="loadingMore" class="loading-more">
        <text>加载中...</text>
      </view>
      <view v-else-if="noMore" class="no-more">
        <text>已经到底了</text>
      </view>
    </scroll-view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { recordApi } from '../../api/record'
import { getAccountIconClass } from '../../types/account'
import type { AccountType } from '../../types/account'
import { getCategoryIconClass } from '../../utils/category-icon-map'

const accountId = ref(0)
const loading = ref(true)
const loadingMore = ref(false)
const noMore = ref(false)
const page = ref(1)
const pageSize = 50

const accountInfo = ref({
  icon: '',
  name: '',
  balance: 0,
  type: 'cash' as AccountType,
})

const monthlySummary = ref({
  income: 0,
  expense: 0,
})

interface AccountRecord {
  id: number
  type: string
  amount: number
  date: string
  remark: string
  direction: 'in' | 'out'
  categoryName: string
  counterpartAccountName: string
  createdAt: string
}

const recordList = ref<AccountRecord[]>([])

const formatAmount = (val: number) => {
  const prefix = val < 0 ? '-¥' : '¥'
  return prefix + Math.abs(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const formatAbs = (val: number) => {
  return '¥' + Math.abs(val).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

const getRecordName = (record: AccountRecord) => {
  if (record.type === 'transfer') {
    return record.direction === 'out'
      ? `转出至${record.counterpartAccountName || '未知账户'}`
      : `从${record.counterpartAccountName || '未知账户'}转入`
  }
  if (record.type === 'repayment') {
    return record.direction === 'out'
      ? `还款至${record.counterpartAccountName || '未知账户'}`
      : `收到还款`
  }
  return record.categoryName
}

const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr)
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const diff = (today.getTime() - target.getTime()) / (1000 * 60 * 60 * 24)

  if (diff === 0) return '今天'
  if (diff === 1) return '昨天'
  const month = date.getMonth() + 1
  const day = date.getDate()
  const weekDays = ['日', '一', '二', '三', '四', '五', '六']
  const weekDay = weekDays[date.getDay()]
  return `${String(month).padStart(2, '0')}月${String(day).padStart(2, '0')}日 星期${weekDay}`
}

const groupedRecords = computed(() => {
  const groups: Record<string, { date: string; label: string; records: AccountRecord[]; income: number; expense: number }> = {}

  for (const record of recordList.value) {
    if (!groups[record.date]) {
      groups[record.date] = {
        date: record.date,
        label: formatDateLabel(record.date),
        records: [],
        income: 0,
        expense: 0,
      }
    }
    groups[record.date].records.push(record)
    const absAmount = Math.abs(record.amount)
    if (record.direction === 'in') {
      groups[record.date].income += absAmount
    } else {
      groups[record.date].expense += absAmount
    }
  }

  return Object.values(groups).sort((a, b) => b.date.localeCompare(a.date))
})

const loadData = async () => {
  if (!accountId.value) return
  loading.value = true
  try {
    const res = await recordApi.getRecordsByAccount(accountId.value, 1, pageSize)
    if (res.success && res.data) {
      accountInfo.value = {
        icon: res.data.account.icon,
        name: res.data.account.name,
        balance: res.data.account.balance,
        type: res.data.account.type,
      }
      monthlySummary.value = res.data.monthlySummary
      recordList.value = res.data.records.list
      page.value = 1
      noMore.value = recordList.value.length >= res.data.records.total
    }
  } catch (e) {
    console.error('加载账户交易记录失败:', e)
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  if (loadingMore.value || noMore.value) return
  loadingMore.value = true
  try {
    const nextPage = page.value + 1
    const res = await recordApi.getRecordsByAccount(accountId.value, nextPage, pageSize)
    if (res.success && res.data) {
      recordList.value = [...recordList.value, ...res.data.records.list]
      page.value = nextPage
      noMore.value = recordList.value.length >= res.data.records.total
    }
  } catch (e) {
    console.error('加载更多失败:', e)
  } finally {
    loadingMore.value = false
  }
}

const goToEdit = (record: AccountRecord) => {
  uni.navigateTo({ url: `/pages/record/edit-record?id=${record.id}` })
}

onMounted(() => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as any
  const id = currentPage?.options?.accountId || currentPage?.$page?.options?.accountId
  if (id) {
    accountId.value = parseInt(id)
    loadData()
  }
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background: var(--color-bg-page, #F5F6FA);
}

.account-header {
  background: linear-gradient(135deg, var(--color-primary, #00BFFF) 0%, var(--color-primary-dark, #0099CC) 100%);
  padding: 48rpx 32rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.account-icon {
  width: 64rpx;
  height: 64rpx;
  margin-bottom: 12rpx;
  color: #FFFFFF;
}

.account-name {
  font-size: 32rpx;
  color: #FFFFFF;
  font-weight: 500;
  margin-bottom: 8rpx;
}

.account-balance {
  font-size: 48rpx;
  color: #FFFFFF;
  font-weight: 700;
  margin-bottom: 24rpx;
}

.account-balance.negative {
  color: #FFB3B3;
}

.monthly-summary {
  display: flex;
  align-items: center;
  gap: 40rpx;
}

.summary-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4rpx;
}

.summary-label {
  font-size: 22rpx;
  color: #ffffffb3;
}

.summary-value {
  font-size: 26rpx;
  font-weight: 600;
}

.summary-value.expense {
  color: #FFB3B3;
}

.summary-value.income {
  color: #B3FFD9;
}

.summary-divider {
  width: 1rpx;
  height: 40rpx;
  background: #ffffff33;
}

.record-scroll {
  height: calc(100vh - 340rpx);
  padding: 16rpx 24rpx;
}

.date-group {
  margin-bottom: 24rpx;
}

.date-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 12rpx 12rpx;
}

.date-text {
  font-size: 26rpx;
  color: var(--color-text-secondary, #999);
  font-weight: 600;
}

.date-totals {
  display: flex;
  gap: 16rpx;
}

.date-expense {
  font-size: 22rpx;
  color: var(--color-danger, #FA3534);
}

.date-income {
  font-size: 22rpx;
  color: var(--color-success, #19BE6B);
}

.record-item {
  display: flex;
  align-items: center;
  padding: 20rpx 16rpx;
  background: var(--color-bg-card, #FFFFFF);
  border-radius: 16rpx;
  margin-bottom: 2rpx;
  gap: 20rpx;
}

.record-item:first-of-type {
  border-radius: 16rpx 16rpx 4rpx 4rpx;
}

.record-item:last-of-type {
  border-radius: 4rpx 4rpx 16rpx 16rpx;
  margin-bottom: 0;
}

.record-item:only-of-type {
  border-radius: 16rpx;
}

.record-icon-wrap {
  width: 72rpx;
  height: 72rpx;
  border-radius: 36rpx;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.record-icon-wrap .category-icon-svg {
  width: 28rpx;
  height: 28rpx;
}

.record-info {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.record-name {
  font-size: 28rpx;
  color: var(--color-text-primary, #2D3436);
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-remark {
  font-size: 22rpx;
  color: var(--color-text-secondary, #999);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.record-amount {
  font-size: 30rpx;
  font-weight: 600;
  flex-shrink: 0;
}

.record-amount.expense {
  color: var(--color-danger, #FA3534);
}

.record-amount.income {
  color: var(--color-success, #19BE6B);
}

.loading-state,
.empty-state {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 400rpx;
  color: var(--color-text-secondary, #999);
  font-size: 28rpx;
}

.loading-more,
.no-more {
  text-align: center;
  padding: 24rpx 0;
  color: var(--color-text-secondary, #999);
  font-size: 24rpx;
}
</style>
