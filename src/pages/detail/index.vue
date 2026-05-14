<!--
  pages/detail/index.vue - 账单明细页面
  功能：展示记账记录，按月份筛选，下拉刷新、上拉加载
  技术：Vue3 + TypeScript + uni-app + Wot Design
-->
<template>
  <view class="page">
    <view class="header">
      <view class="header-top">
        <text class="app-title">F.I.R.E生活家</text>
      </view>
      <view class="header-content">
        <view class="date-selector" @tap="showDatePicker">
          <text class="year-text" :key="currentYear">{{ currentYear }}年</text>
          <text class="month-text" :key="currentMonth">{{ currentMonth }}月</text>
        </view>
        <view class="header-amounts">
          <view class="amount-item">
            <text class="amount-label">收入</text>
            <text class="amount-value income" :key="monthIncome">{{ monthIncome.toFixed(2) }}</text>
          </view>
          <view class="amount-divider"></view>
          <view class="amount-item">
            <text class="amount-label">支出</text>
            <text class="amount-value expense" :key="monthExpense">{{ monthExpense.toFixed(2) }}</text>
          </view>
        </view>
      </view>
    </view>

    <view class="function-bar">
      <view class="function-item">
        <view class="function-icon"><text class="iconfont icon-zhangdan"></text></view>
        <text class="function-text">账单</text>
      </view>
      <view class="function-item">
        <view class="function-icon"><text class="iconfont icon-tongji"></text></view>
        <text class="function-text">预算</text>
      </view>
      <view class="function-item">
        <view class="function-icon"><text class="iconfont icon-zichan"></text></view>
        <text class="function-text">资产管家</text>
      </view>
      <view class="function-item">
        <view class="function-icon"><text class="iconfont icon-gouwuche"></text></view>
        <text class="function-text">购物返现</text>
      </view>
      <view class="function-item">
        <view class="function-icon"><text class="iconfont icon-qita"></text></view>
        <text class="function-text">更多</text>
      </view>
    </view>

    <view v-if="loading && sortedDates.length === 0" class="loading-state">
      <text class="loading-text">加载中...</text>
    </view>

    <view class="bill-wrapper">
      <scroll-view
        scroll-y
        class="bill-scroll"
        refresher-enabled
        :refresher-triggered="isRefreshing"
        refresher-threshold="60"
        @refresherrefresh="handleScrollToUpper"
      >
        <view :class="['bill-content', transitionDirection]" :key="currentYear + '-' + currentMonth">
          <view v-if="!loading && sortedDates.length === 0" class="empty-state">
            <text class="empty-text">暂无记账记录</text>
            <text class="empty-hint">点击下方按钮开始记账</text>
          </view>

          <view v-for="date in sortedDates" :key="date" class="bill-section">
            <WdCellGroup custom-style="border-radius: 16rpx; overflow: hidden;">
              <view class="bill-date">
                <text class="date-text">{{ formatDate(date) }}</text>
                <view class="day-totals">
                  <text class="day-income">收入: {{ getDayIncome(date) }}</text>
                  <text class="day-expense">支出: {{ getDayExpense(date) }}</text>
                </view>
              </view>
              <view v-for="record in getDateRecords(date)" :key="record.id" class="bill-item-wrapper">
                <WdCell :title="getCategoryInfo(record.typeId).name" :value="`${record.type === 'expense' ? '-' : '+'}${formatAmount(record.amount)}`">
                  <template #icon>
                    <view class="item-icon"><text class="iconfont" :class="getCategoryInfo(record.typeId).icon"></text></view>
                  </template>
                  <template #value>
                    <text :class="['item-amount', record.type]">
                      {{ record.type === 'expense' ? '-' : '+' }}{{ formatAmount(record.amount) }}
                    </text>
                  </template>
                </WdCell>
              </view>
            </WdCellGroup>
          </view>

          <view v-if="sortedDates.length > 0" class="load-more">
            <text class="load-more-text">{{ loadMoreText }}</text>
          </view>
        </view>
      </scroll-view>
    </view>

    <YearMonthPicker ref="yearMonthPickerRef" v-model="selectedYearMonth" />
    <CustomTabbar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive, watch } from 'vue'
