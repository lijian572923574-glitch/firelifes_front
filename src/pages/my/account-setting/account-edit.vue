<template>
  <view class="account-edit-page">
    <WdNavbar
      :title="isEdit ? '编辑账户' : '新增账户'"
      leftArrow
      fixed
      placeholder
      bordered
      safeAreaInsetTop
      @click-left="goBack"
    />

    <scroll-view class="content" scroll-y>
      <!-- 图标选择卡片 -->
      <view class="card">
        <view class="icon-preview-row">
          <view class="icon-preview" :class="{ 'preview-liability': formData.type === 'liability' }">
            <text class="icon-preview-text">{{ formData.icon }}</text>
          </view>
          <view class="icon-preview-info">
            <text class="icon-preview-title">选择图标</text>
            <text class="icon-preview-desc">点击下方图标更换</text>
          </view>
        </view>
        <view class="icon-row">
          <view
            v-for="icon in ACCOUNT_ICONS"
            :key="icon"
            class="icon-item"
            :class="{ active: formData.icon === icon }"
            @click="formData.icon = icon"
          >
            <text class="icon-item-text">{{ icon }}</text>
          </view>
        </view>
      </view>

      <!-- 账户类型卡片 -->
      <view class="card">
        <text class="card-title">账户类型</text>
        <view class="type-grid">
          <view class="type-row">
            <view
              v-for="item in typeRow1"
              :key="item.value"
              class="type-card"
              :class="{ active: formData.type === item.value }"
              :style="formData.type === item.value ? { background: item.activeBg } : {}"
              @click="onTypeChange(item.value)"
            >
              <view class="type-card-dot" :style="{ background: item.color }"></view>
              <text class="type-card-emoji">{{ item.emoji }}</text>
              <text class="type-card-label" :style="formData.type === item.value ? { color: item.color, fontWeight: '600' } : {}">{{ item.label }}</text>
            </view>
          </view>
          <view class="type-row">
            <view
              v-for="item in typeRow2"
              :key="item.value"
              class="type-card"
              :class="{ active: formData.type === item.value }"
              :style="formData.type === item.value ? { background: item.activeBg } : {}"
              @click="onTypeChange(item.value)"
            >
              <view class="type-card-dot" :style="{ background: item.color }"></view>
              <text class="type-card-emoji">{{ item.emoji }}</text>
              <text class="type-card-label" :style="formData.type === item.value ? { color: item.color, fontWeight: '600' } : {}">{{ item.label }}</text>
            </view>
          </view>
        </view>
      </view>

      <!-- 表单卡片 -->
      <view class="card">
        <!-- 账户名称 -->
        <view class="form-row">
          <text class="form-label">账户名称</text>
          <WdInput
            v-model="formData.name"
            placeholder="请输入账户名称"
            :maxlength="20"
            showClear
            customStyle="background: #F5F6FA; border-radius: 10rpx;"
          />
        </view>

        <!-- 账户余额 -->
        <view class="form-row">
          <text class="form-label">账户余额</text>
          <view class="balance-input-wrap">
            <text class="balance-prefix">¥</text>
            <view class="balance-divider"></view>
            <view class="balance-input-area">
              <WdInput
                :model-value="balanceInput"
                @update:model-value="onBalanceInput"
                type="text"
                :placeholder="formData.type === 'liability' ? '-0.00' : '0.00'"
                customStyle="background: transparent; border: none; padding: 0;"
              />
            </view>
          </view>
        </view>

        <!-- 账户说明 -->
        <view class="form-row">
          <text class="form-label">账户说明（选填）</text>
          <WdTextarea
            v-model="formData.description"
            placeholder="请输入账户说明（选填）"
            :maxlength="500"
            showWordCount
            autoHeight
            customStyle="background: #F5F6FA; border-radius: 10rpx;"
          />
        </view>
      </view>

      <!-- 开关卡片 -->
      <view v-if="canSetDefault" class="card switch-card">
        <view class="switch-row">
          <view class="switch-info">
            <text class="switch-title">默认支出账户</text>
            <text class="switch-desc">记账时自动选中此账户用于支出</text>
          </view>
          <WdSwitch
            v-model="formData.isDefaultExpense"
            activeColor="#00BFFF"
          />
        </view>
        <view class="switch-divider"></view>
        <view class="switch-row">
          <view class="switch-info">
            <text class="switch-title">默认收入账户</text>
            <text class="switch-desc">收入记账时自动选中此账户</text>
          </view>
          <WdSwitch
            v-model="formData.isDefaultIncome"
            activeColor="#00BFFF"
          />
        </view>
      </view>

      <!-- 负债类账户专用字段 -->
      <view v-if="formData.type === 'liability' && formData.repaymentMethod !== 'flexible'" class="card liability-form">
        <view class="liability-header">贷款参数</view>

        <view class="form-row">
          <text class="form-label">原始贷款总本金</text>
          <WdInput
            v-model.number="formData.originalPrincipal"
            type="digit"
            placeholder="请输入原始贷款总额"
            customStyle="background: #F5F6FA; border-radius: 10rpx;"
          >
            <template #suffix>
              <text class="unit">元</text>
            </template>
          </WdInput>
        </view>

        <view class="form-row">
          <text class="form-label">贷款年利率</text>
          <WdInput
            v-model.number="formData.annualInterestRate"
            type="digit"
            placeholder="4.9"
            customStyle="background: #F5F6FA; border-radius: 10rpx;"
          >
            <template #suffix>
              <text class="unit">%</text>
            </template>
          </WdInput>
          <text class="field-hint">灵活还款填0表示无息</text>
        </view>

        <view class="form-row">
          <text class="form-label">还款方式</text>
          <view class="option-grid">
            <view
              v-for="method in repaymentMethods"
              :key="method.value"
              class="option-item"
              :class="{ active: formData.repaymentMethod === method.value }"
              @click="formData.repaymentMethod = method.value"
            >
              <text class="option-text">{{ method.label }}</text>
            </view>
          </view>
        </view>

        <view v-if="formData.repaymentMethod !== 'flexible'" class="form-row">
          <text class="form-label">总还款期数</text>
          <WdInput
            v-model.number="formData.totalMonths"
            type="number"
            placeholder="请输入总期数"
            customStyle="background: #F5F6FA; border-radius: 10rpx;"
          >
            <template #suffix>
              <text class="unit">月</text>
            </template>
          </WdInput>
        </view>

        <view v-if="formData.repaymentMethod !== 'flexible'" class="form-row">
          <text class="form-label">剩余还款期数</text>
          <WdInput
            v-model.number="formData.remainingMonths"
            type="number"
            placeholder="请输入剩余期数"
            customStyle="background: #F5F6FA; border-radius: 10rpx;"
          >
            <template #suffix>
              <text class="unit">月</text>
            </template>
          </WdInput>
        </view>

        <view v-if="formData.repaymentMethod !== 'flexible'" class="form-row">
          <text class="form-label">每月还款日</text>
          <view class="day-grid">
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

        <view class="form-row">
          <text class="form-label">关联资产账户（可选）</text>
          <view class="account-picker" @click="showAccountPicker = true">
            <text v-if="linkedAccountName" class="picker-value">{{ linkedAccountName }}</text>
            <text v-else class="picker-placeholder">选择关联的固定资产账户</text>
            <text class="picker-arrow">›</text>
          </view>
        </view>
      </view>

      <view class="safe-bottom"></view>
    </scroll-view>

    <!-- 保存按钮 -->
    <view class="save-section">
      <WdButton
        type="primary"
        block
        :disabled="!canSave"
        :loading="saving"
        customStyle="height: 96rpx; border-radius: 12rpx; font-size: 32rpx; font-weight: 600;"
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
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getAccountDetail, createAccount, updateAccount, getAccountList } from '../../../api/account'
import { navigateBack } from '../../../utils/navigate'
import type { Account, AccountRequest, AccountType, RepaymentMethod } from '../../../types/account'
import { ACCOUNT_ICONS } from '../../../types/account'

