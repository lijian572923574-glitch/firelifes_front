# FIRE生活家 - Trae Spec 索引

> 最后更新：2026-05-09

## 说明

每个功能的 Trae Spec 包含三件套：
- **spec.md**：产品需求文档（Goals/FR/AC）
- **tasks.md**：实施计划（Task/Priority/Depends On）
- **checklist.md**：验收清单

## Spec 列表

### 01 - 记账省心

| Spec 目录 | 功能 | 状态 |
|-----------|------|------|
| record-continue | 继续记下一笔 | 🟡设计中 |
| account-selector | 账户选择器 | 🟡设计中 |
| smart-remark | 智能备注 | 🟡设计中 |
| record-confirm-card | 记账确认卡片 | 🟡设计中 |
| category-pinned | 分类置顶 | 🟡设计中 |
| record-reminder | 记账提醒 | 🟡设计中 |
| auto-record | 自动记账 | 🟡设计中 |
| quick-amount | 快捷金额 | 🟡设计中 |
| record-template | 记账模板 | 🟡设计中 |
| transfer-record | 转账记录 | 🟡设计中 |
| icon-fallback-fix | 图标兜底 | 🟡设计中 |
| amount-format | 金额格式化 | 🟡设计中 |
| draft-auto-save | 草稿自动保存 | 🟡设计中 |

### 02 - 资产有数

| Spec 目录 | 功能 | 状态 |
|-----------|------|------|
| account-system | 账户体系重构 | 🟡设计中 |
| asset-overview | 资产总览 | 🟡设计中 |
| account-detail | 账户详情 | 🟡设计中 |
| record-account-linkage | 记账账户联动 | 🟡设计中 |
| depreciating-asset | 折旧资产 | 🟡设计中 |
| fixed-asset | 固定资产 | 🟡设计中 |
| investment-tracking | 投资追踪 | 🟡设计中 |

### 03 - FIRE可期

| Spec 目录 | 功能 | 状态 |
|-----------|------|------|
| fire-goal | FIRE目标设定 | 🟡设计中 |
| fire-progress | FIRE进度追踪 | 🟡设计中 |
| savings-rate | 储蓄率计算 | 🟡设计中 |
| fire-time-price | FIRE时间换算 | 🟡设计中 |
| monthly-fire-report | 月度FIRE报告 | 🟡设计中 |

### 04 - 系统配置

| Spec 目录 | 功能 | 状态 |
|-----------|------|------|
| user-auth | 登录注册 | 🟡设计中 |
| settings | 设置页 | 🟡设计中 |
| data-sync | 数据同步 | 🟡设计中 |

## Spec 结构

每个 Spec 目录包含：

```
trae-specs/
└── [功能标识符]/
    ├── spec.md          ← 产品规格文档
    ├── tasks.md         ← 实施计划
    └── checklist.md     ← 验收清单
```

### spec.md 模板

```markdown
# [功能名称]

## Goals（目标）
- 用户目标
- 业务目标

## FR（功能需求）
- FR-01: [功能需求描述]
- FR-02: ...

## AC（验收标准）
- AC-01: [验收条件]
- AC-02: ...
```

### tasks.md 模板

```markdown
# 实施计划

## 任务列表
| Task | 描述 | 优先级 | 依赖 |
|------|------|--------|------|
| T-01 | [任务描述] | P0 | - |
| T-02 | [任务描述] | P1 | T-01 |

## 开发顺序
1. T-01
2. T-02
```

### checklist.md 模板

```markdown
# 验收清单

## 功能验收
- [ ] 验收项1
- [ ] 验收项2

## UI 验收
- [ ] 布局正确
- [ ] 动效流畅
- [ ] 适配良好

## 数据验收
- [ ] 接口正常
- [ ] 数据准确
```

## 与需求文档的关系

每个 spec 对应 `requirements/` 下的同名功能文档：

```
requirements/
├── 01-记账省心/
│   └── record-continue.md      ← 需求文档

trae-specs/
└── record-continue/
    ├── spec.md                 ← 产品规格
    ├── tasks.md                ← 实施计划
    └── checklist.md            ← 验收清单
```

## 优先级说明

| 优先级 | 说明 |
|--------|------|
| P0 | 核心功能，必须完成 |
| P1 | 重要功能，计划完成 |
| P2 | 辅助功能，酌情实现 |

## 状态说明

| 标记 | 含义 |
|------|------|
| 🟡设计中 | 正在设计 spec |
| 🟢已确认 | spec 已确认 |
| 🔵开发中 | 正在开发 |
| ✅已完成 | 功能完成 |
| ❌已废弃 | 不再做此功能 |

## 协作流程

```
需求文档 (requirements/)
      ↓
产品规格 (trae-specs/*/spec.md)
      ↓
实施计划 (trae-specs/*/tasks.md)
      ↓
开发实现 (Trae IDE)
      ↓
验收清单 (trae-specs/*/checklist.md)
      ↓
功能完成
```
