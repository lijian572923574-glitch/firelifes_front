<template>
  <view class="page">
    <wd-navbar
      title="预算设置"
      left-arrow
      fixed
      placeholder
      bordered
      safe-area-inset-top
      @click-left="goBack"
    />

    <scroll-view class="content" scroll-y>
      <view v-if="loading" class="loading-state">
        <text class="loading-text">加载中...</text>
      </view>

      <template v-else>
        <!-- ===== 一、年度预算 ===== -->
        <view class="section-label">年度预算</view>

        <!-- 年度总预算 -->
        <view class="card">
          <text class="card-title">年度总预算</text>
          <view class="budget-input-row">
            <text class="currency">¥</text>
            <input
              class="budget-input"
              type="digit"
              v-model="annualTotalInput"
              placeholder="输入年度总支出预算"
              @blur="saveAnnualTotal"
            />
          </view>
          <view class="hint-row">
            <text class="hint">月度约 ¥{{ formatAmount(annualTotalMonthly) }}（÷ 12 个月）</text>
            <text class="hint-divider">|</text>
            <text class="hint">预警 {{ alertThreshold }}%</text>
            <input
              class="threshold-inline"
              type="number"
              :max="100"
              :min="50"
              :value="String(alertThreshold)"
              @blur="(e: any) => saveAlertThreshold(parseInt(e.detail.value) || 80)"
            />
          </view>
        </view>

        <!-- 分类预算 -->
        <view class="card">
          <view class="card-header">
            <text class="card-title">分类预算</text>
            <view class="btn-add" @tap="showCategoryPicker = true">+ 添加</view>
          </view>

          <view v-if="categoryBudgets.length === 0" class="empty-budgets">
            <text class="empty-text">还没有分类预算，点击"+ 添加"选择支出分类</text>
          </view>

          <view v-if="categoryBudgets.length > 0" class="category-summary-bar">
            <text class="summary-text">合计 ¥{{ formatAmount(categoryTotalYearly) }} / 年</text>
            <text v-if="categoryTotalYearly > annualTotal" class="summary-warn">
              ⚠️ 超出总预算 ¥{{ formatAmount(categoryTotalYearly - annualTotal) }}
            </text>
          </view>

          <view v-for="item in categoryBudgets" :key="item.typeId" class="category-row">
            <view class="category-row-left">
              <text class="category-row-name">{{ item.name }}</text>
              <text class="category-row-monthly">月度 ¥{{ formatAmount(item.yearlyAmount / 12) }}</text>
            </view>
            <view class="category-row-right">
              <view class="category-input-wrap">
                <text class="currency-xs">¥</text>
                <input
                  class="category-input"
                  type="digit"
                  :value="String(item.yearlyAmount)"
                  @blur="(e: any) => updateCategoryYearly(item.typeId, parseFloat(e.detail.value) || 0)"
                  placeholder="年度金额"
                />
              </view>
              <text class="delete-btn" @tap="removeCategoryBudget(item.typeId)">删除</text>
            </view>
          </view>
        </view>

        <!-- ===== 二、当月微调 ===== -->
        <view v-if="monthlyCategoryItems.length > 0" class="section-label">当月微调</view>

        <view v-if="monthlyTotalInput" class="card">
          <view class="card-header">
            <text class="card-title">月度总预算</text>
            <text class="card-subtitle">软参考</text>
          </view>
          <view class="budget-input-row">
            <text class="currency">¥</text>
            <input
              class="budget-input"
              type="digit"
              v-model="monthlyTotalInput"
              @blur="saveMonthlyTotal"
            />
          </view>
          <text class="hint">仅调整当月金额，不影响其他月份</text>
        </view>

        <view v-if="monthlyCategoryItems.length > 0" class="card">
          <view class="card-header">
            <text class="card-title">{{ currentMonth }}月分类预算</text>
            <text class="card-subtitle">可单独调整</text>
          </view>
          <view v-for="item in monthlyCategoryItems" :key="'m-' + item.typeId" class="budget-row">
            <view class="budget-row-left">
              <text class="budget-row-name">{{ item.name }}</text>
              <text class="budget-row-default">默认 ¥{{ formatAmount(item.defaultAmount) }}</text>
            </view>
            <view class="budget-row-input-wrap">
              <text class="currency-sm">¥</text>
              <input
                class="budget-row-input"
                type="digit"
                :value="String(item.currentAmount)"
                @blur="(e: any) => updateMonthlyCategory(item.typeId, parseFloat(e.detail.value) || 0)"
              />
            </view>
          </view>
        </view>

        <!-- ===== 三、快速模板 ===== -->
        <view class="section-label">快速模板</view>
        <view class="card">
          <view class="template-row">
            <text class="template-label">月收入</text>
            <view class="template-input-wrap">
              <text class="currency">¥</text>
              <input
                class="budget-input"
                type="digit"
                v-model="monthlyIncomeInput"
                placeholder="输入月收入"
              />
            </view>
          </view>
          <view v-if="suggestedAnnual > 0" class="suggestion">
            <text class="suggestion-text">
              建议年度总预算 ¥{{ formatAmount(suggestedAnnual) }}（月收入 × 12 × 70%）
            </text>
            <view class="btn-apply" @tap="applyAnnualSuggestion">应用</view>
          </view>
        </view>

        <view class="bottom-btn-wrap">
          <view class="btn-save" @tap="onSave">保存设置</view>
        </view>
        <view class="bottom-spacer" />
      </template>
    </scroll-view>

    <!-- 分类选择弹窗 -->
    <view v-if="showCategoryPicker" class="picker-overlay" @tap="showCategoryPicker = false">
      <view class="picker-panel" @tap.stop>
        <view class="picker-header">
          <text class="picker-title">选择支出分类</text>
          <text class="picker-close" @tap="showCategoryPicker = false">✕</text>
        </view>
        <scroll-view class="picker-list" scroll-y>
          <view v-for="cat in availableCategories" :key="cat.id" class="picker-item" @tap="addCategoryBudget(cat)">
            <text class="picker-item-name">{{ cat.name }}</text>
          </view>
          <view v-if="availableCategories.length === 0" class="picker-empty">
            <text>所有分类已添加预算</text>
          </view>
        </scroll-view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { budgetApi, type AnnualBudgetItem } from '../../../api/budget'
