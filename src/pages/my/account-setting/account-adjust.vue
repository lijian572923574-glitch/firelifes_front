<template>
  <view class="account-adjust-page">
    <WdNavbar
      title="调整余额"
      leftArrow
      fixed
      placeholder
      bordered
      safeAreaInsetTop
      @click-left="goBack"
    />

    <scroll-view class="content" scroll-y>
      <!-- 账户信息卡片 -->
      <view v-if="account" class="account-card">
        <view class="account-header">
          <text class="account-icon">{{ account.icon }}</text>
          <view class="account-info">
            <text class="account-name">{{ account.name }}</text>
            <text class="account-type">{{ getTypeLabel(account.type) }}</text>
          </view>
        </view>
        <view class="balance-section">
          <text class="label">当前余额</text>
          <text class="current-balance" :style="{ color: getBalanceColor(account.type) }">
            ¥{{ formatBalance(account.balance) }}
          </text>
        </view>
      </view>

      <view class="form-container">
        <!-- 新余额输入 -->
        <view class="form-item">
          <view class="form-label">调整后余额</view>
          <WdInput
            :model-value="newBalanceInput"
            @update:model-value="onNewBalanceInput"
            type="text"
            :placeholder="account?.type === 'liability' ? '-0.00' : '0.00'"
            showClear
            customStyle="background: #F8F8F8; border-radius: 12rpx;"
          >
            <template #prefix>
              <text class="currency">¥</text>
            </template>
          </WdInput>
        </view>

        <!-- 调整金额预览 -->
        <view v-if="showDiff" class="diff-section">
          <view class="diff-label">调整金额</view>
          <text class="diff-amount" :class="{ positive: diffAmount >= 0, negative: diffAmount < 0 }">
            {{ diffAmount >= 0 ? '+' : '' }}¥{{ formatBalance(Math.abs(diffAmount)) }}
          </text>
        </view>

        <!-- 备注 -->
        <view class="form-item">
          <view class="form-label">备注（选填）</view>
          <WdTextarea
            v-model="remark"
            placeholder="请输入调整原因..."
            :maxlength="500"
            showWordCount
            autoHeight
            customStyle="background: #F8F8F8; border-radius: 12rpx;"
          />
        </view>
      </view>

      <!-- 调整记录 -->
      <view v-if="adjustments.length > 0" class="records-section">
        <view class="section-title">调整记录</view>
        <view class="records-list">
          <view v-for="item in adjustments" :key="item.id" class="record-item">
            <view class="record-left">
              <text class="record-icon">📝</text>
              <view class="record-info">
                <text class="record-diff">
                  {{ item.adjustmentAmount >= 0 ? '+' : '' }}¥{{ formatBalance(item.adjustmentAmount) }}
                </text>
                <text class="record-time">{{ formatTime(item.createdAt) }}</text>
              </view>
            </view>
            <view class="record-right">
              <text class="record-balance">¥{{ formatBalance(item.newBalance) }}</text>
            </view>
          </view>
        </view>
      </view>

      <view class="safe-bottom"></view>
    </scroll-view>

    <view class="save-section">
      <WdButton
        type="primary"
        block
        :disabled="!canAdjust"
        :loading="adjusting"
        customStyle="height: 88rpx; border-radius: 44rpx; font-size: 32rpx; font-weight: 600;"
        @click="handleAdjust"
      >
        确认调整
      </WdButton>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad, onShow } from '@dcloudio/uni-app';
import { getAccountDetail, adjustAccountBalance, getAccountAdjustments } from '../../../api/account';
import { navigateBack } from '../../../utils/navigate';
import type { Account, AccountType, AccountAdjustment } from '../../../types/account';
import { ACCOUNT_TYPE_OPTIONS, getBalanceColor } from '../../../types/account';

const accountId = ref<string>('');
const account = ref<Account | null>(null);
const adjustments = ref<AccountAdjustment[]>([]);
const adjusting = ref(false);

const newBalanceInput = ref('');
const newBalance = ref(0);
const remark = ref('');

const showDiff = computed(() => {
  return account.value !== null && newBalanceInput.value !== '';
});

const diffAmount = computed(() => {
  if (!account.value) return 0;
  return newBalance.value - account.value.balance;
});

const canAdjust = computed(() => {
  return account.value !== null &&
         newBalanceInput.value !== '' &&
         !isNaN(newBalance.value) &&
         newBalance.value !== account.value.balance;
});

const formatBalance = (balance: number): string => {
  return balance.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
};

const getTypeLabel = (type: AccountType): string => {
  const option = ACCOUNT_TYPE_OPTIONS.find(o => o.value === type);
  return option?.label || type;
};

const formatTime = (timeStr: string): string => {
  const date = new Date(timeStr);
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hour = String(date.getHours()).padStart(2, '0');
  const minute = String(date.getMinutes()).padStart(2, '0');
  return `${month}-${day} ${hour}:${minute}`;
};

