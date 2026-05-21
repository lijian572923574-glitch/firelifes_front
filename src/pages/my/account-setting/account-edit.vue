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

        <!-- 默认支出账户开关 -->
        <view class="form-item">
          <view class="switch-item" @click="formData.isDefaultExpense = !formData.isDefaultExpense">
            <view class="switch-label">
              <text class="switch-title">设为默认支出账户</text>
              <text class="switch-desc">记账时默认选中此账户用于支出</text>
            </view>
            <WdSwitch
              :model-value="formData.isDefaultExpense"
              @update:model-value="formData.isDefaultExpense = $event"
              activeColor="#00BFFF"
            />
          </view>
        </view>

        <!-- 默认收入账户开关 -->
        <view class="form-item">
          <view class="switch-item" @click="formData.isDefaultIncome = !formData.isDefaultIncome">
            <view class="switch-label">
              <text class="switch-title">设为默认收入账户</text>
              <text class="switch-desc">记账时默认选中此账户用于收入</text>
            </view>
            <WdSwitch
              :model-value="formData.isDefaultIncome"
              @update:model-value="formData.isDefaultIncome = $event"
              activeColor="#00BFFF"
            />
          </view>
        </view>

        <!-- 负债类账户专用字段 - 贷款参数（灵活还款除外） -->
        <view v-if="formData.type === 'liability' && formData.repaymentMethod !== 'flexible'" class="form-item">
          <view class="liability-section">
            <view class="section-title">贷款参数</view>

            <!-- 原始贷款总本金 -->
            <view class="field-item">
              <text class="field-label">原始贷款总本金</text>
              <WdInput
                v-model.number="formData.originalPrincipal"
                type="digit"
                placeholder="请输入原始贷款总额"
                customStyle="background: #F8F8F8; border-radius: 12rpx;"
              >
                <template #suffix>
                  <text class="unit">元</text>
                </template>
              </WdInput>
            </view>

            <!-- 贷款年利率 -->
            <view class="field-item">
              <text class="field-label">贷款年利率</text>
              <WdInput
                v-model.number="formData.annualInterestRate"
                type="digit"
                placeholder="4.9"
                customStyle="background: #F8F8F8; border-radius: 12rpx;"
              >
                <template #suffix>
                  <text class="unit">%</text>
                </template>
              </WdInput>
              <text class="field-hint">灵活还款填0表示无息</text>
            </view>

            <!-- 还款方式 -->
            <view class="field-item">
              <text class="field-label">还款方式</text>
              <view class="repayment-selector">
                <view
                  v-for="method in repaymentMethods"
                  :key="method.value"
                  class="repayment-item"
                  :class="{ active: formData.repaymentMethod === method.value }"
                  @click="formData.repaymentMethod = method.value"
                >
                  <text class="repayment-text">{{ method.label }}</text>
                </view>
              </view>
            </view>

            <!-- 总还款期数 - 灵活还款不显示 -->
            <view v-if="formData.repaymentMethod !== 'flexible'" class="field-item">
              <text class="field-label">总还款期数</text>
              <WdInput
                v-model.number="formData.totalMonths"
                type="number"
                placeholder="请输入总期数"
                customStyle="background: #F8F8F8; border-radius: 12rpx;"
              >
                <template #suffix>
                  <text class="unit">月</text>
                </template>
              </WdInput>
            </view>

            <!-- 剩余还款期数 - 灵活还款不显示 -->
            <view v-if="formData.repaymentMethod !== 'flexible'" class="field-item">
              <text class="field-label">剩余还款期数</text>
              <WdInput
                v-model.number="formData.remainingMonths"
                type="number"
                placeholder="请输入剩余期数"
                customStyle="background: #F8F8F8; border-radius: 12rpx;"
              >
                <template #suffix>
                  <text class="unit">月</text>
                </template>
              </WdInput>
            </view>

            <!-- 每月还款日 - 灵活还款不显示 -->
            <view v-if="formData.repaymentMethod !== 'flexible'" class="field-item">
              <text class="field-label">每月还款日</text>
              <view class="day-selector">
                <view
                  v-for="day in 28"
                  :key="day"
                  class="day-item"
                  :class="{ active: formData.repaymentDay === day }"
                  @click="formData.repaymentDay = day"
                >
                  <text class="day-text">{{ day }}</text>
                </view>
              </view>
            </view>

            <!-- 关联资产账户 -->
            <view class="field-item">
              <text class="field-label">关联资产账户（可选）</text>
              <view class="account-picker" @click="showAccountPicker = true">
                <text v-if="linkedAccountName" class="picker-value">{{ linkedAccountName }}</text>
                <text v-else class="picker-placeholder">选择关联的固定资产账户</text>
                <text class="picker-arrow">›</text>
              </view>
            </view>
          </view>
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

  <!-- 账户选择弹窗 -->
  <wd-popup v-model="showAccountPicker" position="bottom">
    <view class="account-picker-popup">
      <view class="picker-header">
        <text class="picker-title">选择关联资产账户</text>
        <text class="picker-cancel" @click="showAccountPicker = false">取消</text>
      </view>
      <view class="picker-list">
        <view
          v-for="account in assetAccounts"
          :key="account.id"
          class="picker-item"
          :class="{ selected: formData.linkedAssetAccountId === account.id }"
          @click="selectLinkedAccount(account.id)"
        >
          <text class="picker-icon">{{ account.icon }}</text>
          <text class="picker-name">{{ account.name }}</text>
          <text v-if="formData.linkedAssetAccountId === account.id" class="check-icon">✓</text>
        </view>
        <view
          v-if="formData.linkedAssetAccountId"
          class="picker-item picker-clear"
          @click="clearLinkedAccount"
        >
          <text class="picker-name clear-text">不关联任何账户</text>
        </view>
      </view>
    </view>
  </wd-popup>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { onLoad } from '@dcloudio/uni-app';