import { categoryApi, type UserCategory } from '../../../api/category'

const currentYear = new Date().getFullYear()
const currentMonth = new Date().getMonth() + 1

const loading = ref(true)
const annualTotalInput = ref('')
const monthlyTotalInput = ref('')
const monthlyIncomeInput = ref('')
const showCategoryPicker = ref(false)
const alertThreshold = ref(80)

interface CategoryBudgetItem {
  typeId: number
  name: string
  yearlyAmount: number
}

const categoryBudgets = ref<CategoryBudgetItem[]>([])
const expenseCategories = ref<UserCategory[]>([])

interface MonthlyCategoryItem {
  typeId: number
  name: string
  defaultAmount: number
  currentAmount: number
  budgetId: number | null
}

const monthlyCategoryItems = ref<MonthlyCategoryItem[]>([])
let annualSummaryData: { items: AnnualBudgetItem[] } | null = null

const annualTotal = computed(() => parseFloat(annualTotalInput.value) || 0)
const annualTotalMonthly = computed(() => {
  if (annualTotal.value <= 0) return 0
  return Math.round((annualTotal.value / 12) * 100) / 100
})
const categoryTotalYearly = computed(() =>
  categoryBudgets.value.reduce((s, b) => s + (b.yearlyAmount || 0), 0)
)
const suggestedAnnual = computed(() => {
  const income = parseFloat(monthlyIncomeInput.value)
  if (isNaN(income) || income <= 0) return 0
  return Math.round(income * 12 * 0.7)
})

const availableCategories = computed(() => {
  const addedIds = new Set(categoryBudgets.value.map((b) => b.typeId))
  return expenseCategories.value.filter((c) => !addedIds.has(c.id) && c.isEnabled)
})

const goBack = () => uni.navigateBack()

const formatAmount = (val: number) => {
  return Math.abs(val).toLocaleString('zh-CN', { maximumFractionDigits: 0 })
}

async function loadData() {
  loading.value = true
  try {
    const [summaryRes, catRes] = await Promise.all([
      budgetApi.getAnnualSummary(currentYear),
      categoryApi.getUserCategories('expense'),
    ])
    if (catRes.success && catRes.data) {
      const allCats: UserCategory[] = []
      for (const group of catRes.data) {
        if (group.children) {
          for (const child of group.children) allCats.push(child as any)
        }
      }
      expenseCategories.value = allCats
    }
    if (summaryRes.success && summaryRes.data) {
      populateFromSummary(summaryRes.data.items)
    }
  } catch { /* ignore */ }
  finally { loading.value = false }
}

