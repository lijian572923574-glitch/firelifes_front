# 记账智能记忆
> 文件：`smart-memory.md` | 中文名称：记账智能记忆（账户+日期） | 所属模块：记账省心
> 版本：v1.3 | 状态：✅已实现 | 最后更新：2026-05-28

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-25 | 初始版本 | AI |
| v1.1 | 2026-05-28 | 新增30小时窗口策略：30小时内有记录则沿用上一条的账户+日期，超过30小时回退分类记忆或默认值 | AI |
| v1.2 | 2026-05-28 | 30小时窗口数据来源改为后端 `/record/latest`：取用户记录表中最新一条（按 `createdAt` 倒序），不再依赖本地存储 `saveLastRecord` | AI |
| v1.3 | 2026-05-28 | 去除所有 localStorage 缓存方案，改用页面加载守卫（PageLoadingGuard）：页面初始化期间阻止用户交互，等 API 数据就绪后才允许操作，彻底根除异步竞态问题 | AI |

---

## 功能概述

记账时自动记忆用户上次的选择，减少连续记账时的重复操作。核心策略分为三层：

1. **30小时窗口策略（主策略）**：从后端获取用户最新一条记录。如果该记录的 `createdAt` 在30小时内 → 沿用其日期和账户；超过30小时 → 进入下一层
2. **账户按分类记忆（兜底策略）**：30小时内无记录时，每个分类记住上次使用的账户，选分类时自动带出
3. **日期持续记忆**：记账成功后不重置日期，下一笔默认沿用上一笔的日期

### 为什么要做

用户一周记一次账、批量补录这段时间的支出时，希望每次记账的账户和日期保持不变，只需改分类和金额。核心场景：

- **一周批量记账**：用户用微信集中消费了一周，周末打开App批量补录。进入记账页 → 调后端获取最新记录 → 自动恢复日期和微信账户 → 只需选分类+输金额即可完成每笔记账
- **跨天补录**：昨天用微信记了餐饮，今天再次打开记账 → 超过30小时 → 回退分类记忆：餐饮自动带微信

### 行业参考

| App | 策略 |
|-----|------|
| 钱迹 | 每个分类记住上次使用的账户，选分类时自动带出 |
| 秒速记账 | 按分类记忆账户，同时根据时间段预测分类 |
| 随手记 | 模板记账，预填所有字段 |

---

## 用户故事

### 30小时窗口策略
作为一周记一次账的用户，我打开记账页时，希望日期和账户自动沿用后端最新一条记录的状态（因为大概率还是用同一个账户、记同一段时间的账），只需要改分类和金额就能快速完成批量记账。

### 账户按分类记忆
作为用户，如果我最近30小时内没有记账，当我选择了「餐饮」分类并使用「微信」账户记了一笔支出后，下次再选「餐饮」时，希望账户自动选为「微信」，而不是每次都回到默认账户。

### 日期持续记忆
作为用户，当我连续记账时（记账成功 → 继续记下一笔），日期保持不变。比如补录5月15日的多笔支出，不需要每笔都重新选日期。

---

## 详细设计

### 一、30小时窗口策略（主策略）

#### 核心逻辑

```
打开记账页（onShow）
  ├─ pageLoading = true（页面加载守卫开启，阻止所有交互）
  │
  ├─ 草稿有效 → draft.load() → 显示草稿banner → pageLoading = false
  │
  ├─ 刚完成记账（justCompleted）
  │    └─ await fetchLatestRecord() → await applyRecentRecord() → partialReset()
  │    └─ pageLoading = false
  │
  └─ 用户主动进入
       └─ await fetchLatestRecord() → await applyRecentRecord()
            ├─ 30小时内有记录 → 恢复日期+交易类型，清空分类/金额/备注
            └─ 超过30小时或首次使用 → resetForm()
       └─ pageLoading = false

选择分类时（selectCategory）
  ├─ pageLoading = true → 提示"页面初始化中"并return（防止异步竞态）
  ├─ latestRecord.value 匹配当前交易类型 → 用最新记录的账户
  └─ 无匹配 → 分类记忆 → 默认账户
```

#### 页面加载守卫机制

