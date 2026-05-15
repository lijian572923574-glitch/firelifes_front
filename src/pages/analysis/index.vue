<!--
  pages/analysis/index.vue - 资产页面
  功能：净资产展示、账户余额列表、折旧资产列表
  技术：Vue3 + TypeScript + uni-app
-->
<template>
  <view class="page">
    <view class="net-worth-card">
      <text class="nw-label">净资产</text>
      <text class="nw-value">¥{{ formatAmount(netWorth) }}</text>
      <view v-if="loadingNetWorth" class="nw-loading">计算中...</view>
    </view>

    <view v-if="accounts.length > 0" class="section">
      <text class="section-title">账户余额</text>
      <view v-for="account in accounts" :key="account.id" class="account-row">
        <text class="account-icon">{{ account.icon }}</text>
        <view class="account-info">
          <text class="account-name">{{ account.name }}</text>
          <text class="account-type">{{ typeLabel(account.type) }}</text>
        </view>
        <text class="account-balance" :class="{ negative: account.balance < 0 }">
          ¥{{ formatAmount(account.balance) }}
        </text>
      </view>
    </view>

    <view v-if="depreciatingAssets.length > 0" class="section">
      <text class="section-title">折旧资产</text>
      <view v-for="asset in depreciatingAssets" :key="asset.id" class="asset-row">
        <view class="asset-icon-bg">
          <text class="asset-icon">📱</text>
        </view>
        <view class="asset-info">
          <text class="asset-name">{{ asset.name }}</text>
          <text class="asset-category">{{ asset.categoryName }}</text>
        </view>
        <view class="asset-value-col">
          <text class="asset-value">¥{{ formatAmount(asset.currentValue) }}</text>
          <view class="asset-progress-bar">
            <view class="asset-progress-fill" :style="{ width: asset.progressPercent + '%' }"></view>
          </view>
        </view>
      </view>
    </view>

    <view v-if="!loadingNetWorth && accounts.length === 0 && depreciatingAssets.length === 0" class="empty-state">
      <text class="empty-icon">💼</text>
      <text class="empty-text">暂无资产数据</text>
      <text class="empty-hint">记账后资产数据会自动更新</text>
    </view>

    <CustomTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { recordApi } from '../../api/record'
import { getAccountList } from '../../api/account'
import type { Account } from '../../types/account'
import CustomTabbar from '../../components/CustomTabbar.vue'

const ACCOUNT_TYPE_LABELS: Record<string, string> = {
  cash: '现金',
  fixed_asset: '固定资产',
  depreciable_asset: '折旧资产',
  liability: '负债',
}

const DEPRECIATING_CATEGORY_LABELS: Record<string, string> = {
  phone: '手机', computer: '电脑', camera: '相机', appliance: '家电',
  footwear: '鞋服', furniture: '家具', bag: '包袋', sports: '运动', other: '其他',
}

const netWorth = ref(0)
const loadingNetWorth = ref(true)
const accounts = ref<Account[]>([])
const depreciatingAssets = ref<any[]>([])

const formatAmount = (val: number) => Math.abs(val).toFixed(2)
const typeLabel = (type: string) => ACCOUNT_TYPE_LABELS[type] || type

const loadAssets = async () => {
  loadingNetWorth.value = true
  try {
    const [nwRes, accRes, depRes] = await Promise.all([
      recordApi.getNetWorth(),
      getAccountList(),
      recordApi.getDepreciatingAssets(),
    ])

    if (nwRes.success && nwRes.data) {
      netWorth.value = nwRes.data.netWorth
    }

    if (accRes.success && accRes.data) {
      accounts.value = accRes.data.filter((a: Account) => !a.isDeleted && a.isVisible)
    }

    if (depRes.success && depRes.data) {
      depreciatingAssets.value = depRes.data.map((a: any) => ({
        ...a,
        categoryName: DEPRECIATING_CATEGORY_LABELS[a.category] || a.category,
        progressPercent: a.expectedLifeMonths > 0
          ? Math.round((a.usedMonths / a.expectedLifeMonths) * 100)
          : 0,
      }))
    }
  } catch {
    // ignore
  }
  loadingNetWorth.value = false
}

onMounted(() => {
  loadAssets()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
  padding-bottom: 80px;
}

.net-worth-card {
  background: linear-gradient(135deg, #00BFFF, #0099CC);
  margin: 20rpx;
  border-radius: 20rpx;
  padding: 40rpx 32rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10rpx;
}

.nw-label {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}

.nw-value {
  font-size: 56rpx;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1rpx;
}

.nw-loading {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
}

.section {
  background: #fff;
  border-radius: 20rpx;
  margin: 0 20rpx 20rpx;
  padding: 28rpx;
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #2d3436;
  margin-bottom: 20rpx;
  padding-bottom: 16rpx;
  border-bottom: 1rpx solid #f5f5f5;
}

.account-row {
  display: flex;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #f8f8f8;
}

.account-row:last-child {
  border-bottom: none;
}

.account-icon {
  font-size: 36rpx;
  margin-right: 18rpx;
}

.account-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.account-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.account-type {
  font-size: 22rpx;
  color: #999;
}

.account-balance {
  font-size: 30rpx;
  font-weight: 600;
  color: #2d3436;
}

.account-balance.negative {
  color: #e74c3c;
}

.asset-row {
  display: flex;
  align-items: center;
  padding: 18rpx 0;
  border-bottom: 1rpx solid #f8f8f8;
}

.asset-row:last-child {
  border-bottom: none;
}

.asset-icon-bg {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: rgba(0, 191, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 18rpx;
}

.asset-icon {
  font-size: 32rpx;
}

.asset-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
}

.asset-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.asset-category {
  font-size: 22rpx;
  color: #999;
}

.asset-value-col {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 8rpx;
}

.asset-value {
  font-size: 28rpx;
  font-weight: 600;
  color: #00BFFF;
}

.asset-progress-bar {
  width: 120rpx;
  height: 8rpx;
  background: #e8edf2;
  border-radius: 4rpx;
  overflow: hidden;
}

.asset-progress-fill {
  height: 100%;
  background: #00BFFF;
  border-radius: 4rpx;
  transition: width 0.5s ease;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
  gap: 16rpx;
}

.empty-icon {
  font-size: 64rpx;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}

.empty-hint {
  font-size: 24rpx;
  color: #ccc;
}
</style>
