
# 分类大类列表页
&gt; 文件：`category-group-list.md` | 中文名称：分类大类列表页 | 所属模块：系统配置（我的页面子模块）
&gt; 页面路径：`pages/my/category-group-list.vue`

&gt; 版本：v2.0 | 状态：🟡设计中 | 最后更新：2026-05-12

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v2.0 | 2026-05-12 | 统一使用WotUI组件库，左滑交互模式，移除图标字段 | AI |
| v1.1 | 2026-05-12 | 添加子分类管理入口，完善分层导航设计 | AI |
| v1.0 | 2026-05-10 | 初始版本：分类大类列表页独立需求 | AI |

---

## 功能概述
分类大类列表页是分类体系的入口页面，展示所有用户分类大类，支持新增、编辑、删除大类，点击大类可进入该大类下的子分类列表页进行子分类管理。

## 用户故事
作为用户，我希望能方便地查看和管理我的分类大类和子分类，这样可以让我的记账分类更有条理。

---

## 交互设计

### 页面结构

```
分类大类列表页
┌────────────────────────────────────┐
│  ← 返回     分类管理       [+]     │ ← WdNavbar
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ 餐饮                     ›    │  │ ← WdSwipeCell 左滑区域
│  └──────────────────────────────┘  │
│  ┌──────┐  ┌──────┐              │
│  │ 编辑 │  │ 删除 │              │ ← WdSwipeCell 右滑操作区
│  └──────┘  └──────┘              │
│                                     │
│  ┌──────────────────────────────┐  │
│  │ 交通                     ›    │  │
│  └──────────────────────────────┘  │
│  ┌──────┐  ┌──────┐              │
│  │ 编辑 │  │ 删除 │              │
│  └──────┘  └──────┘              │
│                                     │
│  ...                                │
│                                     │
└────────────────────────────────────┘
```

### 分类大类卡片展示
每个分类大类卡片使用 `WdSwipeCell` 组件：
- **名称**：分类大类名称（加粗）
- **右箭头**：提示可点击进入子分类列表（使用 `WdIcon`）
- **左滑操作区**：编辑按钮（主色）、删除按钮（危险色）

### 卡片交互
- **点击卡片名称/空白区域**：进入该大类下的子分类列表页
- **向左滑动卡片**：显示编辑、删除按钮
- **点击编辑按钮**：显示编辑弹窗（阻止冒泡，不进入子分类）
- **点击删除按钮**：显示确认弹窗（阻止冒泡，不进入子分类）

### 交互流程

1. **页面加载**
   - 显示所有用户分类大类列表
   - 无大类时显示空状态

2. **右上角"+"按钮**
   - 点击显示新增弹窗

3. **点击分类大类卡片**
   - 进入该大类下的子分类列表页（页面路径：`pages/my/category-list.vue`）

4. **左滑卡片 → 编辑按钮**
   - 点击显示编辑弹窗

5. **左滑卡片 → 删除按钮**
   - 点击显示确认弹窗："确定要删除此分类吗？"
   - 确认后删除并刷新列表

### 状态变化

| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 空态 | 无分类 | 显示引导卡片"添加你的第一个分类" |
| 正常 | 有分类 | 显示分类列表 |
| 加载中 | 请求数据中 | 显示加载文字 |
| 删除确认 | 点击删除 | 显示确认弹窗 |
| 删除完成 | 确认删除 | 删除并刷新列表 |

---

## UI 组件使用

页面使用 WotUI (`@wot-ui/ui`) 组件库，通过 `@uni-helper/vite-plugin-uni-components` 自动按需导入。

| 组件 | 用途 | 关键属性 |
|------|------|---------|
| WdNavbar | 顶部导航栏 | `title="分类管理"`, `leftArrow`, `fixed`, `placeholder`, `bordered`, `safeAreaInsetTop`, `rightText="+", @click-right` |
| WdSwipeCell | 左滑单元格 | `:right-width="140"`, `#default`, `#right` |
| WdButton | 操作按钮 | `size="small"`, `type="primary"` (编辑), `type="danger"` (删除) |
| WdIcon | 箭头图标 | `name="arrow-right"`, `color="#CCCCCC"` |
| WdDialog | 编辑弹窗 | `v-model`, `title`, `show-cancel-button`, `show-confirm-button` |
| WdInput | 弹窗输入框 | `v-model`, `placeholder`, `maxlength` |

&gt; **注意**：页面容器需设置 `overflow-x: hidden` 禁止横向滚动，避免与 WdSwipeCell 冲突。

---

## UI 设计规范

### 布局
- 页面背景：#F5F5F5
- 导航栏：WdNavbar 组件，`fixed` + `placeholder` 固定顶部
- 分类卡片：高度 88rpx，圆角 16rpx
- 卡片间距：16rpx
- WdSwipeCell 右滑区域宽度：140rpx（编辑70rpx + 删除70rpx）

