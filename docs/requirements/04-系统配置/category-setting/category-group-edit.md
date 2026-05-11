
# 分类大类编辑页
&gt; 文件：`category-group-edit.md` | 中文名称：分类大类编辑 | 所属模块：系统配置（我的页面子模块）
&gt; 页面路径：`pages/my/category-group-edit.vue`

&gt; 版本：v1.0 | 状态：🟡设计中 | 最后更新：2026-05-10

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-10 | 初始版本：分类大类编辑页独立需求 | AI |

---

## 功能概述
分类大类编辑页支持新增大类和编辑两种模式，提供分类大类信息的基本维护功能。

## 用户故事
作为用户，我希望能灵活添加和修改分类大类信息，这样可以让我的记账分类更有条理。

---

## 交互设计

### 页面结构

```
分类大类编辑页
┌────────────────────────────────────┐
│  ← 新增大类 / 编辑大类  (WdNavbar) │
├────────────────────────────────────┤
│  分类图标                            │
│  ┌────────────────────────────────┐ │
│  │ [🍔] [🚇] [🛒] [🎮] [🏠] [💊]  │ │
│  │ [📚] [💰] [💼] [🎉] [📈]       │ │
│  └────────────────────────────────┘ │
│                                      │
│  大类名称                     (WdInput)│
│  ┌────────────────────────────────┐ │
│  │ 请输入大类名称              [x] │ │
│  └────────────────────────────────┘ │
│                                      │
│  分类类型                            │
│  ┌────────────────────────────────┐ │
│  │ [支出] [收入]                  │ │
│  └────────────────────────────────┘ │
│                                      │
├────────────────────────────────────┤
│       [ 保 存 ]  (WdButton)         │
└────────────────────────────────────┘
```

### 页面模式

- **新增模式**：标题显示"新增大类"，所有字段为空，图标默认选中🍔，类型默认支出，保存后创建新分类
- **编辑模式**：标题显示"编辑大类"，通过路由参数 `id` 加载已有分类数据并填充表单，保存后更新

### 表单字段与验证

| 字段 | 必填 | 验证规则 | 说明 |
|------|------|---------|------|
| 分类图标 | ⭕ | 11个预设图标选一 | 新增模式默认🍔，编辑模式加载已有图标 |
| 大类名称 | ✅ | 1-20字符 | 非空且不超过20字符 |
| 分类类型 | ✅ | 二选一 | 支出 / 收入，pill标签样式 |

### 预设图标列表
```
🍔 🚇 🛒 🎮 🏠 💊 📚 💰 💼 🎉 📈
```
共11个预设图标，网格布局展示，选中项蓝色边框高亮。

### 交互细节

- **默认值填充**：新增模式图标默认🍔，类型默认expense（支出）
- **保存按钮**：使用 WdButton 组件，固定在页面底部，`disabled` 置灰不可点击，`loading` 显示加载中状态
- **保存反馈**：调用API成功后toast提示"创建成功"/"修改成功"，1.5秒后自动 `navigateBack` 返回列表页
- **清除按钮**：WdInput 组件 `showClear` 属性提供一键清除功能

---

## UI 组件使用

页面使用 WotUI (`@wot-ui/ui`) 组件库，通过 `@uni-helper/vite-plugin-uni-components` 自动按需导入。

| 组件 | 用途 | 关键属性 |
|------|------|---------|
| WdNavbar | 顶部导航栏 | `title`, `leftArrow`, `fixed`, `placeholder`, `bordered`, `safeAreaInsetTop` |
| WdInput | 大类名称输入 | `v-model`, `placeholder`, `maxlength=20`, `showClear` |
| WdButton | 保存按钮 | `type="primary"`, `block`, `:disabled`, `:loading` |

&gt; **注意**：图标选择器和类型选择器保持自定义实现，WotUI 无直接对应的 emoji 选择器组件，pill 标签样式比 WdRadio 更符合设计需求。

---

## UI 设计规范

### 布局
- 页面背景：#F5F5F5
- 导航栏：WdNavbar 组件，`fixed` + `placeholder` 固定顶部
- 表单容器：白色背景，margin 0 24rpx，圆角 16rpx，内边距 32rpx 24rpx
- 表单项间距：40rpx
- 标签与输入框间距：16rpx
- 图标项尺寸：96rpx × 96rpx，间距 16rpx
- 类型标签：padding 12rpx 24rpx，圆角 40rpx，间距 12rpx
- 保存按钮：WdButton `block` 通栏，高度 88rpx，圆角 44rpx，固定在底部

### 颜色
- 页面背景：#F5F5F5
- 表单容器背景：#FFFFFF
- 输入框背景：#F8F8F8（通过 WdInput `customStyle` 设置）
- 选中边框：#00BFFF
- 选中背景：rgba(0, 191, 255, 0.1)
- 标签文字：#333333
- 占位文字：#CCCCCC
- 保存按钮：WdButton `type="primary"` 默认主题色
- 禁用态：WdButton `disabled` 属性自动处理

