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
        @update:date="selectedDate = $event"
        @update:amount="displayAmount = $event"
        @update:remark="remark = $event"
        @update:fromAccount="fromAccount = $event"
        @update:toAccount="toAccount = $event"
        @update:selectedAccount="selectedAccount = $event"
        @complete="handleComplete"
        @toggleDatePicker="showDatePicker = true"
      />
    </WdPopup>

    <DatePicker :visible="showDatePicker" :date="selectedDate" @update:date="selectedDate = $event" @close="showDatePicker = false" />
    <CustomTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import CategorySelector from './components/CategorySelector.vue'
import TransactionForm from './components/TransactionForm.vue'
import DatePicker from './components/DatePicker.vue'
import { recordApi } from '../../api/record'
import type { Account } from '../../types/account'
import type { RecordType } from '../../api/record'
import CustomTabbar from '../../components/CustomTabbar.vue'

const transactionType = ref<'income' | 'expense'>('expense')
const selectedCategory = ref<{ id: number; name: string; icon: string } | null>(null)
const displayAmount = ref('')
const remark = ref('')
const selectedDate = ref(new Date().toISOString().split('T')[0])
const showDatePicker = ref(false)
const showTransactionForm = ref(false)
const isSubmitting = ref(false)
const categorySelectorRef = ref()

const selectedAccount = ref<Account | null>(null)
const fromAccount = ref<Account | null>(null)
const toAccount = ref<Account | null>(null)

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

const selectCategory = (category: { id: number; name: string; icon: string }) => {
  selectedCategory.value = category
  if (category.name === '转账' || category.name === '还债') {
    fromAccount.value = null
    toAccount.value = null
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

  try {
    const amount = parseFloat(displayAmount.value)
    const finalAmount = transactionType.value === 'expense' || isTransfer.value || isRepayment.value ? -Math.abs(amount) : Math.abs(amount)

    const payload: {
      typeId: number
      type: RecordType
      amount: number
      accountId?: number
      toAccountId?: number
      remark: string
      date: string
    } = {
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

    const res = await recordApi.createRecord(payload)

    if (res.success) {
      const successMsg = isTransfer.value ? '转账成功' : isRepayment.value ? '还款成功' : '记账成功'
      uni.showToast({ title: successMsg, icon: 'success' })
      setTimeout(() => {
        uni.reLaunch({ url: '/pages/detail/index' })
      }, 1000)
    } else {
      uni.showToast({ title: res.message || '记账失败', icon: 'none' })
    }
  } catch (error) {
    uni.showToast({ title: '网络错误', icon: 'none' })
    console.error('记账失败:', error)
  } finally {
    isSubmitting.value = false
  }
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
</style>
