<!--
  pages/detail/index.vue - 账单明细页面
  功能：展示记账记录，按月份筛选，下拉刷新、上拉加载
  技术：Vue3 + TypeScript + uni-app + Wot Design
-->
<template>
  <view class="page">
    <DetailHeader
      :currentYear="currentYear"
      :currentMonth="currentMonth"
      :monthIncome="monthIncome"
      :monthExpense="monthExpense"
      @open-date-picker="showDatePicker"
    />

    <view v-if="netWorth !== null" class="fire-mini-bar">
      <view class="fire-mini-bar-fill" :style="{ width: firePercent + '%' }"></view>
      <text class="fire-mini-text">🔥 净资产 ¥{{ formatNetWorth }} · 距 FIRE {{ firePercent.toFixed(1) }}%</text>
    </view>

    <FunctionBar
      :items="functionItems"
      @item-click="handleFunctionClick"
    />

    <SavingsRateCard
      :monthIncome="monthIncome"
      :monthExpense="monthExpense"
    />

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
        @scrolltolower="handleReachBottom"
        :lower-threshold="60"
      >
        <view :class="['bill-content', transitionDirection]" :key="currentYear + '-' + currentMonth">
          <view v-if="!loading && sortedDates.length === 0" class="empty-state">
            <text class="empty-text">暂无记账记录</text>
            <text class="empty-hint">点击下方按钮开始记账</text>
          </view>

          <view v-for="date in sortedDates" :key="date" class="bill-section">
            <BillCard
              :formattedDate="formatDate(date)"
              :dayIncome="getDayIncome(date)"
              :dayExpense="getDayExpense(date)"
              :records="getEnrichedRecords(date)"
              @record-tap="handleRecordTap"
            />
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
import { onShow } from '@dcloudio/uni-app'
import { recordApi } from '../../api/record'
import { categoryApi, type CategoryGroup } from '../../api/category'
import CustomTabbar from '../../components/CustomTabbar.vue'
import YearMonthPicker from '../../components/YearMonthPicker.vue'
import DetailHeader from './components/DetailHeader.vue'
import FunctionBar, { type FunctionItem } from './components/FunctionBar.vue'
import BillCard, { type BillCardRecord } from './components/BillCard.vue'
import SavingsRateCard from './components/SavingsRateCard.vue'

interface RecordItem {
  id: number
  typeId: number
  type: 'income' | 'expense' | 'transfer' | 'repayment'
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
const netWorth = ref<number | null>(null)
const fireGoal = ref(0)

const firePercent = computed(() => {
  if (fireGoal.value <= 0 || netWorth.value === null) return 0
  return Math.min((netWorth.value / fireGoal.value) * 100, 100)
})

const formatNetWorth = computed(() => {
  if (netWorth.value === null) return '--'
  return Math.abs(netWorth.value).toFixed(0)
})

const pageData = reactive<Map<string, DatePageData>>(new Map())
const loading = ref(false)
const isRefreshing = ref(false)
const hasMoreData = ref(true)
let loadPrevMonthLock = false

const loadMoreText = computed(() => {
  return '上拉查看上一个月'
})

const functionItems: FunctionItem[] = [
  { key: 'bill', icon: 'icon-zhangdan', text: '账单' },
  { key: 'budget', icon: 'icon-tongji', text: '预算' },
  { key: 'asset', icon: 'icon-zichan', text: '资产管家' },
  { key: 'cashback', icon: 'icon-gouwuche', text: '购物返现' },
]

const handleFunctionClick = (item: FunctionItem) => {
  if (item.key === 'bill') {
    uni.navigateTo({ url: '/pages/detail/bill' })
    return
  }
  console.log('Function clicked:', item.key)
}

const handleRecordTap = (record: BillCardRecord) => {
  uni.navigateTo({
    url: `/pages/record/edit-record?id=${record.id}`,
  })
}

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

const CATEGORY_BG_COLOR = 'rgba(0, 191, 255, 0.08)'

const getCategoryInfo = (typeId: number): { name: string; icon: string; color: string } => {
  for (const group of categories.value) {
    for (const cat of group.children) {
      if (cat.id === typeId) {
        const icon = CATEGORY_ICON_MAP[cat.name] || userIconsMap.value.get(cat.iconId) || cat.iconUrl || 'icon-qita'
        return { name: cat.name, icon, color: CATEGORY_BG_COLOR }
      }
    }
  }
  return { name: '其他', icon: 'icon-qita', color: CATEGORY_BG_COLOR }
}

const sortedDates = computed(() => {
  return Array.from(pageData.keys()).sort((a, b) => new Date(b).getTime() - new Date(a).getTime())
})

const getDateRecords = (date: string): RecordItem[] => {
  return pageData.get(date)?.list || []
}

const getEnrichedRecords = (date: string): BillCardRecord[] => {
  return getDateRecords(date).map((record) => {
    const info = getCategoryInfo(record.typeId)
    return {
      id: record.id,
      type: record.type,
      amount: record.amount,
      displayName: record.remark || info.name,
      categoryIcon: info.icon,
      categoryColor: info.color,
    }
  })
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

const fetchNetWorth = async () => {
  try {
    const res = await recordApi.getNetWorth()
    if (res.success && res.data) {
      netWorth.value = res.data.netWorth
    }
  } catch {
    netWorth.value = null
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
  fetchNetWorth()
  loadFirstPageDates()
})
</script>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #f5f6fa;
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

.fire-mini-bar {
  margin: 0 20rpx;
  height: 40rpx;
  background: rgba(0, 191, 255, 0.06);
  border-radius: 8rpx;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.fire-mini-bar-fill {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  background: linear-gradient(90deg, rgba(0, 191, 255, 0.15), rgba(0, 191, 255, 0.25));
  transition: width 0.6s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.fire-mini-text {
  position: relative;
  z-index: 1;
  font-size: 22rpx;
  color: #00BFFF;
  padding: 0 16rpx;
  white-space: nowrap;
}

.bill-wrapper {
  flex: 1;
  margin: 0 20rpx;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: 60px;
}

.bill-scroll {
  flex: 1;
  height: 100%;
}

.bill-content {
  width: 100%;
  padding: 20rpx 0;
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
  margin-bottom: 24rpx;
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