import { onShow, onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'
import { recordApi } from '../../api/record'
import { categoryApi, type CategoryGroup } from '../../api/category'
import CustomTabbar from '../../components/CustomTabbar.vue'
import YearMonthPicker from '../../components/YearMonthPicker.vue'

interface RecordItem {
  id: number
  typeId: number
  type: 'income' | 'expense'
  amount: number
  remark?: string
  date: string
  createdAt?: string
}

interface DatePageData {
  list: RecordItem[]
  total: number
  page: number
  pageSize: number
}

const categories = ref<CategoryGroup[]>([])
const userIconsMap = ref<Map<number, string>>(new Map())
const transitionDirection = ref<'next' | 'prev'>('next')

// 使用当前日期初始化，避免硬编码导致的问题
const today = new Date()
const currentYear = ref(today.getFullYear().toString())
const currentMonth = ref((today.getMonth() + 1).toString().padStart(2, '0'))
const selectedYearMonth = ref(`${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}`)
const yearMonthPickerRef = ref<InstanceType<typeof YearMonthPicker> | null>(null)

const showDatePicker = () => {
  yearMonthPickerRef.value?.open()
}

watch(selectedYearMonth, (newVal) => {
  if (!newVal) return
  const parts = newVal.split('-')
  currentYear.value = parts[0]
  currentMonth.value = parts[1]
  loadMonthData()
})

const monthIncome = ref(0)
const monthExpense = ref(0)

const pageData = reactive<Map<string, DatePageData>>(new Map())
const loading = ref(false)
const isRefreshing = ref(false)
const hasMoreData = ref(true)
let loadPrevMonthLock = false

const loadMoreText = computed(() => {
  return '上拉查看上一个月'
})

// 分类名→iconfont类名映射
const CATEGORY_ICON_MAP: Record<string, string> = {
  // 支出
  '餐饮': 'icon-canyin', '零食': 'icon-lingshi', '交通': 'icon-jiaotong',
  '购物': 'icon-gouwuche', '居住': 'icon-fangzi', '娱乐': 'icon-youxiyouxiji',
  '医疗': 'icon-yiliao', '教育': 'icon-jiaoyu', '通讯': 'icon-shouji',
  '旅行': 'icon-lvhang', '美容': 'icon-meirong', '服饰': 'icon-yifu',
  '运动': 'icon-yundong-', '日用品': 'icon-riyongpin', '宠物': 'icon-xiedaichongwu',
  '烟酒': 'icon-yanjiu', '社交': 'icon-13', '汽车': 'icon-qiche',
  '数码家电': 'icon-shumajiadianleimu', '其他': 'icon-qita',
  // 收入
  '工资': 'icon-gongzijianyi', '工资条': 'icon-gongzitiao', '奖金': 'icon-jiangjinxiangqing',
  '红包': 'icon-jiangjinjilu', '兼职': 'icon-a-068_jianzhi', '礼金': 'icon-a-068_lijin',
  '退款': 'icon-tuikuan', '闲置': 'icon-xianzhi', '理财收益': 'icon-licaishouyi',
  // 通用
  '设置': 'icon-shezhi', '账单': 'icon-zhangdan',
}

const getCategoryInfo = (typeId: number): { name: string; icon: string } => {
  for (const group of categories.value) {
    for (const cat of group.children) {
      if (cat.id === typeId) {
        // 优先使用本地映射表
        if (CATEGORY_ICON_MAP[cat.name]) {
          return { name: cat.name, icon: CATEGORY_ICON_MAP[cat.name] }
        }
        const iconUrl = userIconsMap.value.get(cat.iconId) || cat.iconUrl || 'icon-qita'
        return { name: cat.name, icon: iconUrl }
      }
    }
  }
  return { name: '其他', icon: 'icon-qita' }
}

const sortedDates = computed(() => {
  return Array.from(pageData.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
})

const getDateRecords = (date: string): RecordItem[] => {
  return pageData.get(date)?.list || []
}

const getDayIncome = (dateStr: string) => {
  const dayRecords = getDateRecords(dateStr)
  const income = dayRecords.filter((r) => r.type === 'income').reduce((sum, r) => sum + Math.abs(r.amount), 0)
  return income.toFixed(2)
}

const getDayExpense = (dateStr: string) => {
  const dayRecords = getDateRecords(dateStr)
  const expense = dayRecords.filter((r) => r.type === 'expense').reduce((sum, r) => sum + Math.abs(r.amount), 0)
  return expense.toFixed(2)
}

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr)
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const weekDay = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][date.getDay()]
  return `${month}月${day}日 ${weekDay}`
}

const formatAmount = (amount: number) => {
  return Math.abs(amount).toFixed(2)
}

const categoriesLoaded = ref(false)