**问题**：页面通过 `uni.reLaunch` 重新创建时，`onShow` 中 `fetchLatestRecord()` 是异步API调用，而 `CategorySelector` 组件立即渲染并可交互。用户快速点击分类时，`latestRecord.value` 尚未就绪，导致30小时窗口判断失败。

**解决方案**：引入 `pageLoading` 状态，在 `onShow` 异步初始化期间阻止用户交互。

```typescript
// 伪代码逻辑
onShow(async () => {
  pageLoading.value = true
  try {
    // 草稿不需要API数据，直接放行
    if (draft.hasValidDraft()) { ...; return }
    
    await fetchLatestRecord()  // 确保API数据就绪
    
    if (getJustCompleted()) {
      await applyRecentRecord()
      partialReset()
    } else {
      // 正常进入逻辑
    }
  } finally {
    pageLoading.value = false  // 无论何种路径，最终解锁交互
  }
})
```

**`selectCategory` 中的守卫**：

```typescript
const selectCategory = async (category) => {
  if (pageLoading.value) {
    uni.showToast({ title: '页面初始化中，请稍候...', icon: 'none' })
    return
  }
  // ... 正常逻辑
}
```

#### 数据来源：后端 `/record/latest`

仅使用后端 API 获取用户记录表中 `createdAt` 最新的一条，**不再使用任何 localStorage 缓存**。

优势：
- **准确性**：取数据库真实数据，不受本地存储清空、多设备不同步等影响
- **迁移友好**：用户换设备登录时，自动读取云端最新记录
- **无竞态**：通过页面加载守卫确保API数据就绪后才允许交互，无需额外缓存方案
- **低维护**：无本地缓存代码，减少维护成本和潜在的缓存一致性问题

移除的缓存代码：
- `LAST_COMPLETED_KEY` 常量
- `CachedRecordData` 接口
- `saveLastCompletedRecord` / `getLastCompletedRecord` 函数
- `isTimestampWithinWindow` 函数
- `saveLastCompletedRecord()` 调用（`handleComplete`中）
- `getBestRecentRecord` 函数中的缓存兜底逻辑（简化为只检查 `latestRecord`）

#### 数据模型

复用 `src/api/record.ts` 中的 `RecordData` 接口：

```typescript
interface RecordData {
  id: number
  typeId: number
  date: string        // 记账日期，如 "2026-05-26"
  amount: number
  type: RecordType    // 'expense' | 'income' | 'transfer' | 'repayment' | ...
  accountId?: number  // 支出/收入账户
  toAccountId?: number
  remark?: string
  createdAt?: string  // 服务端记录创建时间，用于30小时判断
}
```

#### 30小时判断

使用 `record.createdAt`（服务端时间）与 `Date.now()`（客户端时间）比较。30小时 = 30 × 60 × 60 × 1000ms。

#### API 调用

新增 `src/api/record.ts` → `recordApi.getLatestRecord()`：

```
GET /record/latest → 返回当前用户最新一条记录（按 createdAt 倒序第一条）
若用户无记录 → 返回 null
```

---

### 二、账户按分类记忆（兜底策略）

#### 核心逻辑

```
30小时内无记录
  → 选择分类 → 查找该分类上次使用的账户 → 自动选中
                          ↓（无记忆记录）
                          回退到默认账户逻辑（isDefaultExpense / isDefaultIncome）
```

#### 记忆维度

| 场景 | 记忆Key | 记忆Value | 示例 |
|------|---------|-----------|------|
| 支出 - 选分类 | `expense_{categoryId}` | accountId | 餐饮→微信、交通→现金 |
| 收入 - 选分类 | `income_{categoryId}` | accountId | 工资→储蓄卡、红包→微信 |
| 转账 - 转出 | `transfer_from` | accountId | 转出→储蓄卡 |
| 转账 - 转入 | `transfer_to` | accountId | 转入→微信 |
| 还债 - 还款账户 | `repayment_from` | accountId | 还款→储蓄卡 |
| 还债 - 债权账户 | `repayment_to` | accountId | 债权→信用卡 |

#### 记忆时机