function populateFromSummary(items: AnnualBudgetItem[]) {
  annualSummaryData = { items }
  categoryBudgets.value = []
  monthlyCategoryItems.value = []
  let hasTotal = false

  for (const item of items) {
    if (item.typeId === null) {
      annualTotalInput.value = String(item.yearlyAmount)
      hasTotal = true
      const cur = item.months.find((m) => m.month === currentMonth)
      monthlyTotalInput.value = String(cur ? cur.amount : Math.round(item.yearlyAmount / 12))
    } else {
      const cat = expenseCategories.value.find((c) => c.id === item.typeId)
      categoryBudgets.value.push({
        typeId: item.typeId,
        name: cat?.name || `分类${item.typeId}`,
        yearlyAmount: item.yearlyAmount,
      })
      const cur = item.months.find((m) => m.month === currentMonth)
      monthlyCategoryItems.value.push({
        typeId: item.typeId,
        name: cat?.name || `分类${item.typeId}`,
        defaultAmount: item.monthlyAmount,
        currentAmount: cur ? cur.amount : item.monthlyAmount,
        budgetId: cur ? cur.budgetId : null,
      })
    }
  }
  if (!hasTotal) monthlyTotalInput.value = String(annualTotalMonthly.value)
}

async function saveAnnualTotal() {
  const amt = parseFloat(annualTotalInput.value)
  if (isNaN(amt) || amt <= 0) return
  try {
    const exists = annualSummaryData?.items?.some((i) => i.typeId === null)
    if (!exists) {
      await budgetApi.createYearlyBatch({ year: currentYear, budgets: [{ yearlyAmount: amt, alertThreshold: alertThreshold.value }] })
      uni.showToast({ title: '年度总预算已创建（12个月）', icon: 'success' })
      await loadData()
    } else {
      const e = await findExistingTotal()
      if (e) await budgetApi.updateBudget(e.id, { amount: Math.round((amt / 12) * 100) / 100 })
      uni.showToast({ title: '已更新', icon: 'success' })
    }
    monthlyTotalInput.value = String(Math.round(amt / 12))
  } catch { uni.showToast({ title: '保存失败', icon: 'none' }) }
}

async function saveMonthlyTotal() {
  const amt = parseFloat(monthlyTotalInput.value)
  if (isNaN(amt) || amt <= 0) return
  try {
    const e = await findExistingTotal()
    if (e) {
      await budgetApi.updateBudget(e.id, { amount: amt })
    } else {
      await budgetApi.createBudget({ name: '月度总预算', year: currentYear, month: currentMonth, amount: amt })
    }
    uni.showToast({ title: '已更新', icon: 'success' })
  } catch { uni.showToast({ title: '保存失败', icon: 'none' }) }
}

async function saveAlertThreshold(v: number) {
  alertThreshold.value = v
  const e = await findExistingTotal()
  if (e) {
    try { await budgetApi.updateBudget(e.id, { alertThreshold: v }) } catch { /* ignore */ }
  }
}

function addCategoryBudget(cat: UserCategory) {
  showCategoryPicker.value = false
  categoryBudgets.value.push({ typeId: cat.id, name: cat.name, yearlyAmount: 0 })
  monthlyCategoryItems.value.push({ typeId: cat.id, name: cat.name, defaultAmount: 0, currentAmount: 0, budgetId: null })
}

async function updateCategoryYearly(typeId: number, yearlyAmount: number) {
  const item = categoryBudgets.value.find((b) => b.typeId === typeId)
  if (!item || isNaN(yearlyAmount) || yearlyAmount < 0) return
  item.yearlyAmount = yearlyAmount
  const ma = Math.round((yearlyAmount / 12) * 100) / 100
  const mi = monthlyCategoryItems.value.find((m) => m.typeId === typeId)
  if (mi) { mi.defaultAmount = ma; if (mi.currentAmount === 0) mi.currentAmount = ma }
  if (yearlyAmount <= 0) return
  try {
    const exists = annualSummaryData?.items?.some((i) => i.typeId === typeId)
    if (!exists) {
      await budgetApi.createYearlyBatch({ year: currentYear, budgets: [{ typeId, yearlyAmount, alertThreshold: 80 }] })
      uni.showToast({ title: '分类预算已创建（12个月）', icon: 'success' })
    } else if (mi?.budgetId) {
      await budgetApi.updateBudget(mi.budgetId, { amount: ma })
      uni.showToast({ title: '已更新', icon: 'success' })
    }
    await loadData()
  } catch { uni.showToast({ title: '保存失败', icon: 'none' }) }
}

