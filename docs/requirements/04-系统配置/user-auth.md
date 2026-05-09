# 登录注册 (user-auth)

> 版本：v1.0 | 状态：🟡设计中 | 最后更新：2026-05-09

## 版本历史

| 版本 | 日期 | 变更内容 | 作者 |
|------|------|---------|------|
| v1.0 | 2026-05-09 | 初始版本 | AI |

---

## 功能概述

用户身份认证模块，支持微信一键登录和手机号+验证码登录两种方式，确保用户数据安全和多设备同步。用户必须登录后才能使用完整功能，数据与账号绑定。

## 用户故事

作为用户，我希望能够快速登录应用，跨设备同步我的记账数据，同时确保我的财务数据安全私密。

## 交互设计

### 页面结构

```
登录页 (src/pages/auth/login.vue)
┌────────────────────────────────────┐
│                                     │
│                                     │
│            [应用 Logo]               │
│                                     │
│         FIRE生活家                   │
│       记账省心、资产有数、FIRE可期   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    微信一键登录               │   │
│  │    [微信图标]                 │   │
│  └─────────────────────────────┘   │
│                                     │
│           或                        │
│                                     │
│  ┌─────────────────────────────┐   │
│  │    手机号登录                │   │
│  └─────────────────────────────┘   │
│                                     │
│  ─────────────────────────────────  │
│  登录即表示同意《用户协议》和《隐私政策》│
│                                     │
└────────────────────────────────────┘

手机号登录页 (src/pages/auth/phone-login.vue)
┌────────────────────────────────────┐
│  ← 返回      手机号登录              │
│                                     │
│                                     │
│  手机号                            │
│  ┌─────────────────────────────┐   │
│  │ +86                    [▼] │   │
│  └─────────────────────────────┘   │
│  ┌─────────────────────────────┐   │
│  │ 输入手机号                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  验证码                            │
│  ┌─────────────────┬───────────┐   │
│  │ 输入验证码       │ 获取验证码 │   │
│  └─────────────────┴───────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │          登录               │   │
│  └─────────────────────────────┘   │
│                                     │
└────────────────────────────────────┘

账号绑定页 (src/pages/auth/bind-phone.vue)
┌────────────────────────────────────┐
│  ← 返回      绑定手机号              │
│                                     │
│  微信登录成功                       │
│  为了同步数据，请绑定手机号          │
│                                     │
│  手机号                            │
│  ┌─────────────────────────────┐   │
│  │ 输入手机号                   │   │
│  └─────────────────────────────┘   │
│                                     │
│  验证码                            │
│  ┌─────────────────┬───────────┐   │
│  │ 输入验证码       │ 获取验证码 │   │
│  └─────────────────┴───────────┘   │
│                                     │
│  ┌─────────────────────────────┐   │
│  │          绑定并登录          │   │
│  └─────────────────────────────┘   │
│                                     │
│  [跳过此步骤]                       │
│                                     │
└────────────────────────────────────┘

隐私协议页 (src/pages/auth/privacy.vue)
┌────────────────────────────────────┐
│  ← 返回      隐私政策               │
│                                     │
│  [长文本协议内容]                   │
│                                     │
└────────────────────────────────────┘

用户协议页 (src/pages/auth/terms.vue)
┌────────────────────────────────────┐
│  ← 返回      用户协议               │
│                                     │
│  [长文本协议内容]                   │
│                                     │
└────────────────────────────────────┘
```

### 交互流程

#### 微信一键登录
1. 用户点击"微信一键登录"
2. 调用微信登录 API，获取 code
3. 后端使用 code 换取 openid
4. 判断 openid 是否已绑定账号
5. 如果已绑定，直接登录成功
6. 如果未绑定，显示账号绑定页

#### 手机号登录
1. 用户输入手机号
2. 点击"获取验证码"
3. 后端发送短信验证码
4. 用户输入验证码
5. 后端验证验证码
6. 登录成功

#### 账号绑定
1. 微信登录成功后，显示绑定页
2. 用户输入手机号和验证码
3. 后端创建账号并绑定微信 openid
4. 登录成功
5. 可选择跳过，但功能受限

#### Token 管理
1. 登录成功后，后端返回 access_token 和 refresh_token
2. access_token 有效期 7 天
3. refresh_token 有效期 30 天
4. access_token 过期前，使用 refresh_token 刷新
5. refresh_token 过期，需要重新登录
6. 退出登录时，清除本地 Token

### 状态变化