### 颜色（卡布里蓝体系）
- 页面背景：#F5F5F5
- 卡片背景：#FFFFFF
- 新增按钮：#00BFFF
- 编辑按钮：#00BFFF（WdButton type="primary"）
- 删除按钮：#FA3534（WdButton type="danger"）
- 说明文字：#999999
- 分割线：#F5F5F5

### 字体
- 导航标题：WdNavbar 默认样式
- 分类名称：30rpx，#333333，加粗
- 操作按钮文字：26rpx，WdButton 默认样式

### 动效
- 列表加载：fadeIn，时长 300ms，stagger 50ms
- WdSwipeCell 滑动：组件自带过渡动画
- WdButton 点击：组件自带反馈效果

---

## 数据结构

### 分类大类数据结构
```typescript
interface UserCategoryGroup {
  id: number;
  userId: number;               // 用户ID
  name: string;                 // 大类名称
  sortOrder: number;            // 排序
  isEnabled: boolean;           // 是否启用
  createdAt: string;
  updatedAt: string;
}
```

---

## API 接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getUserGroups | GET | `/api/category/user/groups/all` | 获取用户分类大类列表 |
| createUserGroup | POST | `/api/category/user/groups` | 创建分类大类 |
| updateUserGroup | PUT | `/api/category/user/groups/:id` | 更新分类大类 |
| deleteUserGroup | DELETE | `/api/category/user/groups/:id` | 删除分类大类 |

### 请求/响应格式
```typescript
// 响应体
{
  success: boolean;
  message: string;
  data: UserCategoryGroup[];
}

// 创建/更新请求体
{
  name: string;
}
```

---

## 子分类列表页（关联页面）

### 页面路径
`pages/my/category-list.vue`

### 功能概述
子分类列表页展示指定大类下的所有子分类，支持新增、编辑、删除子分类。

### 数据结构
```typescript
interface Category {
  id: string;
  name: string;
  groupId: number;
  iconId: number;
  iconUrl?: string;
  sortOrder: number;
  isDefault: boolean;
  type: 'income' | 'expense';
}
```

### API 接口
| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| getCategoriesByGroup | GET | `/api/category/group/:groupId` | 获取指定大类下的子分类列表 |
| createCategory | POST | `/api/category/user` | 创建子分类 |
| updateCategory | PUT | `/api/category/user/:id` | 更新子分类 |
| deleteCategory | DELETE | `/api/category/user/:id` | 删除子分类 |

### 页面结构
```
子分类列表页
┌────────────────────────────────────┐
│  ← 返回     餐饮           [+]     │ ← WdNavbar
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │ 📝 早餐                  ›    │  │ ← WdSwipeCell
│  └──────────────────────────────┘  │
│  ┌──────┐  ┌──────┐              │
│  │ 编辑 │  │ 删除 │              │
│  └──────┘  └──────┘              │
│                                     │
│  ...                                │
│                                     │
└────────────────────────────────────┘
```

### 交互说明
- 子分类列表页同样使用 WdSwipeCell 左滑交互模式
- 点击卡片进入子分类详情/编辑页（视后续需求）
- 左滑显示编辑、删除按钮

---

## 与现有功能的关联

### 依赖关系
- 依赖用户认证状态（userStore）
- 分类设置入口依赖个人中心页面

### 需要修改的文件
- `src/pages/my/index.vue` — 我的页面（已增加分类设置入口）

### 新增文件
- `src/pages/my/category-group-list.vue` — 分类大类列表页
- `src/pages/my/category-list.vue` — 子分类列表页

---

## 边界情况

1. **未登录状态**
   - 不显示分类列表
   - 提示登录

2. **网络错误**
   - 提示："网络错误，请重试"

3. **空状态**
   - 显示引导卡片"添加你的第一个分类"

4. **删除大类时**
   - 如果该大类下有子分类，提示："请先删除该大类下的子分类"
   - 无子分类时才允许删除

5. **禁止横向滚动**
   - 页面根容器设置 `overflow-x: hidden`
   - 避免与 WdSwipeCell 的横向滑动冲突

---

## 实现要点

### WdSwipeCell 使用示例
```vue
&lt;wd-swipe-cell :right-width="140"&gt;
  &lt;template #default&gt;
    &lt;view class="group-card" @click="goToCategoryList(group.id)"&gt;
      &lt;text class="group-name"&gt;{{ group.name }}&lt;/text&gt;
      &lt;wd-icon name="arrow-right" size="16px" color="#CCCCCC" /&gt;
    &lt;/view&gt;
  &lt;/template&gt;
  &lt;template #right&gt;
    &lt;wd-button size="small" type="primary" @click.stop="handleEdit(group)"&gt;编辑&lt;/wd-button&gt;
    &lt;wd-button size="small" type="danger" @click.stop="handleDelete(group)"&gt;删除&lt;/wd-button&gt;
  &lt;/template&gt;
&lt;/wd-swipe-cell&gt;
```

### 禁止横向滚动
```vue
&lt;style scoped&gt;
.page-container {
  overflow-x: hidden; /* 关键：禁止页面横向滚动 */
  min-height: 100vh;
  background-color: #F5F5F5;
}
&lt;/style&gt;
```

