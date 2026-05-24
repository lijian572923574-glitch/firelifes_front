# 新用户注册默认配置需求文档

## 1. 问题背景

新用户注册后，系统需要为其创建一套完整的默认数据，使其开箱即用。当前已有部分初始化逻辑，但存在明显缺失，导致跨设备体验不一致。

## 2. 当前注册初始化链路全景

### 2.1 初始化流程

```
用户注册/首次登录
  │
  ├─ 1. 创建 users 记录
  │     ├─ username: user_{timestamp}
  │     ├─ password: bcrypt 加密
  │     ├─ phone: 手机号
  │     ├─ nickname: 昵称或手机号
  │     └─ isActive: true
  │
  ├─ 2. categoryService.initUserCategories(userId)
  │     ├─ 复制 10 个全局分类组 → user_category_groups
  │     ├─ 复制 45 个全局图标 → user_icons
  │     └─ 复制 45 个全局分类 → user_category_customizations
  │
  ├─ 3. accountService.createDefaultAccounts(userId)
  │     ├─ 现金 (cash, 默认收支账户)
  │     ├─ 折旧资产 (depreciable_asset)
  │     └─ 固定资产 (fixed_asset)
  │
  └─ 【缺失】4. user_config 初始化 ← 本期补全
```

### 2.2 触发入口

