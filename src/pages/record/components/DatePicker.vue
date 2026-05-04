<template>
  <WdPopup position="bottom" v-model="localVisible" custom-style="border-radius: 32rpx 32rpx 0 0">
    <view class="picker-header">
      <view class="picker-cancel" @tap="close">取消</view>
      <view class="picker-title">选择日期</view>
      <view class="picker-confirm" @tap="confirm">确定</view>
    </view>
    <WdPickerView :model-value="pickerValue" :columns="pickerColumns" @change="onPickerChange" custom-style="height: 420rpx" />
  </WdPopup>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'

const props = defineProps<{
  visible: boolean
  date: string
}>()

const emit = defineEmits<{
  (e: 'update:date', date: string): void
  (e: 'close'): void
}>()

const localVisible = computed({
  get: () => props.visible,
  set: (val) => {
    if (!val) emit('close')
  }
})

const today = new Date()
const years = computed(() => {
  const result = []
  const currentYear = today.getFullYear()
  for (let i = currentYear - 10; i <= currentYear + 10; i++) {
    result.push(i)
  }
  return result
})

const months = computed(() => {
  const result = []
  for (let i = 1; i <= 12; i++) {
    result.push(i)
  }
  return result
})

const selectedYear = ref(today.getFullYear())
const selectedMonth = ref(today.getMonth() + 1)
const selectedDay = ref(today.getDate())

const days = computed(() => {
  const result = []
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  for (let i = 1; i <= daysInMonth; i++) {
    result.push(i)
  }
  return result
})

const pickerColumns = computed(() => {
  return [
    {
      values: years.value,
      defaultIndex: years.value.indexOf(selectedYear.value),
      format: (label: number) => `${label}年`
    },
    {
      values: months.value,
      defaultIndex: months.value.indexOf(selectedMonth.value),
      format: (label: number) => `${label.toString().padStart(2, '0')}月`
    },
    {
      values: days.value,
      defaultIndex: days.value.indexOf(selectedDay.value),
      format: (label: number) => `${label.toString().padStart(2, '0')}日`
    }
  ]
})

const pickerValue = ref([0, 0, 0])

const updatePickerValue = () => {
  const yearIndex = years.value.indexOf(selectedYear.value)
  const monthIndex = months.value.indexOf(selectedMonth.value)
  const dayIndex = days.value.indexOf(selectedDay.value)
  pickerValue.value = [yearIndex >= 0 ? yearIndex : 0, monthIndex >= 0 ? monthIndex : 0, dayIndex >= 0 ? dayIndex : 0]
}

const onPickerChange = (e: any) => {
  const [yearIndex, monthIndex, dayIndex] = e.modelValue
  selectedYear.value = years.value[yearIndex]
  selectedMonth.value = months.value[monthIndex]
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  selectedDay.value = Math.min(days.value[dayIndex] || 1, daysInMonth)
}

const formatDate = () => {
  const year = selectedYear.value
  const month = String(selectedMonth.value).padStart(2, '0')
  const day = String(selectedDay.value).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const confirm = () => {
  emit('update:date', formatDate())
  emit('close')
}

const close = () => {
  emit('close')
}

watch(() => props.date, (newDate) => {
  if (newDate) {
    const date = new Date(newDate)
    selectedYear.value = date.getFullYear()
    selectedMonth.value = date.getMonth() + 1
    selectedDay.value = date.getDate()
    setTimeout(updatePickerValue, 50)
  }
}, { immediate: true })

watch([selectedYear, selectedMonth], () => {
  const daysInMonth = new Date(selectedYear.value, selectedMonth.value, 0).getDate()
  if (selectedDay.value > daysInMonth) {
    selectedDay.value = daysInMonth
  }
  setTimeout(updatePickerValue, 0)
})
</script>

<style scoped>
.picker-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24rpx 32rpx;
  border-bottom: 1rpx solid rgba(229, 231, 235, 0.6);
}

.picker-cancel {
  font-size: 28rpx;
  color: #9ca3af;
  font-weight: 500;
  padding: 8rpx 16rpx;
  border-radius: 12rpx;
}

.picker-cancel:active {
  background: rgba(156, 163, 175, 0.1);
  color: #6b7280;
}

.picker-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #2d3436;
}

.picker-confirm {
  font-size: 28rpx;
  color: #ffb347;
  font-weight: 600;
  padding: 8rpx 20rpx;
  border-radius: 12rpx;
}

.picker-confirm:active {
  background: rgba(255, 179, 71, 0.15);
  transform: scale(0.95);
}
</style>
