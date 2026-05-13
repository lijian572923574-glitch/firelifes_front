<template>
  <view class="page-container">
    <wd-navbar
      title="账户设置"
      left-arrow
      fixed
      placeholder
      bordered
      safe-area-inset-top
      right-text="+"
      @click-left="goBack"
      @click-right="goToAdd"
    />

    <view class="content-scroll">
      <view v-if="loading" class="loading-state">
        <text class="loading-icon">⏳</text>
        <text class="loading-text">加载中...</text>
      </view>

      <view v-else-if="!hasAccounts" class="empty-state">
        <text class="empty-icon">📝</text>
        <text class="empty-text">添加你的第一个账户</text>
      </view>

      <view v-else>
        <view v-for="group in groupedAccounts" :key="group.type" class="group-section">
          <view class="group-title">
            <view class="title-line"></view>
            <text>{{ getTypeLabel(group.type) }}</text>
          </view>
          <view class="account-list">
            <wd-swipe-action
              v-for="account in group.accounts"
              :key="account.id"
              :right-width="140"
            >
              <template #default>
                <view class="account-card" @click="goToEdit(account.id)">
                  <view class="card-left">
                    <text class="account-icon">{{ account.icon }}</text>
                    <view class="account-info">
                      <view class="name-row">
                        <text class="account-name">{{ account.name }}</text>
                        <view v-if="account.isDefault" class="default-badge">
                          <text class="badge-text">默认</text>
                        </view>
                      </view>
                      <text v-if="account.description" class="account-desc">{{ account.description }}</text>
                    </view>
                  </view>
                  <view class="card-right">
                    <text class="balance" :style="{ color: getBalanceColor(account.type) }">
                      ¥{{ formatBalance(account.balance) }}
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
                    v-if="!account.isDefault"
                    class="swipe-btn swipe-btn-delete"
                    @click.stop="handleDelete(account)"
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
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getAccountList, deleteAccount } from '../../../api/account'
import { navigateBack } from '../../../utils/navigate'
import type { Account, AccountType } from '../../../types/account'
import { ACCOUNT_TYPE_OPTIONS, getBalanceColor } from '../../../types/account'

const loading = ref(false)
const accounts = ref<Account[]>([])

const groupedAccounts = computed(() => {
  const groups: { type: AccountType; accounts: Account[] }[] = []
  const typeOrder: AccountType[] = ['cash', 'fixed_asset', 'depreciable_asset', 'liability']

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

const formatBalance = (balance: number): string => {
  return balance.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

async function loadAccounts() {
  loading.value = true
  try {
    const res = await getAccountList()
    if (res.success) {
      accounts.value = res.data
    } else {
      uni.showToast({
        title: res.message || '获取账户列表失败',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('加载账户列表失败:', error)
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    })
  } finally {
    loading.value = false
  }
}

function goBack() {
  navigateBack('/pages/my/index')
}

function goToAdd() {
  uni.navigateTo({
    url: '/pages/my/account-setting/account-edit'
  })
}

function goToEdit(id: string) {
  uni.navigateTo({
    url: `/pages/my/account-setting/account-edit?id=${id}`
  })
}

function handleEdit(account: Account) {
  goToEdit(account.id)
}

async function handleDelete(account: Account) {
  uni.showModal({
    title: '提示',
    content: '确定要删除此账户吗？',
    success: async (res) => {
      if (res.confirm) {
        try {
          const apiRes = await deleteAccount(account.id)
          if (apiRes.success) {
            uni.showToast({ title: '删除成功', icon: 'success' })
            loadAccounts()
          } else {
            uni.showToast({ title: apiRes.message || '删除失败', icon: 'none' })
          }
        } catch (err) {
          uni.showToast({ title: '网络错误', icon: 'none' })
        }
      }
    }
  })
}

onShow(() => {
  loadAccounts()
})
</script>

<style scoped>
.page-container {
  overflow-x: hidden;
  min-height: 100vh;
  background-color: #F5F5F5;
}

.content-scroll {
  padding: 24rpx;
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 160rpx 0;
}

.loading-icon,
.empty-icon {
  font-size: 120rpx;
  margin-bottom: 24rpx;
  opacity: 0.4;
}

.loading-text,
.empty-text {
  font-size: 28rpx;
  color: #999999;
  text-align: center;
  line-height: 1.6;
}

.group-section {
  margin-bottom: 32rpx;
}

.group-title {
  display: flex;
  align-items: center;
  height: 64rpx;
  padding-left: 8rpx;
  font-size: 26rpx;
  font-weight: 600;
  color: #666666;
  letter-spacing: 1rpx;
}

.title-line {
  width: 6rpx;
  height: 28rpx;
  background: linear-gradient(180deg, #00BFFF 0%, #0099CC 100%);
  border-radius: 3rpx;
  margin-right: 12rpx;
}

.account-list {
  display: flex;
  flex-direction: column;
  gap: 20rpx;
}

.account-card {
  height: 120rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
  background-color: #FFFFFF;
  border-radius: 20rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.account-card:active {
  background-color: #F8F9FA;
}

.card-left {
  display: flex;
  align-items: center;
  flex: 1;
}

.account-icon {
  font-size: 52rpx;
  margin-right: 20rpx;
  width: 64rpx;
  text-align: center;
}

.account-info {
  display: flex;
  flex-direction: column;
  flex: 1;
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
  color: #333333;
}

.default-badge {
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  padding: 2rpx 12rpx;
  border-radius: 8rpx;
}

.badge-text {
  font-size: 20rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.account-desc {
  font-size: 24rpx;
  color: #999999;
  line-height: 1.4;
}

.card-right {
  display: flex;
  align-items: center;
  margin-left: 16rpx;
}

.balance {
  font-size: 32rpx;
  font-weight: 700;
  margin-right: 12rpx;
}

.card-arrow {
  font-size: 44rpx;
  color: #CCCCCC;
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
  background-color: #00BFFF;
}

.swipe-btn-delete {
  background-color: #FA3534;
}

.swipe-btn-text {
  font-size: 26rpx;
  color: #FFFFFF;
  font-weight: 500;
}

.safe-bottom {
  height: calc(env(safe-area-inset-bottom) + 40rpx);
}
</style>
