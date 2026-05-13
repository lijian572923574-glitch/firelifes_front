<template>
  <view class="account-edit-page">
    <!-- WotUI 导航栏 -->
    <WdNavbar
      :title="isEdit ? '编辑账户' : '新增账户'"
      leftArrow
      fixed
      placeholder
      bordered
      safeAreaInsetTop
      @click-left="goBack"
    />

    <!-- 内容区域 -->
    <scroll-view class="content" scroll-y>
      <view class="form-container">
        <!-- 图标选择 -->
        <view class="form-item">
          <view class="form-label">账户图标</view>
          <view class="icon-selector">
            <view
              v-for="icon in ACCOUNT_ICONS"
              :key="icon"
              class="icon-item"
              :class="{ active: formData.icon === icon }"
              @click="formData.icon = icon"
            >
              <text class="icon-text">{{ icon }}</text>
            </view>
          </view>
        </view>

        <!-- 账户名称 -->
        <view class="form-item">
          <view class="form-label">账户名称</view>
          <WdInput
            v-model="formData.name"
            placeholder="请输入账户名称"
            :maxlength="20"
            showClear
            customStyle="background: #F8F8F8; border-radius: 12rpx;"
          />
        </view>

        <!-- 账户类型 -->
        <view class="form-item">
          <view class="form-label">账户类型</view>
          <view class="type-selector">
            <view
              v-for="type in ACCOUNT_TYPE_OPTIONS"
              :key="type.value"
              class="type-item"
              :class="{ active: formData.type === type.value }"
              @click="onTypeChange(type.value)"
            >
              <text class="type-text">{{ type.label }}</text>
            </view>
          </view>
        </view>

        <!-- 账户余额 -->
        <view class="form-item">
          <view class="form-label">账户余额</view>
          <WdInput
            :model-value="balanceInput"
            @update:model-value="onBalanceInput"
            type="text"
            :placeholder="formData.type === 'liability' ? '-0.00' : '0.00'"
            showClear
            customStyle="background: #F8F8F8; border-radius: 12rpx;"
          >
            <template #prefix>
              <text class="currency">¥</text>
            </template>
          </WdInput>
        </view>

        <!-- 调整余额入口 -->
        <view v-if="isEdit" class="adjust-section" @click="goToAdjust">
          <view class="adjust-left">
            <text class="adjust-icon">🔄</text>
            <text class="adjust-text">调整余额</text>
          </view>
          <text class="arrow">›</text>
        </view>

        <!-- 账户说明 -->
        <view class="form-item">
          <view class="form-label">账户说明</view>
          <WdTextarea
            v-model="formData.description"
            placeholder="请输入账户说明（选填）"
            :maxlength="500"
            showWordCount
            autoHeight
            customStyle="background: #F8F8F8; border-radius: 12rpx;"
          />
        </view>
      </view>

      <!-- 底部安全区域 -->
      <view class="safe-bottom"></view>
    </scroll-view>

    <!-- 保存按钮 - 固定在底部 -->
    <view class="save-section">
      <WdButton
        type="primary"
        block
        :disabled="!canSave"
        :loading="saving"
        customStyle="height: 88rpx; border-radius: 44rpx; font-size: 32rpx; font-weight: 600;"
        @click="handleSave"
      >
        保存
      </WdButton>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getAccountDetail, createAccount, updateAccount } from '../../../api/account';
import { navigateBack } from '../../../utils/navigate';
import type { Account, AccountRequest, AccountType } from '../../../types/account';
import { ACCOUNT_TYPE_OPTIONS, ACCOUNT_ICONS } from '../../../types/account';

const accountId = ref<string | null>(null);
const isEdit = computed(() => !!accountId.value);
const account = ref<Account | null>(null);
const saving = ref(false);

const formData = ref<AccountRequest>({
  name: '',
  icon: '💵',
  type: 'cash',
  balance: 0,
  description: ''
});

const balanceInput = ref('');

const canSave = computed(() => {
  return formData.value.name.trim().length > 0 &&
         formData.value.name.length <= 20 &&
         !isNaN(formData.value.balance);
});

