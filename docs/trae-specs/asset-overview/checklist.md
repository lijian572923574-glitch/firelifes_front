# 资产总览页 - 验收清单

## 功能验收

### 净资产计算
- [ ] Checkpoint 1: 净资产 = 现金类 + 投资类市值 + 固定资产净权益 + 折旧资产当前价值 - 负债总额
- [ ] Checkpoint 2: 资产总计 = 现金类 + 投资类市值 + 固定资产净权益 + 折旧资产当前价值
- [ ] Checkpoint 3: 负债总计 = 所有负债账户余额总和
- [ ] Checkpoint 4: 净资产为负时显示红色 #FA3534

### 资产配置环形图
- [ ] Checkpoint 5: 展示5个分类：存款、投资、房产、折旧资产、负债
- [ ] Checkpoint 6: 存款颜色 #00BFFF（卡布里蓝）
- [ ] Checkpoint 7: 投资颜色 #19BE6B（绿色）
- [ ] Checkpoint 8: 房产颜色 #0099CC（深蓝）
- [ ] Checkpoint 9: 折旧资产颜色 #67C8FF（浅蓝）
- [ ] Checkpoint 10: 负债颜色 #FA3534（红色）
- [ ] Checkpoint 11: 点击分类显示详细数据
- [ ] Checkpoint 12: 占比计算正确

### 账户卡片列表
- [ ] Checkpoint 13: 按类型分组：现金类 → 投资类 → 固定资产 → 折旧资产 → 负债类
- [ ] Checkpoint 14: 现金类显示余额
- [ ] Checkpoint 15: 投资类显示市值和收益率
- [ ] Checkpoint 16: 固定资产显示净权益和增值率
- [ ] Checkpoint 17: 折旧资产显示当前价值和折旧进度
- [ ] Checkpoint 18: 负债类显示余额

### 固定资产区块
- [ ] Checkpoint 19: 展示总净权益
- [ ] Checkpoint 20: 每个资产显示：图标 + 名称 + 净权益 + 增值率
- [ ] Checkpoint 21: 超过6个月未更新显示"⚠️估值待更新"
- [ ] Checkpoint 22: 有"查看全部"入口

### 折旧资产区块
- [ ] Checkpoint 23: 展示当前总价值
- [ ] Checkpoint 24: 展示本月折旧额
- [ ] Checkpoint 25: 每个资产显示：图标 + 名称 + 当前价值 + 折旧进度
- [ ] Checkpoint 26: 有"查看全部"入口

### 投资类卡片
- [ ] Checkpoint 27: 显示当前市值
- [ ] Checkpoint 28: 显示收益率
- [ ] Checkpoint 29: 盈利显示绿色 #19BE6B
- [ ] Checkpoint 30: 亏损显示红色 #FA3534

### 折旧进度显示
- [ ] Checkpoint 31: 进度计算正确 = (购入价-当前价值)/(购入价-残值) × 100%
- [ ] Checkpoint 32: 进度条颜色 #00BFFF

## UI/UX 验收

### 布局
- [ ] Checkpoint 33: 页面内边距 32rpx
- [ ] Checkpoint 34: 净资产区域高度 200rpx
- [ ] Checkpoint 35: 净资产数字 72rpx
- [ ] Checkpoint 36: 图表区域高度 320rpx
- [ ] Checkpoint 37: 账户卡片高度 112rpx
- [ ] Checkpoint 38: 卡片间距 16rpx

### 颜色（卡布里蓝体系）
- [ ] Checkpoint 39: 净资产数字 #00BFFF
- [ ] Checkpoint 40: 净资产为负 #FA3534
- [ ] Checkpoint 41: 资产总计 #19BE6B
- [ ] Checkpoint 42: 负债总计 #FA3534

### 字体
- [ ] Checkpoint 43: 净资产金额 72rpx，加粗
- [ ] Checkpoint 44: 净资产标签 28rpx，#999999
- [ ] Checkpoint 45: 账户名称 32rpx
- [ ] Checkpoint 46: 账户余额 36rpx

### 动效
- [ ] Checkpoint 47: 页面进入 fadeIn + slideUp，300ms
- [ ] Checkpoint 48: 数字变化滚动动画，1s
- [ ] Checkpoint 49: 图表加载 drawIn，500ms
- [ ] Checkpoint 50: 卡片点击 scale 0.98，100ms

## API 验收

- [ ] Checkpoint 51: GET /api/assets/overview 返回净资产和各分类数据
- [ ] Checkpoint 52: 包含各子类型账户列表
- [ ] Checkpoint 53: 包含固定资产汇总
- [ ] Checkpoint 54: 包含折旧资产汇总和本月折旧额

## 技术验收

- [ ] Checkpoint 55: 使用 Vue3 + TypeScript + SCSS
- [ ] Checkpoint 56: 使用 Wot UI 组件库
- [ ] Checkpoint 57: 遵循 UniApp 兼容性要求
- [ ] Checkpoint 58: SVG 线框图标统一主色描边
- [ ] Checkpoint 59: 禁止黄色/暖色系