const accountId = ref<string | null>(null)
const isEdit = computed(() => !!accountId.value)
const account = ref<Account | null>(null)
const saving = ref(false)

const TYPE_CONFIG: Record<AccountType, { color: string; emoji: string; label: string; activeBg: string }> = {
  cash:         { color: '#00BFFF', emoji: '💰', label: '现金类', activeBg: 'rgba(0,191,255,0.06)' },
  investment:   { color: '#FF9800', emoji: '📈', label: '投资类', activeBg: 'rgba(255,152,0,0.06)' },
  fixed_asset:  { color: '#9C27B0', emoji: '🏠', label: '固定资产类', activeBg: 'rgba(156,39,176,0.06)' },
  depreciable_asset: { color: '#00BCD4', emoji: '📱', label: '折旧资产类', activeBg: 'rgba(0,188,212,0.06)' },
  liability:    { color: '#FA3534', emoji: '💳', label: '负债类', activeBg: 'rgba(250,53,52,0.06)' },
}

const typeRow1 = computed(() =>
  (['cash', 'investment', 'fixed_asset'] as AccountType[]).map(v => ({ value: v, ...TYPE_CONFIG[v] }))
)
const typeRow2 = computed(() =>
  (['depreciable_asset', 'liability'] as AccountType[]).map(v => ({ value: v, ...TYPE_CONFIG[v] }))
)

