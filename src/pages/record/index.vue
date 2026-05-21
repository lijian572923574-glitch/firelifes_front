<template>
  <view class="record-page">
    <view class="header">
      <view class="header-bottom">
        <view class="header-left">
          <text class="type-btn" :class="{ active: transactionType === 'expense' }" @tap="switchType('expense')">支出</text>
          <text class="type-divider">|</text>
          <text class="type-btn" :class="{ active: transactionType === 'income' }" @tap="switchType('income')">收入</text>
        </view>
        <text class="cancel-btn" @tap="handleCancel">取消</text>
      </view>
    </view>

    <view class="content">
      <CategorySelector ref="categorySelectorRef" :transactionType="transactionType" :selectedCategoryId="selectedCategory?.id || 0" @select="selectCategory" />
    </view>

    <WdPopup
      position="bottom"
      v-model="showTransactionForm"
      :z-index="1000"
      :modal="true"
      :close-on-click-modal="true"
      custom-style="border-radius: 32rpx 32rpx 0 0; background: transparent;"
      @close="handleCloseTransactionForm"
    >
      <TransactionForm
        :date="selectedDate"
        :transactionType="transactionType"
        :categoryName="selectedCategory?.name"
        :isTransfer="isTransfer"
        :isRepayment="isRepayment"
        :fromAccount="fromAccount"
        :toAccount="toAccount"
        :selectedAccount="selectedAccount"
        :submitting="submitStatus !== 'idle'"
        @update:date="selectedDate = $event"
        @update:amount="displayAmount = $event"
        @update:remark="remark = $event"
        @update:fromAccount="fromAccount = $event"
        @update:toAccount="toAccount = $event"
        @update:selectedAccount="selectedAccount = $event"
        @update:assetData="assetData = $event"
        @complete="handleComplete"
        @toggleDatePicker="showDatePicker = true"
      />
    </WdPopup>

    <DatePicker :visible="showDatePicker" :date="selectedDate" @update:date="selectedDate = $event" @close="showDatePicker = false" />
    <CustomTabbar />

    <view v-if="submitStatus === 'submitting'" class="loading-overlay" @tap.stop>
      <view class="loading-box">
        <view class="loading-spinner"></view>
        <text class="loading-text">记账中...</text>
      </view>
    </view>

    <RecordConfirmCard
      v-if="showConfirmCard"
      :type="transactionType"
      :amount="Math.abs(parseFloat(displayAmount))"
      :categoryName="selectedCategory?.name || ''"
      :accountName="activeAccount?.name || ''"
      :accountIcon="activeAccount?.icon || ''"
      :accountBalance="0"
      :hasAsset="!!assetData"
      @continue="handleContinueRecord"
      @back="handleBackToDetail"
    />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CategorySelector from './components/CategorySelector.vue'
import TransactionForm from './components/TransactionForm.vue'
import DatePicker from './components/DatePicker.vue'
import RecordConfirmCard from './components/RecordConfirmCard.vue'
import { recordApi } from '../../api/record'
import { getAccountList } from '../../api/account'
import type { Account } from '../../types/account'
import type { DepreciatingAssetData } from '../../types/asset'
import type { RecordType, CreateRecordData } from '../../api/record'
import CustomTabbar from '../../components/CustomTabbar.vue'

const transactionType = ref<'income' | 'expense'>('expense')
const selectedCategory = ref<{ id: number; name: string; icon: string } | null>(null)
const displayAmount = ref('')
const remark = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const showDatePicker = ref(false)
const showTransactionForm = ref(false)
const isSubmitting = ref(false)
const submitStatus = ref<'idle' | 'submitting' | 'success' | 'error'>('idle')
const categorySelectorRef = ref()

const selectedAccount = ref<Account | null>(null)
const fromAccount = ref<Account | null>(null)
const toAccount = ref<Account | null>(null)
const assetData = ref<DepreciatingAssetData | null>(null)
const showConfirmCard = ref(false)

const activeAccount = computed(() => {
  if (isTransfer.value || isRepayment.value) return fromAccount.value
  return selectedAccount.value
})

