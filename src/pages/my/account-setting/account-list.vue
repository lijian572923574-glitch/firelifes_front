<template>
  <view class="page-container">
    <wd-navbar
      title="我的账户"
      left-arrow
      fixed
      placeholder
      bordered
      safe-area-inset-top
      @click-left="goBack"
    >
      <template #right>
        <view class="nav-add-btn" @click="goToAdd">
          <text class="nav-add-icon">+</text>
        </view>
      </template>
    </wd-navbar>

    <view class="content-scroll">
      <view v-if="loading" class="skeleton-container">
        <view v-for="i in 3" :key="i" class="skeleton-card">
          <view class="skeleton-icon"></view>
          <view class="skeleton-info">
            <view class="skeleton-line skeleton-line-long"></view>
            <view class="skeleton-line skeleton-line-short"></view>
          </view>
          <view class="skeleton-balance"></view>
        </view>
      </view>

      <view v-else-if="!hasAccounts" class="empty-state">
        <view class="empty-icon-wrap">
          <text class="empty-icon-emoji">💳</text>
        </view>
        <text class="empty-title">还没有添加账户</text>
        <text class="empty-subtitle">添加你的第一个账户开始记账吧</text>
        <view class="empty-btn" @click="goToAdd">
          <text class="empty-btn-text">+ 添加账户</text>
        </view>
      </view>

      <view v-else>
        <view v-for="group in groupedAccounts" :key="group.type" class="group-section">
          <view class="group-title">
            <view class="title-bar" :style="{ background: getTypeColor(group.type) }"></view>
            <view class="title-icon category-icon-svg" :class="getTypeIconClass(group.type)"></view>
            <text class="title-text">{{ getTypeLabel(group.type) }}</text>
            <text class="title-count">({{ group.accounts.length }})</text>
          </view>

          <view class="account-list">
            <wd-swipe-action
              v-for="account in group.accounts"
              :key="account.id"
              :right-width="(account.isDefaultExpense || account.isDefaultIncome) ? 70 : 140"
            >
              <template #default>
                <view class="account-card" @click="goToEdit(account.id)">
                  <view class="card-bar" :style="{ background: getTypeColor(account.type) }"></view>
                  <view class="account-icon category-icon-svg" :class="getAccountIconClass(account.icon, account.type)"></view>
                  <view class="account-info">
                    <view class="name-row">
                      <text class="account-name">{{ account.name }}</text>
                      <view class="badges-row">
                        <view v-if="account.isDefaultExpense" class="default-badge">
                          <text class="badge-text">默认支出</text>
                        </view>
                        <view v-if="account.isDefaultIncome" class="default-badge income">
                          <text class="badge-text">默认收入</text>
                        </view>
                      </view>
                    </view>
                    <text v-if="account.description" class="account-desc">{{ account.description }}</text>
                  </view>
                  <view class="card-right">
                    <text class="balance" :style="{ color: getBalanceColor(account.type, account.balance) }">
                      {{ formatBalance(account.balance) }}
                    </text>
                    <text class="card-arrow">›</text>
                  </view>
                </view>
              </template>

              <template #right>
                <view class="swipe-actions">
                  <view
                    class="swipe-btn swipe-btn-edit"
                    @click.stop="handleEdit(account)"
                  >
                    <text class="swipe-btn-text">编辑</text>
                  </view>
                  <view
                    v-if="!account.isDefaultExpense && !account.isDefaultIncome"
                    class="swipe-btn swipe-btn-delete"
                    @click.stop="handleDeleteClick(account)"
                  >
                    <text class="swipe-btn-text">删除</text>
                  </view>
                </view>
              </template>
            </wd-swipe-action>
          </view>
        </view>
      </view>

      <view class="safe-bottom"></view>
    </view>

    <wd-dialog
      v-model="showDeleteDialog"
      title="删除账户"
      show-cancel-button
      show-confirm-button
      confirm-button-text="删除"
      cancel-button-text="取消"
      @confirm="confirmDelete"
    >
      <text>确定要删除「{{ deleteTarget?.name }}」吗？删除后不可恢复。</text>
    </wd-dialog>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAccountList, deleteAccount } from '../../../api/account'
import { navigateBack } from '../../../utils/navigate'
import type { Account, AccountType } from '../../../types/account'
import { ACCOUNT_TYPE_OPTIONS, getBalanceColor, getAccountIconClass } from '../../../types/account'

const loading = ref(false)
const accounts = ref<Account[]>([])
const showDeleteDialog = ref(false)
const deleteTarget = ref<Account | null>(null)