const loadAccountDetail = async (id: string) => {
  try {
    const res = await getAccountDetail(id);
    if (res.success) {
      account.value = res.data;
      
      // 负债类余额强制转负数
      let displayBalance = res.data.balance;
      if (res.data.type === 'liability' && res.data.balance > 0) {
        displayBalance = -Math.abs(res.data.balance);
      }
      
      formData.value = {
        name: res.data.name,
        icon: res.data.icon,
        type: res.data.type,
        balance: displayBalance,
        description: res.data.description
      };
      
      balanceInput.value = displayBalance.toString();
    } else {
      uni.showToast({
        title: res.message || '获取账户详情失败',
        icon: 'none'
      });
    }
  } catch (err) {
    console.error('加载账户详情失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  }
};

const onTypeChange = (type: AccountType) => {
  const oldType = formData.value.type;
  formData.value.type = type;
  
  // 如果从非负债类切换到负债类，且当前余额是正数，自动转为负数
  if (type === 'liability' && oldType !== 'liability') {
    if (balanceInput.value !== '' && !balanceInput.value.startsWith('-')) {
      const num = parseFloat(balanceInput.value) || 0;
      if (num > 0) {
        balanceInput.value = '-' + balanceInput.value;
        formData.value.balance = -num;
      }
    }
  }
  // 如果从负债类切换到非负债类，且当前余额是负数，自动转为正数
  else if (type !== 'liability' && oldType === 'liability') {
    if (balanceInput.value.startsWith('-')) {
      const num = parseFloat(balanceInput.value) || 0;
      balanceInput.value = balanceInput.value.slice(1);
      formData.value.balance = Math.abs(num);
    }
  }
};

const onBalanceInput = (value: string) => {
  const isLiability = formData.value.type === 'liability';
  
  // 负债类允许负数，其他类不允许负数
  let regex;
  if (isLiability) {
    regex = /^-?\d*\.?\d{0,2}$/;
  } else {
    regex = /^\d*\.?\d{0,2}$/;
  }
  
  if (regex.test(value) || value === '') {
    if (value !== '') {
      const num = parseFloat(value) || 0;
      // 负债类强制为负数（如果输入正数自动转为负数）
      if (isLiability && num > 0 && !value.startsWith('-')) {
        balanceInput.value = '-' + value;
        formData.value.balance = -num;
      } else {
        balanceInput.value = value;
        formData.value.balance = num;
      }
    } else {
      balanceInput.value = value;
      formData.value.balance = 0;
    }
  }
};

const handleSave = async () => {
  if (!canSave.value || saving.value) return;

  // 负债类余额强制转负数
  if (formData.value.type === 'liability' && formData.value.balance > 0) {
    formData.value.balance = -Math.abs(formData.value.balance);
    if (balanceInput.value && !balanceInput.value.startsWith('-')) {
      balanceInput.value = '-' + balanceInput.value;
    }
  }

  saving.value = true;
  try {
    if (isEdit.value && accountId.value) {
      const res = await updateAccount(accountId.value, formData.value);
      if (res.success) {
        uni.showToast({
          title: '修改成功',
          icon: 'success'
        });
        setTimeout(() => {
          navigateBack('/pages/my/account-setting/account-list');
        }, 1500);
      } else {
        uni.showToast({
          title: res.message || '修改失败',
          icon: 'none'
        });
      }
    } else {
      const res = await createAccount(formData.value);
      if (res.success) {
        uni.showToast({
          title: '创建成功',
          icon: 'success'
        });
        setTimeout(() => {
          navigateBack('/pages/my/account-setting/account-list');
        }, 1500);
      } else {
        uni.showToast({
          title: res.message || '创建失败',
          icon: 'none'
        });
      }
    }
  } catch (err) {
    console.error('保存失败:', err);
    uni.showToast({
      title: '网络错误',
      icon: 'none'
    });
  } finally {
    saving.value = false;
  }
};

const goBack = () => {
  navigateBack('/pages/my/account-setting/account-list');
};

const goToAdjust = () => {
  if (accountId.value) {
    uni.navigateTo({
      url: `/pages/my/account-setting/account-adjust?id=${accountId.value}`
    });
  }
};

onLoad((options: any) => {
  if (options.id) {
    accountId.value = options.id;
    loadAccountDetail(options.id);
  } else {
    formData.value = {
      name: '',
      icon: '💵',
      type: 'cash',
      balance: 0,
      description: ''
    };
    balanceInput.value = '';
  }
});
</script>

<style>
.account-edit-page {
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

/* 图标选择器 */
.icon-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.icon-item {
  width: 104rpx;
  height: 104rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #F8F9FA;
  border-radius: 16rpx;
  border: 2rpx solid transparent;
  transition: all 150ms ease;
}

.icon-item:active {
  transform: scale(0.95);
}

.icon-item.active {
  border-color: #00BFFF;
  background-color: rgba(0, 191, 255, 0.1);
}

.icon-text {
  font-size: 52rpx;
}

/* 类型选择器 */
.type-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.type-item {
  padding: 14rpx 28rpx;
  background-color: #F8F9FA;
  border-radius: 48rpx;
  border: 2rpx solid transparent;
  transition: all 150ms ease;
}

.type-item:active {
  transform: scale(0.98);
}

.type-item.active {
  border-color: #00BFFF;
  background-color: rgba(0, 191, 255, 0.1);
}

.type-text {
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
}

.type-item.active .type-text {
  color: #00BFFF;
  font-weight: 600;
}

/* 调整余额入口 */
.adjust-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 32rpx;
  padding: 28rpx;
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  border-radius: 16rpx;
}

.adjust-left {
  display: flex;
  align-items: center;
}

.adjust-icon {
  font-size: 44rpx;
  margin-right: 16rpx;
}

.adjust-text {
  font-size: 28rpx;
  color: #0277BD;
  font-weight: 600;
}

/* 保存区域 */
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