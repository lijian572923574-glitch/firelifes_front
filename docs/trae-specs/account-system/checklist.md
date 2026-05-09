# 账户体系重构 - 验收清单

## 功能验收

### 账户类型扩展
- [ ] Checkpoint 1: 资产类包含4个子类型：现金类、投资类、固定资产、折旧资产
- [ ] Checkpoint 2: 负债类包含5个子类型：信用卡、花呗白条、房贷、车贷、借款
- [ ] Checkpoint 3: 账户类型选择支持所有9个子类型
- [ ] Checkpoint 4: 账户列表按大类分组展示

### 不同类型显示不同字段
- [ ] Checkpoint 5: 现金类：名称、图标、初始余额
- [ ] Checkpoint 6: 投资类：名称、图标、初始余额、持仓成本、市值
- [ ] Checkpoint 7: 固定资产：名称、图标、购入价、品类、关联负债
- [ ] Checkpoint 8: 折旧资产：名称、图标、购入价、品类、折旧方法、使用月数、残值
- [ ] Checkpoint 9: 信用卡：名称、图标、账单日、还款日
- [ ] Checkpoint 10: 花呗白条：名称、图标、信用额度
- [ ] Checkpoint 11: 房贷/车贷：名称、图标、贷款总额、期限、利率
- [ ] Checkpoint 12: 借款：名称、图标、出借人、借款日期、到期日期

### 账户数据结构
- [ ] Checkpoint 13: Account 接口包含 subType 字段
- [ ] Checkpoint 14: AssetAccountSubType 类型定义正确
- [ ] Checkpoint 15: LiabilityAccountSubType 类型定义正确
- [ ] Checkpoint 16: 各子类型的特殊字段定义完整

### 账户余额计算
- [ ] Checkpoint 17: 现金类账户余额 = 初始余额 + 收支变动
- [ ] Checkpoint 18: 投资类账户余额 = 当前市值
- [ ] Checkpoint 19: 固定资产账户余额 = 当前估值 - 关联负债余额
- [ ] Checkpoint 20: 折旧资产账户余额 = 当前价值（自动折旧计算）

### 净资产计算
- [ ] Checkpoint 21: 净资产 = 现金类 + 投资类 + 固定资产净权益 + 折旧资产 - 负债总额
- [ ] Checkpoint 22: 计算结果精确到分

## UI/UX 验收

### 布局
- [ ] Checkpoint 23: 页面内边距 32rpx
- [ ] Checkpoint 24: 账户卡片高度 112rpx，圆角 16rpx
- [ ] Checkpoint 25: 图标尺寸 64rpx

### 颜色（卡布里蓝体系）
- [ ] Checkpoint 26: 主色描边图标 #00BFFF
- [ ] Checkpoint 27: 资产余额 #19BE6B
- [ ] Checkpoint 28: 负债余额 #FA3534
- [ ] Checkpoint 29: 投资盈利 #19BE6B
- [ ] Checkpoint 30: 投资亏损 #FA3534

### 字体
- [ ] Checkpoint 31: 账户名称 32rpx，#333333，加粗
- [ ] Checkpoint 32: 余额 36rpx
- [ ] Checkpoint 33: 投资类额外信息 24rpx，#999999

## API 验收

- [ ] Checkpoint 34: GET /api/accounts 返回9种子类型的账户
- [ ] Checkpoint 35: POST /api/accounts 支持创建各子类型账户
- [ ] Checkpoint 36: PUT /api/accounts/:id 支持更新各子类型账户
- [ ] Checkpoint 37: PUT /api/accounts/:id/valuation 支持更新投资类市值

## 技术验收

- [ ] Checkpoint 38: 使用 Vue3 + TypeScript + SCSS
- [ ] Checkpoint 39: 使用 Wot UI 组件库
- [ ] Checkpoint 40: 遵循 UniApp 兼容性要求
- [ ] Checkpoint 41: API 风格为 RESTful
- [ ] Checkpoint 42: SVG 线框图标统一主色描边
- [ ] Checkpoint 43: 禁止黄色/暖色系