const groupedAccounts = computed(() => {
  const groups: { type: AccountType; accounts: Account[] }[] = []
  const typeOrder: AccountType[] = ['cash', 'investment', 'fixed_asset', 'depreciable_asset', 'liability']
  typeOrder.forEach(type => {
    const typeAccounts = accounts.value.filter(a => a.type === type)
    if (typeAccounts.length > 0) {
      groups.push({ type, accounts: typeAccounts })
    }
  })
  return groups
})

const hasAccounts = computed(() => accounts.value.length > 0)

const getTypeLabel = (type: AccountType): string => {
  const option = ACCOUNT_TYPE_OPTIONS.find(o => o.value === type)
  return option?.label || type
}

const getTypeColor = (type: AccountType): string => {
  const map: Record<AccountType, string> = {
    cash: '#00BFFF',
    investment: '#FF9800',
    fixed_asset: '#9C27B0',
    depreciable_asset: '#00BCD4',
    liability: '#FA3534',
  }
  return map[type] || '#00BFFF'
}

const getTypeIconClass = (type: AccountType): string => {
  const map: Record<AccountType, string> = {
    cash: 'account-icon-wallet',
    investment: 'account-icon-trending',
    fixed_asset: 'account-icon-house',
    depreciable_asset: 'account-icon-mobile',
    liability: 'account-icon-credit-card',
  }
  return map[type] || 'account-icon-wallet'
}

