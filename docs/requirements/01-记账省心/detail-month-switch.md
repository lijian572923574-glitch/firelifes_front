# 明细页 - 月份切换与年月选择器
&gt; 文件：`detail-month-switch.md` | 中文名称：明细页月份切换与年月选择器 | 所属模块：记账省心
&gt; 页面路径：`pages/detail/index.vue`

&gt; 版本：v1.0 | 状态：✅已完成 | 最后更新：2026-05-14

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-14 | 初始版本：月份切换、年月选择器、共用组件 | AI |

---

## 功能概述
明细页支持按月份查看记账记录，提供两种月份切换方式：
1. **滚动切换**：上拉加载上一月、下拉刷新下一月
2. **选择器切换**：点击左上角年月弹出年月选择器，直接跳转

年月选择器抽取为共用组件 `YearMonthPicker`，后续统计页等可直接复用。

## 用户故事
作为用户，我希望能方便地在明细页切换不同月份查看记账记录，可以通过滚动或直接选择年月来切换。

---

## 交互设计

### 月份切换方式

#### 方式一：滚动切换
- **上拉到底**：加载上一个月的记录（如5月→4月）
- **下拉刷新**：加载下一个月的记录（如4月→5月）
- **限制**：不能超过当前月份（未来月份不可访问）
- **动画**：切换月份时内容区有滑入动画（上拉向下滑入，下拉向上滑入）

#### 方式二：年月选择器
- **触发**：点击左上角「XXXX年XX月」区域
- **弹出**：底部弹出年月选择器（WdPopup + WdPickerView）
- **限制**：年份最多到当前年，当前年月份最多到当前月
- **确认**：点击确定后自动加载对应月份数据

### 页面结构
```
明细页
┌────────────────────────────────────┐
│  F.I.R.E生活家                      │
│  ┌──────────┐  ┌──────┬──────┐    │
│  │ 2026年   │  │ 收入 │ 支出 │    │ ← 点击年月弹出选择器
│  │ 05月     │  │ +xxx │ -xxx │    │
│  └──────────┘  └──────┴──────┘    │
├────────────────────────────────────┤
│  账单  预算  资产管家  购物返现  更多│
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ 05月14日 星期四               │  │
│  │ 收入: +xxx  支出: -xxx       │  │
│  │ 🍔 餐饮            -35.00   │  │
│  │ 🚇 交通            -5.00    │  │
│  └──────────────────────────────┘  │
│  ...                               │
│        上拉查看上一个月              │
└────────────────────────────────────┘
```

### 年月选择器弹窗
```
┌────────────────────────────────────┐
│  取消          选择年月        确定  │
├────────────────────────────────────┤
│        2026年                      │
│        05月                        │
│  ← WdPickerView 滚轮选择 →        │
└────────────────────────────────────┘
```

---

## 共用组件：YearMonthPicker

### 组件路径
`src/components/YearMonthPicker.vue`

### 组件接口
```typescript
// Props
modelValue: string  // 格式："2026-05"

// Emits
update:modelValue: string  // 选择确认后回传

// Expose
open(): void  // 外部调用打开弹窗
```

### 使用方式
```vue
<YearMonthPicker ref="pickerRef" v-model="selectedYearMonth" />

// 打开选择器
pickerRef.value?.open()

// 监听变化
watch(selectedYearMonth, (val) => {
  // val 格式："2026-05"
})
```

### 技术实现
- 使用 `WdPopup` + `WdPickerView` 组件
- `columns` 格式：`PickerOption[][]`（`[{value, label}]`）
- `modelValue` 格式：值数组 `[2026, 5]`（非索引数组）
- 当前年月份只显示到当前月，历史年份显示全部12个月

---

## 数据结构

### 月份数据缓存
```typescript
const pageData = reactive<Map<string, DatePageData>>(new Map())

interface DatePageData {
  list: RecordItem[]
  total: number
  page: number
  pageSize: number
}
```

### 月份切换状态
```typescript
const currentYear = ref('2026')
const currentMonth = ref('05')
const selectedYearMonth = ref('2026-05')
const transitionDirection = ref<'next' | 'prev'>('next')
```

---

## API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getRecordsByMonth | GET | `/api/record/month/:yearMonth` | 获取指定月份记录 |
| getMonthSummary | GET | `/api/record/summary/:yearMonth` | 获取月度收支汇总 |

---

## 边界情况

1. **未来月份**：不能切换到超过当前月份的月份
2. **空月份**：如果某月无数据，提示"已经到底了"或"已经是最新月份了"
3. **快速切换**：通过锁机制防止重复请求（`loadPrevMonthLock`）
4. **H5兼容**：使用 scroll-view 的 refresher 机制替代页面级下拉刷新

---

## 实现要点

### 未来月份限制
```typescript
if (year > currentYearNum || (year === currentYearNum && month > currentMonthNum)) {
  uni.showToast({ title: '已经是最新月份了', icon: 'none' })
  return
}
```

### 切换动画
```css
.bill-content.next { animation-name: slideUpFromBottom; }
.bill-content.prev { animation-name: slideDownFromTop; }
```

### 防重复请求锁
```typescript
let loadPrevMonthLock = false
// 上拉切换时加锁，1秒后释放
```

---

## 验收标准

- [x] 上拉到底可切换到上一月
- [x] 下拉刷新可切换到下一月
- [x] 不能切换到未来月份
- [x] 点击年月弹出选择器
- [x] 选择器中年份限制到当前年
- [x] 选择器当前年月份限制到当前月
- [x] 切换月份有动画效果
- [x] YearMonthPicker 为共用组件，统计页可复用