| 状态 | 触发条件 | 行为 |
|------|----------|------|
| 未登录 | 应用启动 | 显示登录页 |
| 登录中 | 点击登录 | 显示 loading |
| 登录成功 | 验证通过 | 跳转首页 |
| 登录失败 | 验证失败 | 显示错误提示 |
| Token 过期 | Token 无效 | 跳转登录页 |
| 账号绑定 | 微信首次登录 | 显示绑定页 |
| 跳过绑定 | 选择跳过 | 跳转首页（功能受限） |

## UI 设计规范

### 布局
- Logo 区域：高度 200rpx，居中
- 登录按钮：宽度 80%，高度 96rpx
- 手机号输入：高度 88rpx
- 验证码输入：高度 88rpx
- 验证码按钮：宽度 200rpx

### 颜色
- 主色背景：linear-gradient(135deg, #00BFFF, #0099CC)
- 按钮背景：#07C160（微信绿）
- 次级按钮：#E0F7FA
- 文字链接：#00BFFF
- 错误提示：#FA3534

### 字体
- Logo 文字：48rpx，#333333
- 按钮文字：32rpx，#FFFFFF
- 输入框：28rpx
- 协议文字：22rpx，#999999

## 数据结构

### 登录请求/响应
```typescript
// 微信登录
// POST /api/auth/wechat-login
interface WechatLoginRequest {
  code: string;  // 微信授权 code
}

interface WechatLoginResponse {
  code: number;
  data: {
    needBindPhone: boolean;  // 是否需要绑定手机号
    token?: string;          // 已绑定时返回 token
    userId?: string;         // 用户ID
  };
}

// 手机号登录
// POST /api/auth/phone-login
interface PhoneLoginRequest {
  phone: string;
  code: string;  // 验证码
}

interface PhoneLoginResponse {
  code: number;
  data: {
    token: string;
    refreshToken: string;
    user: UserInfo;
  };
}

// 绑定手机号
// POST /api/auth/bind-phone
interface BindPhoneRequest {
  phone: string;
  code: string;
  wechatOpenid?: string;  // 微信 openid
}

interface BindPhoneResponse {
  code: number;
  data: {
    token: string;
    refreshToken: string;
    user: UserInfo;
  };
}

// 刷新 Token
// POST /api/auth/refresh
interface RefreshTokenRequest {
  refreshToken: string;
}

interface RefreshTokenResponse {
  code: number;
  data: {
    token: string;
    refreshToken: string;
  };
}

// 获取验证码
// POST /api/auth/send-code
interface SendCodeRequest {
  phone: string;
  type: 'login' | 'bind';
}
```

### 用户信息
```typescript
interface UserInfo {
  id: string;
  phone?: string;
  wechatOpenid?: string;
  nickname?: string;
  avatar?: string;
  createdAt: string;
}
```

## 与现有功能的关联

### 依赖关系
- 无外部依赖

### 被依赖关系
- 所有需要用户身份的功能

### 需要修改的文件
- `src/pages/auth/login.vue` - 登录页
- `src/pages/auth/phone-login.vue` - 手机号登录页
- `src/pages/auth/bind-phone.vue` - 账号绑定页
- `src/api/auth.ts` - 认证 API
- `src/store/user.ts` - 用户状态管理
- `src/middleware/auth.ts` - 路由守卫

### 新增文件
- `src/utils/token.ts` - Token 管理工具
- `src/components/PrivacyModal.vue` - 隐私协议弹窗

## 边界情况

1. **微信未安装**
   - 隐藏微信登录按钮
   - 只显示手机号登录

2. **短信发送失败**
   - 显示"验证码发送失败，请稍后重试"
   - 按钮恢复可点击状态

3. **验证码错误**
   - 显示"验证码错误"
   - 允许重新输入

4. **验证码过期**
   - 显示"验证码已过期，请重新获取"
   - 自动重新获取

5. **手机号已注册**
   - 手机号登录直接成功
   - 微信登录时提示"该手机号已注册，请使用手机号登录"

6. **微信 openid 被其他账号绑定**
   - 提示"该微信已绑定其他账号"
   - 引导使用原账号登录

7. **Token 刷新失败**
   - 跳转登录页
   - 提示"登录状态已过期，请重新登录"

8. **网络错误**
   - 显示网络错误提示
   - 提供重试按钮

## 安全规范

1. **敏感数据**
   - Token 存储在安全区域
   - 不在 URL 中传递 Token

2. **验证码**
   - 有效期 5 分钟
   - 错误 3 次后需等待
   - 同一手机号 1 分钟只能获取一次

3. **密码策略**
   - 如有密码，至少 8 位
   - 不允许简单密码

4. **登录日志**
   - 记录登录时间、IP、设备
   - 异常登录提醒