**写入**：记账成功后，将当前选择的账户写入对应Key（本地存储）
**读取**：选择分类时，30小时窗口未命中时回退到此

#### 兼容性

- 记忆的账户可能已被删除/隐藏，需校验：如果记忆的账户不在当前可用列表中，清除该条记忆，回退默认逻辑
- 新用户无记忆数据，行为与现在完全一致

---

### 三、日期持续记忆

#### 规则

| 场景 | 日期默认值 |
|------|-----------|
| 首次进入记账页（无30小时内记录） | 今天 |
| 30小时内有最新记录 → 打开记账页 | 沿用最新记录的 `date` |
| 记账成功后（连续记账） | 沿用上一笔的日期 |
| 恢复草稿 | 草稿中保存的日期 |

#### 关键区分

- **连续记账**（justCompleted）：记完一笔不离开页面 → `partialReset()`，日期不变
- **30小时内重新进入**：关闭后30小时内再打开 → `fetchLatestRecord()` → 恢复最新记录的日期
- **超过30小时重新进入**：关闭超过30小时再打开 → `resetForm()`，日期=今天

---

## 交互流程

### 批量记账流程（核心场景）

```
上周日记完最后一笔在5月23日，今天5月28日打开（超过30小时）：
  打开记账页 → fetchLatestRecord() → createdAt超过30小时 → resetForm() → 日期=今天
  → 改日期为5月23日 → 选分类「餐饮」→ latestRecord已过期 → 查分类记忆 → 带出「微信」
  → 输入金额35 → 提交 → 记账成功

  记账成功后 → justCompleted=true → reLaunch
  → onShow → justCompleted → await fetchLatestRecord()
  → 后端返回刚存的那条（createdAt在30小时内）
  → applyRecentRecord() → selectedDate=5月23日 → partialReset()
  → 选分类「交通」→ latestRecord.value 匹配 expense 类型 → 自动带出「微信」
  → 输入金额5 → 提交 → 记账成功 → ... 循环
```

### 补录历史账目流程

```
用户点击记账 → 进入记账页（日期=今天 or 30小时内日期）
  → 改日期为5月15日
  → 选分类「餐饮」→ 账户自动带出（30小时窗口 or 分类记忆）
  → 输入金额28 → 提交
  → 记账成功
  → 日期保持5月15日
  → 选分类「购物」→ 账户自动带出
  → 输入金额199 → 提交
  → 日期仍是5月15日，无需重复选择
```

---

## 账户决策完整优先级

```
选择分类 → 获取账户列表后：
  1. 转账/还债：查分类记忆 → 查默认账户
  2. 支出：查 latestRecord（需匹配 expense 类型）→ 查分类记忆(expense_{categoryId}) → 查默认支出账户
  3. 收入：查 latestRecord（需匹配 income 类型）→ 查分类记忆(income_{categoryId}) → 查默认收入账户
```

---

## 需要修改的文件

### 前端修改
| 文件 | 路径 | 说明 |
|------|------|------|
| `record.ts` | `src/api/record.ts` | 新增 `getLatestRecord()`：`GET /record/latest` 获取用户最新一条记录 |
| `record-memory.ts` | `src/utils/record-memory.ts` | 分类记忆读写。30小时窗口代码已移除（数据来源改为后端） |
| `index.vue` | `src/pages/record/index.vue` | 1. onShow: async 调 `fetchLatestRecord` + `applyRecentRecord`<br>2. selectCategory: 用 `latestRecord.value` 匹配账户<br>3. handleComplete: 只写分类记忆，不再写 `saveLastRecord`<br>4. partialReset: 保留日期/账户/分类，仅清空金额/备注 |

### 后端新增
| 接口 | 方法 | 说明 |
|------|------|------|
| `/record/latest` | GET | 返回当前用户最近一条记账记录（按 `createdAt` 倒序第一条），无记录返回 null |

---

## `record-memory.ts` 接口设计

```typescript
// ========== 分类记忆（兜底） ==========

function saveAccountMemory(type, categoryId, accountId): void  // 写入
function getAccountMemory(type, categoryId): string | null     // 读取
function clearAccountMemory(type, categoryId): void            // 清除
function findAccountByMemory(type, categoryId, accounts): { id: string } | null  // 查找
```