const loadCategoriesOnce = async () => {
  if (categoriesLoaded.value) return
  try {
    const [expenseRes, incomeRes, iconsRes] = await Promise.all([
      categoryApi.getUserCategories('expense'),
      categoryApi.getUserCategories('income'),
      categoryApi.getUserIcons()
    ])

    if (expenseRes.success && expenseRes.data && incomeRes.success && incomeRes.data) {
      categories.value = [...expenseRes.data, ...incomeRes.data]
    }

    if (iconsRes.success && iconsRes.data) {
      const iconMap = new Map<number, string>()
      iconsRes.data.forEach((icon: any) => {
        iconMap.set(icon.id, icon.url)
      })
      userIconsMap.value = iconMap
    }
    categoriesLoaded.value = true
  } catch (error) {
    console.error('加载分类失败:', error)
  }
}

const loadMonthSummary = async () => {
  try {
    const res = await recordApi.getMonthSummary(`${currentYear.value}-${currentMonth.value}`)
    if (res.success && res.data) {
      monthIncome.value = res.data.income
      monthExpense.value = res.data.expense
    }
  } catch (error) {
    console.error('加载月度汇总失败:', error)
    monthIncome.value = 0
    monthExpense.value = 0
  }
}

const loadFirstPageDates = async () => {
  const pageSize = 500
  const yearMonth = `${currentYear.value}-${currentMonth.value}`
  try {
    const res = await recordApi.getRecordsByMonth(yearMonth, 1, pageSize)
    if (res.success && res.data) {
      const { list } = res.data
      const dateGroups = new Map<string, RecordItem[]>()
      list.forEach((record) => {
        const dateStr = record.date
        if (!dateGroups.has(dateStr)) {
          dateGroups.set(dateStr, [])
        }
        dateGroups.get(dateStr)!.push(record)
      })

      pageData.clear()
      dateGroups.forEach((records, date) => {
        pageData.set(date, {
          list: records,
          total: list.length,
          page: 1,
          pageSize: pageSize
        })
      })
      // 不再需要分页加载，每次只加载一个月的数据
      hasMoreData.value = false
    }
  } catch (error) {
    console.error('加载日期列表失败:', error)
    pageData.clear()
    hasMoreData.value = false
  }
}

const loadMonthData = async () => {
  loading.value = true
  try {
    await Promise.all([loadCategoriesOnce(), loadMonthSummary(), loadFirstPageDates()])
  } catch (error) {
    console.error('加载数据失败:', error)
  } finally {
    loading.value = false
  }
}

const handleScrollToUpper = async () => {
  isRefreshing.value = true
  try {
    await switchToNextMonth()
  } finally {
    isRefreshing.value = false
  }
}