### 字体
- 导航标题：WdNavbar 默认样式
- 表单标签：28rpx，font-weight 500，#333333
- 输入文字：WdInput 默认样式
- 图标文字：48rpx
- 类型标签文字：26rpx，#333333（选中态 #00BFFF，font-weight 500）
- 保存按钮：WdButton 默认样式，`customStyle` 设置 32rpx font-weight 600

### 交互状态
- 图标项默认：背景 #F8F8F8，无边框
- 图标项选中：边框 2rpx #00BFFF，背景 rgba(0, 191, 255, 0.1)
- 类型标签默认：背景 #F8F8F8，无边框
- 类型标签选中：边框 2rpx #00BFFF，背景 rgba(0, 191, 255, 0.1)，文字 #00BFFF
- 输入框清除：WdInput `showClear` 聚焦/有内容时显示清除按钮
- 保存按钮正常：WdButton `type="primary"` 正常态
- 保存按钮禁用：WdButton `disabled` 自动置灰
- 保存按钮加载：WdButton `loading` 显示加载动画

### 动效
- 图标/类型选中切换：transition all 0.2s ease
- 保存按钮状态切换：transition opacity 0.2s ease

---

## 数据结构

### 分类类型定义

```typescript
// 分类类型枚举
export type CategoryType = 'expense' | 'income';

// 分类大类数据结构
export interface CategoryGroup {
  id: number;
  name: string;
  icon: string;
  type: CategoryType;
  order: number;
  isDefault: boolean;
  isVisible: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

// 创建/编辑分类的请求参数
export interface CategoryGroupRequest {
  name: string;
  icon: string;
  type: CategoryType;
}

// 分类类型选项
export const CATEGORY_TYPE_OPTIONS = [
  { value: 'expense' as CategoryType, label: '支出' },
  { value: 'income' as CategoryType, label: '收入' }
]

// 预设图标
export const CATEGORY_ICONS = [
  '🍔', '🚇', '🛒', '🎮', '🏠', '💊', '📚', '💰', '💼', '🎉', '📈'
]
```

---

## API 接口（`src/api/category.ts`）

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getCategoryGroupDetail | GET | `/api/category-groups/:id` | 获取分类详情（编辑模式加载数据） |
| createCategoryGroup | POST | `/api/category-groups` | 创建新分类 |
| updateCategoryGroup | PUT | `/api/category-groups/:id` | 更新分类信息 |

### 请求/响应格式

```typescript
// 创建/更新请求体（CategoryGroupRequest）
{
  name: string;        // 大类名称
  icon: string;        // 图标emoji
  type: CategoryType;  // 分类类型
}

// 响应体
{
  success: boolean;
  message: string;
  data: CategoryGroup;
}
```

---

## 页面逻辑流程

### 新增模式
1. 进入页面（无 `id` 参数）
2. 初始化表单：图标=🍔，类型=expense
3. 用户填写表单
4. `canSave` 计算属性校验：名称非空 &amp;&amp; 名称≤20字符
5. 点击保存 → `saving = true` → 调用 `createCategoryGroup` API
6. 成功 → toast "创建成功" → 1.5s后 `navigateBack`
7. 失败 → toast 显示错误信息 → `saving = false`

### 编辑模式
1. 进入页面（带 `id` 参数）
2. `onLoad` 中调用 `loadCategoryGroupDetail(id)` 加载分类详情
3. 将返回数据填充到 `formData`
4. 用户修改表单
5. 点击保存 → `saving = true` → 调用 `updateCategoryGroup(id, formData)` API
6. 成功 → toast "修改成功" → 1.5s后 `navigateBack`
7. 失败 → toast 显示错误信息 → `saving = false`

### 保存按钮可用条件
```typescript
const saving = ref(false);

const canSave = computed(() =&gt; {
  return formData.value.name.trim().length &gt; 0 &amp;&amp;
         formData.value.name.length &lt;= 20;
});

// WdButton 绑定：:disabled="!canSave" :loading="saving"
```

---

## 边界情况

1. **网络错误**：catch 捕获后 toast "网络错误"，`saving = false`
2. **分类不存在**：API 返回 success=false，toast 显示 message
3. **名称为空**：canSave 为 false，WdButton `disabled` 置灰不可点击
4. **名称超长**：WdInput `maxlength=20` 自动限制，canSave 为 false
5. **编辑模式加载失败**：toast 提示错误信息，用户可手动返回
6. **重复提交防护**：`saving` 状态为 true 时 `handleSave` 直接 return，防止重复提交
7. **重复名称**：点击保存时提示："该分类名称已存在"
