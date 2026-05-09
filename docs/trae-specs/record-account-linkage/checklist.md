# 记账联动账户余额 - 验收清单

## 功能验收

### 账户选择
- [ ] Checkpoint 1: 记账前必须选择账户
- [ ] Checkpoint 2: 未选择时"记账"按钮禁用
- [ ] Checkpoint 3: 账户按类型分组展示
- [ ] Checkpoint 4: 选择后显示账户图标+名称+余额

### 余额联动更新
- [ ] Checkpoint 5: 支出减少账户余额
- [ ] Checkpoint 6: 收入增加账户余额
- [ ] Checkpoint 7: 转账转出账户减少、转入账户增加
- [ ] Checkpoint 8: 余额不足时提示"余额不足"

### 记入资产开关
- [ ] Checkpoint 9: 支出类型显示"记入资产"开关
- [ ] Checkpoint 10: 收入类型不显示开关
- [ ] Checkpoint 11: 转账类型不显示开关
- [ ] Checkpoint 12: 开关默认关闭
- [ ] Checkpoint 13: 开关打开展开资产字段
- [ ] Checkpoint 14: 品类选择后自动推荐折旧方法
- [ ] Checkpoint 15: 选择品类后自动填充推荐参数
- [ ] Checkpoint 16: 资产名称默认取分类名

### 记账成功创建折旧资产
- [ ] Checkpoint 17: 开关打开时记账同时创建折旧资产
- [ ] Checkpoint 18: 折旧资产状态为"使用中"
- [ ] Checkpoint 19: 折旧资产当前价值=购入价
- [ ] Checkpoint 20: 开关关闭时不创建折旧资产

### 折旧资产卖出自动创建收入
- [ ] Checkpoint 21: 用户卖出折旧资产时
- [ ] Checkpoint 22: 自动创建一笔收入记录
- [ ] Checkpoint 23: 收入金额=卖出价格
- [ ] Checkpoint 24: 分类为"二手出售"
- [ ] Checkpoint 25: 备注自动填"出售：资产名称"

### 编辑/删除记账
- [ ] Checkpoint 26: 编辑记账回滚原账户余额
- [ ] Checkpoint 27: 编辑记账更新新账户余额
- [ ] Checkpoint 28: 删除记账回滚账户余额
- [ ] Checkpoint 29: 删除转账回滚两个账户余额

### 记账确认卡片
- [ ] Checkpoint 30: 显示关联账户名称
- [ ] Checkpoint 31: 显示 FIRE 时间换算
- [ ] Checkpoint 32: 显示更新后的账户余额

## UI/UX 验收

### 布局
- [ ] Checkpoint 33: Header 区域高度 80rpx
- [ ] Checkpoint 34: 账户选择器高度 56rpx
- [ ] Checkpoint 35: 确认卡片宽 600rpx
- [ ] Checkpoint 36: 明细列表项高度 120rpx
- [ ] Checkpoint 37: 记入资产开关区域高度 80rpx

### 颜色（卡布里蓝体系）
- [ ] Checkpoint 38: 账户选择器背景 #E0F7FA
- [ ] Checkpoint 39: 账户图标 #00BFFF
- [ ] Checkpoint 40: 资产余额 #19BE6B
- [ ] Checkpoint 41: 负债余额 #FA3534
- [ ] Checkpoint 42: 记入资产开关打开态 #00BFFF

### 字体
- [ ] Checkpoint 43: 账户名称 28rpx
- [ ] Checkpoint 44: 账户余额 24rpx
- [ ] Checkpoint 45: 确认卡片金额 48rpx
- [ ] Checkpoint 46: FIRE 时间 24rpx

### 动效
- [ ] Checkpoint 47: 余额变化滚动动画 800ms
- [ ] Checkpoint 48: 确认卡片 scale + fadeIn 200ms
- [ ] Checkpoint 49: 记账成功打勾动画 300ms
- [ ] Checkpoint 50: 记入资产开关切换 200ms
- [ ] Checkpoint 51: 记入资产字段展开 250ms

## API 验收

- [ ] Checkpoint 52: POST /api/records 支持 createDepreciatingAsset
- [ ] Checkpoint 53: PUT /api/records/:id 支持更新关联折旧资产
- [ ] Checkpoint 54: DELETE /api/records/:id 支持解关联折旧资产
- [ ] Checkpoint 55: PUT /api/assets/depreciating/:id/dispose 卖出时返回 incomeRecordId

## 技术验收

- [ ] Checkpoint 56: 使用 Vue3 + TypeScript + SCSS
- [ ] Checkpoint 57: 使用 Wot UI 组件库
- [ ] Checkpoint 58: 遵循 UniApp 兼容性要求
- [ ] Checkpoint 59: API 风格为 RESTful
- [ ] Checkpoint 60: SVG 线框图标统一主色描边
- [ ] Checkpoint 61: 禁止黄色/暖色系