const switchToNextMonth = async () => {
  let year = parseInt(currentYear.value)
  let month = parseInt(currentMonth.value)
  const currentYearNum = today.getFullYear()
  const currentMonthNum = today.getMonth() + 1

  // 计算下一个月
  month++
  if (month > 12) {
    month = 1
    year++
  }

  // 检查是否是未来月份
  if (year > currentYearNum || (year === currentYearNum && month > currentMonthNum)) {
    uni.showToast({
      title: '已经是最新月份了',
      icon: 'none'
    })
    return
  }

  const nextYearMonth = `${year.toString()}-${month.toString().padStart(2, '0')}`

  try {
    const checkRes = await recordApi.getRecordsByMonth(nextYearMonth, 1, 1)

    if (checkRes.success && checkRes.data && checkRes.data.list.length > 0) {
      transitionDirection.value = 'next'
      await new Promise((resolve) => setTimeout(resolve, 50))
      currentYear.value = year.toString()
      currentMonth.value = month.toString().padStart(2, '0')
      await loadMonthData()
    } else {
      uni.showToast({
        title: '已经是最新月份了',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('[detail] 检查下一个月数据失败', error)
  }
}

const handlePullDownRefresh = async () => {
  // 小程序端的下拉刷新
  await switchToNextMonth()
  uni.stopPullDownRefresh()
  isRefreshing.value = false
}

const switchToPrevMonth = async () => {
  let year = parseInt(currentYear.value)
  let month = parseInt(currentMonth.value)

  // 计算上一个月
  month--
  if (month < 1) {
    month = 12
    year--
  }

  const prevYearMonth = `${year.toString()}-${month.toString().padStart(2, '0')}`

  try {
    const checkRes = await recordApi.getRecordsByMonth(prevYearMonth, 1, 1)

    if (checkRes.success && checkRes.data && checkRes.data.list.length > 0) {
      transitionDirection.value = 'prev'
      await new Promise((resolve) => setTimeout(resolve, 50))
      currentYear.value = year.toString()
      currentMonth.value = month.toString().padStart(2, '0')
      await loadMonthData()
    } else {
      uni.showToast({
        title: '已经到底了，没有更多数据了',
        icon: 'none'
      })
    }
  } catch (error) {
    console.error('[detail] 检查上一个月数据失败', error)
  }
}

const handleReachBottom = async () => {
  if (loadPrevMonthLock) return
  
  loadPrevMonthLock = true
  await switchToPrevMonth()
  
  setTimeout(() => {
    loadPrevMonthLock = false
  }, 1000)
}

onMounted(() => {
  loadMonthData()
})

onShow(() => {
  loadMonthSummary()
  loadFirstPageDates()
})

onPullDownRefresh(() => {
  handlePullDownRefresh()
})

onReachBottom(() => {
  handleReachBottom()
})
</script>

<style>
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
  padding-bottom: 80px;
}

.header {
  background: linear-gradient(135deg, #00BFFF 0%, #0099CC 100%);
  padding: 40rpx 30rpx 30rpx;
  color: #333;
  flex-shrink: 0;
  width: 100%;
}

.header-top {
  margin-bottom: 20rpx;
  text-align: center;
}

.app-title {
  font-size: 40rpx;
  font-weight: bold;
  color: #333;
}

.header-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.date-selector {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 5rpx;
}

.year-text {
  font-size: 28rpx;
  color: #333;
  display: inline-block;
  animation: fadeSlideDown 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.month-text {
  font-size: 48rpx;
  font-weight: bold;
  color: #333;
  display: inline-block;
  animation: fadeSlideDown 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

@keyframes fadeSlideDown {
  0% {
    opacity: 0;
    transform: translateY(-20rpx);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.header-amounts {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.3);
  border-radius: 20rpx;
  padding: 15rpx 25rpx;
}

.amount-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.amount-label {
  font-size: 22rpx;
  color: #666;
  margin-bottom: 5rpx;
}

.amount-value {
  font-size: 32rpx;
  font-weight: bold;
  display: inline-block;
  animation: fadeSlideDown 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.amount-value.income {
  color: #19be6b;
}

.amount-value.expense {
  color: #fa3534;
}

.amount-divider {
  width: 1px;
  height: 60rpx;
  background: rgba(255, 255, 255, 0.5);
  margin: 0 25rpx;
}

.function-bar {
  display: flex;
  justify-content: space-around;
  padding: 30rpx 20rpx;
  background: #fff;
  flex-shrink: 0;
  border-bottom: 1px solid #eee;
  width: 100%;
}

.function-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.function-icon {
  font-size: 48rpx;
  margin-bottom: 10rpx;
  color: #00BFFF;
}

.function-text {
  font-size: 22rpx;
  color: #666;
}

.loading-state {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 100rpx 0;
}

.loading-text {
  font-size: 28rpx;
  color: #999;
}

.bill-wrapper {
  flex: 1;
  margin: 0 20rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.bill-scroll {
  flex: 1;
  height: 100%;
}

.bill-content {
  width: 100%;
  animation: monthSlideIn 0.4s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.bill-content.next {
  animation-name: slideUpFromBottom;
}

.bill-content.prev {
  animation-name: slideDownFromTop;
}

@keyframes slideUpFromBottom {
  0% {
    opacity: 0;
    transform: translateY(80rpx) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideDownFromTop {
  0% {
    opacity: 0;
    transform: translateY(-80rpx) scale(0.96);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.bill-section {
  margin-bottom: 20rpx;
}

.bill-date {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20rpx;
  background: #fff;
}

.date-text {
  font-size: 28rpx;
  font-weight: bold;
  color: #333;
}

.day-totals {
  display: flex;
  gap: 20rpx;
}

.day-income {
  font-size: 24rpx;
  color: #19be6b;
}

.day-expense {
  font-size: 24rpx;
  color: #fa3534;
}

.bill-item-wrapper {
  background: #fff;
}

.item-icon {
  color: #00BFFF;
  font-size: 40rpx;
  width: 60rpx;
  height: 60rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border-radius: 12rpx;
}

.item-amount {
  font-size: 32rpx;
  font-weight: 500;
}

.item-amount.expense {
  color: #fa3534;
}

.item-amount.income {
  color: #19be6b;
}

.load-more {
  padding: 30rpx;
  text-align: center;
}

.load-more-text {
  font-size: 26rpx;
  color: #666;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100rpx 0;
}

.empty-text {
  font-size: 32rpx;
  color: #999;
  margin-bottom: 20rpx;
}

.empty-hint {
  font-size: 26rpx;
  color: #ccc;
}
</style>
