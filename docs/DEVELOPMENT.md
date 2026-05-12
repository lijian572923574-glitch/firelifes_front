# FIRE生活家 - 开发规范

> 最后更新：2026-05-12

## 1. 生命周期函数导入规范

### 1.1 Vue 组件生命周期（从 vue 导入）
- `onMounted`
- `onUnmounted`
- `onUpdated`
- `onBeforeMount`
- `onBeforeUnmount`

### 1.2 UniApp 页面生命周期（从 @dcloudio/uni-app 导入）
- `onShow`
- `onHide`
- `onLoad`
- `onUnload`
- `onReachBottom`
- `onPullDownRefresh`
- `onShareAppMessage`

### 1.3 正确示例
```typescript
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
```

## 2. WotUI 组件使用规范

### 2.1 组件名规则
- 组件在模板中使用大写开头，如：`<WdNavbar>`、`<WdSwipeAction>`
- 组件自动通过 `@uni-helper/vite-plugin-uni-components` 按需导入
- 不需要手动 import 组件

### 2.2 实际组件列表
| 需求文档 | 实际组件 |
|---------|---------|
| WdSwipeCell | WdSwipeAction |

### 2.3 常用 WotUI 组件
- WdNavbar - 导航栏
- WdSwipeAction - 左滑操作
- WdButton - 按钮
- WdIcon - 图标
- WdDialog - 对话框
- WdInput - 输入框
- WdLoading - 加载
- WdCell - 单元格
- WdCellGroup - 单元格组
- WdPopup - 弹出层
- WdPickerView - 选择器视图

## 3. 项目结构规范

```
firelifes_front/
├── src/
│   ├── pages/              # 页面
│   ├── components/         # 组件
│   ├── api/               # API 接口
│   ├── stores/            # Pinia 状态管理
│   ├── utils/             # 工具函数
│   ├── config/            # 配置
│   └── App.vue            # 应用入口
├── docs/
│   ├── requirements/       # 需求文档
│   └── trae-specs/       # Trae Spec 文档
└── vite.config.ts        # Vite 配置
```

## 4. 编码规范

### 4.1 TypeScript
- 使用 TypeScript 严格模式
- 避免使用 `any` 类型
- 接口类型定义放在 `api/` 目录下

### 4.2 Vue 3 Composition API
- 使用 `<script setup lang="ts">` 语法
- 使用 `ref`、`computed` 响应式 API
- 使用组合式函数复用逻辑

### 4.3 CSS
- 使用 rpx 单位适配
- 页面容器设置 `min-height: 100vh`
- 注意安全区域适配 `padding-bottom: env(safe-area-inset-bottom)`

## 5. 常见问题记录

### 5.1 WdSwipeCell 不存在
- 实际组件是 `WdSwipeAction`
- 使用方式相同，只是名字不同

### 5.2 左滑操作不生效
- 页面容器需要设置 `overflow-x: hidden`
- WdSwipeAction 需要设置正确的 slot：`#default` 和 `#right`

### 5.3 组件导入错误
- 不要手动 import WotUI 组件
- 确保 vite.config.ts 配置了 `@uni-helper/vite-plugin-uni-components`
- 组件名使用 PascalCase（大写开头）

## 6. 参考文件
- `src/pages/detail/index.vue` - 完整的页面示例
- `wot-ui-resolver.ts` - WotUI 组件解析器配置
- `vite.config.ts` - Vite 配置