| 入口 | 代码位置 | 说明 |
|---|---|---|
| 注册 | `authService.register()` → [auth.service.ts:76-88](file:///Users/dundao/work_for_fire/firelifes_back/src/service/auth.service.ts#L76-L88) | 验证码注册 |
| 验证码登录（新用户） | `authService.login()` → [auth.service.ts:126-135](file:///Users/dundao/work_for_fire/firelifes_back/src/service/auth.service.ts#L126-L135) | 首次验证码登录自动注册 |
| 微信登录（新用户） | `authService.login()` → [auth.service.ts:195-203](file:///Users/dundao/work_for_fire/firelifes_back/src/service/auth.service.ts#L195-L203) | 首次微信登录自动注册 |

三处都会调用 `initUserCategories` + `createDefaultAccounts`，需统一追加 `user_config` 初始化。

---

## 3. 涉及的全部数据表

### 3.1 用户核心表

| 表名 | 注册时创建 | 记录数 | 说明 |
|---|---|---|---|
| `users` | ✅ | 1 | 用户身份信息 |

### 3.2 分类体系表（全局 → 用户复制）

| 全局表（模版） | 用户表（复制数据） | 记录数 | 说明 |
|---|---|---|---|
| `category_groups` | `user_category_groups` | **10** | 10 个大类（饮食消费、居家居住...） |
| `icons` | `user_icons` | **45** | 45 个 emoji 图标 |
| `categories` | `user_category_customizations` | **45** | 45 个二级分类（37 支出 + 8 收入） |

### 3.3 账户表

| 表名 | 记录数 | 说明 |
|---|---|---|
| `accounts` | **3** | 现金、折旧资产、固定资产 |

### 3.4 【本期新增】用户配置表

| 表名 | 记录数 | 说明 |
|---|---|---|
| `user_configs` | **1**（key=`theme`） | 主题颜色配置 |

### 3.5 待后续初始化的表（本期暂不动）

| 表名 | 状态 | 说明 |
|---|---|---|
| `budgets` | 不初始化 | 新用户无默认预算，需手动创建 |
| `depreciating_assets` | 不初始化 | 用户自行添加资产 |
| `records` | 不初始化 | 用户自行记账 |

---

## 4. 详细默认配置清单

### 4.1 分类组（10 个）

代码定义：[category.service.ts](file:///Users/dundao/work_for_fire/firelifes_back/src/service/category.service.ts#L87-L97)

| ID | 名称 | 排序 |
|---|---|---|
| - | 饮食消费 | 1 |
| - | 居家居住 | 2 |
| - | 交通出行 | 3 |
| - | 形象与消费 | 4 |
| - | 兴趣与成长 | 5 |
| - | 社交关系 | 6 |
| - | 健康与医疗 | 7 |
| - | 职场工作 | 8 |
| - | 金融理财 | 9 |
| - | 其他类型 | 10 |

> 注：用户表中 ID 为自增，不固定；`isUserCreated=false` 表示系统默认，`isEnabled=true`。

### 4.2 支出分类（37 个）

代码定义：[category.service.ts](file:///Users/dundao/work_for_fire/firelifes_back/src/service/category.service.ts#L99-L135)

| 大类 | 支出分类 |
|---|---|
| 饮食消费 | 餐饮🍜、饮料🥤、水果🍎、零食🍰、咖啡☕ |
| 居家居住 | 住房🏠、居家🛋️、维修🔧、快递📦 |
| 交通出行 | 交通🚌、汽车🚗 |
| 形象与消费 | 服饰👔、美发💇、美容💄、购物🛍️ |
| 兴趣与成长 | 运动🚴、健身🏋️、旅行✈️、书籍📚、学习🎓、娱乐🎮、电影🎬、音乐🎵、游戏🎮 |
| 社交关系 | 社交💬、礼物🎁、礼金🧧、亲友👨‍👩‍👧‍👦、宠物🐶 |
| 健康与医疗 | 医疗💊 |
| 职场工作 | 办公💼、通讯📱 |
| 金融理财 | 投资📈、彩票🎰 |
| 其他类型 | 其他📦、日用🧻、捐赠❤️ |

### 4.3 收入分类（8 个）

| 大类 | 收入分类 |
|---|---|
| 职场工作 | 工资💼、奖金🎁、兼职👔、报销📋 |
| 金融理财 | 投资收入📈、理财💰 |
| 社交关系 | 礼金收入🧧 |
| 其他类型 | 其他收入📦 |

### 4.4 默认账户（3 个）

代码定义：[account.service.ts](file:///Users/dundao/work_for_fire/firelifes_back/src/service/account.service.ts#L33-L62)

| 名称 | 图标 | 类型 | 初始余额 | 默认支出 | 默认收入 |
|---|---|---|---|---|---|
| 现金 | 💵 | cash | 0 | ✅ | ✅ |
| 折旧资产 | 📱 | depreciable_asset | 0 | ❌ | ❌ |
| 固定资产 | 🏠 | fixed_asset | 0 | ❌ | ❌ |

> **设计意图：** 现金为默认收支账户，新用户直接记账。折旧资产和固定资产用于后续资产管家功能。

### 4.5 【本期新增】用户配置（1 条）

写入 `user_configs` 表：

| config_key | config_value |
|---|---|
| `theme` | `{"mode":"preset","presetName":"teal","customColors":{}}` |

> **设计意图：** 新用户默认使用 teal（稳重蓝绿）主题。换设备登录后从服务端拉取，自动应用。

### 4.6 前端默认值（localStorage，本期无需迁移到 DB）

| 配置项 | 默认值 | 存储位置 |
|---|---|---|
| 主题模式 | preset | `fire_theme_mode` |
| 预设主题名 | teal | `fire_theme_preset` |
| 功能入口排序 | bill → asset → fire → cashback | `function_items_order` |

> **说明：** 功能入口排序属于纯 UI 偏好，换设备后恢复默认排序体验可接受，本期不纳入 DB 初始化。

---

## 5. 实现方案

### 5.1 后端改造

**目标：** 在 `authService` 的 3 个新用户创建入口中，统一追加 `user_config` 初始化。

**改动文件：**

| 文件 | 改动 |
|---|---|
| `firelifes_back/src/service/auth.service.ts` | 在 `register()`、`login()`（验证码+微信新用户分支）中，`createDefaultAccounts` 之后新增 `initUserConfig(userId)` 调用 |
| `firelifes_back/src/service/user.service.ts` | 新增 `initUserConfig(userId)` 方法，写入默认 theme 配置 |

**新增方法伪代码：**

```typescript
// user.service.ts
async initUserConfig(userId: number): Promise<void> {
  const existing = await this.userConfigModel.findOne({
    where: { userId, configKey: 'theme' }
  })
  if (existing) return // 已有配置，跳过

  await this.userConfigModel.save({
    userId,
    configKey: 'theme',
    configValue: JSON.stringify({
      mode: 'preset',
      presetName: 'teal',
      customColors: {}
    })
  })
}
```

### 5.2 前端改造

**本期无需改造。** `stores/user.ts` 的 `fetchUserConfig()` 已在上一期实现，新用户注册后登录即可拉取到 `theme` 配置。

**数据流：**

```
注册成功 → 返回 token + user
  → setAuth() → fetchUserConfig()
    → GET /user/config → { theme: { mode: 'preset', presetName: 'teal', ... } }
      → applyConfigTheme() → 页面应用 teal 主题
```

---

## 6. 完整初始化数据量统计

| 表 | 记录数 |
|---|---|
| users | 1 |
| user_category_groups | 10 |
| user_icons | 45 |
| user_category_customizations | 45 |
| accounts | 3 |
| user_configs | 1 |
| **合计** | **105 条** |

---

## 7. 测试要点

| 测试场景 | 验证点 | 优先级 |
|---|---|---|
| **新用户注册** | 注册后 `user_configs` 中存在 key=`theme` 的记录，值为默认 teal 预设 | P0 |
| **验证码登录新用户** | 首次验证码登录自动注册后，同上有 theme 配置 | P0 |
| **微信登录新用户** | 首次微信登录自动注册后，同上有 theme 配置 | P0 |
| **新设备登录** | 注册后换设备登录，自动应用 teal 主题 | P0 |
| **老用户登录** | 已有用户登录，不重复创建 theme 配置 | P1 |
| **注册失败回滚** | 分类/账户/配置任一初始化失败，不影响用户记录一致性 | P2 |

---

## 8. 交付物清单

| 序号 | 交付物 | 路径 | 操作 |
|---|---|---|---|
| 1 | Service 新增方法 | `firelifes_back/src/service/user.service.ts` | 新增 `initUserConfig` |
| 2 | AuthService 调用 | `firelifes_back/src/service/auth.service.ts` | 3 处新增调用 |
| 3 | 本需求文档 | `firelifes_front/docs/requirements/04-系统配置/new-user-default-config.md` | ✅ 已输出 |

---

## 9. 风险与注意事项

1. **幂等性：** `initUserConfig` 需先检查是否存在，避免重复创建
2. **异步不阻塞：** 配置初始化失败不应阻塞注册流程（用户记录已创建）
3. **老用户兼容：** `stores/user.ts` 的 `fetchUserConfig()` 中已有迁移逻辑，老用户登录后会从 localStorage 上传主题到 DB
4. **预算表暂不初始化：** 预算是用户主动设置的功能，不应强制预设；若后续需要引导，可在 UI 层做"新手引导"而非 DB 初始化
