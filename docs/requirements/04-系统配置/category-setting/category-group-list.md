
# 分类大类列表页
&gt; 文件：`category-group-list.md` | 中文名称：分类大类列表页 | 所属模块：系统配置（我的页面子模块）
&gt; 页面路径：`pages/my/category-group-list.vue`

&gt; 版本：v1.0 | 状态：🟡设计中 | 最后更新：2026-05-10

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-10 | 初始版本：分类大类列表页独立需求 | AI |

---

## 功能概述
分类大类列表页是分类体系的入口页面，展示所有分类大类（支出大类和收入大类分开显示），支持新增、编辑、删除大类，以及查看子分类。

## 用户故事
作为用户，我希望能方便地查看和管理我的分类大类，这样可以让我的记账分类更有条理。

---

## 交互设计

### 页面结构

```
分类大类列表页
┌────────────────────────────────────┐
│  ← 返回                    [+] │
├────────────────────────────────────┤
│  ┌─────────────────────────────┐   │
│  │ 🍔 餐饮                     │   │
│  │ [更多] [✎] [🗑]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │ 🚇 交通                     │   │
│  │ [更多] [✎] [🗑]            │   │
│  └─────────────────────────────┘   │
│                                     │
│  ...                                │
│                                     │
└────────────────────────────────────┘
```

### 默认分类大类

用户注册成功后，系统自动创建以下默认分类大类：

#### 支出大类
| 大类名称 | 图标 | 类型 | 排序 |
|---------|------|------|------|
| 餐饮 | 🍔 | expense | 1 |
| 交通 | 🚇 | expense | 2 |
| 购物 | 🛒 | expense | 3 |
| 娱乐 | 🎮 | expense | 4 |
| 居住 | 🏠 | expense | 5 |
| 医疗 | 💊 | expense | 6 |
| 教育 | 📚 | expense | 7 |
| 其他支出 | 💰 | expense | 8 |

#### 收入大类
| 大类名称 | 图标 | 类型 | 排序 |
|---------|------|------|------|
| 工资 | 💼 | income | 1 |
| 奖金 | 🎉 | income | 2 |
| 投资收益 | 📈 | income | 3 |
| 其他收入 | 💰 | income | 4 |

**注意**：默认分类大类不可删除，但可以编辑名称和图标。

### 分类大类卡片展示
每个分类大类卡片显示：
- **图标**：左侧显示分类图标
- **名称**：分类大类名称（加粗）
- **操作按钮**：[更多] [✎] [🗑] 依次排列

### 交互流程

1. **页面加载**
   - 显示所有分类大类列表（支出大类和收入大类分开显示）
   - 无大类时显示空状态

2. **右上角"+"按钮**
   - 点击跳转到分类大类编辑页（新增模式）

3. **[更多]按钮**
   - 点击进入该大类下的子分类列表（待定）

4. **[✎]编辑按钮**
   - 点击跳转到分类大类编辑页（编辑模式）

5. **[🗑]删除按钮**
   - 点击显示确认弹窗："确定要删除此分类吗？"
   - 确认后删除并刷新列表
   - 注意：大类下有子分类时不能删除，提示用户

### 状态变化

| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 空态 | 无分类 | 显示引导卡片"添加你的第一个分类" |
| 正常 | 有分类 | 显示分类列表 |
| 加载中 | 请求数据中 | 显示骨架屏 |
| 删除确认 | 点击删除 | 显示确认弹窗 |
| 删除完成 | 确认删除 | 删除并刷新列表 |

---

## UI 组件使用

页面使用 WotUI (`@wot-ui/ui`) 组件库，通过 `@uni-helper/vite-plugin-uni-components` 自动按需导入。

| 组件 | 用途 | 关键属性 |
|------|------|---------|
| WdNavbar | 顶部导航栏 | `title="分类管理"`, `leftArrow`, `fixed`, `placeholder`, `bordered`, `safeAreaInsetTop` |

---

## UI 设计规范

### 布局
- 页面背景：#F5F5F5
- 导航栏：WdNavbar 组件，`fixed` + `placeholder` 固定顶部
- 分类卡片：高度 120rpx，圆角 16rpx
- 卡片间距：16rpx
- 图标尺寸：64rpx