---

## `record/index.vue` 改动点

### 1. `fetchLatestRecord()` — 从后端获取最新记录

```typescript
const latestRecord = ref<RecordData | null>(null)
const LAST_RECORD_WINDOW = 30 * 60 * 60 * 1000

const fetchLatestRecord = async () => {
  const res = await recordApi.getLatestRecord()
  latestRecord.value = (res.success && res.data) ? res.data : null
}
```

### 2. `applyRecentRecord()` — 应用30小时窗口

```typescript
const applyRecentRecord = (): boolean => {
  const record = latestRecord.value
  if (!record || !record.createdAt) return false
  if (Date.now() - new Date(record.createdAt).getTime() > LAST_RECORD_WINDOW) return false
  selectedDate.value = record.date
  if (record.type === 'expense' || record.type === 'income') {
    transactionType.value = record.type
  }
  // 后续新增字段在此追加
  return true
}
```

### 3. `onShow()` — async 获取最新记录

```
onShow(async () => {
  ├─ 草稿有效 → 显示草稿banner（不变）
  ├─ justCompleted → await fetchLatestRecord() → applyRecentRecord() → partialReset()
  └─ 用户主动进入 → await fetchLatestRecord()
       ├─ applyRecentRecord() true → 清空分类/金额/备注/账户
       └─ applyRecentRecord() false → resetForm()
})
```

### 4. `selectCategory()` — 用 latestRecord 匹配账户

```
支出/收入选择分类时：
  ├─ latestRecord.value 匹配当前类型 → 用最新记录的账户
  └─ 无 → findAccountByMemory(分类记忆) → 默认账户
```

注意：`RecordData.accountId` 是 `number`，`Account.id` 是 `string`，比较时需 `String(recent.accountId)`。

### 5. `handleComplete()` — 只写分类记忆

```
记账成功 → saveAccountMemory(...) → draft.remove() → partialReset()
（不再调用 saveLastRecord）
```

### 6. `partialReset()` — 不变

```typescript
const partialReset = () => {
  displayAmount.value = ''
  remark.value = ''
  assetData.value = null
  // 保留：selectedDate / selectedCategory / selectedAccount / fromAccount / toAccount
}
```

---

## 边界情况

1. **后端 `/record/latest` 返回 null**（新用户无记录）→ `latestRecord.value` 为 null → `applyRecentRecord()` 返回 false → `resetForm()`
2. **后端接口超时/异常** → `fetchLatestRecord()` catch → `latestRecord.value` = null → 回退默认逻辑
3. **最新记录的账户已被删除/隐藏** → `selectCategory` 中匹配失败 → 回退分类记忆 → 回退默认账户
4. **用户切换支出/收入tab** — 清空分类和账户选择，下次选分类时按新tab类型匹配 latestRecord
5. **跨日期补录** — 用户改日期记一笔后，后端最新记录的 `date` 更新，下次 `onShow` 时会恢复新日期
6. **草稿恢复** — 草稿优先级最高，不触发 fetchLatestRecord
7. **新用户** — 无记录，行为与未升级前完全一致
8. **30小时临界值** — 30h01m 无记忆 → `resetForm()`；29h59m 有记忆 → `applyRecentRecord()`
9. **客户端与服务端时间不同步** — 30小时窗口足够宽，几秒偏差不影响判断结果
10. **多设备记账** — 设备A记一笔后，设备B打开记账页 → 调后端获取最新记录 → 同样能恢复上一条的日期和账户

---

## 与现有功能的关系

| 现有功能 | 影响 |
|---------|------|
| 默认账户（isDefaultExpense/Income） | 作为最后的回退方案（30小时无匹配 → 分类无记忆 → 默认账户） |
| 分类记忆（expense_{id} / income_{id}） | 30小时窗口未命中时的兜底策略 |
| 草稿自动保存 | 草稿保存/恢复逻辑不变，草稿优先级最高 |
| 记账成功跳转明细页 | 跳转行为不变，reLaunch 回来时日期保持 |
| 编辑记录 | 不受影响，编辑页有独立的日期/账户逻辑 |