import { getAccountDetail, createAccount, updateAccount, getAccountList } from '../../../api/account';
import { navigateBack } from '../../../utils/navigate';
import type { Account, AccountRequest, AccountType, RepaymentMethod } from '../../../types/account';
import { ACCOUNT_TYPE_OPTIONS, ACCOUNT_ICONS } from '../../../types/account';

const accountId = ref<string | null>(null);
const isEdit = computed(() => !!accountId.value);
const account = ref<Account | null>(null);
const saving = ref(false);

// 还款方式选项
const repaymentMethods: { value: RepaymentMethod; label: string }[] = [
  { value: 'equal_principal_interest', label: '等额本息' },
  { value: 'equal_principal', label: '等额本金' },
  { value: 'interest_first', label: '先息后本' },
  { value: 'flexible', label: '灵活还款' }
];

// 资产账户列表（用于关联固定资产）
const assetAccounts = ref<Account[]>([]);
const showAccountPicker = ref(false);

// 计算关联账户名称
const linkedAccountName = computed(() => {
  if (!formData.value.linkedAssetAccountId) return '';
  const account = assetAccounts.value.find(a => a.id === formData.value.linkedAssetAccountId);
  return account?.name || '';
});

const formData = ref<AccountRequest>({
  name: '',
  icon: '💵',
  type: 'cash',
  balance: 0,
  description: '',
  isDefaultExpense: false,
  isDefaultIncome: false,
  // 负债类字段默认值
  originalPrincipal: undefined,
  annualInterestRate: 4.9,
  repaymentMethod: 'equal_principal_interest',
  totalMonths: undefined,
  remainingMonths: undefined,
  repaymentDay: undefined,
  linkedAssetAccountId: undefined
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
        description: res.data.description,
        isDefaultExpense: res.data.isDefaultExpense || false,
        isDefaultIncome: res.data.isDefaultIncome || false,
        // 负债类字段
        originalPrincipal: res.data.originalPrincipal,
        annualInterestRate: res.data.annualInterestRate ?? 4.9,
        repaymentMethod: res.data.repaymentMethod || 'equal_principal_interest',
        totalMonths: res.data.totalMonths,
        remainingMonths: res.data.remainingMonths,
        repaymentDay: res.data.repaymentDay,
        linkedAssetAccountId: res.data.linkedAssetAccountId
      };
      
      balanceInput.value = displayBalance.toString();

      // 加载资产账户列表（用于关联）
      loadAssetAccounts();
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

// 加载固定资产账户列表（用于关联）
const loadAssetAccounts = async () => {
  try {
    const res = await getAccountList();
    if (res.success) {
      // 只显示固定资产类账户
      assetAccounts.value = res.data.filter((a: Account) => a.type === 'fixed_asset');
    }
  } catch (error) {
    console.error('加载资产账户失败:', error);
  }
};

// 选择关联账户
const selectLinkedAccount = (accountId: string) => {
  formData.value.linkedAssetAccountId = accountId;
  showAccountPicker.value = false;
};

// 清除关联账户
const clearLinkedAccount = () => {
  formData.value.linkedAssetAccountId = undefined;
  showAccountPicker.value = false;
};

const goBack = () => {
  navigateBack('/pages/my/account-setting/account-list');
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
      description: '',
      isDefaultExpense: false,
      isDefaultIncome: false,
      enableAutoRepayment: false,
      originalPrincipal: undefined,
      annualInterestRate: 4.9,
      repaymentMethod: 'equal_principal_interest',
      totalMonths: undefined,
      remainingMonths: undefined,
      repaymentDay: undefined,
      linkedAssetAccountId: undefined
    };
    balanceInput.value = '';
    // 加载资产账户列表（用于关联）
    loadAssetAccounts();
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

/* 开关项 */
.switch-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16rpx 0;
}