const repaymentMethods: { value: RepaymentMethod; label: string }[] = [
  { value: 'equal_principal_interest', label: '等额本息' },
  { value: 'equal_principal', label: '等额本金' },
  { value: 'interest_first', label: '先息后本' },
  { value: 'flexible', label: '灵活还款' },
]

const assetAccounts = ref<Account[]>([])
const showAccountPicker = ref(false)

const canSetDefault = computed(() => {
  return formData.value.type === 'cash' || formData.value.type === 'liability'
})

const linkedAccountName = computed(() => {
  if (!formData.value.linkedAssetAccountId) return ''
  const account = assetAccounts.value.find(a => a.id === formData.value.linkedAssetAccountId)
  return account?.name || ''
})

const formData = ref<AccountRequest>({
  name: '',
  icon: '💵',
  type: 'cash',
  balance: 0,
  description: '',
  isDefaultExpense: false,
  isDefaultIncome: false,
  originalPrincipal: undefined,
  annualInterestRate: 4.9,
  repaymentMethod: 'equal_principal_interest',
  totalMonths: undefined,
  remainingMonths: undefined,
  repaymentDay: undefined,
  linkedAssetAccountId: undefined,
})

const balanceInput = ref('')

const canSave = computed(() => {
  return formData.value.name.trim().length > 0 &&
         formData.value.name.length <= 20 &&
         !isNaN(formData.value.balance)
})