async function updateMonthlyCategory(typeId: number, amt: number) {
  const item = monthlyCategoryItems.value.find((m) => m.typeId === typeId)
  if (!item || isNaN(amt) || amt <= 0) return
  item.currentAmount = amt
  try {
    if (item.budgetId) {
      await budgetApi.updateBudget(item.budgetId, { amount: amt })
    } else {
      const cat = expenseCategories.value.find((c) => c.id === typeId)
      const res = await budgetApi.createBudget({ name: cat?.name || '分类预算', typeId, year: currentYear, month: currentMonth, amount: amt })
      if (res.success && res.data) item.budgetId = res.data.id
    }
    uni.showToast({ title: '已更新', icon: 'success' })
  } catch { uni.showToast({ title: '更新失败', icon: 'none' }) }
}

async function removeCategoryBudget(typeId: number) {
  const item = categoryBudgets.value.find((b) => b.typeId === typeId)
  if (!item) return
  uni.showModal({
    title: '删除确认',
    content: `确定删除「${item.name}」的预算设置吗？`,
    success: async (res) => {
      if (!res.confirm) return
      categoryBudgets.value = categoryBudgets.value.filter((b) => b.typeId !== typeId)
      const mi = monthlyCategoryItems.value.find((m) => m.typeId === typeId)
      monthlyCategoryItems.value = monthlyCategoryItems.value.filter((m) => m.typeId !== typeId)
      if (mi?.budgetId) {
        try { await budgetApi.deleteBudget(mi.budgetId) } catch { /* ignore */ }
      }
      uni.showToast({ title: '已删除', icon: 'success' })
    },
  })
}

async function findExistingTotal() {
  try {
    const res = await budgetApi.getBudgets(currentYear, currentMonth)
    if (res.success && res.data) return res.data.budgets.find((b) => b.typeId === null) || null
  } catch { /* ignore */ }
  return null
}

function applyAnnualSuggestion() {
  if (suggestedAnnual.value <= 0) return
  annualTotalInput.value = String(suggestedAnnual.value)
  saveAnnualTotal()
}

function onSave() {
  uni.showToast({ title: '设置已保存', icon: 'success' })
  uni.navigateBack()
}

onMounted(async () => {
  try { await budgetApi.copyMonth(currentYear, currentMonth) } catch { /* ignore */ }
  await loadData()
})
</script>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f6fa;
}
.content {
  padding: 16rpx 24rpx;
}
.loading-state {
  display: flex;
  justify-content: center;
  padding: 200rpx 0;
}
.loading-text {
  font-size: 28rpx;
  color: #999;
}
.bottom-spacer {
  height: 60rpx;
}

/* ===== 区块标题 ===== */
.section-label {
  font-size: 30rpx;
  font-weight: 700;
  color: #333;
  padding: 36rpx 0 16rpx 8rpx;
}

/* ===== 卡片 ===== */
.card {
  background: #fff;
  border-radius: 16rpx;
  padding: 28rpx;
  margin-bottom: 20rpx;
  box-shadow: 0 2rpx 12rpx rgba(0,0,0,0.04);
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16rpx;
}
.card-title {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
}
.card-subtitle {
  font-size: 22rpx;
  color: #999;
}

/* ===== 通用输入行 ===== */
.budget-input-row {
  display: flex;
  align-items: center;
  border-bottom: 2rpx solid #e8e8e8;
  padding-bottom: 8rpx;
}
.currency {
  font-size: 36rpx;
  font-weight: 700;
  color: #333;
  margin-right: 8rpx;
}
.currency-sm {
  font-size: 26rpx;
  font-weight: 600;
  color: #666;
  margin-right: 4rpx;
}
.currency-xs {
  font-size: 24rpx;
  font-weight: 600;
  color: #666;
  margin-right: 2rpx;
}
.budget-input {
  flex: 1;
  font-size: 32rpx;
  height: 56rpx;
}

/* ===== 提示行 ===== */
.hint-row {
  display: flex;
  align-items: center;
  gap: 10rpx;
  margin-top: 12rpx;
}
.hint {
  font-size: 22rpx;
  color: #999;
}
.hint-divider {
  color: #ddd;
  font-size: 20rpx;
}
.threshold-inline {
  width: 64rpx;
  height: 40rpx;
  font-size: 22rpx;
  color: #00bfff;
  text-align: center;
  background: #f0f9ff;
  border-radius: 6rpx;
}