.switch-label {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.switch-title {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.switch-desc {
  font-size: 24rpx;
  color: #999999;
}

/* 负债类账户表单 */
.liability-section {
  padding: 24rpx;
  background: linear-gradient(135deg, rgba(250, 53, 52, 0.05) 0%, rgba(250, 53, 52, 0.02) 100%);
  border-radius: 16rpx;
  border: 2rpx solid rgba(250, 53, 52, 0.1);
}

.section-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #FA3534;
  margin-bottom: 24rpx;
}

.field-item {
  margin-bottom: 32rpx;
}

.field-item:last-child {
  margin-bottom: 0;
}

.field-label {
  font-size: 26rpx;
  color: #333333;
  font-weight: 500;
  margin-bottom: 12rpx;
  display: block;
}

.field-hint {
  font-size: 22rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.unit {
  font-size: 26rpx;
  color: #999999;
  margin-right: 8rpx;
}

/* 还款方式选择器 */
.repayment-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.repayment-item {
  padding: 16rpx 24rpx;
  background: #FFFFFF;
  border: 2rpx solid #EEEEEE;
  border-radius: 12rpx;
  transition: all 0.2s ease;
}

.repayment-item.active {
  border-color: #FA3534;
  background: rgba(250, 53, 52, 0.05);
}

.repayment-text {
  font-size: 24rpx;
  color: #666666;
}

.repayment-item.active .repayment-text {
  color: #FA3534;
  font-weight: 500;
}

/* 还款日选择器 */
.day-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.day-item {
  width: 64rpx;
  height: 64rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FFFFFF;
  border: 2rpx solid #EEEEEE;
  border-radius: 12rpx;
  transition: all 0.2s ease;
}

.day-item.active {
  border-color: #FA3534;
  background: rgba(250, 53, 52, 0.05);
}

.day-text {
  font-size: 24rpx;
  color: #666666;
}

.day-item.active .day-text {
  color: #FA3534;
  font-weight: 600;
}

/* 账户选择器 */
.account-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #FFFFFF;
  border-radius: 12rpx;
}

.picker-value {
  font-size: 28rpx;
  color: #333333;
}

.picker-placeholder {
  font-size: 28rpx;
  color: #CCCCCC;
}

.picker-arrow {
  font-size: 32rpx;
  color: #CCCCCC;
}

/* 账户选择弹窗 */
.account-picker-popup {
  background: #FFFFFF;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 60vh;
}

.picker-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 32rpx 24rpx;
  border-bottom: 2rpx solid #F5F5F5;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333333;
}

.picker-cancel {
  font-size: 28rpx;
  color: #999999;
}

.picker-list {
  padding: 16rpx 0;
  max-height: 50vh;
  overflow-y: auto;
}

.picker-item {
  display: flex;
  align-items: center;
  padding: 24rpx;
  transition: background 0.2s ease;
}

.picker-item:active {
  background: #F5F5F5;
}

.picker-icon {
  font-size: 40rpx;
  margin-right: 16rpx;
}

.picker-name {
  flex: 1;
  font-size: 28rpx;
  color: #333333;
}

.check-icon {
  font-size: 28rpx;
  color: #00BFFF;
  font-weight: 600;
}

.picker-clear .picker-name {
  color: #FA3534;
  text-align: center;
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