const isTransfer = computed(() => selectedCategory.value?.name === '转账')
const isRepayment = computed(() => selectedCategory.value?.name === '还债')

const recordType = computed<RecordType>(() => {
  if (isTransfer.value) return 'transfer'
  if (isRepayment.value) return 'repayment'
  return transactionType.value
})

onMounted(() => {
})

onUnmounted(() => {
})

onShow(() => {
  resetForm()
})

const resetForm = () => {
  transactionType.value = 'expense'
  selectedCategory.value = null
  displayAmount.value = ''
  remark.value = ''
  selectedDate.value = new Date().toISOString().split('T')[0]
  selectedAccount.value = null
  fromAccount.value = null
  toAccount.value = null
  categorySelectorRef.value?.reload?.()
}

const switchType = (type: 'income' | 'expense') => {
  transactionType.value = type
  selectedCategory.value = null
  selectedAccount.value = null
  fromAccount.value = null
  toAccount.value = null
}

const selectCategory = async (category: { id: number; name: string; icon: string }) => {
  selectedCategory.value = category

  if (category.name === '转账' || category.name === '还债') {
    fromAccount.value = null
    toAccount.value = null
  }

  try {
    const res = await getAccountList()
    if (res.success && res.data && res.data.length > 0) {
      const accounts = res.data.filter(a => !a.isDeleted && a.isVisible)

      if (category.name === '转账') {
        const nonLiability = accounts.filter(a => a.type !== 'liability')
        fromAccount.value = nonLiability.find(a => a.isDefaultExpense) || nonLiability[0] || null
        toAccount.value = accounts.find(a => a.id !== fromAccount.value?.id) || null
      } else if (category.name === '还债') {
        const nonLiability = accounts.filter(a => a.type !== 'liability')
        const liabilities = accounts.filter(a => a.type === 'liability')
        fromAccount.value = nonLiability.find(a => a.isDefaultExpense) || nonLiability[0] || null
        toAccount.value = liabilities.find(a => a.isDefaultIncome) || liabilities[0] || null
      } else if (transactionType.value === 'expense') {
        const expenseAccounts = accounts.filter(a => a.type === 'cash' || a.type === 'liability')
        selectedAccount.value = expenseAccounts.find(a => a.isDefaultExpense) || expenseAccounts[0] || null
      } else {
        const incomeAccounts = accounts.filter(a => a.type !== 'liability')
        selectedAccount.value = incomeAccounts.find(a => a.isDefaultIncome) || incomeAccounts[0] || null
      }
    }
  } catch (error) {
    console.error('加载账户列表失败:', error)
  }

  showTransactionForm.value = true
}

const handleCloseTransactionForm = () => {
  showTransactionForm.value = false
}

const handleCancel = () => {
  uni.reLaunch({ url: '/pages/detail/index' })
}

