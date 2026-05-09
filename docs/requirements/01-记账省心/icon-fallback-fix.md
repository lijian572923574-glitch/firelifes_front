# 功能名称

> 版本：v1.0 | 状态：🟡设计中 | 最后更新：2026-05-09

## 版本历史
| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-09 | 初始版本 | AI |

---

> 最后更新：2026-05-09

---

## 功能概述
将所有使用 emoji 作为兜底图标的场景替换为主色线框占位图标。使用 SVG 内联或 Unicode 线框图标代替，避免 emoji 在不同设备上显示不一致的问题。

## 用户故事
作为用户，我希望在不同设备上看到的分类图标样式一致，不会出现某些设备 emoji 显示异常或大小不一的问题。线框图标更加简洁专业，符合应用的极简设计风格。

## 交互设计

### 页面结构
```
修复前（emoji）              修复后（线框图标）
┌───────────┐               ┌───────────┐
│     🍜    │               │     ⬜    │
│   午餐    │               │   午餐    │
│           │  ───────>    │  (SVG)   │
└───────────┘               └───────────┘
```

### 图标替换方案
| 分类类型 | 原 emoji | 替换方案 |
|----------|----------|----------|
| 餐饮 | 🍜 | SVG 线框碗 |
| 交通 | 🚇 | SVG 线框地铁 |
| 购物 | 🛒 | SVG 线框购物车 |
| 娱乐 | 🎮 | SVG 线框游戏手柄 |
| 通讯 | 📱 | SVG 线框手机 |
| 医疗 | 🏥 | SVG 线框医院 |
| 教育 | 📚 | SVG 线框书本 |
| 工资 | 💰 | SVG 线框钱包 |
| 其他 | 📦 | SVG 线框方框 |

### 交互流程
1. 应用启动，加载图标配置
2. 分类渲染时，优先使用后端返回的图标URL
3. 如果图标加载失败或无图标，显示线框占位图标
4. 占位图标统一使用 #00BFFF 描边

### 状态变化
| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 正常 | 图标URL有效 | 显示网络图标 |
| 兜底 | 图标加载失败 | 显示线框占位图标 |
| 兜底 | 无图标数据 | 显示线框占位图标 |

## UI 设计规范

### 布局
- 图标容器：80rpx × 80rpx
- SVG 图标：48rpx × 48rpx，居中
- 图标背景：透明或 #E0F7FA

### 颜色
- 图标描边：#00BFFF
- 图标填充：无（保持线框风格）
- 图标尺寸：48rpx
- 描边宽度：2rpx

### 字体
无

### SVG 图标规范
```svg
<svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
  <path d="..." stroke="#00BFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

## 数据结构

### 本地存储
```typescript
// 图标缓存配置
const ICON_CACHE_KEY = 'icon_cache_config';
```

### 图标配置
```typescript
interface CategoryIconConfig {
  categoryId: string;
  iconUrl?: string;
  fallbackIcon: string;  // SVG 组件名
}

// 兜底图标映射
const FALLBACK_ICONS: Record<string, string> = {
  'meal': 'IconMeal',
  'transport': 'IconTransport',
  'shopping': 'IconShopping',
  'entertainment': 'IconGame',
  'communication': 'IconPhone',
  'medical': 'IconHospital',
  'education': 'IconBook',
  'salary': 'IconWallet',
  'default': 'IconBox'
};
```

## 与现有功能的关联
- 新增组件：`src/components/icons/IconMeal.vue`、`src/components/icons/IconTransport.vue` 等
- 新增图标注册：`src/components/icons/index.ts`
- 修改分类组件：`CategoryItem.vue`
- 影响所有使用 emoji 的场景

## 边界情况
1. **图标加载超时**：3秒超时后显示兜底图标
2. **图标URL格式错误**：显示兜底图标
3. **SVG 渲染失败**：降级显示 Unicode 字符
4. **深色模式**：图标描边色适配深色主题
5. **高 DPI 屏幕**：SVG 保持清晰