const loadData = async () => {
  try {
    const [accountRes, adjustmentsRes] = await Promise.all([
      getAccountDetail(accountId.value),
      getAccountAdjustments(accountId.value)
    ]);
    
    if (accountRes.success) {
      account.value = accountRes.data;
    }
    if (adjustmentsRes.success) {
      adjustments.value = adjustmentsRes.data;
    }
  } catch (err) {
    console.error('加载数据失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

const onNewBalanceInput = (value: string) => {
  if (!account.value) return;
  
  const isLiability = account.value.type === 'liability';
  
  let regex;
  if (isLiability) {
    regex = /^-?\d*\.?\d{0,2}$/;
  } else {
    regex = /^\d*\.?\d{0,2}$/;
  }
  
  if (regex.test(value) || value === '') {
    if (value !== '') {
      const num = parseFloat(value) || 0;
      if (isLiability && num > 0 && !value.startsWith('-')) {
        newBalanceInput.value = '-' + value;
        newBalance.value = -num;
      } else {
        newBalanceInput.value = value;
        newBalance.value = num;
      }
    } else {
      newBalanceInput.value = value;
      newBalance.value = 0;
    }
  }
};

const handleAdjust = async () => {
  if (!canAdjust.value || adjusting.value || !account.value) return;
  
  let finalBalance = newBalance.value;
  if (account.value.type === 'liability' && finalBalance > 0) {
    finalBalance = -Math.abs(finalBalance);
  }
  
  adjusting.value = true;
  try {
    const res = await adjustAccountBalance(accountId.value, {
      newBalance: finalBalance,
      remark: remark.value
    });
    if (res.success) {
      uni.showToast({
        title: '调整成功',
        icon: 'success'
      });
      setTimeout(() => {
        navigateBack('/pages/my/account-setting/account-edit');
      }, 1500);
    } else {
      uni.showToast({
        title: res.message || '调整失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('调整失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  } finally {
    adjusting.value = false;
  }
};

const goBack = () => {
  navigateBack('/pages/my/account-setting/account-edit');
};

onLoad((options: any) => {
  if (options.id) {
    accountId.value = options.id;
    loadData();
  }
});

onShow(() => {
  if (accountId.value) {
    loadData();
  }
});
</script>

<style>
.account-adjust-page {
  min-height: 100vh;
  background-color: #F8F9FA;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 24rpx 0;
  padding-bottom: 140rpx;
}

.account-card {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  margin: 0 24rpx 24rpx;
  border-radius: 20rpx;
  padding: 32rpx;
}

.account-header {
  display: flex;
  align-items: center;
  margin-bottom: 24rpx;
}

.account-icon {
  font-size: 56rpx;
  margin-right: 16rpx;
}

.account-info {
  display: flex;
  flex-direction: column;
}

.account-name {
  font-size: 32rpx;
  color: #0277BD;
  font-weight: 700;
  margin-bottom: 4rpx;
}

.account-type {
  font-size: 24rpx;
  color: #0288D1;
  opacity: 0.8;
}

.balance-section {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.label {
  font-size: 26rpx;
  color: #01579B;
}

.current-balance {
  font-size: 40rpx;
  font-weight: 700;
}

.form-container {
  background-color: #FFFFFF;
  margin: 0 24rpx;
  border-radius: 20rpx;
  padding: 36rpx 28rpx;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.04);
}

.form-item {
  margin-bottom: 40rpx;
}

.form-item:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 28rpx;
  color: #333333;
  font-weight: 600;
  margin-bottom: 16rpx;
}

.currency {
  font-size: 32rpx;
  color: #333333;
  font-weight: 700;
  margin-right: 8rpx;
}

.diff-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 40rpx;
  padding: 20rpx 24rpx;
  background-color: #F8F9FA;
  border-radius: 12rpx;
}

.diff-label {
  font-size: 26rpx;
  color: #666666;
}

.diff-amount {
  font-size: 32rpx;
  font-weight: 700;
}

.diff-amount.positive {
  color: #19BE6B;
}

.diff-amount.negative {
  color: #FA3534;
}

.records-section {
  margin-top: 32rpx;
  padding: 0 24rpx;
}

.section-title {
  font-size: 26rpx;
  color: #666666;
  font-weight: 600;
  margin-bottom: 20rpx;
}

.records-list {
  background-color: #FFFFFF;
  border-radius: 16rpx;
  overflow: hidden;
}

.record-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx;
  border-bottom: 1rpx solid #F0F0F0;
}

.record-item:last-child {
  border-bottom: none;
}

.record-left {
  display: flex;
  align-items: center;
}

.record-icon {
  font-size: 36rpx;
  margin-right: 16rpx;
}

.record-info {
  display: flex;
  flex-direction: column;
}

.record-diff {
  font-size: 28rpx;
  color: #333333;
  font-weight: 600;
  margin-bottom: 4rpx;
}

.record-time {
  font-size: 24rpx;
  color: #999999;
}

.record-right {
  display: flex;
  align-items: center;
}

.record-balance {
  font-size: 28rpx;
  color: #333333;
  font-weight: 600;
}

.save-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 24rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #F8F9FA;
}

.safe-bottom {
  height: env(safe-area-inset-bottom);
}
</style>