### 颜色（卡布里蓝体系）
- 页面背景：#F5F5F5
- 卡片背景：#FFFFFF
- 主色描边图标：#00BFFF
- 新增按钮：#00BFFF
- 说明文字：#999999
- 分割线：#F5F5F5

### 字体
- 导航标题：WdNavbar 默认样式
- 分类名称：32rpx，#333333，加粗
- 右侧箭头：24rpx，#CCCCCC

### 动效
- 列表加载：fadeIn，时长 300ms，stagger 50ms
- 卡片点击：scale 0.98，时长 100ms

---

## 数据结构

### 分类大类数据结构
```typescript
// 分类类型枚举
type CategoryType = 'expense' | 'income';

interface CategoryGroup {
  id: number;
  name: string;                    // 大类名称
  icon: string;                    // 图标
  type: CategoryType;              // 类型
  order: number;                   // 排序
  isDefault?: boolean;             // 是否为默认分类
  isVisible: boolean;              // 是否显示
  isDeleted: boolean;              // 软删除标记
  createdAt: string;
  updatedAt: string;
}

// 默认支出大类配置
const DEFAULT_EXPENSE_CATEGORIES: Omit&lt;CategoryGroup, 'id' | 'createdAt' | 'updatedAt'&gt;[] = [
  { name: '餐饮', icon: '🍔', type: 'expense', order: 1, isDefault: true, isVisible: true, isDeleted: false },
  { name: '交通', icon: '🚇', type: 'expense', order: 2, isDefault: true, isVisible: true, isDeleted: false },
  { name: '购物', icon: '🛒', type: 'expense', order: 3, isDefault: true, isVisible: true, isDeleted: false },
  { name: '娱乐', icon: '🎮', type: 'expense', order: 4, isDefault: true, isVisible: true, isDeleted: false },
  { name: '居住', icon: '🏠', type: 'expense', order: 5, isDefault: true, isVisible: true, isDeleted: false },
  { name: '医疗', icon: '💊', type: 'expense', order: 6, isDefault: true, isVisible: true, isDeleted: false },
  { name: '教育', icon: '📚', type: 'expense', order: 7, isDefault: true, isVisible: true, isDeleted: false },
  { name: '其他支出', icon: '💰', type: 'expense', order: 8, isDefault: true, isVisible: true, isDeleted: false }
];

// 默认收入大类配置
const DEFAULT_INCOME_CATEGORIES: Omit&lt;CategoryGroup, 'id' | 'createdAt' | 'updatedAt'&gt;[] = [
  { name: '工资', icon: '💼', type: 'income', order: 1, isDefault: true, isVisible: true, isDeleted: false },
  { name: '奖金', icon: '🎉', type: 'income', order: 2, isDefault: true, isVisible: true, isDeleted: false },
  { name: '投资收益', icon: '📈', type: 'income', order: 3, isDefault: true, isVisible: true, isDeleted: false },
  { name: '其他收入', icon: '💰', type: 'income', order: 4, isDefault: true, isVisible: true, isDeleted: false }
];
```

---

## API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getCategoryGroups | GET | `/api/category-groups` | 获取分类大类列表 |
| deleteCategoryGroup | DELETE | `/api/category-groups/:id` | 删除分类大类 |

### 请求/响应格式
```typescript
// 响应体
{
  success: boolean;
  message: string;
  data: CategoryGroup[];
}
```

---

## 与现有功能的关联

### 依赖关系
- 依赖用户认证状态（userStore）
- 分类设置入口依赖个人中心页面

### 需要修改的文件
- `src/pages/my/index.vue` — 我的页面（已增加分类设置入口）

### 新增文件
- `src/pages/my/category-group-list.vue` — 分类大类列表页
- `src/pages/my/category-group-edit.vue` — 分类大类编辑页

---

## 边界情况

1. **大类下有子分类**
   - 不能删除该大类
   - 提示："请先删除该分类下的子分类"

2. **未登录状态**
   - 不显示分类列表
   - 提示登录

3. **网络错误**
   - 提示："网络错误，请重试"

4. **空状态**
   - 显示引导卡片"添加你的第一个分类"