const handleComplete = async () => {
  if (!displayAmount.value) {
    uni.showToast({ title: '请输入金额', icon: 'none' })
    return
  }
  if (!selectedCategory.value) {
    uni.showToast({ title: '请选择分类', icon: 'none' })
    return
  }

  if (isTransfer.value || isRepayment.value) {
    if (!fromAccount.value) {
      uni.showToast({ title: isRepayment.value ? '请选择还款账户' : '请选择转出账户', icon: 'none' })
      return
    }
    if (!toAccount.value) {
      uni.showToast({ title: isRepayment.value ? '请选择债权账户' : '请选择转入账户', icon: 'none' })
      return
    }
    if (fromAccount.value.id === toAccount.value.id) {
      uni.showToast({ title: '转出和转入账户不能相同', icon: 'none' })
      return
    }
  }

  if (isSubmitting.value) return
  isSubmitting.value = true
  submitStatus.value = 'submitting'

  try {
    const amount = parseFloat(displayAmount.value)
    const finalAmount = transactionType.value === 'expense' || isTransfer.value || isRepayment.value ? -Math.abs(amount) : Math.abs(amount)

    const payload: CreateRecordData = {
      typeId: selectedCategory.value.id,
      type: recordType.value,
      amount: finalAmount,
      remark: remark.value,
      date: selectedDate.value
    }

    if (isTransfer.value || isRepayment.value) {
      payload.accountId = parseInt(fromAccount.value!.id)
      payload.toAccountId = parseInt(toAccount.value!.id)
    } else if (selectedAccount.value) {
      payload.accountId = parseInt(selectedAccount.value.id)
    }

    // 如果记入了折旧资产，附加资产数据
    if (assetData.value) {
      payload.depreciatingAsset = {
        name: assetData.value.name,
        category: assetData.value.category,
        depreciationMethod: assetData.value.depreciationMethod,
        purchasePrice: assetData.value.purchasePrice,
        purchaseDate: assetData.value.purchaseDate,
        expectedLifeMonths: assetData.value.expectedLifeMonths,
        residualValue: assetData.value.residualValue,
      }
    }

    const res = await recordApi.createRecord(payload)

    if (res.success) {
      submitStatus.value = 'idle'
      isSubmitting.value = false
      showTransactionForm.value = false
      showConfirmCard.value = true
    } else {
      submitStatus.value = 'error'
      setTimeout(() => {
        submitStatus.value = 'idle'
        isSubmitting.value = false
      }, 1200)
      uni.showToast({ title: res.message || '记账失败', icon: 'none' })
    }
  } catch (error) {
    submitStatus.value = 'error'
    setTimeout(() => {
      submitStatus.value = 'idle'
      isSubmitting.value = false
    }, 1200)
    uni.showToast({ title: '网络错误', icon: 'none' })
    console.error('记账失败:', error)
  }
}

const handleContinueRecord = () => {
  showConfirmCard.value = false
  selectedCategory.value = null
  displayAmount.value = ''
  remark.value = ''
  assetData.value = null
  showTransactionForm.value = false
}

const handleBackToDetail = () => {
  uni.reLaunch({ url: '/pages/detail/index' })
}
</script>

<style>
.record-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #faf9f6 0%, #f5f3ef 100%);
  padding-top: 120rpx;
  padding-bottom: 80px;
}

.header {
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  padding: 20rpx 30rpx;
  color: #333;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 80;
  box-shadow: 0 4rpx 20rpx rgba(0, 191, 255, 0.3);
  backdrop-filter: blur(10rpx);
}

.header-bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20rpx;
}

.content {
  overflow-y: auto;
  padding-bottom: 20rpx;
}

.content.has-form {
  padding-bottom: 500rpx;
}

.type-btn {
  font-size: 32rpx;
  font-weight: 600;
  color: rgba(51, 51, 51, 0.5);
  padding: 10rpx 30rpx;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
}

.type-btn.active {
  color: #333;
}

.type-btn.active::after {
  content: '';
  position: absolute;
  bottom: -5rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 40rpx;
  height: 6rpx;
  background: #333;
  border-radius: 3rpx;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateX(-50%) translateY(-10rpx);
  }
  to {
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }
}

.type-divider {
  font-size: 32rpx;
  color: rgba(51, 51, 51, 0.3);
  font-weight: 200;
}

.cancel-btn {
  font-size: 28rpx;
  color: #333;
  padding: 10rpx 24rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(5rpx);
  border: 1rpx solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.cancel-btn:active {
  transform: scale(0.95);
  background: rgba(255, 255, 255, 0.6);
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(8rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  animation: fadeIn 0.2s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.loading-box {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20rpx);
  border-radius: 20rpx;
  padding: 48rpx 64rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 28rpx;
  box-shadow: 0 8rpx 32rpx rgba(0, 0, 0, 0.08), 0 2rpx 8rpx rgba(0, 0, 0, 0.04);
  border: 1rpx solid rgba(255, 255, 255, 0.8);
  animation: popIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes popIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

.loading-spinner {
  width: 56rpx;
  height: 56rpx;
  border: 4rpx solid rgba(0, 191, 255, 0.15);
  border-top-color: #00BFFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-check {
  width: 56rpx;
  height: 56rpx;
  border-radius: 50%;
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 4rpx 16rpx rgba(0, 191, 255, 0.35);
  animation: checkPop 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes checkPop {
  from {
    transform: scale(0);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  color: #2d3436;
  font-size: 28rpx;
  font-weight: 500;
}
</style>