const formatBalance = (balance: number): string => {
  const prefix = balance < 0 ? '-¥' : '¥'
  return prefix + Math.abs(balance).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

async function loadAccounts() {
  loading.value = true
  try {
    const res = await getAccountList()
    if (res.success) {
      accounts.value = res.data
    } else {
      uni.showToast({ title: res.message || '获取账户列表失败', icon: 'none' })
    }
  } catch (error) {
    console.error('加载账户列表失败:', error)
    uni.showToast({ title: '网络错误', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function goBack() {
  navigateBack('/pages/my/index')
}

function goToAdd() {
  uni.navigateTo({ url: '/pages/my/account-setting/account-edit' })
}

function goToEdit(id: string) {
  uni.navigateTo({ url: `/pages/my/account-setting/account-edit?id=${id}` })
}

function handleEdit(account: Account) {
  goToEdit(account.id)
}

function handleDeleteClick(account: Account) {
  deleteTarget.value = account
  showDeleteDialog.value = true
}

async function confirmDelete() {
  if (!deleteTarget.value) return
  const account = deleteTarget.value
  try {
    const apiRes = await deleteAccount(account.id)
    if (apiRes.success) {
      uni.showToast({ title: `已删除「${account.name}」`, icon: 'success', duration: 2000 })
      showDeleteDialog.value = false
      deleteTarget.value = null
      loadAccounts()
    } else {
      uni.showToast({ title: apiRes.message || '删除失败', icon: 'none' })
    }
  } catch (err) {
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

onShow(() => {
  loadAccounts()
})
</script>

<style scoped>
.page-container {
  overflow-x: hidden;
  min-height: 100vh;
  background-color: var(--color-bg-page, #F5F7FA);
}

.nav-add-btn {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: var(--color-primary-light, #E6F7F5);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.nav-add-btn:active {
  background: var(--color-primary-light, #E6F7F5);
  transform: scale(0.92);
}

.nav-add-icon {
  font-size: 36rpx;
  color: var(--color-primary, #0D9488);
  font-weight: 300;
  line-height: 1;
}

.content-scroll {
  padding: 24rpx;
}

.skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.skeleton-card {
  height: 120rpx;
  background-color: var(--color-bg-card, #FFFFFF);
  border-radius: 20rpx;
  padding: 0 28rpx;
  display: flex;
  align-items: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.skeleton-icon {
  width: 64rpx;
  height: 64rpx;
  border-radius: 16rpx;
  background: linear-gradient(90deg, var(--color-border-light, #F1F5F9) 25%, var(--color-border, #E2E8F0) 50%, var(--color-border-light, #F1F5F9) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

.skeleton-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
  margin-left: 20rpx;
}

.skeleton-line {
  border-radius: 8rpx;
  background: linear-gradient(90deg, var(--color-border-light, #F1F5F9) 25%, var(--color-border, #E2E8F0) 50%, var(--color-border-light, #F1F5F9) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-line-long {
  width: 240rpx;
  height: 28rpx;
}

.skeleton-line-short {
  width: 160rpx;
  height: 20rpx;
}

.skeleton-balance {
  width: 120rpx;
  height: 32rpx;
  border-radius: 8rpx;
  background: linear-gradient(90deg, var(--color-border-light, #F1F5F9) 25%, var(--color-border, #E2E8F0) 50%, var(--color-border-light, #F1F5F9) 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
  flex-shrink: 0;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 120rpx 0;
}

.empty-icon-wrap {
  width: 140rpx;
  height: 140rpx;
  border-radius: 50%;
  background: var(--color-primary-light, #E6F7F5);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 32rpx;
}

.empty-icon-emoji {
  font-size: 64rpx;
}

.empty-title {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text-secondary, #94A3B8);
  margin-bottom: 12rpx;
}

.empty-subtitle {
  font-size: 24rpx;
  color: var(--color-text-secondary, #94A3B8);
  margin-bottom: 48rpx;
}

.empty-btn {
  width: 320rpx;
  height: 88rpx;
  border-radius: 44rpx;
  background: linear-gradient(135deg, var(--color-primary, #0D9488) 0%, var(--color-primary-dark, #0B7A70) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.empty-btn:active {
  transform: scale(0.96);
  opacity: 0.9;
}

.empty-btn-text {
  font-size: 30rpx;
  font-weight: 600;
  color: var(--color-text-inverse, #FFFFFF);
}

.group-section {
  margin-bottom: 36rpx;
}

.group-title {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding: 0 8rpx;
  margin-bottom: 16rpx;
}

.title-bar {
  width: 6rpx;
  height: 28rpx;
  border-radius: 3rpx;
  margin-right: 10rpx;
  flex-shrink: 0;
}

.title-icon {
  width: 36rpx;
  height: 36rpx;
  margin-right: 10rpx;
  color: var(--color-text-secondary, #94A3B8);
}

.title-text {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--color-text-secondary, #94A3B8);
}

.title-count {
  font-size: 24rpx;
  font-weight: 400;
  color: var(--color-text-secondary, #94A3B8);
  margin-left: 8rpx;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.account-card {
  height: 120rpx;
  display: flex;
  align-items: center;
  padding: 0 28rpx;
  background-color: var(--color-bg-card, #FFFFFF);
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: all 200ms ease;
  position: relative;
}

.account-card:active {
  background-color: var(--color-border-light, #F1F5F9);
  transform: scale(0.985);
}

.card-bar {
  width: 6rpx;
  height: 48rpx;
  border-radius: 3rpx;
  margin-right: 20rpx;
  flex-shrink: 0;
}

.account-icon {
  width: 52rpx;
  height: 52rpx;
  flex-shrink: 0;
  margin-right: 20rpx;
  color: var(--color-text-primary, #333);
}

.account-info {
  display: flex;
  flex-direction: column;
  flex: 1;
  min-width: 0;
}

.name-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  flex-wrap: wrap;
}

.account-name {
  font-size: 32rpx;
  font-weight: 600;
  color: var(--color-text-primary, #1E293B);
  line-height: 1.2;
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 8rpx;
}

.default-badge {
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  padding: 4rpx 14rpx;
  border-radius: 8rpx;
}

.default-badge.income {
  background: linear-gradient(135deg, var(--color-success, #10B981) 0%, var(--color-primary-dark, #0B7A70) 100%);
}

.badge-text {
  font-size: 20rpx;
  color: var(--color-text-inverse, #FFFFFF);
  font-weight: 500;
}

.account-desc {
  font-size: 24rpx;
  color: var(--color-text-secondary, #94A3B8);
  margin-top: 4rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.card-right {
  display: flex;
  align-items: center;
  margin-left: 16rpx;
  flex-shrink: 0;
}

.balance {
  font-size: 32rpx;
  font-weight: 700;
  margin-right: 12rpx;
}

.card-arrow {
  font-size: 44rpx;
  color: var(--color-text-tertiary, #CBD5E1);
  line-height: 1;
}

.swipe-actions {
  display: flex;
  height: 100%;
}

.swipe-btn {
  width: 70rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}

.swipe-btn-edit {
  background-color: var(--color-primary, #0D9488);
}

.swipe-btn-delete {
  background-color: var(--color-danger, #EF4444);
}

.swipe-btn-text {
  font-size: 26rpx;
  color: var(--color-text-inverse, #FFFFFF);
  font-weight: 500;
}

.safe-bottom {
  height: calc(env(safe-area-inset-bottom) + 40rpx);
}
</style>