const loadAccountDetail = async (id: string) => {
  try {
    const res = await getAccountDetail(id)
    if (res.success) {
      account.value = res.data
      let displayBalance = res.data.balance
      if (res.data.type === 'liability' && res.data.balance > 0) {
        displayBalance = -Math.abs(res.data.balance)
      }
      formData.value = {
        name: res.data.name,
        icon: res.data.icon,
        type: res.data.type,
        balance: displayBalance,
        description: res.data.description,
        isDefaultExpense: res.data.isDefaultExpense || false,
        isDefaultIncome: res.data.isDefaultIncome || false,
        originalPrincipal: res.data.originalPrincipal,
        annualInterestRate: res.data.annualInterestRate ?? 4.9,
        repaymentMethod: res.data.repaymentMethod || 'equal_principal_interest',
        totalMonths: res.data.totalMonths,
        remainingMonths: res.data.remainingMonths,
        repaymentDay: res.data.repaymentDay,
        linkedAssetAccountId: res.data.linkedAssetAccountId,
      }
      balanceInput.value = displayBalance.toString()
      loadAssetAccounts()
    } else {
      uni.showToast({ title: res.message || '获取账户详情失败', icon: 'none' })
    }
  } catch (err) {
    console.error('加载账户详情失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  }
}

const onTypeChange = (type: AccountType) => {
  const oldType = formData.value.type
  formData.value.type = type

  if (type !== 'cash' && type !== 'liability') {
    formData.value.isDefaultExpense = false
    formData.value.isDefaultIncome = false
  }

  if (type === 'liability' && oldType !== 'liability') {
    if (balanceInput.value !== '' && !balanceInput.value.startsWith('-')) {
      const num = parseFloat(balanceInput.value) || 0
      if (num > 0) {
        balanceInput.value = '-' + balanceInput.value
        formData.value.balance = -num
      }
    }
  } else if (type !== 'liability' && oldType === 'liability') {
    if (balanceInput.value.startsWith('-')) {
      const num = parseFloat(balanceInput.value) || 0
      balanceInput.value = balanceInput.value.slice(1)
      formData.value.balance = Math.abs(num)
    }
  }
}

const onBalanceInput = (value: string) => {
  const isLiability = formData.value.type === 'liability'
  const regex = isLiability ? /^-?\d*\.?\d{0,2}$/ : /^\d*\.?\d{0,2}$/

  if (regex.test(value) || value === '') {
    if (value !== '') {
      const num = parseFloat(value) || 0
      if (isLiability && num > 0 && !value.startsWith('-')) {
        balanceInput.value = '-' + value
        formData.value.balance = -num
      } else {
        balanceInput.value = value
        formData.value.balance = num
      }
    } else {
      balanceInput.value = value
      formData.value.balance = 0
    }
  }
}

const handleSave = async () => {
  if (!canSave.value || saving.value) return

  if (formData.value.type === 'liability' && formData.value.balance > 0) {
    formData.value.balance = -Math.abs(formData.value.balance)
    if (balanceInput.value && !balanceInput.value.startsWith('-')) {
      balanceInput.value = '-' + balanceInput.value
    }
  }

  saving.value = true
  try {
    if (isEdit.value && accountId.value) {
      const res = await updateAccount(accountId.value, formData.value)
      if (res.success) {
        uni.showToast({ title: '修改成功', icon: 'success' })
        setTimeout(() => { navigateBack('/pages/my/account-setting/account-list') }, 1500)
      } else {
        uni.showToast({ title: res.message || '修改失败', icon: 'none' })
      }
    } else {
      const res = await createAccount(formData.value)
      if (res.success) {
        uni.showToast({ title: '创建成功', icon: 'success' })
        setTimeout(() => { navigateBack('/pages/my/account-setting/account-list') }, 1500)
      } else {
        uni.showToast({ title: res.message || '创建失败', icon: 'none' })
      }
    }
  } catch (err) {
    console.error('保存失败:', err)
    uni.showToast({ title: '网络错误', icon: 'none' })
  } finally {
    saving.value = false
  }
}

const loadAssetAccounts = async () => {
  try {
    const res = await getAccountList()
    if (res.success) {
      assetAccounts.value = res.data.filter((a: Account) => a.type === 'fixed_asset')
    }
  } catch (error) {
    console.error('加载资产账户失败:', error)
  }
}

const selectLinkedAccount = (id: string) => {
  formData.value.linkedAssetAccountId = id
  showAccountPicker.value = false
}

const clearLinkedAccount = () => {
  formData.value.linkedAssetAccountId = undefined
  showAccountPicker.value = false
}

const goBack = () => {
  navigateBack('/pages/my/account-setting/account-list')
}

onLoad((options: any) => {
  if (options.id) {
    accountId.value = options.id
    loadAccountDetail(options.id)
  } else {
    loadAssetAccounts()
  }
})
</script>

<style scoped>
.account-edit-page {
  min-height: 100vh;
  background-color: #F0F2F5;
  display: flex;
  flex-direction: column;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 16rpx 16rpx;
  padding-bottom: 140rpx;
}

.card {
  background-color: #FFFFFF;
  border-radius: 24rpx;
  padding: 32rpx 28rpx;
  margin-bottom: 20rpx;
}

.card-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
  margin-bottom: 20rpx;
}

/* 图标预览区 */
.icon-preview-row {
  display: flex;
  align-items: center;
  gap: 24rpx;
  margin-bottom: 24rpx;
}

.icon-preview {
  width: 112rpx;
  height: 112rpx;
  border-radius: 24rpx;
  background: rgba(0, 191, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.icon-preview.preview-liability {
  background: rgba(250, 53, 52, 0.08);
}

.icon-preview-text {
  font-size: 60rpx;
}

.icon-preview-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}

.icon-preview-title {
  font-size: 30rpx;
  font-weight: 600;
  color: #333333;
}

.icon-preview-desc {
  font-size: 24rpx;
  color: #999999;
}

/* 图标选择行 */
.icon-row {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.icon-item {
  width: 80rpx;
  height: 80rpx;
  border-radius: 16rpx;
  background: #F5F6FA;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 150ms ease;
}

.icon-item:active {
  transform: scale(0.92);
}

.icon-item.active {
  background: rgba(0, 191, 255, 0.1);
}

.icon-item-text {
  font-size: 40rpx;
}

/* 类型选择 */
.type-grid {
  display: flex;
  flex-direction: column;
  gap: 16rpx;
}

.type-row {
  display: flex;
  gap: 16rpx;
}

.type-card {
  flex: 1;
  height: 112rpx;
  border-radius: 16rpx;
  background: #F5F6FA;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8rpx;
  transition: all 150ms ease;
}

.type-card:active {
  transform: scale(0.96);
}

.type-card-dot {
  width: 8rpx;
  height: 8rpx;
  border-radius: 4rpx;
}

.type-card-emoji {
  font-size: 32rpx;
}

.type-card-label {
  font-size: 22rpx;
  color: #666666;
}

/* 表单行 */
.form-row {
  margin-bottom: 32rpx;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 26rpx;
  color: #666666;
  font-weight: 500;
  margin-bottom: 12rpx;
}

.balance-input-wrap {
  display: flex;
  align-items: center;
  background: #F5F6FA;
  border-radius: 10rpx;
  padding: 0 24rpx;
  height: 88rpx;
}

.balance-prefix {
  font-size: 32rpx;
  font-weight: 700;
  color: #333333;
}

.balance-divider {
  width: 1rpx;
  height: 36rpx;
  background: #E8E8E8;
  margin: 0 20rpx;
  flex-shrink: 0;
}

.balance-input-area {
  flex: 1;
}

/* 开关卡片 */
.switch-card {
  padding: 0;
}

.switch-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28rpx;
}

.switch-divider {
  height: 1rpx;
  background: #F0F2F5;
  margin: 0 28rpx;
}

.switch-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  margin-right: 20rpx;
}

.switch-title {
  font-size: 28rpx;
  color: #333333;
  font-weight: 500;
}

.switch-desc {
  font-size: 22rpx;
  color: #999999;
}

/* 负债类 */
.liability-form {
  background: #FFF5F5;
  border: 2rpx solid rgba(250, 53, 52, 0.1);
}

.liability-header {
  font-size: 28rpx;
  font-weight: 600;
  color: #FA3534;
  margin-bottom: 24rpx;
}

.unit {
  font-size: 26rpx;
  color: #999999;
  margin-right: 8rpx;
}

.field-hint {
  font-size: 22rpx;
  color: #999999;
  margin-top: 8rpx;
  display: block;
}

.option-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
}

.option-item {
  padding: 16rpx 28rpx;
  background: #FFFFFF;
  border: 2rpx solid #EEEEEE;
  border-radius: 12rpx;
  transition: all 0.2s ease;
}

.option-item.active {
  border-color: #FA3534;
  background: rgba(250, 53, 52, 0.05);
}

.option-text {
  font-size: 24rpx;
  color: #666666;
}

.option-item.active .option-text {
  color: #FA3534;
  font-weight: 500;
}

.day-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}

.day-item {
  width: 68rpx;
  height: 68rpx;
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

.account-picker {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20rpx 24rpx;
  background: #F5F6FA;
  border-radius: 10rpx;
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

/* 保存区域 */
.save-section {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 20rpx 32rpx;
  padding-bottom: calc(20rpx + env(safe-area-inset-bottom));
  background-color: #F0F2F5;
}

.safe-bottom {
  height: calc(env(safe-area-inset-bottom) + 20rpx);
}

/* 弹窗 */
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
</style>