/* ===== 添加按钮 ===== */
.btn-add {
  font-size: 24rpx;
  color: #00bfff;
  padding: 8rpx 20rpx;
  border: 1rpx solid #00bfff;
  border-radius: 8rpx;
}

/* ===== 空状态 ===== */
.empty-budgets {
  padding: 48rpx 0;
  text-align: center;
}
.empty-text {
  font-size: 24rpx;
  color: #999;
}

/* ===== 分类汇总条 ===== */
.category-summary-bar {
  background: #f0f9ff;
  border-radius: 10rpx;
  padding: 14rpx 18rpx;
  margin-bottom: 16rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.summary-text {
  font-size: 24rpx;
  color: #0369a1;
  font-weight: 600;
}
.summary-warn {
  font-size: 22rpx;
  color: #e17055;
}

/* ===== 分类行 ===== */
.category-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.category-row:last-child { border-bottom: none; }
.category-row-left {
  flex: 1;
}
.category-row-name {
  font-size: 28rpx;
  font-weight: 600;
  color: #333;
  display: block;
}
.category-row-monthly {
  font-size: 22rpx;
  color: #09bb07;
  margin-top: 4rpx;
}
.category-row-right {
  display: flex;
  align-items: center;
  gap: 12rpx;
}
.category-input-wrap {
  display: flex;
  align-items: center;
  background: #f5f6fa;
  border-radius: 8rpx;
  padding: 6rpx 12rpx;
}
.category-input {
  width: 140rpx;
  font-size: 26rpx;
  height: 44rpx;
}
.delete-btn {
  font-size: 22rpx;
  color: #ff4757;
  padding: 4rpx 8rpx;
}

/* ===== 月度微调行 ===== */
.budget-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 0;
  border-bottom: 1rpx solid #f5f5f5;
}
.budget-row:last-child { border-bottom: none; }
.budget-row-left {
  flex: 1;
}
.budget-row-name {
  font-size: 28rpx;
  color: #333;
  display: block;
}
.budget-row-default {
  font-size: 20rpx;
  color: #999;
  margin-top: 4rpx;
}
.budget-row-input-wrap {
  display: flex;
  align-items: center;
  background: #f5f6fa;
  border-radius: 8rpx;
  padding: 6rpx 12rpx;
}
.budget-row-input {
  width: 140rpx;
  font-size: 26rpx;
  height: 44rpx;
}

/* ===== 快速模板 ===== */
.template-row {
  display: flex;
  align-items: center;
  gap: 12rpx;
  margin-bottom: 16rpx;
}
.template-label {
  font-size: 28rpx;
  color: #333;
  white-space: nowrap;
}
.template-input-wrap {
  display: flex;
  align-items: center;
  flex: 1;
  border-bottom: 2rpx solid #e8e8e8;
  padding-bottom: 8rpx;
}
.suggestion {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #f0f9ff;
  border-radius: 10rpx;
  padding: 16rpx;
}
.suggestion-text {
  font-size: 24rpx;
  color: #0369a1;
  flex: 1;
}
.btn-apply {
  background: #00bfff;
  color: #fff;
  padding: 8rpx 24rpx;
  border-radius: 8rpx;
  font-size: 24rpx;
  white-space: nowrap;
}

/* ===== 保存按钮 ===== */
.bottom-btn-wrap {
  margin-top: 30rpx;
  display: flex;
  justify-content: center;
}
.btn-save {
  width: 60%;
  text-align: center;
  padding: 20rpx 0;
  background: #00bfff;
  color: #fff;
  border-radius: 48rpx;
  font-size: 30rpx;
  font-weight: 600;
  box-shadow: 0 4rpx 16rpx rgba(0,191,255,0.35);
}

/* ===== 分类选择弹窗 ===== */
.picker-overlay {
  position: fixed; top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.5);
  z-index: 1000;
  display: flex; align-items: flex-end;
}
.picker-panel {
  width: 100%;
  background: #fff;
  border-radius: 24rpx 24rpx 0 0;
  max-height: 70vh;
}
.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f0f0f0;
}
.picker-title {
  font-size: 30rpx; font-weight: 600; color: #333;
}
.picker-close {
  font-size: 36rpx; color: #999; padding: 8rpx;
}
.picker-list {
  max-height: 60vh;
}
.picker-item {
  padding: 28rpx 32rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.picker-item:active { background: #f5f6fa; }
.picker-item-name {
  font-size: 28rpx; color: #333;
}
.picker-empty {
  padding: 60rpx; text-align: center;
  font-size: 24rpx; color: #999;
}
</style>
