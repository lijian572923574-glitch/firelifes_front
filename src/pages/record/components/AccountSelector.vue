<template>
  <view class="account-selector">
    <view class="account-search" v-if="searchable">
      <input class="search-input" v-model="searchKeyword" placeholder="搜索账户..." />
    </view>

    <view class="account-list">
      <view v-show="filteredAccounts.length > 0">
        <view class="section-title">资产账户</view>
        <view
          v-for="account in filteredAccounts.filter(a => a.type !== 'liability')"
          :key="account.id"
          class="account-item"
          :class="{ selected: selectedId === account.id }"
          @click="selectAccount(account)"
        >
          <text class="account-icon">{{ account.icon }}</text>
          <view class="account-info">
            <text class="account-name">{{ account.name }}</text>
          </view>
          <text class="account-balance" :class="account.type === 'liability' ? 'negative' : 'positive'">
            {{ formatBalance(account.balance) }}
          </text>
          <text class="check-mark" v-if="selectedId === account.id">✓</text>
        </view>
      </view>

      <view v-show="filteredAccounts.filter(a => a.type === 'liability').length > 0">
        <view class="section-title">负债账户</view>
        <view
          v-for="account in filteredAccounts.filter(a => a.type === 'liability')"
          :key="account.id"
          class="account-item"
          :class="{ selected: selectedId === account.id }"
          @click="selectAccount(account)"
        >
          <text class="account-icon">{{ account.icon }}</text>
          <view class="account-info">
            <text class="account-name">{{ account.name }}</text>
          </view>
          <text class="account-balance negative">
            {{ formatBalance(account.balance) }}
          </text>
          <text class="check-mark" v-if="selectedId === account.id">✓</text>
        </view>
      </view>

      <view v-if="filteredAccounts.length === 0 && !loading" class="empty-state">
        <text class="empty-text">{{ emptyText }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import type { Account } from '../../../types/account'

const props = defineProps<{
  filterType?: 'expense' | 'income' | 'transfer' | 'repayment'
  filterRole?: 'from' | 'to'
  excludeAccountId?: string
  searchable?: boolean
  emptyText?: string
}>()

const emit = defineEmits<{
  (e: 'select', account: Account): void
}>()

const selectedId = ref<string>('')
const searchKeyword = ref('')
const loading = ref(true)
const accounts = ref<Account[]>([])

const filteredAccounts = computed(() => {
  let list = accounts.value

  if (props.filterType) {
    list = getFilteredAccounts(list, props.filterType, props.filterRole || 'from')
  }

  if (props.excludeAccountId) {
    list = list.filter(a => a.id !== props.excludeAccountId)
  }

  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    list = list.filter(a => a.name.toLowerCase().includes(keyword))
  }

  return list
})

const getFilteredAccounts = (
  allAccounts: Account[],
  transactionType: string,
  role: string
): Account[] => {
  switch (transactionType) {
    case 'expense':
      return allAccounts.filter(a => !a.isDeleted && a.isVisible)

    case 'income':
      return allAccounts.filter(a =>
        !a.isDeleted && a.isVisible && a.type !== 'liability'
      )

    case 'transfer':
      return allAccounts.filter(a => !a.isDeleted && a.isVisible)

    case 'repayment':
      if (role === 'from') {
        return allAccounts.filter(a =>
          !a.isDeleted && a.isVisible && a.type !== 'liability'
        )
      } else {
        return allAccounts.filter(a =>
          !a.isDeleted && a.isVisible && a.type === 'liability'
        )
      }

    default:
      return allAccounts.filter(a => !a.isDeleted && a.isVisible)
  }
}

const formatBalance = (balance: number) => {
  const abs = Math.abs(balance)
  if (abs >= 10000) {
    return '¥' + (abs / 10000).toFixed(1) + '万'
  }
  return '¥' + abs.toFixed(2)
}

const selectAccount = (account: Account) => {
  selectedId.value = account.id
  emit('select', account)
}

const loadAccounts = async () => {
  try {
    loading.value = true
    const { getAccountList } = await import('../../../api/account')
    const res = await getAccountList()
    if (res.success && res.data) {
      accounts.value = res.data
    }
  } catch (error) {
    console.error('加载账户列表失败:', error)
  } finally {
    loading.value = false
  }
}

const setSelected = (accountId?: string) => {
  selectedId.value = accountId || ''
}

watch(() => props.filterType, () => {
  selectedId.value = ''
  searchKeyword.value = ''
})

onMounted(() => {
  loadAccounts()
})

defineExpose({
  setSelected,
  reload: loadAccounts
})
</script>

<style scoped>
.account-selector {
  padding: 0;
}

.account-search {
  padding: 16rpx 24rpx;
}

.search-input {
  height: 72rpx;
  background: #f5f5f5;
  border-radius: 16rpx;
  padding: 0 24rpx;
  font-size: 28rpx;
  color: #333;
}

.section-title {
  font-size: 24rpx;
  color: #999;
  padding: 20rpx 24rpx 12rpx;
}

.account-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  margin: 0 16rpx 12rpx;
  background: #fff;
  border-radius: 16rpx;
  box-shadow: 0 2rpx 12rpx rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.account-item:active {
  transform: scale(0.98);
  background: rgba(0, 191, 255, 0.03);
}

.account-item.selected {
  background: rgba(0, 191, 255, 0.08);
  box-shadow: 0 0 0 2rpx rgba(0, 191, 255, 0.3);
}

.account-icon {
  font-size: 40rpx;
  margin-right: 20rpx;
  width: 60rpx;
  text-align: center;
}

.account-info {
  flex: 1;
}

.account-name {
  font-size: 28rpx;
  color: #333;
  font-weight: 500;
}

.account-balance {
  font-size: 26rpx;
  font-weight: 600;
  margin-right: 12rpx;
}

.account-balance.positive {
  color: #19BE6B;
}

.account-balance.negative {
  color: #FA3534;
}

.check-mark {
  font-size: 28rpx;
  color: #00BFFF;
  font-weight: 700;
}

.empty-state {
  padding: 80rpx;
  text-align: center;
}

.empty-text {
  font-size: 28rpx;
  color: #999;
}
</style>
